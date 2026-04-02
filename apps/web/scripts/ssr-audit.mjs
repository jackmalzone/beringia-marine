/**
 * Layer 2 SSR audit: fetch HTML via HTTP and assert SEO-critical markers.
 * Run: node apps/web/scripts/ssr-audit.mjs
 * Or: pnpm --filter @vital-ice/web ssr:audit
 *
 * Env: SSR_AUDIT_BASE_URL or BASE_URL (default http://localhost:3000) - URL to fetch
 *      SSR_CANONICAL_BASE_URL - base for canonical assertions (defaults to baseUrl)
 *      SSR_AUDIT_INSIGHT_SLUG (default holiday-glow-red-light-therapy-christmas)
 *      SSR_AUDIT_CMS_SLUG (optional; if set, audits /[slug])
 */

const baseUrl = (
  process.env.SSR_AUDIT_BASE_URL ||
  process.env.BASE_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');

const canonicalBase = (process.env.SSR_CANONICAL_BASE_URL || '').replace(/\/$/, '');
const isLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
const strictCanonical = Boolean(canonicalBase) || !isLocal;
const insightSlug = process.env.SSR_AUDIT_INSIGHT_SLUG || 'holiday-glow-red-light-therapy-christmas';
const cmsSlug = process.env.SSR_AUDIT_CMS_SLUG;
const MIN_INSIGHTS_WORDS = Number(process.env.SSR_AUDIT_MIN_INSIGHTS_WORDS || 300);
const MIN_INSIGHTS_P_TAGS = Number(process.env.SSR_AUDIT_MIN_INSIGHTS_P_TAGS || 3);
const MIN_SERVICE_WORDS = Number(process.env.SSR_AUDIT_MIN_SERVICE_WORDS || 200);
const MIN_SERVICE_P_TAGS = Number(process.env.SSR_AUDIT_MIN_SERVICE_P_TAGS || 2);
const MIN_VISIBLE_MAIN_INSIGHTS_WORDS = Number(
  process.env.SSR_AUDIT_MIN_VISIBLE_MAIN_INSIGHTS_WORDS || 300
);
const MIN_VISIBLE_MAIN_INSIGHTS_P_TAGS = Number(
  process.env.SSR_AUDIT_MIN_VISIBLE_MAIN_INSIGHTS_P_TAGS || 3
);
const MIN_VISIBLE_MAIN_SERVICE_WORDS = Number(
  process.env.SSR_AUDIT_MIN_VISIBLE_MAIN_SERVICE_WORDS || 200
);
const MIN_VISIBLE_MAIN_SERVICE_P_TAGS = Number(
  process.env.SSR_AUDIT_MIN_VISIBLE_MAIN_SERVICE_P_TAGS || 2
);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Canonical: presence required; exact href only when strict (canonicalBase set or not local). */
function canonicalOk(html, path) {
  if (!/<link[^>]*rel=["']canonical["'][^>]*>/i.test(html)) return false;
  if (!strictCanonical) return true;
  const origin = canonicalBase || baseUrl;
  const expected = `${origin}${path.startsWith('/') ? path : `/${path}`}`;
  const escaped = escapeRegExp(expected);
  const re1 = new RegExp(`rel=["']canonical["'][^>]*href=["']${escaped}["']`, 'i');
  const re2 = new RegExp(`href=["']${escaped}["'][^>]*rel=["']canonical["']`, 'i');
  return re1.test(html) || re2.test(html);
}

/** Extract application/ld+json script bodies. */
function extractJsonLd(html) {
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1]);
  return blocks.join('\n');
}

/** True if ld+json blocks or full HTML contain at least one of the allowed @type values. */
function jsonLdTypesOk(html, allowed) {
  const typeGroup = allowed.map(escapeRegExp).join('|');
  const strictRe = new RegExp(`"@type"\\s*:\\s*"(?:${typeGroup})"`, 'i');
  const relaxedRe = new RegExp(`(?:${typeGroup})`, 'i');
  const jsonld = extractJsonLd(html);
  if (jsonld.length && strictRe.test(jsonld)) return true;
  return strictRe.test(html) || relaxedRe.test(html);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  if (!text) return 0;
  const words = text.split(/\s+/).filter(Boolean);
  return words.length;
}

function countTags(html, tagName) {
  const re = new RegExp(`<${tagName}(\\s|>)`, 'gi');
  const matches = html.match(re);
  return matches ? matches.length : 0;
}

function extractVisibleMainHtml(html) {
  const seoMainMatch = html.match(/<main[^>]*data-seo-main[^>]*>[\s\S]*?<\/main>/i);
  if (seoMainMatch) return seoMainMatch[0];

  const mainMatch = html.match(/<main[\s>][\s\S]*?<\/main>/i);
  return mainMatch ? mainMatch[0] : '';
}

function htmlMetrics(html) {
  const text = stripHtml(html);
  const visibleMainHtml = extractVisibleMainHtml(html);
  const visibleMainText = stripHtml(visibleMainHtml);
  return {
    rawHtmlBytes: Buffer.byteLength(html, 'utf8'),
    contentWords: countWords(text),
    pTagCount: countTags(html, 'p'),
    h2TagCount: countTags(html, 'h2'),
    hasJsonLdScript: /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html),
    hasSeoMain: /data-seo-main/i.test(html) || /<main[\s>]/i.test(html),
    seoMainContainsP:
      /<main[^>]*data-seo-main[^>]*>[\s\S]*?<p[\s>]/i.test(html) ||
      /<main[\s>][\s\S]*?<p[\s>]/i.test(html),
    visibleMainWords: countWords(visibleMainText),
    visibleMainPTagCount: countTags(visibleMainHtml, 'p'),
    visibleMainH2TagCount: countTags(visibleMainHtml, 'h2'),
  };
}

