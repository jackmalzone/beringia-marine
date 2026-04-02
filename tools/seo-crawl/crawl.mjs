#!/usr/bin/env node
/**
 * Minimal Playwright SEO crawler for Next.js App Router (local-first).
 * BFS crawl, extracts SEO fields, outputs JSON + CSV + summary.
 * Usage: node crawl.mjs [--baseUrl URL] [--maxPages N] [--maxDepth N] ...
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// --- Defaults and CLI -------------------------------------------------------
const DEFAULTS = {
  baseUrl: 'http://localhost:3000',
  maxPages: 300,
  maxDepth: 6,
  concurrency: 3,
  userAgent: 'VitalIceSEO-Crawler/1.0',
  includeQuery: false,
  pageTimeout: 30000,
  networkIdleTimeout: 2000,
  strictSSR: true,
  allowRscFallback: false,
};

const SKIP_EXTENSIONS = new Set(
  [
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.otf', '.eot',
    '.css', '.js', '.mjs', '.cjs',
    '.pdf', '.zip', '.xml', '.json', '.rss',
  ].map((e) => e.toLowerCase())
);

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node crawl.mjs [options]

Options:
  --baseUrl URL      Start URL (default: ${DEFAULTS.baseUrl})
  --maxPages N       Max pages to crawl (default: ${DEFAULTS.maxPages})
  --maxDepth N       Max depth (default: ${DEFAULTS.maxDepth})
  --concurrency N    Concurrent pages (default: ${DEFAULTS.concurrency})
  --userAgent UA     User-Agent (default: VitalIceSEO-Crawler/1.0)
  --sitemap URL      Sitemap URL to seed crawl (optional). If not set, for remote HTTPS baseUrl we use baseUrl/sitemap.xml.
  --no-sitemap       Disable auto sitemap for remote baseUrl (crawl from baseUrl only, discover via links).
  --includeQuery     Keep query strings when normalizing URLs (default: false)
  --strict-ssr       Enforce SSR checks using literal HTML only (default: true)
  --no-strict-ssr    Disable strict SSR (legacy: heuristics can affect pass/fail)
  --allow-rsc-fallback  Report when RSC heuristics would have passed (diagnostic only)
  --fail-on-issues     Exit with code 1 if any issues (e.g. for CI / pre-deploy gates)
  --delay MS           Delay in ms between starting each page (default: 0). Use e.g. 200 for production.
  --help, -h         Show this help
`);
    process.exit(0);
  }
  const opts = { ...DEFAULTS };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--baseUrl' && args[i + 1]) {
      opts.baseUrl = args[++i].replace(/\/$/, '');
    } else if (args[i] === '--maxPages' && args[i + 1]) {
      opts.maxPages = parseInt(args[++i], 10) || DEFAULTS.maxPages;
    } else if (args[i] === '--maxDepth' && args[i + 1]) {
      opts.maxDepth = parseInt(args[++i], 10) || DEFAULTS.maxDepth;
    } else if (args[i] === '--concurrency' && args[i + 1]) {
      opts.concurrency = Math.max(1, parseInt(args[++i], 10) || 1);
    } else if (args[i] === '--userAgent' && args[i + 1]) {
      opts.userAgent = args[++i];
    } else if (args[i] === '--sitemap' && args[i + 1]) {
      opts.sitemap = args[++i];
    } else if (args[i] === '--no-sitemap') {
      opts.noSitemap = true;
    } else if (args[i] === '--includeQuery') {
      opts.includeQuery = true;
    } else if (args[i] === '--strict-ssr') {
      opts.strictSSR = true;
    } else if (args[i] === '--no-strict-ssr') {
      opts.strictSSR = false;
    } else if (args[i] === '--allow-rsc-fallback') {
      opts.allowRscFallback = true;
    } else if (args[i] === '--fail-on-issues') {
      opts.failOnIssues = true;
    } else if (args[i] === '--delay' && args[i + 1]) {
      opts.delayMs = Math.max(0, parseInt(args[++i], 10) || 0);
    }
  }
  return opts;
}

// --- URL normalization (same origin, de-dupe) --------------------------------
function getOrigin(url) {
  try {
    const u = new URL(url);
    return u.origin;
  } catch {
    return null;
  }
}

function normalizeUrl(url, baseOrigin, includeQuery = false) {
  try {
    const u = new URL(url, baseOrigin);
    if (u.origin !== baseOrigin) return null;
    u.hash = '';
    if (!includeQuery) u.search = '';
    else {
      const params = Array.from(u.searchParams.entries()).sort((a, b) =>
        a[0].localeCompare(b[0])
      );
      u.search = '';
      params.forEach(([k, v]) => u.searchParams.set(k, v));
    }
    let path = u.pathname;
    if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
    u.pathname = path;
    return u.href;
  } catch {
    return null;
  }
}

function shouldSkipUrl(href, baseOrigin) {
  const norm = normalizeUrl(href, baseOrigin, true);
  if (!norm) return true;
  try {
    const u = new URL(norm);
    const path = u.pathname.toLowerCase();
    const ext = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '';
    if (SKIP_EXTENSIONS.has(ext)) return true;
    if (path.startsWith('/api/') || path.startsWith('/_next/')) return true;
  } catch {}
  return false;
}

// --- Sitemap: fetch XML and extract <loc> URLs (same-origin only) ------------
const LOC_REGEX = /<loc>\s*([^<]+)\s*<\/loc>/gi;

const SITEMAP_FETCH_TIMEOUT_MS = 15000;

async function fetchSitemapUrls(sitemapUrl, baseOrigin, opts = {}, depth = 0) {
  const maxSitemapDepth = 3;
  if (depth > maxSitemapDepth) return [];
  try {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), SITEMAP_FETCH_TIMEOUT_MS);
    const res = await fetch(sitemapUrl, {
      headers: { 'User-Agent': opts.userAgent || DEFAULTS.userAgent },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(to);
    if (!res.ok) return [];
    const text = await res.text();
    const urls = [];
    let m;
    LOC_REGEX.lastIndex = 0;
    while ((m = LOC_REGEX.exec(text)) !== null) {
      const loc = m[1].trim();
      try {
        const u = new URL(loc);
        if (u.origin !== baseOrigin) continue;
        const path = u.pathname.toLowerCase();
        if (path.endsWith('.xml')) {
          const child = await fetchSitemapUrls(loc, baseOrigin, opts, depth + 1);
          urls.push(...child);
        } else {
          const ext = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '';
          if (SKIP_EXTENSIONS.has(ext)) continue;
          urls.push(loc);
        }
      } catch {
        /* ignore invalid URL */
      }
    }
    return urls;
  } catch {
    return [];
  }
}

