# SSR SEO System Hardening + Acceptance Review

**Role:** Staff Engineer / Release Steward  
**Scope:** Playwright SEO crawler (`tools/seo-crawl`) + application SSR implementation (SSRBodyBlock, layout, heading refactors)  
**Outcome:** Concrete improvements, guardrails, and merge recommendation.

---

## 1. Current architecture (ground truth)

### 1.1 How SSR content is guaranteed in the initial HTML

- **Mechanism:** A single injection point in the **root layout** emits **literal HTML** (not RSC payload) at the start of `<body>`. That HTML is built as a string and rendered via `dangerouslySetInnerHTML`, so it appears as real tags in the response stream.
- **Source of path:** Middleware sets `x-pathname` on the **response** (`response.headers.set('x-pathname', pathname)`). The root layout’s `SSRBodyBlock` reads `headers().get('x-pathname')`. **Caveat:** In Next.js, `headers()` in Server Components reads **request** headers. Passing data from middleware to the server is typically done by mutating the **request** (e.g. `NextResponse.next({ request: { headers: new Headers(...) } })`). The current code sets a **response** header; whether the server actually sees `x-pathname` depends on Next.js behavior and should be verified (e.g. log in SSRBodyBlock in prod build).
- **Fallback:** If pathname doesn’t map to a known route or content is missing, `SSRBodyBlock` returns `null` and no block is injected.

### 1.2 How `<SSRBodyBlock />` works, where it renders, and what it emits

- **Where:** Renders in **root layout** (`apps/web/src/app/layout.tsx`), as the first child of `<body>`, before any providers or page content.
- **Logic:**
  1. Reads `x-pathname` from `headers()`.
  2. **`/insights/[slug]`:** Calls `getArticleBySlug(slug)`. If an article exists and has abstract or content, builds block with `h1 = article.title`, `content = article.abstract` (if ≥50 chars) or stripped `article.content` (first 400 chars). Renders a single wrapper `<div>` with `dangerouslySetInnerHTML={{ __html: buildSSRHtmlBlock({ h1, content }) }}`.
  3. **All other routes:** `getPageKeyFromPathname(pathname)` maps path to a static `pageKey`. `getSSRContent(pageKey)` (from ServerSideSEO) returns `{ h1, content }` from the in-code `SEO_CONTENT` map. Same wrapper div + `buildSSRHtmlBlock(content)`.
- **Emitted HTML:** `buildSSRHtmlBlock` (in `apps/web/src/lib/seo/ssr-html.ts`) returns:
  ```html
  <div class="sr-only" aria-hidden="false"><h1>${escapeHtml(h1)}</h1><p>${escapeHtml(content)}</p></div>
  ```
  Text is HTML-escaped. The wrapper in React is another `<div suppressHydrationWarning dangerouslySetInnerHTML ... aria-hidden="false">`, so the DOM is: div (wrapper) → div.sr-only → h1, p.

- **Styling:** `.sr-only` in `globals.css` uses position absolute, 1px size, overflow hidden, clip rect(0,0,0,0). Content is in DOM and available to crawlers and screen readers but not visibly rendered.

### 1.3 How visible headings are structured

- **Intent:** Exactly one true `<h1>` per page, supplied by the layout block (SSRBodyBlock). The visible “hero” or page title is **not** an `<h1>`.
- **Implementation:** Visible main headings were changed from `<h1>` / `<motion.h1>` to:
  - `<div role="heading" aria-level={1}>` (or `motion.div` with the same attributes), with the same visual classes.
- **Where:** Hero (home), About, Book, Contact, Services, Partners, Experience, Careers, FAQ, Client policy, Register, service templates (Sanity + static), Insights list hero, Article hero, HeroBlock, and “Service Not Found” client component.
- **ServerSideSEO:** No longer outputs an `<h1>`; it still outputs a `.sr-only` block with h2s, nav, and a paragraph so crawlers that execute JS see additional structure and links. The single H1 is only in SSRBodyBlock’s literal HTML.

### 1.4 How the crawler determines “SSR content present,” H1 count, and word count