const routes = [
  {
    path: '/services',
    name: 'Services index',
    assertions: (html) => {
      const errs = [];
      if (!/<title>[^<]*<\/title>/i.test(html)) errs.push('missing <title>');
      if (!canonicalOk(html, '/services')) errs.push('canonical for /services');
      if (!/<h1[\s>]/i.test(html)) errs.push('at least one <h1>');
      if (!jsonLdTypesOk(html, ['LocalBusiness', 'ItemList', 'WebPage'])) errs.push('JSON-LD LocalBusiness/ItemList/WebPage');
      if (!/Cold Plunge|Our Services|Wellness Services/i.test(html)) errs.push('body phrase (Cold Plunge / Our Services)');
      return errs;
    },
  },
  {
    path: '/services/cold-plunge',
    name: 'Service cold-plunge',
    minimums: {
      contentWords: MIN_SERVICE_WORDS,
      pTagCount: MIN_SERVICE_P_TAGS,
    },
    visibleMainMinimums: {
      contentWords: MIN_VISIBLE_MAIN_SERVICE_WORDS,
      pTagCount: MIN_VISIBLE_MAIN_SERVICE_P_TAGS,
    },
    assertions: (html) => {
      const errs = [];
      if (!canonicalOk(html, '/services/cold-plunge')) errs.push('canonical for /services/cold-plunge');
      if (!/<h1[^>]*>[\s\S]*?Cold Plunge/i.test(html)) errs.push('<h1> containing "Cold Plunge"');
      if (!jsonLdTypesOk(html, ['Service', 'LocalBusiness', 'WebPage'])) errs.push('JSON-LD Service/LocalBusiness/WebPage');
      if (!/Experience cold plunge|cold plunge therapy|cold plunge/i.test(html)) errs.push('body phrase (cold plunge)');
      return errs;
    },
  },
  {
    path: '/insights',
    name: 'Insights index',
    assertions: (html) => {
      const errs = [];
      if (!/<title>[^<]*<\/title>/i.test(html)) errs.push('missing <title>');
      if (!canonicalOk(html, '/insights')) errs.push('canonical for /insights');
      if (!/<h1[\s>]/i.test(html)) errs.push('at least one <h1>');
      if (!jsonLdTypesOk(html, ['Blog', 'ItemList', 'WebPage'])) errs.push('JSON-LD Blog/ItemList/WebPage');
      return errs;
    },
  },
  {
    path: `/insights/${insightSlug}`,
    name: `Insights article ${insightSlug}`,
    minimums: {
      contentWords: MIN_INSIGHTS_WORDS,
      pTagCount: MIN_INSIGHTS_P_TAGS,
    },
    visibleMainMinimums: {
      contentWords: MIN_VISIBLE_MAIN_INSIGHTS_WORDS,
      pTagCount: MIN_VISIBLE_MAIN_INSIGHTS_P_TAGS,
    },
    assertions: (html) => {
      const errs = [];
      if (!/<title>[^<]*<\/title>/i.test(html)) errs.push('missing <title>');
      if (!canonicalOk(html, `/insights/${insightSlug}`)) errs.push(`canonical for /insights/${insightSlug}`);
      if (!/<h1[\s>]/i.test(html)) errs.push('at least one <h1>');
      if (!jsonLdTypesOk(html, ['Article'])) errs.push('JSON-LD Article');
      return errs;
    },
  },
];

