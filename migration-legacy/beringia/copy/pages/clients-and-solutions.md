# Clients and solutions — staged summary

**Sources:** `src/app/clients/page.tsx`, `src/app/clients/[slug]/ClientPageContent.tsx`, `src/lib/sanity.ts`, `cms/studio-beringia-marine/schemas/client.ts`

## Static marketing alignment (hardcoded in app)

These three slugs appear on the home page, header Solutions menu, and footer. **Live titles/descriptions on listing and detail pages come from Sanity** when the dataset contains matching `client` documents.

| Display name (typical) | Slug / path | Home blurb (static) |
|------------------------|-------------|---------------------|
| Mission Robotics | `/clients/mission-robotics` | Advanced underwater robotics for exploration and research missions. |
| Anchor Bot | `/clients/anchor-bot` | Innovative anchoring solutions for marine applications. |
| Advanced Navigation | `/clients/advanced-navigation` | Cutting-edge navigation systems for marine vessels. |

**Footer label variance:** "Anchorbot Marine" vs header "Anchor Bot" — normalize in config Phase 2.

## Client listing page (`/clients`)

- **H1:** Our Clients
- **Content:** Per Sanity `client`: name, logo URL, overview description (from `overview.description`).

## Client detail page (`/clients/[slug]`)

**CMS-driven blocks rendered in source:**

1. **Overview** — title, description, header image, optional logo + website link (`src/components/Client/Overview`)
2. **Selling points** — section title + expandable cards with features, optional docs (`SellingPoints`)
3. **Value proposition** — title, description, highlights (`ValueProposition`)
4. **Media** — `MediaLinks` ("Connect With Us") + `MediaGallery` (currently stub UI in `MediaGallery.tsx`; full gallery logic exists separately in `Gallery.tsx` but is not wired from `ClientPageContent`)

**In-page section nav (`ClientNav`) labels:**

- Overview
- Features
- Value
- Media

**Fetched in GROQ but not rendered in `ClientPageContent`:** `useCases`, `demo`, `modelId`, `interactiveTitle`, `interactiveDescription` — reconcile in Phase 2 or drop from schema.

## SEO fields in CMS (not wired to Next metadata in source)

- `seo.title`, `seo.description`, `seo.ogImage` — available in query; **no `generateMetadata`** on client route in current app.