- **Flow per URL:**
  1. **RENDERED pass (Playwright):** `page.goto(url, { waitUntil: 'networkidle' })`, then 1.5s or 3s delay (longer for insight articles), then `page.evaluate(extractScript)`. That script uses the **live DOM**: `document.querySelectorAll('h1')`, body text via `document.body.cloneNode(true)` with script/style/noscript removed, then word count on `textContent`. So **H1 count** and **word count** here are **post-JS, full DOM** (RENDERED).
  2. **RAW pass (fetch):** After closing the page, `fetchInitialHtml(url, userAgent)` does a plain `fetch(url)` and `res.text()`. No browser, no JS. The full response body is the “initial HTML.”
  3. **Parse RAW:** `parseInitialHtml(rawHtml)`:
     - **Literal HTML:** Regex for `<title>`, `<meta name="description">`, `<h1[^>]*>`, then `<body>...</body>`. Body text: strip `<script>`, `<style>`, then all tags, then count words. So **ssrH1Count** and **ssrWordCount** are from **literal tags and text only**.
     - **RSC heuristics:** If `ssrH1Count === 0` **or** `ssrWordCount < 30`, the parser also runs:
       - Regex for RSC-style H1: `"h1",null,{"children":"..."` (with optional single-quote variant and escaped chars). For each match, it adds 1 to ssrH1Count (capped at 1) and adds that text’s word count to ssrWordCount.
       - Regex for long `"content"` or `"children"` strings (≥50 chars); if a match has ≥20 words, those words are added to ssrWordCount (no cap; multiple matches can stack).
  4. **SSR verdict:** `hasRenderedContent = (wordCount > 50) && (h1Count >= 1)` (using **RENDERED** counts). Then `ssrContentMissing = hasRenderedContent && (ssrWordCount < MIN_SSR_WORDS || ssrH1Count === 0)` (using **RAW** counts, possibly boosted by RSC heuristics). So a page “passes” SSR if either:
     - Literal HTML already has ≥1 H1 and ≥30 body words, or
     - RSC heuristics add enough H1 and words so that the boosted RAW counts clear the threshold.

- **H1 issues:** `missing_h1` and `multiple_h1` are based **only on RENDERED** `h1Count` (DOM after JS). They do not use RAW or RSC.

### 1.5 How RSC payload parsing factors in

- **When:** Only when the **literal** HTML already “fails” RAW: `ssrH1Count === 0` or `ssrWordCount < 30`.
- **Effect:** Can set `ssrH1Count` to at least 1 and add words to `ssrWordCount`, so `ssrContentMissing` can become false even when there is **no** literal `<h1>` or sufficient literal body text in the response.
- **Risk:** A page that sends only a shell (e.g. loading state) and all real content in RSC payload could “pass” SSR in the crawler because the heuristic finds RSC strings, while a strict non-JS consumer (e.g. some crawlers or preview bots) would see no real content. The crawler does not currently distinguish “passed via literal HTML” vs “passed via RSC heuristic.”

---

## 2. Risks and tradeoffs

### 2.A SEO & cloaking risk (sr-only injection at root layout)

- **What we do:** We inject a single, consistent block per page: one `<h1>` and one `<p>`, either from static `SEO_CONTENT` or from article title + abstract. Content is **truthful** to the page (same H1 as metadata/title intent; paragraph is summary or abstract, not different messaging).
- **Cloaking / hidden content:** Search guidelines forbid showing different content to crawlers than to users when the intent is to manipulate rankings. Our block is:
  - **Same topic and intent** as the page (H1 and summary match the page).
  - **Not used to stuff keywords** that aren’t reflected in visible content (we use existing SEO content and article data).
  - **Visible to assistive tech** (aria-hidden="false", sr-only is a standard pattern for screen readers).
- **Conditions for acceptability:** (1) H1 and paragraph must match or accurately summarize the page. (2) No extra keyword stuffing in the block. (3) If we ever show different H1/content in the block than the visible page, that would be high cloaking risk.
- **Constraints to stay legitimate:** (a) SSRBodyBlock content must remain derived from the same source of truth as the page (SEO_CONTENT, article title/abstract). (b) No per-crawler or per–user-agent branching for this block. (c) Document the pattern in the SEO/accessibility docs so future changes don’t drift.

