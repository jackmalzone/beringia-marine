# Partner: Leviathan Autonomy, Inc.

Strategic partnership signed 2026 (consulting agreement, Rev010). Beringia Marine is
Leviathan's **primary US market representative, technical advisor, and US Prime contractor /
integration partner** for US government programs.

- **Sanity document id:** `partner.leviathan-autonomy`
- **Slug / page:** `/solutions/leviathan-autonomy`
- **Doc type:** `partner` (same schema as the other solution partners)
- **Status:** `active`
- **Authored content (seed source):** `apps/web/src/lib/content/partners/leviathan-autonomy.json`

## Partnership facts (from the consulting agreement)

- **Company:** Leviathan Autonomy, Inc. — Delaware corporation, with operating subsidiary
  Leviathan Autonomy S.r.l. (Bergamo, Italy).
- **Stage:** Pre-seed.
- **Product:** *Insight Engine* — distributed passive acoustic monitoring (PAM) and
  sensor-fusion platform for port, harbor, and naval-base security.
- **Target market:** US Navy, US Coast Guard, port authorities, allied government programs.
- **US Prime structure:** In any US government program involving Leviathan products that
  Beringia helped develop, Beringia holds the prime contract and subcontracts Leviathan for
  the technology — facilitates ITAR-compliant US program access (ITAR/FOCI structural
  requirement).
- **Commission categories (reference, not published on the page):** PAM sensor hardware 12%,
  software platform licenses 15%, system integration 10%, training/support/maintenance 10%,
  data services 15%.

## How this page was created

Authored as static partner JSON (versioned in the repo, like the other partners) and pushed
to the production Sanity dataset with a targeted seed:

```bash
# preview
pnpm --filter @beringia/studio exec tsx scripts/seed-leviathan.ts --dry-run
# write
pnpm --filter @beringia/studio exec tsx scripts/seed-leviathan.ts
```

The page renders Sanity-first (`resolvePartnerBySlug`) with the static JSON as fallback, and
is registered in `SOLUTIONS` so it appears in the sitemap, `generateStaticParams`, and the
server-side SEO link block.

## TODO — drop these into Studio when available (no assets created yet)

The page currently renders with **no logo and no hero image** (the index card falls back to
the Beringia mark). Add the following via Studio → **Partners / Solutions → Leviathan
Autonomy**, then Publish:

- [ ] **Logo** — likely `Untitled.png` in the Drive folder (verify it's the Leviathan mark).
      If it's a dark/coloured wordmark, set **Logo color treatment → Force white** so it reads
      on the dark header.
- [ ] **Header image** — landscape hero (≥1600×900). None supplied yet; source from Leviathan.
- [ ] **Documents / brochures** — upload as PDFs and attach via the partner **Documents** field
      or per-selling-point **Documentation** links.
- [ ] **Website / LinkedIn** — add under **Connect-with-us links** (not supplied in the agreement).

### Where the brochures live (Google Drive)

Brochures subfolder: **`1EAF4QEIBsIDd-L4X7Xn47JsEfN4Y40r1`**
(parent folder `1dmCB2kpTbdA0AbobTwtP_xNJSVv9r7d9`).

- `Insight Engine Brochure (Letter 2pages).pdf` — Leviathan's product marketing (most relevant).
- `IMPAC_Independent Robotics_Flyer.pdf`, `IMPAC Demo Short.pdf`, `IR Product Overview May 8 2026.pdf`.
- `Untitled.png` — possibly the logo.
- `aq3-lh_preliminary_datasheet Loggerhead.pdf` / `AQ3-LH ... [PREVIEW].pdf` /
  `Loggerhead - Market Research.pdf` — **a different partner (Loggerhead AQ3-LH hydrophone
  array)**, not Leviathan. Do not attach these to this page.

Brochures are marketing PDFs and belong in Sanity as uploadable assets — they are intentionally
**not** committed to the repo.