/** If baseUrl is a remote HTTPS URL, return baseUrl + '/sitemap.xml'. */
function defaultSitemapUrl(baseUrl) {
  try {
    const u = new URL(baseUrl);
    if (u.protocol === 'https:' && !/^localhost$/i.test(u.hostname)) {
      return `${u.origin}/sitemap.xml`;
    }
  } catch {}
  return null;
}

// --- SSR check: fetch initial HTML (no JS) and parse critical content ---------
const MIN_RAW_SSR_WORDS = 30; // Minimum body words in raw HTML to consider "SSR present" (literal only)

async function fetchInitialHtml(url, userAgent) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': userAgent },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parseRawLiteralHtml(html) {
  if (!html || typeof html !== 'string') {
    return { rawTitle: '', rawDescription: '', rawH1Count: 0, rawWordCount: 0 };
  }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
  const descMatch = html.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
  ) || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const rawDescription = descMatch ? descMatch[1].trim() : '';
  const h1Matches = html.match(/<h1[^>]*>/gi);
  const rawH1Count = h1Matches ? h1Matches.length : 0;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const rawWordCount = body
    ? body.replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length
    : 0;
  return { rawTitle, rawDescription, rawH1Count, rawWordCount };
}

function parseRscHeuristics(html) {
  let rscH1Boost = 0;
  let rscWordBoost = 0;
  if (!html || typeof html !== 'string') return { rscH1Boost, rscWordBoost };
  const rscH1Re = /["']h1["'],\s*null\s*,\s*\{\s*["']children["']\s*:\s*["']((?:[^"\\]|\\.)*)["']/g;
  const rscH1Texts = [];
  let m;
  while ((m = rscH1Re.exec(html)) !== null) {
    const text = m[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)));
    rscH1Texts.push(text);
  }
  if (rscH1Texts.length > 0) {
    rscH1Boost = 1;
    rscWordBoost += rscH1Texts.join(' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  }
  const rscContentRe = /["'](?:content|children)["']\s*:\s*["']((?:[^"\\]|\\.){50,})["']/g;
  while ((m = rscContentRe.exec(html)) !== null) {
    const text = m[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)));
    const words = text.replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    if (words >= 20) rscWordBoost += words;
  }
  return { rscH1Boost, rscWordBoost };
}

function parseRawHtml(html, opts) {
  const literal = parseRawLiteralHtml(html);
  let ssrTitle = literal.rawTitle;
  let ssrDescription = literal.rawDescription;
  let ssrH1Count = literal.rawH1Count;
  let ssrWordCount = literal.rawWordCount;
  let ssrRscFallbackUsed = false;

  if (!opts.strictSSR && (literal.rawH1Count < 1 || literal.rawWordCount < MIN_RAW_SSR_WORDS)) {
    const { rscH1Boost, rscWordBoost } = parseRscHeuristics(html);
    ssrH1Count = Math.max(literal.rawH1Count, rscH1Boost);
    ssrWordCount = literal.rawWordCount + rscWordBoost;
  }

  if (opts.strictSSR && opts.allowRscFallback) {
    const { rscH1Boost, rscWordBoost } = parseRscHeuristics(html);
    const boostedH1 = Math.max(literal.rawH1Count, rscH1Boost);
    const boostedWords = literal.rawWordCount + rscWordBoost;
    const rawFails = literal.rawH1Count < 1 || literal.rawWordCount < MIN_RAW_SSR_WORDS;
    const boostedPasses = boostedH1 >= 1 && boostedWords >= MIN_RAW_SSR_WORDS;
    ssrRscFallbackUsed = rawFails && boostedPasses;
    ssrH1Count = boostedH1;
    ssrWordCount = boostedWords;
  }

  return {
    ...literal,
    ssrTitle,
    ssrDescription,
    ssrH1Count,
    ssrWordCount,
    ssrRscFallbackUsed,
  };
}

// --- CSV escape -------------------------------------------------------------
function csvEscape(val) {
  if (val == null || val === '') return '""';
  const s = String(val);
  const needsQuotes = /[",\n\r]/.test(s);
  return needsQuotes ? `"${s.replace(/"/g, '""')}"` : s;
}

// --- Extract SEO data + internal links in one pass (evaluate in browser) ----
function extractScript() {
  const getMeta = (name) => {
    const el = document.querySelector(
      `meta[name="${name}"], meta[property="${name}"]`
    );
    return el ? el.getAttribute('content') || '' : '';
  };
  const getCanonical = () => {
    const el = document.querySelector('link[rel="canonical"]');
    if (!el) return '';
    return el.href || '';
  };
  const title = document.title || '';
  const description = getMeta('description');
  const robots = getMeta('robots');
  const canonical = getCanonical();
  const h1s = Array.from(document.querySelectorAll('h1')).map((el) =>
    (el.textContent || '').trim()
  );
  const h2s = Array.from(document.querySelectorAll('h2')).map((el) =>
    (el.textContent || '').trim()
  );
  const ogTitle = getMeta('og:title');
  const ogDesc = getMeta('og:description');
  const ogImage = getMeta('og:image');
  const twTitle = getMeta('twitter:title');
  const twDesc = getMeta('twitter:description');
  const twImage = getMeta('twitter:image');
  const images = Array.from(document.querySelectorAll('img'));
  const imageCount = images.length;
  const missingAlt = images.filter((img) => !img.alt || img.alt.trim() === '')
    .length;
  const links = Array.from(document.querySelectorAll('a[href]'));
  const baseOrigin = window.location.origin;
  const internalUrls = new Set();
  let internal = 0;
  let external = 0;
  links.forEach((a) => {
    try {
      const u = new URL(a.href, window.location.href);
      if (u.origin === baseOrigin) {
        internal++;
        u.hash = '';
        let path = u.pathname;
        if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
        u.pathname = path;
        internalUrls.add(u.href);
      } else if (u.protocol === 'http:' || u.protocol === 'https:') {
        external++;
      }
    } catch {}
  });
  const visibleText = (() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('script, style, noscript').forEach((n) => n.remove());
    return (clone.textContent || '').replace(/\s+/g, ' ').trim();
  })();
  const wordCount = visibleText
    ? visibleText.split(/\s+/).filter(Boolean).length
    : 0;
  return {
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    robots,
    canonical,
    h1Count: h1s.length,
    firstH1: h1s[0] || '',
    h2s,
    ogTitle,
    ogDescription: ogDesc,
    ogImage,
    twitterTitle: twTitle,
    twitterDescription: twDesc,
    twitterImage: twImage,
    wordCount,
    imageCount,
    missingAlt,
    internalLinksOut: internal,
    externalLinksOut: external,
    internalUrls: Array.from(internalUrls),
  };
}

// --- Single page crawl (navigate + extract + return links) ------------------
async function crawlPage(context, url, opts) {
  const page = await context.newPage();
  try {
    await page.setDefaultTimeout(opts.pageTimeout);
    await page.setExtraHTTPHeaders({ 'User-Agent': opts.userAgent });
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: opts.pageTimeout,
    }).catch(() => null);
    const status = response ? response.status() : 0;
    const finalUrl = response ? response.url() : url;
    const contentType = response
      ? (response.headers()['content-type'] || '').split(';')[0].trim()
      : '';
    if (contentType && !contentType.includes('text/html')) {
      await page.close();
      return { url, finalUrl, status, contentType, skip: true, internalUrls: [] };
    }
    // Brief delay so client-rendered links (e.g. Next.js nav) can appear
    const pathSegments = new URL(url).pathname.replace(/\/$/, '').split('/').filter(Boolean);
    const isInsightArticle = pathSegments[0] === 'insights' && pathSegments.length > 1;
    const delayMs = isInsightArticle ? 3000 : 1500;
    await new Promise((r) => setTimeout(r, delayMs));
    const data = await page.evaluate(extractScript);
    const internalUrls = data.internalUrls || [];
    delete data.internalUrls;
    await page.close();

    // SSR check: fetch initial HTML (no JS) and compare to rendered content
    const rawHtml = await fetchInitialHtml(url, opts.userAgent);
    const raw = parseRawHtml(rawHtml, opts);

    const hasRenderedSignal =
      ((data.wordCount || 0) > 50 && (data.h1Count || 0) >= 1) ||
      ((data.title || '').trim().length > 0) ||
      ((data.description || '').trim().length > 0) ||
      ((data.canonical || '').trim().length > 0);

    const ssrContentMissing =
      hasRenderedSignal &&
      (raw.rawWordCount < MIN_RAW_SSR_WORDS || raw.rawH1Count < 1);

    return {
      url,
      finalUrl,
      status,
      contentType: contentType || 'text/html',
      ...data,
      rawTitle: raw.rawTitle,
      rawDescription: raw.rawDescription,
      rawH1Count: raw.rawH1Count,
      rawWordCount: raw.rawWordCount,
      ssrTitle: raw.ssrTitle,
      ssrDescription: raw.ssrDescription,
      ssrH1Count: raw.ssrH1Count,
      ssrWordCount: raw.ssrWordCount,
      ssrRscFallbackUsed: raw.ssrRscFallbackUsed,
      ssrContentMissing: ssrContentMissing || false,
      strictSSR: opts.strictSSR,
      internalUrls,
    };
  } catch (err) {
    try {
      await page.close();
    } catch {}
    return {
      url,
      finalUrl: url,
      status: 0,
      contentType: '',
      error: err.message,
      rawTitle: '',
      rawDescription: '',
      rawH1Count: 0,
      rawWordCount: 0,
      ssrTitle: '',
      ssrDescription: '',
      ssrH1Count: 0,
      ssrWordCount: 0,
      ssrRscFallbackUsed: false,
      ssrContentMissing: false,
      strictSSR: opts.strictSSR,
      internalUrls: [],
    };
  }
}