**Verdict:** Low cloaking risk **as implemented**, provided we keep the block truthful and don’t branch or stuff. Governance (see below) should lock that.

### 2.B Semantic HTML integrity (visible `<h1>` → `<div role="heading" aria-level={1}>`)

- **Gained:** One true `<h1>` per page in the document (from layout), satisfying “single H1” SEO and outline rules. No duplicate or missing H1 in DOM.
- **Lost:** The **visible** main heading is no longer the document’s H1. The document outline has the real H1 in a visually hidden block and the visible “title” as an ARIA heading.
- **Accessibility:** `role="heading" aria-level={1}` is valid and is announced as a level-1 heading by screen readers. So assistive-tech semantics are preserved. The only oddity is that the “first” heading a screen-reader user might hit could be the visible one (e.g. “Live Better — Together.”) while the “real” H1 in DOM order is the sr-only one (e.g. “Vital Ice - Cold Plunge...”); order depends on DOM position. For our layout, SSRBodyBlock is first in body, so the real H1 is first in DOM; then visible content. So we’re okay.
- **SEO / outline:** Major engines use the DOM and can see the single `<h1>`. They also index visible text. Having the visible hero as div with role="heading" doesn’t break indexing; the canonical H1 is in the same document and matches page intent.
- **Maintainability:** Any new page or new “hero” must follow the rule: no visible `<h1>`; use div + role/aria-level. That’s a policy and training concern; easy to break if not documented and reviewed.

**Verdict:** Tradeoff is acceptable for SEO and a11y **if** we document the heading policy and enforce it (e.g. in checklist and PR review).

### 2.C Tooling self-deception risk (RSC heuristics)

- **Masking real SSR problems:** Yes. If we remove or break the layout injection (e.g. middleware no longer forwards pathname, or SSRBodyBlock returns null), pages could still “pass” SSR because RSC payload in the response might match the regex. The crawler would report “no ssr_content_missing” even though a strict fetch-only client would see no literal H1 and almost no body text.
- **Strict non-JS crawl:** A bot that only parses literal HTML and does not run our RSC regex would see the **injected** block (if present) and pass. If injection were missing, that bot would fail while our crawler could still pass thanks to RSC.
- **False confidence:** We don’t currently report *why* a page passed (literal vs RSC). So we can’t tell “this page is safe for any crawler” from “this page only passed because we counted RSC.”

**Verdict:** RSC heuristics are useful as a **secondary** signal but must not be the **primary** criterion for “SSR OK.” RAW (literal HTML) should be the source of truth for release blocking; RSC should be opt-in or clearly labeled so we don’t silently relax requirements.

---

## 3. Concrete system improvements

### 3.A Dual-pass crawl model (mandatory)

**Principle:** A page is considered SSR-correct only if a strict, non-JS fetch of its initial HTML contains a real `<h1>` and sufficient body text. Rendered content and RSC payloads are supplementary signals only.

- **RAW pass (authoritative for SSR):**
  - **How:** Plain `fetch(url)`, no browser. Parse with **literal-only** logic: no RSC regex. Compute `rawH1Count`, `rawWordCount` from `<body>` (strip script/style, count `<h1>`, count words).
  - **Metrics:** `rawH1Count`, `rawWordCount`, `rawTitle`, `rawDescription`. These are the “strict non-JS” metrics.
  - **Rule:** For a page to be “SSR OK” in a release-blocking sense, require `rawH1Count >= 1` and `rawWordCount >= MIN_SSR_WORDS` (e.g. 30). No RSC fallback for this verdict.

- **RENDERED pass (authoritative for structure and UX):**
  - **How:** Playwright, `networkidle`, delay, then `extractScript` (DOM). Compute `h1Count`, `wordCount`, title, description, canonicals, etc.
  - **Metrics:** All current DOM-based metrics (h1Count, h2s, wordCount, links, images, meta).

- **Comparison and reporting:**
  - Store both RAW and RENDERED in crawl results (e.g. `rawH1Count` / `renderedH1Count`, `rawWordCount` / `renderedWordCount`).
  - **SSR verdict:** `ssrContentMissing = (rendered has content) && (rawH1Count < 1 || rawWordCount < MIN_SSR_WORDS)`. Do **not** use RSC parsing for this flag.
  - Optionally add a **separate** flag: `ssrRscFallbackUsed = (raw would fail) && (after RSC parse, pass)`. Use only for reporting and non-blocking warnings.

