# Static vs CMS-driven content

## Fully static (in repo source)

| Surface | Source files |
|---------|----------------|
| Home marketing sections | `src/app/page.tsx` |
| About | `src/app/about/page.tsx` |
| Contact copy + form UI | `src/app/contact/page.tsx` |
| Terms body | `src/app/terms/page.tsx` |
| Header labels + hardcoded solution links | `src/components/Header/Header.tsx` |
| Footer columns + credits | `src/components/Footer/Footer.tsx` |
| Root default title/description | `src/app/layout.tsx` metadata |
| Design tokens (CSS variables) | `src/app/layout.tsx` inline + `src/app/globals.css` |

## CMS-driven (Sanity `client`)

| Surface | Source |
|---------|--------|
| Client listing cards | `fetchClients` — name, slug, logo, overview.description |
| Client detail — overview block | overview title, description, headerImage, logo |
| Client detail — selling points | sellingPoints title + points (icons, features, docs) |
| Client detail — value proposition | valueProposition |
| Client detail — media links | mediaLinks |
| Client detail — gallery items | gallery[] (types: image, video, sketchfab) — **UI stub in MediaGallery** |

## Queried but not rendered in current `ClientPageContent`

- `useCases` (title, description, cases)
- `demo` (title, description, videoFile)
- `modelId`, `interactiveTitle`, `interactiveDescription` (3D / interactive section)
- `seo` object — **not** connected to Next.js `generateMetadata`

## Hybrid

- **Solutions marketing blurbs** on home are **static**; **client pages** for same slugs are **CMS** if documents exist.
- **Naming:** Footer "Anchorbot Marine" vs nav "Anchor Bot" — static strings, should be unified via config in Phase 2.
