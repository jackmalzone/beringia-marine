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

### Company contact (from the brochures — schema only renders website + email)

- **Website:** https://www.independentrobotics.com  ·  **IMPAC:** https://www.independentrobotics.com/impac
- **Email:** info@independentrobotics.com  *(set on the doc → renders an "Email" button)*
- **Phones:** +1 514-546-0752 (Montreal / CA) · +1 650-899-0752 (US)
- **Address:** 4200 Boul. Saint-Laurent, Suite 1105, Montréal, Québec, Canada, H2W 2R2
- **Tagline:** "Proudly made in Canada · Fièrement Canadien"

The Partner `mediaLinks` field has no phone/address inputs, so those live here as reference.

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

## Where the brochure content lives on the page

The product copy from these brochures is already authored into the **Core Technology** cards
(each card expands to reveal its detail bullets):

- **IMPAC** — no-code definition + "mission impact" value prop in the card description; the six
  core capabilities (Generation, Execution, Awareness, Scale, Integrate, Deploy), the four
  "Built for" use cases, the NATO C2 note, and the drone example as expand bullets. The card
  title deep-links to `independentrobotics.com/impac`.
- **Insight Engine** — "Unlock actionable intelligence…" tagline; the seven key features, the
  three modules (Summarization & Compression / Detection & Anomalies / Robot State & Location),
  output formats, the **NATO DIANA Tech Competition Winner** marker, and the FGVC accuracy
  metrics as expand bullets.
- **Aqua2** — intelligent-autonomy summary + key features (available for purchase now).
- **AQ3-LH (Loggerhead)** — datasheet pitch + key features, applications, and the **full
  technical spec block** (dimensions, depth, weight, compute, battery, speed, endurance,
  camera, interfaces, modular payloads, optional equipment) as `Spec —` expand bullets.
  Available 2026.

**To add a "Specs" / "Manual" / "Evaluation" button to a card:** upload the relevant brochure
PDF in Studio, then paste its asset URL into that selling point's **Documentation → Specs /
Manual / Evaluation** field. (Left blank for now since the PDFs are not yet uploaded — the spec
data itself is already on the AQ3-LH card as bullets.)

### Note on schema vs. presentation

The brochure detail is rendered through the existing `sellingPoint.features[]` accordion (the
card's expandable bullet list) rather than a bespoke spec-table / capability-grid. A
first-class spec-table or capabilities sub-grid would require additive schema fields **plus**
new render markup in `SellingPointsSection.tsx`; it was deliberately deferred so all the
content ships and renders today. Revisit if a richer spec presentation is wanted.