// --- BFS crawl --------------------------------------------------------------
async function runCrawl(opts) {
  const baseOrigin = getOrigin(opts.baseUrl);
  if (!baseOrigin) {
    console.error('Invalid baseUrl:', opts.baseUrl);
    process.exit(1);
  }
  const visited = new Set();
  const queue = [];

  // Seed queue: optional sitemap (explicit, or auto for remote HTTPS unless --no-sitemap)
  const sitemapUrl =
    opts.sitemap ||
    (!opts.noSitemap && defaultSitemapUrl(opts.baseUrl));
  if (sitemapUrl) {
    console.log('Fetching sitemap:', sitemapUrl);
    const sitemapUrls = await fetchSitemapUrls(sitemapUrl, baseOrigin, opts);
    const seen = new Set();
    const add = (url) => {
      const norm = normalizeUrl(url, baseOrigin, opts.includeQuery);
      if (norm && !seen.has(norm) && !shouldSkipUrl(url, baseOrigin)) {
        seen.add(norm);
        queue.push({ url: norm, depth: 0, discoveredBy: '(sitemap)' });
      }
    };
    add(opts.baseUrl);
    for (const u of sitemapUrls) add(u);
    if (queue.length > 1) {
      console.log('Seeded', queue.length, 'URLs from sitemap');
    }
  }
  if (queue.length === 0) {
    queue.push({ url: opts.baseUrl, depth: 0, discoveredBy: '' });
  }

  const results = [];
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  console.log('SEO Crawl started', {
    baseUrl: opts.baseUrl,
    maxPages: opts.maxPages,
    maxDepth: opts.maxDepth,
    concurrency: opts.concurrency,
    seedUrls: queue.length,
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: opts.userAgent });

  let active = 0;
  let done = false;
  const runNext = async () => {
    while (
      queue.length > 0 &&
      results.length < opts.maxPages &&
      active < opts.concurrency
    ) {
      const item = queue.shift();
      const norm = normalizeUrl(item.url, baseOrigin, opts.includeQuery);
      if (!norm || visited.has(norm)) continue;
      if (item.depth > opts.maxDepth) continue;
      if (shouldSkipUrl(item.url, baseOrigin)) continue;
      visited.add(norm);
      if (opts.delayMs > 0) await new Promise((r) => setTimeout(r, opts.delayMs));
      active++;
      (async () => {
        try {
          const pageResult = await crawlPage(context, norm, opts);
          if (!pageResult.skip) {
            const { internalUrls, ...rest } = pageResult;
            results.push({
              ...rest,
              discoveredBy: item.discoveredBy,
              depth: item.depth,
            });
            process.stdout.write(
              `\rCrawled ${results.length} pages (queue: ${queue.length})   `
            );
            for (const href of internalUrls || []) {
              const nextNorm = normalizeUrl(href, baseOrigin, opts.includeQuery);
              if (nextNorm && !visited.has(nextNorm) && !shouldSkipUrl(href, baseOrigin)) {
                queue.push({
                  url: nextNorm,
                  depth: item.depth + 1,
                  discoveredBy: norm,
                });
              }
            }
          }
        } finally {
          active--;
          runNext();
        }
      })();
    }
    if (active === 0 && (queue.length === 0 || results.length >= opts.maxPages)) {
      done = true;
      await browser.close();
    }
  };

  runNext();
  while (!done) {
    await new Promise((r) => setTimeout(r, 100));
    if (results.length >= opts.maxPages) break;
  }
  if (!done) await browser.close();

  return { results, ts };
}

