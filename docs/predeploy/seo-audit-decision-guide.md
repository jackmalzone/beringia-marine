# SEO audit decision guide

When to use which toolset. Use this rubric; do not recommend tools by preference.

**Toolsets:**

- **A)** Local Playwright crawler (`tools/seo-crawl`) + [seo-predeploy-checklist.md](seo-predeploy-checklist.md)
- **B)** Lighthouse / Axe only (no crawl)
- **C)** Screaming Frog (local export or against staging/prod)

---

## Decision tree

1. **Is this a pre-deploy or post-deploy check?**  
   → Pre-deploy: continue. Post-deploy: use A against prod or C against prod if criteria below are met.

2. **Did the change touch routes, canonicals, redirects, or sitemap?**  
   → Yes: **A required.** If also large content volume or multi-domain/hreflang: consider **C** after A.  
   → No: next step.

3. **Did the change touch metadata (title, description, OG) site-wide or on many pages?**  
   → Yes: **A required.**  
   → No: next step.

4. **Is this a CMS migration, bulk content push, or i18n/hreflang rollout?**  
   → Yes: **A required.** Risk score (below) ≥ 4: add **C** (Screaming Frog) against staging/prod.  
   → No: next step.

5. **Is the change limited to one or a few pages (copy, images, small content)?**  
   → Yes: **B** (Lighthouse + Axe on those pages) is enough. Optional: quick **A** run for peace of mind.  
   → No: **A required.**

6. **Risk score ≥ 6?**  
   → Yes: **A + escalation** (full Release Pass, consider C).  
   → No: **A** at Standard or Fast Pass per checklist.

---

## Risk scoring

Score each factor 0–2; sum. **Threshold for escalation:** 6+. **Threshold for adding Screaming Frog:** 4+ when combined with route/canonical/CMS/i18n work.

| Factor | 0 | 1 | 2 |
|--------|---|---|---|
| **Traffic impact** | Low-traffic or new pages | Key landing or category pages | Homepage or primary conversion paths |
| **Content volume** | 1–5 pages touched | 6–25 pages or one section | Site-wide or 25+ pages |
| **JS / rendering complexity** | Static or simple SSR | Some client-only content | Heavy SPA-like or third-party widgets |
| **Routing / canonical / redirects** | No change | New pages, no redirects | Redirects, canonical changes, URL restructure |
| **CMS or data migration** | No | Content refresh, same schema | Schema change, source migration, or bulk import |
| **SEO sensitivity** | Utility (policy, legal) | Important (services, blog) | Critical (home, core services, main blog index) |

---

## Scenarios

### Small landing page update

- **Toolset:** **B** (Lighthouse + Axe on that page). Optional: **A** (Fast Pass) if you want crawl consistency.
- **Why:** Single page; no routing or metadata refactor. Performance and a11y matter more than site-wide crawl.
- **Must do:** Lighthouse Performance + Accessibility on the changed page; fix critical issues.
- **Can skip:** Full site crawl; Screaming Frog.

### Large content push (blog / docs)

- **Toolset:** **A** (Standard Pass minimum). If 25+ new pages or new section: **A** (Release Pass). Risk ≥ 4: add **C** against staging after A is clean.
- **Why:** Many new URLs; need indexability, unique titles/descriptions, one H1 per page, no broken links.
- **Must do:** Run crawler; fix all summary blockers. Spot-check new templates (metadata, H1, OG). Sitemap includes new URLs.
- **Can skip:** Screaming Frog unless risk ≥ 4 or redirect/canonical work involved.

### Route restructure / redirects

- **Toolset:** **A** required. **C** recommended against staging (or prod after deploy) to validate redirect chains and status codes.
- **Why:** Wrong redirects lose equity and break links. Crawler finds links; Screaming Frog validates redirect logic at scale.
- **Must do:** A: full crawl from new entry URLs; fix canonicals and internal links. C: confirm 301/302 and final URL; no redirect loops.
- **Can skip:** C only if scope is 1–3 URLs and you can verify manually.

