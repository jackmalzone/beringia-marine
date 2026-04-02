# Release checklist — copy into PR or release ticket

**Release / PR:** _[e.g. v1.2.0 – Services refresh]_  
**Date:** _[date]_

---

## Audit level

- [ ] **Fast Pass** (~10 min) — crawl + summary + metadata spot check
- [ ] **Standard Pass** (~30–45 min) — full crawl, metadata, OG/Twitter, headings, images, internal links
- [ ] **Release Pass** (~60–90 min) — Standard + Lighthouse, a11y, structured data, sitemap/robots, analytics

---

## Pre-deploy SEO

- [ ] SEO crawler run: `cd tools/seo-crawl && npm run crawl`
- [ ] Summary reviewed: `tools/seo-crawl/output/summary-<timestamp>.md`
- [ ] No release-blocking issues (or exceptions documented below)
- [ ] Checklist used: [docs/predeploy/seo-predeploy-checklist.md](seo-predeploy-checklist.md)

**Crawl summary link:**  
_[Paste path or attach: `output/summary-YYYY-MM-DDTHH-MM-SS.md`]_

**Crawl JSON (optional):**  
_[Paste path: `output/crawl-YYYY-MM-DDTHH-MM-SS.json`]_

---

## Performance budget (Release Pass: mandatory)

- [ ] Performance budget check: `pnpm run check:perf:prod`
- [ ] Summary reviewed: `tools/performance-budget/output/performance-summary-<timestamp>.md`
- [ ] No red violations, or waiver with rationale below (see [performance-budget-guide.md](performance-budget-guide.md))

**Budget summary link:**  
_[Paste path: `tools/performance-budget/output/performance-summary-<timestamp>.md` — e.g. `performance-summary-2026-02-10T00-31-20.md` for a Green run.]_

**Waivers (if any):**  
| Metric | Budget | Actual | Rationale |
|--------|--------|--------|------------|
| | | | |

---

## Optional: Full Lighthouse

- [ ] Lighthouse Performance (Desktop + Mobile) run on `/`, `/services`, one article
- [ ] Lighthouse Accessibility run on same pages

**Lighthouse reports:**  
_[Link or attach screenshots]_

---

## Known exceptions & rationale

| Exception | Rationale |
|-----------|-----------|
| _e.g. canonical_off_origin on localhost only_ | _Expected when crawling localhost; production canonicals correct._ |
| | |

---

## Sign-off

- [ ] Ready to merge / deploy from SEO perspective