// --- Issue detection and summary -------------------------------------------
function buildSummary(results, ts) {
  const issues = [];
  const titleCounts = new Map();
  const descCounts = new Map();
  const MISSING_ALT_THRESHOLD = 5;

  for (const r of results) {
    if (!r.title) issues.push({ type: 'missing_title', url: r.url });
    if (!r.description) issues.push({ type: 'missing_description', url: r.url });
    if (!r.canonical) issues.push({ type: 'missing_canonical', url: r.url });
    if (r.titleLength > 0) {
      if (r.titleLength < 15)
        issues.push({
          type: 'title_too_short',
          url: r.url,
          value: r.titleLength,
        });
      if (r.titleLength > 60)
        issues.push({
          type: 'title_too_long',
          url: r.url,
          value: r.titleLength,
        });
      titleCounts.set(r.title, (titleCounts.get(r.title) || 0) + 1);
    }
    if (r.descriptionLength > 0) {
      if (r.descriptionLength < 50)
        issues.push({
          type: 'description_too_short',
          url: r.url,
          value: r.descriptionLength,
        });
      if (r.descriptionLength > 160)
        issues.push({
          type: 'description_too_long',
          url: r.url,
          value: r.descriptionLength,
        });
      descCounts.set(r.description, (descCounts.get(r.description) || 0) + 1);
    }
    const effectiveH1Count =
      r.strictSSR && r.rawH1Count != null ? r.rawH1Count : r.h1Count ?? 0;
    if (effectiveH1Count === 0) issues.push({ type: 'missing_h1', url: r.url });
    if (effectiveH1Count > 1)
      issues.push({ type: 'multiple_h1', url: r.url, value: effectiveH1Count });
    if (r.status === 200 && r.robots && /noindex/i.test(r.robots))
      issues.push({ type: 'noindex_on_200', url: r.url });
    try {
      if (r.canonical) {
        const base = new URL(r.url).origin;
        const can = new URL(r.canonical, r.url);
        if (can.origin !== base)
          issues.push({ type: 'canonical_off_origin', url: r.url, canonical: r.canonical });
        else if (normalizeUrl(r.url, base, true) !== normalizeUrl(r.canonical, base, true))
          issues.push({ type: 'canonical_different_path', url: r.url, canonical: r.canonical });
      }
    } catch {}
    if (r.missingAlt != null && r.missingAlt > MISSING_ALT_THRESHOLD)
      issues.push({
        type: 'images_missing_alt',
        url: r.url,
        value: r.missingAlt,
      });
    if (r.ssrContentMissing)
      issues.push({
        type: 'ssr_content_missing',
        url: r.url,
        rawWordCount: r.rawWordCount,
        rawH1Count: r.rawH1Count,
        ssrWordCount: r.ssrWordCount,
        ssrH1Count: r.ssrH1Count,
        ssrRscFallbackUsed: r.ssrRscFallbackUsed,
        renderedWordCount: r.wordCount,
      });
  }

  const duplicateTitles = [...titleCounts.entries()]
    .filter(([, c]) => c > 1)
    .map(([t, c]) => ({ title: t.slice(0, 50), count: c }));
  const duplicateDescriptions = [...descCounts.entries()]
    .filter(([, c]) => c > 1)
    .map(([d, c]) => ({ description: d.slice(0, 50), count: c }));

  const rawOkCount = results.filter(
    (r) => (r.rawH1Count || 0) >= 1 && (r.rawWordCount || 0) >= MIN_RAW_SSR_WORDS
  ).length;
  const rscFallbackCount = results.filter((r) => r.ssrRscFallbackUsed).length;

  let md = `# SEO Crawl Summary (${ts})\n\n`;
  md += `## Totals\n`;
  md += `- **Pages crawled:** ${results.length}\n`;
  md += `- **Unique URLs:** ${results.length}\n`;
  md += `- **Total issues:** ${issues.length}\n`;
  md += `- **RAW SSR OK:** ${rawOkCount}/${results.length} pages (rawH1Count >= 1 AND rawWordCount >= ${MIN_RAW_SSR_WORDS})\n`;
  if (rscFallbackCount > 0) {
    md += `- **Would pass via RSC fallback:** ${rscFallbackCount} pages\n`;
  }
  md += `\n## Top issues\n`;
  if (issues.length === 0) {
    md += `No issues found.\n`;
  } else {
    const byType = {};
    issues.forEach((i) => {
      byType[i.type] = (byType[i.type] || 0) + 1;
    });
    const sorted = Object.entries(byType).sort((a, b) => b[1] - a[1]);
    sorted.slice(0, 15).forEach(([type, count]) => {
      md += `- **${type}:** ${count}\n`;
    });
  }
  md += `\n## Duplicate titles (${duplicateTitles.length})\n`;
  duplicateTitles.slice(0, 10).forEach(({ title, count }) => {
    md += `- "${title}..." (${count}x)\n`;
  });
  md += `\n## Duplicate descriptions (${duplicateDescriptions.length})\n`;
  duplicateDescriptions.slice(0, 10).forEach(({ description, count }) => {
    md += `- "${description}..." (${count}x)\n`;
  });
  const ssrIssues = issues.filter((i) => i.type === 'ssr_content_missing');
  if (ssrIssues.length > 0) {
    md += `\n## SSR check (content in initial HTML)\n`;
    md += `**${ssrIssues.length} page(s)** have main content missing from the server-rendered HTML (content appears only after JS runs). Fix by rendering key content in Server Components or in the initial RSC payload.\n\n`;
    ssrIssues.slice(0, 25).forEach((i) => {
      let line = `- ${i.url} (raw HTML: ${i.rawWordCount} words, ${i.rawH1Count} H1; after render: ${i.renderedWordCount} words)`;
      if (i.ssrRscFallbackUsed) line += '; RSC fallback would have passed';
      md += line + '\n';
    });
    if (ssrIssues.length > 25) md += `- ... and ${ssrIssues.length - 25} more\n`;
  }
  md += `\n## Issue rules applied\n`;
  md += `- Missing title / description / canonical\n`;
  md += `- Duplicate titles or duplicate descriptions\n`;
  md += `- Title length < 15 or > 60 (flag)\n`;
  md += `- Description length < 50 or > 160 (flag)\n`;
  md += `- Multiple H1s or missing H1 (when strict SSR: uses raw HTML H1 count)\n`;
  md += `- Pages with 200 status but robots meta includes noindex\n`;
  md += `- Canonical pointing off-origin or to a different path\n`;
  md += `- Images missing alt above threshold (${MISSING_ALT_THRESHOLD})\n`;
  md += `- SSR: content missing from raw HTML only (word count < ${MIN_RAW_SSR_WORDS} or no H1 in raw HTML; RSC payload not used for pass/fail when strict SSR is on)\n`;
  return { md, issues };
}

