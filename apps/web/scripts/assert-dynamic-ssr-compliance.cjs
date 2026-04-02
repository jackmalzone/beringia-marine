/**
 * Dynamic SSR / No-ISR compliance assertions.
 * Run: node apps/web/scripts/assert-dynamic-ssr-compliance.cjs
 * Or: pnpm --filter @vital-ice/web test:compliance
 *
 * Asserts (per docs/seo/DYNAMIC_SSR_NO_ISR_IMPLEMENTATION.md):
 * - No generateStaticParams in services/[slug], insights/[slug], [slug].
 * - No revalidate > 0 in any services/insights page.tsx.
 * - services and insights layouts export revalidate=0, dynamic, fetchCache.
 */

const fs = require('fs');
const path = require('path');

const APP_APP = path.join(__dirname, '..', 'src', 'app');

function readSource(filePath) {
  const full = path.isAbsolute(filePath) ? filePath : path.join(APP_APP, filePath);
  return fs.readFileSync(full, 'utf-8');
}

function listPageFiles(segment) {
  const segmentPath = path.join(APP_APP, segment);
  if (!fs.existsSync(segmentPath)) return [];
  const out = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === 'page.tsx' || e.name === 'page.ts') out.push(full);
    }
  }
  walk(segmentPath);
  return out.map((f) => path.relative(APP_APP, f));
}

const slugPages = [
  'services/[slug]/page.tsx',
  'insights/[slug]/page.tsx',
  '[slug]/page.tsx',
];
const revalidatePositive = /\brevalidate\s*=\s*[1-9]\d*/;
const layouts = [
  { path: 'services/layout.tsx', name: 'services' },
  { path: 'insights/layout.tsx', name: 'insights' },
];

let failed = 0;

// 1) No generateStaticParams in [slug] pages
for (const relPath of slugPages) {
  const content = readSource(relPath);
  if (/\bgenerateStaticParams\b/.test(content)) {
    console.error(`FAIL: ${relPath} must not export generateStaticParams (dynamic SSR)`);
    failed++;
  }
}

// 2) No revalidate > 0 in services/insights pages
for (const segment of ['services', 'insights']) {
  const pages = listPageFiles(segment);
  for (const relPath of pages) {
    const content = readSource(relPath);
    const match = content.match(revalidatePositive);
    if (match) {
      console.error(`FAIL: ${relPath} must not export revalidate > 0 (no ISR). Found: ${match[0]}`);
      failed++;
    }
  }
}

// 3) Layouts enforce revalidate=0, dynamic, fetchCache
for (const { path: relPath, name } of layouts) {
  const content = readSource(relPath);
  if (!/\brevalidate\s*=\s*0\b/.test(content)) {
    console.error(`FAIL: ${name} layout must export revalidate = 0`);
    failed++;
  }
  if (!/dynamic\s*=\s*['"]force-dynamic['"]/.test(content)) {
    console.error(`FAIL: ${name} layout must export dynamic = 'force-dynamic'`);
    failed++;
  }
  if (!/fetchCache\s*=\s*['"]force-no-store['"]/.test(content)) {
    console.error(`FAIL: ${name} layout must export fetchCache = 'force-no-store'`);
    failed++;
  }
}

// 4) Article queries must not use revalidate > 0 (no ISR on insights)
const articlesPath = path.join(__dirname, '..', 'src', 'lib', 'sanity', 'queries', 'articles.ts');
if (fs.existsSync(articlesPath)) {
  const articlesContent = fs.readFileSync(articlesPath, 'utf-8');
  const articleRevalidatePositive = /revalidate:\s*[1-9]\d*/;
  if (articleRevalidatePositive.test(articlesContent)) {
    console.error('FAIL: apps/web/src/lib/sanity/queries/articles.ts must not use revalidate > 0 (no ISR)');
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} compliance assertion(s) failed.`);
  process.exit(1);
}
console.log('Dynamic SSR / No-ISR compliance: all assertions passed.');
