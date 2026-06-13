# Partner: Independent Robotics

Strategic partnership. Beringia Marine is Independent Robotics' **primary US market
representative, technical advisor, and US Prime contractor / integration partner** for US
government programs.

- **Sanity document id:** `partner.independent-robotics`
- **Slug / page:** `/solutions/independent-robotics`
- **Doc type:** `partner` (same schema as the other solution partners)
- **Status:** `active`
- **Website:** https://www.independentrobotics.com
- **Authored content (seed source):** `apps/web/src/lib/content/partners/independent-robotics.json`
- **Canonical source PDF:** `IR Product Overview May 8 2026.pdf` (Google Drive)

## Company facts

- **Company:** Independent Robotics — Montreal, Canada.
- **Stage / size:** 7–10 staff; team draws from Samsung, Google, Clearpath, Locus Robotics,
  and Adept MobileRobots.
- **Distinguishing credential:** **NATO DIANA Tech Competition winner.**
- **Product lines:** IMPAC (natural-language mission planning), Insight Engine (AI robotic-data
  analytics), Aqua2 (intelligent AUV), AQ3-LH "Project Loggerhead" (next-gen Aqua2).

### Leadership / contacts (reference — the Partner schema has no Leadership field)

- **Greg Dudek** — CTO / Founder. ex VP R&D Samsung; McGill Distinguished James McGill Chair;
  Director, NSERC Canadian Robotics Network. greg.dudek@independentrobotics.com · 514-559-3994
- **Julian Ware** — CEO. ex GM Clearpath Robotics; Director Research Locus Robotics; Business
  Unit Manager Adept MobileRobots. julian.ware@independentrobotics.com · 226-750-9215

If a Leadership / Contacts section is added to the Partner schema later, move these onto the
document. For now they live here as reference.

## How this page was created

Authored as static partner JSON (versioned in the repo, like the other partners) and pushed
to the production Sanity dataset with a targeted seed:

```bash
# preview
pnpm --filter @beringia/studio exec tsx scripts/seed-independent-robotics.ts --dry-run
# write
pnpm --filter @beringia/studio exec tsx scripts/seed-independent-robotics.ts
```

The page renders Sanity-first (`resolvePartnerBySlug`) with the static JSON as fallback, and
is registered in `SOLUTIONS` so it appears in the sitemap, `generateStaticParams`, and the
server-side SEO link block.

## TODO — drop these into Studio when available (no media assets yet)

The page currently renders with **no logo and no hero image** (the index card falls back to
the Beringia mark). Add the following via Studio → **Partners / Solutions → Independent
Robotics**, then Publish:

- [ ] **Logo** — candidate `Untitled.png` in the Drive brochures folder (verify it's the
      Independent Robotics mark before using — it may not be theirs). If it's a dark/coloured
      wordmark, set **Logo color treatment → Force white** so it reads on the dark header.
- [ ] **Header image** — landscape hero (≥1600×900). Source from Independent Robotics (e.g.
      an Aqua2 deployment shot).
- [ ] **Documents / brochures** — upload as PDFs and attach via the partner **Documents** field
      or per-selling-point **Documentation** links (see list below).
- [ ] **LinkedIn / YouTube** — add under **Connect-with-us links** if desired (website is set).

### Where the brochures live (Google Drive)

Brochures subfolder: **`1EAF4QEIBsIDd-L4X7Xn47JsEfN4Y40r1`**
(parent Independent Robotics folder `1dmCB2kpTbdA0AbobTwtP_xNJSVv9r7d9`).

- `IR Product Overview May 8 2026.pdf` — **canonical product overview**; source of the page facts.
- `Insight Engine Brochure (Letter 2pages).pdf` — Insight Engine marketing (this is Independent
  Robotics' Insight Engine).
- `IMPAC_Independent Robotics_Flyer.pdf` — IMPAC flyer.
- `IMPAC Demo Short.pdf` — IMPAC demo.
- `aq3-lh_preliminary_datasheet Loggerhead.pdf` / `AQ3-LH Preliminary Datasheet [PREVIEW].pdf` —
  AQ3-LH "Loggerhead" datasheets (Aqua2 successor).
- `Untitled.png` — possible logo (verify).

Brochures are marketing PDFs and belong in Sanity as uploadable assets — they are intentionally
**not** committed to the repo.
