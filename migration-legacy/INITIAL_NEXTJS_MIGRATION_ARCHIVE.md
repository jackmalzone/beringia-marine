# Initial Vite → Next.js migration — archive

This document captures the **implemented Next.js 15 app** (pre-template-rewrite), **improvements**, **known gaps**, **component layout**, **styles**, and **Sanity integration** so a fresh repository can reproduce behavior without spelunking git history.

**Companion material in this folder**

- `ENV_TEMPLATE.md` — Sanity-related env vars (placeholders; use with `.env.local` in the new app).
- `beringia/README.md` — Phase 1 content audit (static vs CMS, what was missing).
- `beringia/inventory/migration-inventory.md` — Checklist and traceability to `src/` paths.
- `beringia/components/component-patterns-reference.md` — UX/behavior reference (not copy-paste source).
- `beringia/config/`, `beringia/copy/`, `beringia/cms/` — Normalized copy and CMS notes.
- `sanity-studio-snapshot/` (after archive step) — Sanity Studio source tree without `node_modules`.

---

## Stack and versions (at archive time)

| Layer | Choice |
|-------|--------|
| Framework | Next.js **15.3.4** (App Router) |
| UI | React **19** |
| Language | TypeScript **5** |
| CMS client | `next-sanity` **^9.12**, `@sanity/client`, `@sanity/image-url` |
| Styling | **CSS Modules** next to components/pages; BEM-like class names (`block__element--modifier`) |
| Content | **Sanity** — `client` documents; GROQ in `src/lib/sanity.ts` |

---

## Architecture decisions

### Data fetching

- **Server:** `createClient` from `next-sanity` in `src/lib/sanity.ts` with `useCdn: false` for server fetches (fresher data for SSG/ISR).
- **Helpers:** `fetchClients()`, `fetchClientBySlug(slug)`, `getAllClientSlugs()`.
- **Client bundle:** Exported `sanityClientConfig` for potential client-side use (CDN).
- **Patterns:** Listing and detail pages were async Server Components calling the helpers directly.

### Dynamic routes (`/clients/[slug]`)

- **`generateStaticParams`:** Built from `getAllClientSlugs()` so all known clients were pre-rendered.
- **ISR:** `export const revalidate = 3600` (1 hour) so new/updated Sanity content could appear without a full redeploy.
- **404:** `notFound()` when slug missing or fetch throws.

### Environment variables

- **Public:** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (default `production` in code).
- **`next.config.ts`:** `images.domains` / `remotePatterns` for `cdn.sanity.io`; `env` block repeating Sanity vars for build visibility.
- **Optional:** `SANITY_API_TOKEN` stubbed for future write operations (not required for read-only).

Recommended for any replacement app: `.env.example` listing the above; real secrets only in `.env.local`.

### Images

- Next `Image` with Sanity CDN host allowlisted.
- `urlFor()` helper in `sanity.ts` used `@sanity/image-url` (dynamic `require` in that helper).

---

## App Router structure (`src/app/`)

| Path | Role |
|------|------|
| `layout.tsx` | Root layout: `metadata`, inline `:root` CSS variables, Google font (Inter), `Header` + `main` + `Footer` |
| `globals.css` | Global resets, `@font-face` for Domitian (paths expected under `public/`) |
| `page.tsx` | Home |
| `about/page.tsx` | About |
| `contact/page.tsx` | Contact (simulated form behavior) |
| `terms/page.tsx` | Terms |
| `clients/page.tsx` | Client grid/list from Sanity |
| `clients/[slug]/page.tsx` | Server page: static params + revalidate + `fetchClientBySlug` |
| `clients/[slug]/ClientPageContent.tsx` | **Client component** — section refs, scroll nav |
| `clients/[slug]/loading.tsx` + `loading.module.css` | Route loading UI |

---

## Component structure (`src/components/`)

### Global chrome

- **Header** — Scroll show/hide, scrolled state, desktop nav + mobile menu, solutions dropdown, body scroll lock.
- **Footer** — Deferred visibility, columns, credits, scroll-to-top.
- **Hero** — Full-viewport hero with image overlay and CTA patterns.
- **Gallery** — Lightbox-style media (reference for richer gallery behavior).
- **Modal** — Portal, focus/escape (reusable pattern).