- **Release blockers:** (1) `ssrContentMissing` true (RAW fails). (2) `missing_h1` or `multiple_h1` (RENDERED). (3) Missing title/description/canonical, etc. as today. `canonical_off_origin` on localhost remains acceptable.

### 3.B SSR detection tightening

- **When RSC parsing is allowed:** Only for **informational** reporting (e.g. “this page would fail RAW but has RSC content”). Not for `ssrContentMissing` or any release-blocking rule.
- **When it must not be used:** For the primary SSR pass/fail decision. That must be literal HTML only.
- **Stricter thresholds / flags:**
  - Add a CLI flag, e.g. `--strict-ssr`, that disables RSC parsing entirely and uses only literal HTML for SSR verdict.
  - Default could remain “current behavior” for backward compatibility, but the **predeploy checklist** should require running with `--strict-ssr` (or make strict the default and add `--allow-rsc-fallback` for analysis). Recommendation: **strict by default**; document that RSC is best-effort analysis only.

### 3.C SSRBodyBlock governance

**Invariant:** Removing or modifying SSRBodyBlock must cause the strict SSR crawl to fail on affected pages. If the crawl still passes after such a change, the system is not enforcing correctness and must be fixed.

- **If we keep SSRBodyBlock (recommended, with constraints):**
  - **Content source:** H1 and paragraph must come only from (a) `SEO_CONTENT[pageKey]` for static routes, or (b) article title + abstract (or stripped content prefix) for `/insights/[slug]`. No ad-hoc strings or user input in the block.
  - **Size limits:** Cap paragraph length (e.g. 500 chars) to avoid dumping long content into a hidden block. Already partially done (400 chars for article content fallback).
  - **Formatting:** No HTML inside the block except the single `<h1>` and single `<p>` (already the case; `buildSSRHtmlBlock` escapes and uses only those tags).
  - **Duplication:** The block must not repeat the same long text that appears verbatim in the visible page in a way that looks like stuffing. Summaries and abstracts are fine.

- **Alternative (if we want to reduce hidden content):**
  - **Visible intro paragraph:** For key pages, add a short, visible “intro” paragraph near the top (e.g. under the hero) that is server-rendered and matches the SEO summary. Then we could avoid a long sr-only paragraph and keep only an sr-only H1 for strict crawlers. That’s a larger UX/content change.
  - **Per-route SSR fragments:** Each page could render its own first chunk (e.g. a fragment that returns literal H1 + one line). That would require no layout injection but would depend on Next.js emitting that fragment as literal HTML in the first chunk (streaming behavior), which we cannot fully control. So layout injection is more reliable.

**Recommendation:** **Keep SSRBodyBlock**, with explicit governance: document the content-source and size rules above, add a small unit or integration test that SSRBodyBlock output is escaped and contains only one H1 and one p, and add a pre-merge note in the checklist that changing SSRBodyBlock or SEO_CONTENT requires SEO review.

### 3.D Heading policy clarification

- **When `<h1>` is allowed in visible content:** Only when the page does **not** use the layout SSR block for that route (e.g. a future route that opts out and renders its own single H1 in the main content). Today we assume every page gets the block.
- **When layout-level SSR H1 is used:** For all routes that map in `getPageKeyFromPathname` or are handled by SSRBodyBlock (including `/insights/[slug]`). That’s the single source of the document H1.
- **Dynamic routes (articles, services):** Articles: H1 = article title from `getArticleBySlug`. Services: H1 from `SEO_CONTENT[serviceSlug]`. Both are truthful to the page.
- **Exceptions:** Any route that must have a visible `<h1>` (e.g. legal or accessibility requirement) must be documented; we’d then either exclude it from the block and ensure one visible H1, or accept two H1s with a documented exception. Currently we have one known `multiple_h1` (contact); that should be fixed (single H1 from block, visible heading stays as div) or explicitly excepted in the checklist.

