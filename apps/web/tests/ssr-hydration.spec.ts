/**
 * Layer 3: SSR and hydration parity.
 * 1) Raw HTML (request.get): assert title, canonical, H1, body phrase, JSON-LD in response body.
 * 2) After hydration (page.goto): assert visible H1 and main content still present (no client nuking SSR).
 *
 * Env: PLAYWRIGHT_BASE_URL (fetch base), SSR_CANONICAL_BASE_URL (canonical assertions; when unset in local dev, presence-only).
 */

import { expect, test } from '@playwright/test';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const baseURL = (process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const canonicalBase = (process.env.SSR_CANONICAL_BASE_URL || '').replace(/\/$/, '');
const isLocal =
  baseURL.includes('localhost') || baseURL.includes('127.0.0.1');
const insightSlug = process.env.SSR_AUDIT_INSIGHT_SLUG || 'holiday-glow-red-light-therapy-christmas';

/** Assert canonical: always require tag; strict (exact href) only when SSR_CANONICAL_BASE_URL set or not local. */
function expectCanonical(html: string, path: string): void {
  expect(html).toMatch(/<link[^>]*rel=["']canonical["'][^>]*>/i);
  const strict = Boolean(canonicalBase) || !isLocal;
  if (!strict) return;
  const origin = canonicalBase || baseURL;
  const expected = `${origin}${path.startsWith('/') ? path : `/${path}`}`;
  const re = new RegExp(
    `<link[^>]*rel=["']canonical["'][^>]*href=["']${escapeRegExp(expected)}["']`,
    'i'
  );
  const altRe = new RegExp(
    `href=["']${escapeRegExp(expected)}["'][^>]*rel=["']canonical["']`,
    'i'
  );
  expect(re.test(html) || altRe.test(html)).toBe(true);
}

/** Extract all application/ld+json script bodies. */
function extractJsonLd(html: string): string {
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks: string[] = [];
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1]);
  return blocks.join('\n');
}

/** Assert at least one of the allowed @type values appears in ld+json blocks or full HTML. */
function expectJsonLdTypes(html: string, allowed: string[]): void {
  const typeGroup = allowed.map(escapeRegExp).join('|');
  const strictRe = new RegExp(`"@type"\\s*:\\s*"(?:${typeGroup})"`, 'i');
  const relaxedRe = new RegExp(`(?:${typeGroup})`, 'i');
  const jsonld = extractJsonLd(html);
  if (jsonld.length > 0) {
    expect(jsonld).toMatch(strictRe);
  } else {
    // RSC streaming may embed JSON-LD in payload (not literal script); accept type name in body
    expect(strictRe.test(html) || relaxedRe.test(html)).toBe(true);
  }
}

const noCacheHeaders = {
  'cache-control': 'no-cache',
  pragma: 'no-cache',
};

test.describe('SSR raw HTML (crawler-equivalent)', () => {
  test('/solutions: title, canonical, H1, JSON-LD, body phrase in response', async ({ request }) => {
    const res = await request.get(`${baseURL}/solutions`, { headers: noCacheHeaders });
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toMatch(/<title>[^<]*<\/title>/i);
    expectCanonical(html, '/solutions');
    expect(html).toMatch(/<h1[\s>]/i);
    expectJsonLdTypes(html, ['LocalBusiness', 'Organization', 'WebSite']);
    expect(html).toMatch(/Solutions|marine|technology|Beringia/i);
  });

  test('/solutions/advanced-navigation: canonical, H1, JSON-LD, body phrase', async ({ request }) => {
    const res = await request.get(`${baseURL}/solutions/advanced-navigation`, { headers: noCacheHeaders });
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expectCanonical(html, '/solutions/advanced-navigation');
    expect(html).toMatch(/<h1[^>]*>[\s\S]*?Advanced Navigation/i);
    expectJsonLdTypes(html, ['LocalBusiness', 'Organization', 'WebSite']);
    expect(html).toMatch(/navigation|marine|mission|Beringia/i);
  });

  test('/insights: title, canonical, H1, JSON-LD', async ({ request }) => {
    const res = await request.get(`${baseURL}/insights`, { headers: noCacheHeaders });
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toMatch(/<title>[^<]*<\/title>/i);
    expectCanonical(html, '/insights');
    expect(html).toMatch(/<h1[\s>]/i);
    expectJsonLdTypes(html, ['Blog', 'ItemList', 'WebPage']);
  });

  test(`/insights/${insightSlug}: title, canonical, H1, Article JSON-LD`, async ({ request }) => {
    const res = await request.get(`${baseURL}/insights/${insightSlug}`, { headers: noCacheHeaders });
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toMatch(/<title>[^<]*<\/title>/i);
    expectCanonical(html, `/insights/${insightSlug}`);
    expect(html).toMatch(/<h1[\s>]/i);
    expectJsonLdTypes(html, ['Article']);
  });
});

test.describe('Hydration parity: visible H1 and content after load', () => {
  test('/solutions: visible H1 and solutions content after hydration', async ({ page }) => {
    await page.goto('/solutions', { waitUntil: 'domcontentloaded' });
    const main = page.locator('main').first();
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(main).toContainText(/Solutions|marine|programs|Advanced Navigation/i);
    await page.waitForTimeout(400);
    await expect(h1).toBeVisible();
    await expect(main).toContainText(/Solutions|marine|programs|Advanced Navigation/i);
  });

  test('/solutions/advanced-navigation: visible H1 and body content present', async ({ page }) => {
    await page.goto('/solutions/advanced-navigation', { waitUntil: 'domcontentloaded' });
    const main = page.locator('main').first();
    const h1 = main.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Advanced Navigation/i);
    await expect(main).toContainText(/navigation|marine|Beringia|Overview/i);
    await page.waitForTimeout(400);
    await expect(h1).toBeVisible();
    await expect(main).toContainText(/navigation|marine|Beringia|Overview/i);
  });

  test('/insights: visible H1 and insights content after hydration', async ({ page }) => {
    await page.goto('/insights', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('main, [role="main"], .content, body').first()).toContainText(/insights|articles|blog|Northline Studio/i);
    await page.waitForTimeout(400);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('main, [role="main"], .content, body').first()).toContainText(/insights|articles|blog|Northline Studio/i);
  });

  test(`/insights/${insightSlug}: visible H1 and article body after hydration`, async ({ page }) => {
    await page.goto(`/insights/${insightSlug}`, { waitUntil: 'domcontentloaded' });
    const main = page.locator('[data-seo-main]').first();
    const h1 = main.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(main).not.toHaveText(/^$/);
    await page.waitForTimeout(400);
    await expect(h1).toBeVisible();
    await expect(main).not.toHaveText(/^$/);
  });
});