### Client detail (`Client/`)

Co-located `*.module.css` per folder.

- **ClientNav** — Smooth scroll between sections; keys used **pseudo-paths** (`/clients/{slug}/features`, etc.) for hash-less in-page navigation.
- **Overview** — Title, description, header image, optional logo/site link.
- **SellingPoints** — Accordion cards; spec/manual links; PDF path stubbed (“modal not implemented” in reference doc).
- **ValueProposition** — Title, description, highlights.
- **UseCases** — Present in types/schema; composition varied by page.
- **MediaLinks** — External links grid (website, YouTube, LinkedIn, Sketchfab, email).
- **MediaGallery** — **Placeholder** in migrated app; `Gallery.tsx` was the behavioral reference for images/video/Sketchfab.

---

## Styling system

- **Tokens:** CSS variables defined in `layout.tsx` (`:root`) — palette, spacing, radius, shadows, transitions; `--font-domitian` + Inter.
- **Modules:** One module per component or page; BEM-style classes (e.g. `.client__section`).
- **Globals:** Typography and base rules in `globals.css`.

**Phase-2 note:** Prefer mapping tokens to the new template’s design system rather than copying every module verbatim.

---

## TypeScript (`src/types/`)

- **`cms.ts/index.ts`** — Sanity-aligned shapes for `Client`, nested overview, selling points, gallery discriminated by `type`, etc.
- **`index.ts`** — Re-exports.
- **`sketchfab.d.ts`** — Ambient typings for Sketchfab embed where used.

**`tsconfig`:** Standard Next “strict” app config with `@/*` paths (as generated by `create-next-app`).

---

## Improvements delivered in this migration (vs Vite)

- App Router file-based routing replacing React Router.
- **Sanity via `next-sanity`** and server-side GROQ fetch patterns.
- **ISR + `generateStaticParams`** for client detail scalability.
- **CSS Modules** colocated with components for scoped styles.
- Split **Server page** vs **Client** islands (`ClientPageContent`, `Header` scroll behavior, etc.).
- **Next/Image** integration with Sanity CDN configuration.

---

## Known gaps, bugs, and content flags (carry forward)

Documented in `beringia/README.md` and inventory:

- **Assets missing locally:** e.g. `public/assets/beringia/*`, Domitian fonts under `public/vendor/fonts/`.
- **SEO:** Root `metadata` only; Sanity `seo` fields fetched but not wired to `generateMetadata` on client pages.
- **Contact:** `tel:` vs visible phone mismatch in staged config; form was simulated.
- **Copy/legal:** Terms typo (“sall” → “shall”); footer vs nav naming (“Anchorbot” vs “Anchor Bot”).
- **MediaGallery:** Not feature-complete vs legacy `Gallery`.
- **No** sitemap/robots in this iteration.

---

## Scripts (`package.json`)

- `dev` / `build` / `start` / `lint` — standard Next.
- `studio` / `studio:install` — run Sanity Studio from `cms/studio-beringia-marine`.

---

## Sanity Studio

**Previously at:** `cms/studio-beringia-marine/` (schemas, `sanity.config.ts`, `deskStructure.ts`, constants).

A **snapshot** of that folder (excluding `node_modules`) should live beside this file as `sanity-studio-snapshot/` after the archive migration step.

---

## What not to blindly port

- Entire `components-migration/` tree (Vite era) — use only for behavior parity and missing assets.
- Placeholder **MediaGallery** implementation — rebuild using **Gallery** patterns.
- Inline token dump in `layout.tsx` — consolidate into the new template’s token file/CSS.

---

## Suggested re-entry checklist for the new template

1. Restore env vars (`.env.local` + `.env.example`).
2. Restore Sanity project/dataset and wire `next-sanity` + image domains.
3. Map `beringia/config` and `beringia/copy` into the template’s content model.
4. Reimplement layout chrome (Header/Footer/Hero) per `component-patterns-reference.md`.
5. Client pages: Server fetch + optional `generateStaticParams` + `revalidate`; client subnav + sections as needed.
6. Recover binaries (logos, fonts, hero imagery) per `metadata/asset-inventory.md`.
7. Add `generateMetadata`, sitemap, and real contact handling when ready.

---

*Generated as part of repository reset: prior app sources removed; this folder retains knowledge and extracts.*
