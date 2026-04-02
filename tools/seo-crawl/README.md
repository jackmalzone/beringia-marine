# SEO Crawl (Next.js App Router)

Minimal Playwright-based SEO crawler for local-first Next.js 14 App Router sites. Crawls via BFS, extracts SEO-relevant fields per page, and writes JSON, CSV, and a summary report.

## Doctrine

- **Strict SSR is the default and required for release.** Do not use `--no-strict-ssr` for release passes.
- **If raw HTML fails, the page is considered broken regardless of RSC fallback.** The crawler verdict uses literal HTML only; RSC heuristics are diagnostic, not a pass.

### Why strict SSR?

Many crawlers and preview bots consume the **initial HTML only** (no JS). If title, H1, and body content aren’t in that response, they may index a shell or nothing. RSC payload and client-rendered content don’t help those consumers. Strict mode makes the crawler judge pages the same way: **raw HTML is the contract**. Using `--no-strict-ssr` for release would allow pages that “pass” only via heuristics while still failing for real crawlers. For full context (architecture, risks, acceptance), see [SSR SEO Hardening Review](../../docs/predeploy/SSR_SEO_HARDENING_REVIEW.md).

## Requirements

- Node.js 18+
- macOS (or any OS supported by Playwright)

## Setup

From this directory (`tools/seo-crawl/`):

```bash
npm install
npx playwright install chromium
```

Or from repo root with pnpm:

```bash
pnpm --filter @vital-ice/seo-crawl install
cd tools/seo-crawl && npx playwright install chromium
```

## Run

**Start your Next.js app** (e.g. `pnpm dev` from repo root so `http://localhost:3000` is up), then:

```bash
npm run crawl
```

Or with options:

```bash
node crawl.mjs --baseUrl http://localhost:3000 --maxPages 100 --maxDepth 4
```

### CLI options

| Flag | Default | Description |
|------|---------|-------------|
| `--baseUrl` | `http://localhost:3000` | Start URL for the crawl |
| `--maxPages` | `300` | Maximum number of pages to crawl |
| `--maxDepth` | `6` | Maximum BFS depth |
| `--concurrency` | `3` | Number of pages to fetch in parallel |
| `--userAgent` | `VitalIceSEO-Crawler/1.0` | User-Agent header |
| `--sitemap` | _(none)_ | Sitemap URL to seed the crawl. If omitted and baseUrl is remote HTTPS, we use `baseUrl/sitemap.xml` automatically. |
| `--no-sitemap` | — | Disable auto sitemap (crawl from baseUrl only, discover pages via link BFS). |
| `--includeQuery` | `false` | Keep query strings when normalizing URLs |
| `--strict-ssr` | `true` | Enforce SSR checks using **literal HTML only** (raw title, description, `<h1>`, body word count). Pass/fail uses raw fields only. Use for release. |
| `--no-strict-ssr` | — | Disable strict SSR (legacy: RSC heuristics can affect pass/fail). Do not use for release. |
| `--allow-rsc-fallback` | `false` | Report when RSC heuristics would have passed (diagnostic only). Sets `ssrRscFallbackUsed`; does not change verdict in strict mode. |
| `--fail-on-issues` | — | Exit with code 1 if any issues are found (for CI / pre-deploy gates). |
| `--delay MS` | `0` | Delay in ms between starting each page (e.g. `200` for production to avoid hammering the server). |
| `--help`, `-h` | — | Show help |

## Output

Files are written to `tools/seo-crawl/output/`:

- **`crawl-<timestamp>.json`** — Full per-page data (url, finalUrl, status, title, meta, h1/h2, og/twitter, word count, image/link counts, **raw** and **ssr** SSR fields, etc.).
- **`crawl-<timestamp>.csv`** — Same data in CSV for spreadsheets.
- **`summary-<timestamp>.md`** — Totals, **RAW SSR OK** count, and top issues (missing title/description/canonical, duplicate titles/descriptions, title/description length flags, multiple/missing H1, noindex on 200, canonical issues, images missing alt, **SSR: content missing from raw HTML**).

Timestamps look like `2025-02-05T12-30-00`.

## Behavior

