# Component patterns — reference only (do not copy into template)

**Purpose:** Preserve behavioral and UX intent for Phase 2 implementation using the template’s primitives.

## Layout shell

- **Root:** Global Header + `<main>` with fixed `paddingTop: 100px` + Footer (`src/app/layout.tsx`).
- **Pattern:** Sticky/fixed header height must match main offset in template.

## Header (`src/components/Header`)

- Scroll direction visibility (hide down, show up after ~100px).
- “Scrolled” visual state after ~50px.
- Desktop: horizontal nav + “Get in Touch” CTA.
- Solutions: hover dropdown (desktop), tap expand (mobile ≤1024px).
- Click-outside closes dropdown; mobile menu locks body scroll.

## Hero (`src/components/Hero`)

- Full-viewport section with background image (Next/Image fill), overlay, optional CTA row, scroll-to-`#main-content` control.
- Parallax-related scroll state exists in component (evaluate for template motion policy).

## Footer (`src/components/Footer`)

- Appears after scroll threshold (300px) with visibility class — **content** staged separately; behavior may differ in template.
- Four-column link grid + copyright + credits + scroll-to-top (desktop) + CSS wave divider.

## Client detail composition (`ClientPageContent.tsx`)

- Section refs map to **pseudo-paths** (`/clients/slug/features`) for nav keys — **not** real routes; in-template implementation can use IDs or hash routes instead.
- **ClientNav:** button-based smooth scroll between Overview → Features → Value → Media.

## Selling points (`SellingPoints`)

- Accordion/expand per card; title click may open external `link`.
- Specs: external URL opens new tab; non-URL logs “PDF modal not implemented” — **rebuild** with template modal or file viewer.

## Media

- **MediaLinks:** simple grid of labeled external links.
- **MediaGallery:** placeholder rendering — **do not port**; use **`Gallery.tsx`** logic as reference (image lightbox, video, Sketchfab iframe) when implementing in template.

## Modal (`src/components/Modal`)

- Portal-based, focus/escape/overlay — reusable **pattern** reference if template lacks equivalent.

## Styling approach in source

- CSS Modules + BEM-like class names; design tokens as CSS variables in layout + globals.
- **Phase 2:** express tokens in template’s system rather than copying `.module.css` wholesale.

## Legacy archive

- `components-migration/` contains Vite-era duplicates (Sketchfab, PdfModal, contexts, hooks). Use only for **missing assets** or historical behavior, not as integration source.
