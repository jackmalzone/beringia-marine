# Pre-deploy SEO Checklist

Repeatable SEO verification before shipping. Use the pass that matches your timeline; release passes include all prior levels.

**Source of truth:** This checklist. Run it; don’t skip.

### Release gate (strict SSR)

- [ ] Run crawler with strict SSR (default; do not use `--no-strict-ssr` for release).
- [ ] Zero `ssr_content_missing` allowed.

---

## Fast Pass (~10 minutes)

For small changes, hotfixes, or when time is tight.

### 1. Local crawl

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Run SEO crawler (strict SSR) | Surfaces missing H1s, bad meta, duplicates, and indexability in one run. **Release passes require strict SSR** (literal HTML only). | From repo root: `pnpm dev` (leave running). In another terminal: `cd tools/seo-crawl && npm run crawl`. Default is `--strict-ssr`; do not use `--no-strict-ssr` for release. | Crawl finishes; `output/summary-<timestamp>.md` exists. | Fix crawler errors (e.g. install deps: `npm i && npx playwright install chromium`). Ensure app is on `http://localhost:3000`. |
| Read crawl summary | Summary is the primary signal for go/no-go. | Open `tools/seo-crawl/output/summary-<timestamp>.md`. | **Release blockers:** Zero `missing_title`, `missing_description`, `missing_h1`, `multiple_h1` (or only acceptable exceptions). `canonical_off_origin` when crawling localhost is **expected** (ignore). | See [Crawl summary: what to fix](#crawl-summary-what-to-fix) below. |

### 2. Metadata spot check

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Home + 2 key pages | Wrong title/description hurts CTR and trust. | In browser: View Page Source on `/`, `/services`, `/book`. Check `<title>` and `<meta name="description">`. | Title ≤60 chars, description 50–160 chars; no empty or placeholder text. | Update `apps/web/src/lib/seo/metadata.ts` or page `generateMetadata` / `metadata` export. |

### 3. No deploy-first

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Crawl before merge | Catching SEO issues after deploy is noisy and slow. | Run Fast Pass (crawl + summary) before merging launch-related PRs. | Crawl run and summary reviewed; blockers resolved or documented in PR. | Block merge until crawl is clean or exceptions are documented in release template. |

---

## Standard Pass (~30–45 minutes)

For normal feature releases and content-heavy changes.

### 4. Crawl & indexability

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Full local crawl (strict SSR) | Ensures all discoverable pages have valid SEO data and one H1. **Use strict SSR for release** (raw HTML is the source of truth). | `cd tools/seo-crawl && npm run crawl`. Default is `--strict-ssr`. Use default `--maxPages 300` unless you have a huge site. | Summary shows 0 release-blocking issues (see table below). RAW SSR OK in summary matches expectation. | Fix issues in code (metadata, headings, canonicals). Re-run crawl. |
| Read `summary-*.md` | Prioritizes what to fix. | Open latest `tools/seo-crawl/output/summary-<timestamp>.md`. Check **Totals** and **Top issues**. | Only acceptable exceptions (e.g. `canonical_off_origin` on localhost). | Address blockers; add non-blockers to backlog or document in release template. |
| Optional: crawl staging | Confirms production-like URLs and redirects. | Deploy to staging, then `node crawl.mjs --baseUrl https://staging.example.com` from `tools/seo-crawl`. | Same as local: no blockers. Canonicals may match staging origin (expected). | Fix staging config or routing; re-crawl. |

### 5. Metadata correctness

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Titles | Long titles truncate in SERPs; short ones underperform. | From crawl CSV or JSON: column `titleLength`. Or View Source on key pages. | Every page: 15 ≤ title length ≤ 60. No duplicates across important pages. | Adjust in `metadata.ts`, `generateMetadata`, or Sanity. Re-crawl. |
| Descriptions | Same as titles for snippets. | Crawl: `descriptionLength`. | 50 ≤ length ≤ 160. No duplicates. | Same as titles. |
| Canonicals | Wrong canonicals cause duplicate-content risk. | Crawl flags `canonical_off_origin`, `canonical_different_path`. View Source: `<link rel="canonical">`. | Canonical points to the correct production URL for that path. On localhost crawl, off-origin is expected. | Fix `metadataBase` or page-level `alternates.canonical` in Next.js metadata. |
| Robots | Accidental noindex hides pages. | Crawl flags `noindex_on_200`. View Source: `<meta name="robots">`. | Indexable pages have no `noindex`. | Remove noindex from metadata or fix conditional logic. |

### 6. Open Graph & Twitter previews

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| OG/Twitter tags | Previews in social and some search. | View Source: `og:title`, `og:description`, `og:image`; `twitter:title`, `twitter:description`, `twitter:image`. Or use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) / [Twitter Card Validator](https://cards-dev.twitter.com/validator). | Present on key pages; image URLs absolute and reachable. | Set in `metadata.ts` or page metadata (`openGraph`, `twitter`). |

### 7. Headings & content semantics

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| One H1 per page | Multiple or missing H1s hurt structure and SEO. | Crawl: `h1Count`, `firstH1`. Summary: `missing_h1`, `multiple_h1`. | Each page: `h1Count` = 1. | Demote extra H1s to H2 or remove; ensure one visible or sr-only H1. See SEO master plan if many pages. |
| H2 hierarchy | Sensible outline for accessibility and parsing. | Manual check on 2–3 key pages. | Logical order; no skipped levels (H1 → H2 → H3). | Adjust heading levels in components. |

### 8. Images & alt text

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Alt text | Accessibility and image SEO. | Crawl: `imageCount`, `missingAlt`. Summary: `images_missing_alt` (threshold 5). | No page with >5 images missing alt. | Add `alt` to `<Image>` or `<img>`; decorative images use `alt=""`. |

### 9. Internal linking

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Crawl link counts | Sanity check for discovery. | Crawl JSON/CSV: `internalLinksOut`, `externalLinksOut`. | Key pages have internal links; no unexpected 0. | Add or fix navigation and in-content links. |
| Broken links | 404s hurt UX and crawl efficiency. | Click through main nav and 2–3 key flows on local or staging. | No 404s on primary paths. | Fix hrefs or add redirects. |

---

## Release Pass (~60–90 minutes)

Pre-launch or major releases. Do Standard Pass first, then the following.

### 10. Performance (Core Web Vitals)

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Lighthouse Performance | LCP, INP/CLS, TTFB affect UX and ranking. | Chrome DevTools → Lighthouse → Performance (Desktop + Mobile). Run on `/`, `/services`, one article. | Performance score ≥80; no “Poor” CWV. | Optimize images, reduce JS, use caching; re-run. |

### 11. Accessibility

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Lighthouse Accessibility | A11y issues can affect SEO and compliance. | Lighthouse → Accessibility on same pages as above. | Score ≥90; no critical failures. | Fix reported issues (contrast, labels, focus). |
| axe (optional) | Deeper a11y coverage. | Install axe DevTools or run `@axe-core/cli` if in pipeline. | No critical/serious violations on key pages. | Address violations; retest. |

### 12. Structured data (JSON-LD)

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Article / org schema | Rich results and knowledge panels. | View Source: search for `application/ld+json`. Use [Rich Results Test](https://search.google.com/test/rich-results). | Valid JSON-LD; no errors in tester. | Fix schema in `apps/web/src/lib/seo/structured-data.ts` or page-level script. |

### 13. Sitemaps & robots.txt

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| Sitemap | Helps discovery of all important URLs. | Production: `https://www.vitalicesf.com/sitemap.xml`. Local: not applicable (dynamic route may not serve same list). | Returns XML; includes homepage, main sections, services, insights. | Check `apps/web/src/app/sitemap.ts`; fix URLs or fetch logic. |
| robots.txt | Controls crawler access. | Production: `https://www.vitalicesf.com/robots.txt`. | Allows `/`; disallows `/api/`, `/admin/`; references sitemap. | Edit `apps/web/src/app/robots.ts`. |
| Staging vs prod | Staging should not be indexed. | On staging, confirm robots disallow or noindex. | Staging blocked or noindex. | Add environment-based rule in `robots.ts` or use noindex on staging. |

### 14. Analytics / tracking sanity check

| Item | Why | How | Good | If it fails |
|------|-----|-----|------|-------------|
| GTM / GA (if used) | Ensures post-launch data. | Load key pages; check Network tab for GTM/GA requests, or use tag assistant. | Tags fire on key events/pages. | Fix container ID, triggers, or consent; verify in staging. |

---

## Crawl summary: what to fix

Use the latest `tools/seo-crawl/output/summary-<timestamp>.md`.

| Issue type | Release blocker? | Action |
|------------|------------------|--------|
| `missing_title`, `missing_description`, `missing_h1` | **Yes** | Fix metadata or heading in code; re-crawl. |
| `multiple_h1` | **Yes** | One H1 per page; demote or remove duplicates. |
| `title_too_short`, `title_too_long` | **Yes** | Bring title to 15–60 chars. |
| `description_too_short`, `description_too_long` | **Yes** | Bring description to 50–160 chars. |
| `duplicate titles` / `duplicate descriptions` | **Yes** (for key pages) | Make unique per page. |
| `noindex_on_200` | **Yes** (unless intentional) | Remove noindex for pages that should be indexed. |
| `canonical_off_origin` | **No** when crawling localhost | Expected; production canonicals are correct. |
| `canonical_different_path` | **Yes** | Fix canonical to match page URL. |
| `images_missing_alt` (above threshold) | **Yes** | Add alt text. |
| `ssr_content_missing` | **Yes** | Main content is not in the **raw** initial HTML (client-only). Render key content in Server Components or ensure it’s in the first HTML so crawlers and SEO see it. Verdict uses literal (raw) HTML only; RSC heuristics are not used for pass/fail when strict SSR is on. |

**Acceptable exceptions:** Document in the release template (e.g. one known duplicate, deferred a11y fix) with rationale.

---

## Quick reference: crawler commands

**For release:** run with strict SSR (default). Do not use `--no-strict-ssr` for release passes.

```bash
# From repo root: start app, then in another terminal:
cd tools/seo-crawl
npm run crawl                    # default: http://localhost:3000, 300 pages, depth 6, --strict-ssr
node crawl.mjs --help            # options
node crawl.mjs --maxPages 100    # smaller run (strict SSR by default)
```

**Output:** `output/crawl-<timestamp>.json`, `crawl-<timestamp>.csv`, `summary-<timestamp>.md`. Use the summary first; use JSON/CSV for per-URL detail.