- **Domain crawl:** For a remote HTTPS `--baseUrl` (e.g. `https://www.vitalicesf.com`), the tool fetches that domain’s sitemap (`/sitemap.xml`) and seeds the crawl with every URL in the sitemap (same-origin only). So one run covers the whole domain. Use `--no-sitemap` to crawl from the start URL only and discover pages via links.
- **BFS** over same-origin links only; URLs are de-duplicated (hash removed, query sorted or stripped per `--includeQuery`, trailing slash normalized).
- **Skips** common non-HTML assets (images, fonts, css, js, pdf, etc.) and paths like `/api/`, `/_next/`.
- **Per page:** waits for `networkidle`, then extracts SEO fields and collects internal links in one pass.
- **SSR verdict (strict by default):** The pass/fail decision uses **raw (literal) HTML only**: `<title>`, `<meta name="description">`, literal `<h1>` tags, and body word count. RSC payload heuristics are **not** used for the verdict when `--strict-ssr` is on (default). **RAW is authoritative.** Output includes `rawTitle`, `rawDescription`, `rawH1Count`, `rawWordCount` (truth) and diagnostic `ssr*` fields; `ssrRscFallbackUsed` is set when `--allow-rsc-fallback` and the page would pass only via RSC heuristics.
- **Issue detection** (see summary): missing or duplicate title/description/canonical; title/description length; H1 count; noindex on 200; canonical off-origin or different path; images missing alt above threshold (e.g. 5); **SSR**: pages where raw HTML has &lt;30 words or no H1 (client-only content) — verdict from raw only.

## Verifying SSR (how we check)

We verify that content is server-rendered in two ways:

1. **Crawler (strict SSR)** — The tool does a plain `fetch()` of each URL (no browser, no JS) and parses the initial HTML for `<title>`, `<meta name="description">`, `<h1>`, and body word count. That’s the “raw” pass. With strict SSR (default), a page passes only if that raw HTML has at least one `<h1>` and ≥30 body words.
2. **Summary** — After a run, open `output/summary-<timestamp>.md`. Check **RAW SSR OK: X/Y pages** (X should equal Y for a healthy site) and **Top issues** for `ssr_content_missing`. Zero `ssr_content_missing` means every crawled page had enough content in the initial HTML.

You can run the same check against **any domain** (local, staging, or production) by setting `--baseUrl`. For **remote HTTPS** URLs, the tool automatically fetches that domain’s **sitemap** (`baseUrl/sitemap.xml`) to seed the crawl, so you get full coverage of the domain in one run:

```bash
# Local (app must be running) — no sitemap; discovers pages via link BFS from baseUrl
node crawl.mjs --baseUrl http://localhost:3000 --maxPages 50

# Staging or production — auto-fetches domain/sitemap.xml and crawls those URLs
node crawl.mjs --baseUrl https://staging.example.com --maxPages 50
node crawl.mjs --baseUrl https://www.vitalicesf.com --maxPages 100

# Use a specific sitemap URL
node crawl.mjs --baseUrl https://www.vitalicesf.com --sitemap https://www.vitalicesf.com/sitemap.xml --maxPages 200

# Crawl a remote domain without sitemap (discover via links only)
node crawl.mjs --baseUrl https://www.vitalicesf.com --no-sitemap --maxPages 50
```

Then open the latest `output/summary-*.md` and confirm **RAW SSR OK** matches the page count and there are no `ssr_content_missing` issues. Optionally, **View Page Source** (Ctrl+U / Cmd+U) on a few URLs and search for `<h1>` and the page title to confirm the SSR block is in the response.

## Pre-deploy and CI

Run the crawler against your local or staging site before deploy to catch SEO issues:

```bash
pnpm dev
# in another terminal:
cd tools/seo-crawl && npm i && npm run crawl
```

Then inspect `output/summary-*.md` and `output/crawl-*.csv` for quick checks.

For **CI or pre-deploy gates**, use `--fail-on-issues` so the script exits with code 1 when any issue is found (missing title, SSR content missing, etc.):

```bash
node crawl.mjs --baseUrl https://staging.example.com --maxPages 100 --fail-on-issues
```

Optional **`--delay 200`** adds 200 ms between starting each page; use for production domains to avoid overloading the server.