**Proposed policy doc (add to repo):** “One H1 per page, supplied by the root layout’s SSR block. Visible hero/title must use `<div role=\"heading\" aria-level={1}>` (or equivalent). No visible `<h1>` except in opt-out routes documented in [list]. New pages must not add a second H1.”

---

## 4. Crawler output and reporting updates

- **RAW vs RENDERED:** In JSON/CSV/summary, include both:
  - `rawH1Count`, `rawWordCount` (literal HTML only).
  - `renderedH1Count`, `renderedWordCount` (current `h1Count`, `wordCount`).
  - Optionally `ssrRscHeuristicUsed` (true if RSC parsing was run and changed the outcome when strict RAW would fail).

- **SSR source:** Add a field or summary section: “Pages whose SSR content is **injected** (layout block)” vs “Pages with **native** SSR (sufficient literal content without injection).” That would require the crawler to know which pages are expected to rely on the block (e.g. all in our sitemap) or to infer from rawWordCount (e.g. if rawWordCount is in a narrow band typical of our block, label as “injected”). Simpler: always report rawH1Count and rawWordCount so reviewers can see that the block is present (e.g. ~1 H1 and ~50–150 words on most pages).

- **Heading semantics:** In the summary, list pages where `renderedH1Count !== 1` (0 or >1). Optionally add a note that visible main headings are div with role="heading" and that the single H1 is in the layout block.

- **Summary text:** In the SSR section, state explicitly: “SSR verdict is based on **literal HTML only** (no JS). RSC payload is not used for pass/fail.” Once dual-pass is in place, add: “RAW pass: N/M pages have ≥1 H1 and ≥30 words in initial HTML.”

---

## 5. Testing and validation plan (runnable locally)

| # | Page type | URL (example) | Command | What to inspect | Expected RAW vs RENDERED |
|---|-----------|----------------|---------|------------------|---------------------------|
| 1 | SSR-native (layout block only) | `/about` | `curl -s http://localhost:3000/about \| grep -o '<h1[^>]*>.*</h1>'` then run crawler with `--strict-ssr` | One literal `<h1>` in response; crawl summary: `ssrContentMissing: false`, `rawH1Count: 1`, `rawWordCount` ≥ 30 | RAW and RENDERED both show 1 H1; RAW word count in 50–150 range (block only). |
| 2 | SSRBodyBlock-dependent | `/` or `/book` | Same curl; open `summary-*.md` | Summary shows no `ssr_content_missing` for that URL; RAW has 1 H1 and enough words | Same as (1). |
| 3 | Client-heavy | `/book` (Mindbody widget) | Crawl; check JSON for that URL | `renderedWordCount` >> `rawWordCount`; still no `ssr_content_missing` because block supplies H1 + words | RAW: ~1 H1, ~80–100 words. RENDERED: 1 H1, hundreds of words. |
| 4 | Article route | `/insights/<slug>` (e.g. first article) | Curl and grep for `<h1>`; crawl | Literal `<h1>` = article title; paragraph from abstract. Crawl: no SSR fail | RAW: 1 H1, 30+ words. RENDERED: 1 H1, full article word count. |
| 5 | Intentional failure | Temporarily comment out `<SSRBodyBlock />` in layout, run crawl | Crawl with strict SSR | All pages (or all that rely on block) show `ssr_content_missing`; RAW has 0 H1 and low word count | RAW: 0 H1, &lt;30 words. RENDERED: still 1 H1 (from ServerSideSEO in stream? or 0 if that’s also removed). Fails. |

**Commands to run (after `pnpm dev`):**

```bash
# 1–4: Normal crawl (strict when implemented)
cd tools/seo-crawl && node crawl.mjs --baseUrl http://localhost:3000 --maxPages 5

# 5: After commenting out SSRBodyBlock
# Same command; then inspect output/summary-*.md for ssr_content_missing count.
```

**Inspect:** `output/summary-<timestamp>.md` (Totals, Top issues, SSR check section) and `output/crawl-<timestamp>.json` (per-URL `ssrContentMissing`, `ssrH1Count`, `ssrWordCount`; later `rawH1Count`, `rawWordCount`).

---

## 6. Documentation updates required