if (cmsSlug) {
  routes.push({
    path: `/${cmsSlug}`,
    name: `CMS page /${cmsSlug}`,
    assertions: (html) => {
      const errs = [];
      if (!/<title>[^<]*<\/title>/i.test(html)) errs.push('missing <title>');
      if (!canonicalOk(html, `/${cmsSlug}`)) errs.push(`canonical for /${cmsSlug}`);
      if (!/<h1[\s>]|<main[\s>]/i.test(html)) errs.push('H1 or main content');
      return errs;
    },
  });
}

let failed = 0;

for (const route of routes) {
  const url = baseUrl + route.path;
  let html;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
    });
    if (!res.ok) {
      console.error(`FAIL [${route.name}] ${url}: HTTP ${res.status}`);
      failed++;
      continue;
    }
    html = await res.text();
  } catch (e) {
    console.error(`FAIL [${route.name}] ${url}: ${e.message}`);
    failed++;
    continue;
  }

  const errs = route.assertions(html);
  const metrics = htmlMetrics(html);

  if (route.minimums) {
    if (metrics.contentWords < route.minimums.contentWords) {
      errs.push(
        `contentWords ${metrics.contentWords} < minimum ${route.minimums.contentWords}`
      );
    }
    if (metrics.pTagCount < route.minimums.pTagCount) {
      errs.push(`pTagCount ${metrics.pTagCount} < minimum ${route.minimums.pTagCount}`);
    }
  }

  if (route.visibleMainMinimums) {
    if (metrics.visibleMainWords < route.visibleMainMinimums.contentWords) {
      errs.push(
        `visibleMainWords ${metrics.visibleMainWords} < minimum ${route.visibleMainMinimums.contentWords}`
      );
    }
    if (metrics.visibleMainPTagCount < route.visibleMainMinimums.pTagCount) {
      errs.push(
        `visibleMainPTagCount ${metrics.visibleMainPTagCount} < minimum ${route.visibleMainMinimums.pTagCount}`
      );
    }
  }

  console.log(
    `METRICS [${route.name}] words=${metrics.contentWords} p=${metrics.pTagCount} h2=${metrics.h2TagCount} visibleMainWords=${metrics.visibleMainWords} visibleMainP=${metrics.visibleMainPTagCount} visibleMainH2=${metrics.visibleMainH2TagCount} bytes=${metrics.rawHtmlBytes} jsonLdScript=${metrics.hasJsonLdScript} seoMain=${metrics.hasSeoMain} seoMainHasP=${metrics.seoMainContainsP}`
  );

  if (errs.length > 0) {
    console.error(`FAIL [${route.name}] ${url}: ${errs.join('; ')}`);
    failed++;
  } else {
    console.log(`OK [${route.name}] ${url}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} SSR audit assertion(s) failed.`);
  process.exit(1);
}
console.log('\nSSR audit: all assertions passed.');