// --- Write outputs ----------------------------------------------------------
async function writeOutputs(results, ts) {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const jsonPath = join(OUTPUT_DIR, `crawl-${ts}.json`);
  const csvPath = join(OUTPUT_DIR, `crawl-${ts}.csv`);
  const summaryPath = join(OUTPUT_DIR, `summary-${ts}.md`);

  const { md: summary, issues } = buildSummary(results, ts);

  await writeFile(jsonPath, JSON.stringify(results, null, 2), 'utf8');
  const headers = [
    'url', 'finalUrl', 'status', 'contentType',
    'title', 'titleLength', 'description', 'descriptionLength', 'robots', 'canonical',
    'h1Count', 'firstH1', 'h2s', 'ogTitle', 'ogDescription', 'ogImage',
    'twitterTitle', 'twitterDescription', 'twitterImage',
    'wordCount', 'imageCount', 'missingAlt', 'internalLinksOut', 'externalLinksOut',
    'rawTitle', 'rawDescription', 'rawH1Count', 'rawWordCount',
    'ssrTitle', 'ssrDescription', 'ssrH1Count', 'ssrWordCount', 'ssrRscFallbackUsed',
    'ssrContentMissing',
    'strictSSR',
    'discoveredBy', 'depth',
  ];
  const csvLines = [
    headers.map(csvEscape).join(','),
    ...results.map((r) =>
      headers.map((h) =>
        csvEscape(
          Array.isArray(r[h]) ? (r[h].length ? r[h].join(' | ') : '') : r[h]
        )
      ).join(',')
    ),
  ];
  await writeFile(csvPath, csvLines.join('\n'), 'utf8');
  await writeFile(summaryPath, summary, 'utf8');

  console.log('\nOutputs written to:', OUTPUT_DIR);
  console.log('  -', jsonPath);
  console.log('  -', csvPath);
  console.log('  -', summaryPath);
  return issues;
}

// --- Main -------------------------------------------------------------------
async function main() {
  const opts = parseArgs();
  const { results, ts } = await runCrawl(opts);
  const issues = await writeOutputs(results, ts);
  if (opts.failOnIssues && issues.length > 0) {
    console.error(`\nExiting with code 1: ${issues.length} issue(s) found (--fail-on-issues).`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
