# Beringia → template migration (Phase 1 staging)

This folder **only** holds extracted copy, normalized config, inventories, and notes. **No template integration** and **no app rebuild** has been performed.

## What was found

- **Marketing site** with Home, About, Contact, Terms, global Header/Footer, and Hero.
- **Client (“solution”) area:** `/clients` listing and `/clients/[slug]` detail driven by **Sanity** (`client` document type).
- **No** blog, insights, or white-paper routes in `src/app/`.
- **Parallel legacy tree:** `components-migration/` (pre–Next.js) — not staged as integration sources; see `components/component-patterns-reference.md`.

## What is static

- Home body copy (mission, solutions blurbs, expertise).
- About full narrative + leadership + About-page social links.
- Contact page copy, validation strings, and simulated form messages.
- Full Terms & Conditions text + version/date footer.
- Header/footer labels and hardcoded solution links (three slugs).
- Root `metadata` title and description in `layout.tsx`.

## What is dynamic (CMS)

- All **client listing** and **client detail** content fetched via GROQ (`src/lib/sanity.ts`): names, logos, overview, selling points, value proposition, media links, gallery payload, etc.
- **Images and files** for clients: served from **Sanity CDN** (`cdn.sanity.io`).

## What is missing locally

- **`public/assets/beringia/*`** (logo PNG, wallpaper, penguin photo) — referenced by code but absent in workspace.
- **`public/vendor/fonts/Domitian-*.otf`** — referenced by `globals.css` but absent.
- **Favicon / app icon** — no `icon.*` found under `src/app`.
- **Sitemap, robots, per-page SEO** — not implemented; Sanity `seo` fields are unused by Next metadata.

## Data quality flags (fix in Phase 2)

- Contact page: **`tel:` href** (`+18057040462`) **≠** visible phone (`+1 805 316 1417`).
- Terms §3: probable typo **“sall”** → **“shall”** (legal review).
- Footer **“Anchorbot Marine”** vs nav **“Anchor Bot”**.

## What should be migrated later (content / config)

- Normalized **`config/*.json`** in this folder → template site settings.
- **`copy/pages/*`** → template content layer (MDX, CMS, or i18n files).
- **Sanity** project/dataset or an **export** of `client` documents if the template keeps headless CMS.
- **Binary assets** once recovered → template `public` or CDN.

## What should probably be rebuilt (not copied)

- **React components** — reimplement using template layout primitives; use `components/component-patterns-reference.md` for behavior parity.
- **CSS Modules** — re-express tokens via the template design system (`layout.tsx` / `globals.css` variables as reference only).
- **Contact form** — replace simulation with a real submission path.
- **`MediaGallery`** stub — implement gallery using **`Gallery.tsx`** behaviors as reference.
- **Client metadata** — add `generateMetadata` using Sanity `seo` (or template equivalent).

## Folder map

| Path | Contents |
|------|----------|
| `copy/pages/` | Home (JSON), About, Contact, Terms (MD), clients summary, insights placeholder |
| `copy/chrome/` | Header/nav, footer, hero defaults |
| `config/` | Site identity, contact, navigation, footer, legal, social/credits |
| `metadata/` | Asset inventory (present/missing) |
| `assets/*/` | README placeholders only — no binaries copied |
| `cms/` | Sanity deps, static vs dynamic, Phase 2 schema notes |
| `components/` | UX/component pattern reference (not source code) |
| `inventory/` | Full migration inventory checklist |

## Next phase (high level)

1. Recover **missing static assets** and fonts.
2. Resolve **phone** and **naming** inconsistencies in staged config.
3. Map `config/*.json` and `copy/*` into the **template’s** content/settings model.
4. Decide **Sanity vs static** for client pages; wire **SEO** and **real contact** handling.
5. Implement client sections in template; **merge or drop** unused schema fields (`useCases`, `demo`, interactive).

---

**Generated:** Phase 1 audit and staging pass. Template repository unchanged by this work.