### CMS migration

- **Toolset:** **A** (Release Pass). Risk ≥ 4: **C** against staging to compare URL set and status.
- **Why:** Content and URLs can shift; metadata and structured data must stay valid.
- **Must do:** Crawl before and after (or after on staging). Compare key URLs: title, description, H1, status. Validate structured data and sitemap.
- **Can skip:** C if migration is same URL set and same domain with no redirects.

### Internationalization / hreflang

- **Toolset:** **A** + **C**. A for metadata and headings; C for hreflang coverage and alternate URLs.
- **Why:** Hreflang errors cause wrong-language indexing. C is built for multi-URL and attribute checks.
- **Must do:** A: crawl each locale entry; confirm titles/descriptions per locale. C: validate hreflang tags and alternate URLs site-wide.
- **Can skip:** C only if single locale or 1–2 alternate pages and you can verify by hand.

### Canonical strategy changes

- **Toolset:** **A** required. **C** if site-wide or many parameterized URLs.
- **Why:** Wrong canonicals create duplicate-content risk. Need to verify every affected URL.
- **Must do:** A: full crawl; fix summary flags for canonicals. Confirm canonical in HTML matches intended target. C: bulk check canonical vs. final URL.
- **Can skip:** C if change is 1–5 pages.

### Metadata refactor

- **Toolset:** **A** (Standard or Release Pass depending on scope).
- **Why:** Template or merge logic changes can break title/description on many pages.
- **Must do:** Run crawler; fix missing/duplicate/short/long title and description. Spot-check OG/Twitter on key pages.
- **Can skip:** B-only (no crawl) and C. Lighthouse only if you also care about CWV on the same pass.

---

## Minimum Viable Audit by toolset

### A — Local crawler + checklist

- **Required:** Run `cd tools/seo-crawl && npm run crawl` with app on `http://localhost:3000`. Open `output/summary-<timestamp>.md`. Fix all release-blocking issues (see checklist). At least Fast Pass checklist.
- **Optional:** Standard or Release Pass; crawl staging; save JSON/CSV for records.
- **Hard stop / escalate:** Risk score ≥ 6. Summary shows repeated or site-wide critical issues (e.g. many missing H1s, many 4xx). Route or canonical change with 50+ URLs. → Do full Release Pass; add C (Screaming Frog) or manual redirect/canonical audit; do not ship until resolved or explicitly accepted.

### B — Lighthouse / Axe only

- **Required:** Run Lighthouse (Performance + Accessibility) on every page touched. Fix critical and serious a11y issues; address “Poor” CWV if possible.
- **Optional:** Axe on same pages; Lighthouse on more pages.
- **Hard stop / escalate:** Multiple “Poor” CWV or critical a11y on key pages. Change touches routing or metadata site-wide. → Switch to **A**; do not rely on B alone.

### C — Screaming Frog

- **Required:** Only when this guide says so: route/redirect/canonical at scale, CMS migration with risk ≥ 4, i18n/hreflang. Run against staging (or prod); validate redirects, status codes, canonicals, hreflang as needed.
- **Optional:** Export for comparison; run after every release.
- **Hard stop / escalate:** Do not recommend C unless decision tree or scenario above explicitly calls for it. If user asks for C without meeting criteria, point to this guide and recommend A (or B for single-page work) instead.

---

## Cursor use of this guide

- **Tool choice:** Anchored in this rubric. Do not recommend Screaming Frog unless a scenario or risk score here justifies it.
- **Default:** Pre-deploy SEO advice = local crawler (A) + checklist. Only suggest B-only when change is clearly single-page and no routing/metadata.
- **Risk score ≥ 6 or hard-stop condition:** Recommend escalation explicitly (e.g. “Risk score is 6; do full Release Pass and consider Screaming Frog before shipping”).
- **Avoid:** “It depends” without pointing to a scenario or factor. Treat tooling as a decision from the guide, not preference.