| Doc | Update |
|-----|--------|
| **Predeploy SEO checklist** (`docs/predeploy/seo-predeploy-checklist.md`) | (1) In “Run SEO crawler,” require strict SSR (e.g. `--strict-ssr` when implemented) for release passes. (2) In “Headings & content semantics,” state that the single H1 is in the layout SSR block and visible titles use `role="heading" aria-level={1}`; link to heading policy. (3) Add “SSR injection” row: confirm no changes to SSRBodyBlock or SEO_CONTENT without SEO/review; document that canonical_off_origin on localhost is expected. |
| **SEO audit decision guide** (`docs/predeploy/seo-audit-decision-guide.md`) | Add short section: when to use local crawler vs Lighthouse vs Screaming Frog; state that the local crawler’s SSR check is **literal HTML only** (strict) and that RSC heuristics are not used for pass/fail. |
| **New: Heading policy** (e.g. `docs/seo/HEADING_POLICY.md` or section in existing SEO doc) | One H1 per page from layout block; visible hero/title = div with role="heading" aria-level={1}; no visible h1 except documented opt-outs; new pages must not add a second H1. |
| **Crawler README** (`tools/seo-crawl/README.md`) | Describe dual-pass (RAW vs RENDERED); define `--strict-ssr`; document that RAW is authoritative for SSR and that RSC is not used for blocking. |
| **Release template** (`docs/predeploy/release-template.md`) | In SEO section, add: “Crawl run with strict SSR; 0 ssr_content_missing. Any multiple_h1 or missing_h1 resolved or documented.” |

---

## 7. Merge recommendation

**Verdict: Approve with required changes (blocking).** Merge is contingent on strict SSR correctness being enforced at the crawler level and verified locally.

**Justification:** The architecture (layout-injected literal HTML + single H1 + visible headings as ARIA headings) is sound and low-risk for cloaking **if** governed. The main gaps are: (1) crawler uses RSC heuristics for the very thing we want to guarantee (literal SSR), which can hide regressions; (2) no explicit RAW vs RENDERED reporting; (3) middleware may be setting the wrong header type for the server (response vs request); (4) heading and SSR-injection rules are not yet documented.

**Required changes before merge:**

1. **Crawler: dual-pass and strict SSR**
   - Implement RAW pass (fetch + parse with **no** RSC regex). Store `rawH1Count`, `rawWordCount`.
   - Define `ssrContentMissing` from RAW only: `(rendered has content) && (rawH1Count < 1 || rawWordCount < MIN_SSR_WORDS)`.
   - Add `--strict-ssr` (or make it the default) so RSC parsing is never used for the SSR verdict. Optionally keep RSC as a separate, non-blocking “RSC fallback used” flag for reporting.
   - Expose RAW vs RENDERED in JSON, CSV, and summary (e.g. “RAW: N/M pages have ≥1 H1 and ≥30 words”).

2. **Middleware: ensure server receives pathname**
   - Verify whether `headers().get('x-pathname')` in SSRBodyBlock actually receives the value set in middleware. If not, switch to setting a **request** header in middleware (e.g. `NextResponse.next({ request: { headers: new Headers(request.headers) } })` and append `x-pathname` to that). Add a minimal sanity check (e.g. log or test that home has non-null pathname in SSRBodyBlock).

3. **Documentation**
   - Add heading policy (one H1 from layout; visible = div with role="heading" aria-level={1}; no second H1).
   - Update predeploy checklist: strict SSR crawl required; SSR block and heading policy referenced.
   - Update crawler README: dual-pass, strict SSR, RAW authoritative.

4. **Fix or document `multiple_h1` on contact**
   - Resolve the single remaining `multiple_h1` (contact) so that RENDERED `h1Count` is 1 (e.g. ensure no duplicate H1 from streamed content or other component), or add an explicit exception in the checklist with a link to a ticket.

**Follow-ups allowed post-merge:**

- SSRBodyBlock governance tests (e.g. escaped output, single h1/p, size limit).
- Optional “injected vs native” SSR labeling in crawl report.
- Consider visible intro paragraph on key pages to reduce reliance on long sr-only paragraph (optional; not blocking).

---

*End of review.*
