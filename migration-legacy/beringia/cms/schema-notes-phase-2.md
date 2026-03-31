# Schema and content model — notes for the new system

**Context:** The reusable template will be source of truth later. These notes inform what to **keep**, **merge**, or **rebuild** relative to Sanity `client` and static site data.

## Keep aligned with current Sanity (if staying on Sanity)

- Single **`client`** (or renamed **case study / solution**) document with:
  - identity: name, slug, logo (+ alt, optional website on logo)
  - **seo**: title, description, ogImage → **wire to template metadata**
  - **overview**: title, description, headerImage
  - **sellingPoints**: nested points with optional documentation (specs/manual URL or file)
  - **valueProposition**: title, description, highlights[]
  - **mediaLinks**: website, youtube, linkedin, sketchfab, email
  - **gallery**: typed items (image / video / sketchfab) with options

## Consider dropping or merging (unused in current Next UI)

- **useCases** — present in schema and GROQ; not shown on site → remove or add template section
- **demo** (video) — same
- **modelId / interactiveTitle / interactiveDescription** — same; or implement 3D block in template

## Move from hardcoded TSX to schema or site settings

- Global **navigation** and **footer** link lists (solutions order, labels)
- **Home** mission, expertise, and optional “featured solutions” (or drive from CMS references)
- **Contact** block (email, phone, address) — site settings singleton
- **Legal** terms body — long text could be Portable Text or MD in CMS; currently static TSX

## Contact form

- Current app: **no API** — success is simulated. Phase 2: form action via template pattern (API route, server action, or third-party).

## Insights / blog

- No current schema in this repo for articles. Add only if product requires it.

## Type definitions

- `src/types/cms.ts/index.ts` mirrors resolved GROQ shapes — useful reference when regenerating types for the template.
