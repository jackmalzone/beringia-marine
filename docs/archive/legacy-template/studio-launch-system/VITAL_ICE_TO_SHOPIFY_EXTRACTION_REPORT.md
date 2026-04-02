## Vital Ice → “Studio Launch System” (Shopify Theme) Extraction Report

Goal: extract reusable architectural, design, and implementation patterns from the Vital Ice production web app and translate them into a Shopify theme system for recovery studios (cold plunge, sauna, contrast therapy).

This report is written as a **build accelerator**: concrete patterns, section blueprints, token candidates, and a prioritized extraction list—not a file-by-file summary.

---

## STEP 1 — Repository overview (onboarding-level architecture)

### Overall architecture
- **Monorepo** (pnpm workspace) with two Next.js apps:
  - **`apps/web`**: consumer site (Next.js App Router)
  - **`apps/studio`**: Sanity Studio (Next.js wrapper) for CMS editing
- **Shared libraries**:
  - `packages/*`: shared UI/forms, Mindbody SDK, config
  - `lib/sanity/*`: canonical Sanity client + queries + schemas + types used by web
- **Core design decision**: marketing site content is split into:
  - **CMS-driven modular pages** (Sanity “content blocks” → React components)
  - **Hand-built high-conversion pages** (home, services, book) that mix data + bespoke UI patterns

### Major directories and roles
- **`apps/web/src/app/`**: route composition (App Router pages/layouts); SEO/SSR decisions live here.
- **`apps/web/src/components/`**:
  - `blocks/`: CMS content blocks (Hero, TextSection, ServiceGrid, Testimonials, Newsletter)
  - `sections/`: bespoke page sections (hero video rotator, benefits protocol panels, etc.)
  - `layout/`: header/footer/navigation
  - `shared/`: larger “templates” (service page template, Sanity-driven service template)
  - `ui/`: primitives and utilities (image wrappers, animated section helpers)
- **`apps/studio/`**:
  - `schemas/`: Studio schema sources (mirrored by `lib/sanity/schemas/*` in this repo)
  - **`proxy.ts`**: studio auth gate (session cookie) per project rule
- **`lib/sanity/`**: shared Sanity client + queries; designed as the “single source of truth” for data access.
- **`docs/`**: practical guides for SEO, performance, deployment, analytics.

### Key technologies
- **Next.js** (App Router), **React**
- **Sanity** CMS (`next-sanity`, Studio v4)
- **CSS Modules** + global CSS variables (design tokens)
- **Framer Motion** (interactions/animations) with a centralized import façade
- **Analytics/observability**: Sentry, Vercel Analytics, Meta Pixel, GTM; CSP + caching headers configured centrally
- **Mindbody** checkout widgets (embed) integrated into membership purchase flow

### Component structure pattern to extract
Vital Ice repeatedly uses a three-layer composition pattern that transfers well into Shopify theme engineering:

- **Data layer**: structured content models (Sanity docs/objects) → typed queries → simple view-models
- **Composition layer**: “templates” that enforce marketing narrative order (hero → proof → protocol → CTA → FAQ)
- **Presentation layer**: section components and primitives (cards, buttons, grid systems, motion wrappers)

In Shopify, this maps to:
- **Data**: section settings + blocks + metafields
- **Composition**: JSON templates per page type + strict ordering constraints where needed
- **Presentation**: reusable snippets + CSS components + minimal JS modules

### Styling strategy
- **Global tokens** in `apps/web/src/app/globals.css`:
  - font families, palette, spacing scale, radii, shadows
- **CSS modules** for sections/components (BEM-like naming, heavy use of gradients + glassmorphism).

Shopify translation:
- replicate tokens as **CSS variables** in `assets/theme.css`
- section styles as structured component classes (`.sls-hero`, `.sls-card`, `.sls-grid`) rather than per-file modules

### Content management approach (what to reuse conceptually)
Sanity page model is a “block array”:
- `page.content[]` where each item is a typed block (`hero`, `textSection`, `serviceGrid`, `testimonials`, `newsletter`)

```34:45:/Users/malzone/projects/vital-ice/lib/sanity/schemas/documents/page.ts
    {
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'textSection' },
        { type: 'serviceGrid' },
        { type: 'testimonials' },
        { type: 'newsletter' },
      ],
    },
```

Shopify analog:
- section list in `templates/*.json`
- section “blocks” as nested content items
- controlled set of section types; avoid unlimited free-form blocks (merchant UX + brand consistency)

---

## STEP 2 — Reusable UI components → Shopify section translation

Below are “drop-in” section patterns that directly fit recovery studio launches. Each item includes what it does, why it’s useful, Shopify mapping, and merchant settings.

### 2.1 Hero (image/video, headline, CTA) — CMS block style
- **What it does**: above-the-fold conversion unit with optional background video + overlay + primary/secondary CTA.
- **Why it’s useful**: sets positioning, captures intent quickly, drives the first click.
- **Shopify section**: `hero-media`
- **Merchant-customizable**:
  - heading, subheading
  - media type (image/video), poster, overlay opacity/color
  - primary CTA label/link, secondary CTA label/link
  - alignment (left/center/right), max-width for text
- **Extractable schema cues** from Sanity hero object:

```8:96:/Users/malzone/projects/vital-ice/lib/sanity/schemas/objects/contentBlocks/hero.ts
  fields: [
    { name: 'headline', type: 'string' },
    { name: 'subheadline', type: 'text' },
    { name: 'backgroundVideo', type: 'url' },
    { name: 'backgroundImage', type: 'image' },
    { name: 'ctaButton', type: 'ctaButton' },
    { name: 'secondaryButton', type: 'ctaButton' },
    { name: 'textAlignment', type: 'string', initialValue: 'center' },
    { name: 'overlay', type: 'object', fields: [{ name: 'opacity', type: 'number' }, { name: 'color', type: 'color' }] },
  ]
```

### 2.2 Services grid (cards with accent color, media, link)
- **What it does**: a “menu” of treatments (cold plunge, infrared sauna, etc.) as tappable cards.
- **Why it’s useful**: services are the primary navigation object for studios; cards convert better than lists.
- **Shopify section**: `services-grid`
- **Merchant-customizable**:
  - section title/subtitle
  - cards as blocks: title, subtitle, image, accent color, link (collection/page)
  - columns (desktop/mobile), hover style (lift vs glow), optional “featured” ribbon

### 2.3 “Protocol + effect” feature rows (Benefits section)
- **What it does**: turns each service into a conversion narrative:
  - metric (“40–50°F”), protocol (time/type/focus), effect summary (“vagus nerve activation”), proof language
- **Why it’s useful**: studios sell *outcomes* and *credibility*; this format does both.
- **Shopify section**: `feature-rows-protocol`
- **Merchant-customizable**:
  - blocks: title, tagline, metric label/value, protocol fields, effect fields, image, icon, accent color
  - optional “clinical proof” toggle and disclaimer block
- **Implementation pattern**: array-driven content + consistent layout (ideal for Shopify blocks).

```20:77:/Users/malzone/projects/vital-ice/apps/web/src/components/sections/Benefits/Benefits.tsx
  const benefits = [
    {
      title: 'COLD PLUNGE',
      tagline: 'Let the chill change you.',
      metricLabel: 'Temp',
      metricValue: '40–50°F',
      protocol: { temp: '40–50°F', time: '2–5 minutes', type: 'Immersion Therapy', focus: 'Resilience and recovery' },
      effect: { summary: '*Vagus nerve activation*...', clinical: 'Clinically studied...', protocolId: 'COLD-01' },
      image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      color: 'rgba(0, 183, 181, 0.8)',
    },
```

### 2.4 Testimonials (grid + slider)
- **What it does**: social proof cards; optionally slider rotation for home page.
- **Why it’s useful**: studios rely on trust; testimonials are a top conversion lever.
- **Shopify sections**:
  - `testimonials-grid`
  - `testimonials-slider` (optional “advanced”)
- **Merchant-customizable**:
  - blocks: quote, name, role, rating, photo
  - layout (grid vs slider), autoplay interval, number of columns

### 2.5 Pricing / membership tiers + “Buy” CTA
- **What it does**: tiered membership offer with “buy” path (in Vital Ice: Mindbody embed).
- **Why it’s useful**: studios convert via memberships; tier layout is critical.
- **Shopify sections**:
  - `membership-tiers` (2–3 tiers, badges, feature list)
  - `sticky-cta` or `booking-cta` (mobile-friendly persistent CTA)
- **Merchant-customizable**:
  - tier names, price, frequency, strike-through compare-at, badge (e.g. “Presale”)
  - tier feature bullets (blocks), limited-availability note
  - CTA behavior: link to product (membership), or external checkout URL, or embed
- **Important Shopify simplification**: prefer **native Shopify products** (membership “product” + selling plan if needed) over third-party modal embeds. If you must embed, use “safe zone” CSS and expect CSP limitations.

### 2.6 FAQ accordion (SEO-first)
- **What it does**: progressive disclosure (expand/collapse) while keeping content accessible/SEO-visible.
- **Why it’s useful**: reduces anxiety, handles objections without cluttering.
- **Shopify section**: `faq`
- **Merchant-customizable**:
  - blocks: question + answer rich text
  - optional JSON-LD structured data toggle

### 2.7 Newsletter / waitlist capture
- **What it does**: lead capture with simple copy + email input.
- **Why it’s useful**: launch phases need list growth; conversion often happens later.
- **Shopify section**: `newsletter-waitlist`
- **Merchant-customizable**:
  - title, body, placeholder, button label
  - integration mode: Shopify customer form vs Klaviyo embed

### 2.8 Logo marquee (partners / press)
- **What it does**: infinite scrolling logos for authority and partnerships.
- **Why it’s useful**: trust transfer; helps new studios borrow credibility.
- **Shopify section**: `logo-marquee`
- **Merchant-customizable**:
  - blocks: logo image + link
  - speed, pause-on-hover

---

## STEP 3 — Design system extraction (tokens + rules)

### Typography hierarchy
From `apps/web/src/app/globals.css`:
- **Heading font**: Bebas Neue (uppercase, wide tracking)
- **Body font**: Montserrat (light weight; premium/clean)
- **UI font**: Inter (buttons/controls)

```10:129:/Users/malzone/projects/vital-ice/apps/web/src/app/globals.css
--font-heading: 'Bebas Neue', sans-serif;
--font-body: 'Montserrat', sans-serif;
--font-ui: 'Inter', sans-serif;
h1 { font-size: clamp(2.5rem, 8vw, 4rem); }
h2 { font-size: clamp(2rem, 6vw, 3rem); }
h3 { font-size: clamp(1.5rem, 4vw, 2rem); }
```

**Shopify adaptation**:
- Use **3-font system** with theme settings:
  - display font (headings), body font, UI font
- Provide a conservative fallback pair in theme presets:
  - Display: Bebas Neue / Oswald
  - Body: Montserrat / Source Sans
  - UI: Inter / system UI

### Color palette (token candidates)
Base tokens already exist:

| Token | Value | Role in UI |
|---|---:|---|
| `--color-primary` | `#00b7b5` | brand teal, links, accents |
| `--color-background` | `#000` | primary background |
| `--color-background-dark` | `#1a1a1a` | section gradients / depth |
| `--color-surface` | `rgba(255,255,255,0.05)` | glass surfaces |
| `--color-sun-ray` | `#f56f0d` | urgency/availability highlight |
| `--color-text-secondary` | `rgba(255,255,255,0.8)` | body secondary |
| `--color-text-muted` | `rgba(255,255,255,0.6)` | captions/meta |

**Shopify adaptation**:
- Expose 6–10 brand tokens in theme settings:
  - primary, secondary, background, surface, text, muted text, alert/urgency
- Keep **service accent colors** as per-block settings (cold/heat/red light) to create a “system of treatments”.

### Spacing rhythm & section conventions
Global spacing scale exists:
`--spacing-xs/sm/md/lg/xl/2xl/3xl`

Observed conventions:
- “major section” padding often \(\sim 4–6rem\) vertical on desktop
- container max widths frequently 1200px and 1400px (good Shopify defaults)

**Recommended Shopify layout tokens**:
- `--container-lg: 1200px`
- `--container-xl: 1400px`
- `--section-py: clamp(48px, 6vw, 96px)`
- `--section-px: clamp(16px, 3vw, 32px)`

### Buttons & cards (style rules to replicate)
Vital Ice uses:
- **glass cards**: rgba surfaces + blur + border + hover glow
- **CTA buttons**: high contrast, gradient or outlined teal; strong padding and uppercase headings

Shopify theme extraction:
- define `.sls-button` with variants:
  - primary (teal solid), outline (teal border), ghost
- define `.sls-card` variants:
  - glass, elevated, gradient
- keep hover micro-interactions, but gate behind `prefers-reduced-motion`

---

## STEP 4 — Content structure patterns (conversion + UX)

### 4.1 Hero messaging structure
Pattern:
- **Headline**: outcome + identity (“Book Your Recovery Session”)
- **Subheadline**: clarifies modalities + promise
- **CTA**: single action that moves down-funnel

Shopify translation:
- enforce a “headline + supporting sentence + CTA” schema in hero sections
- constrain field lengths (prevents ugly merchant edits)

### 4.2 Service description architecture (sell outcome + credibility)
The `service` model encodes a consistent story:
- `subtitle` (one-line promise)
- `description` (context + benefits)
- `benefits[]` (scannable proof points)
- `process[]` (“Your Experience” steps)
- `cta` (final nudge)
- `contraindications[]` (safety; trust builder)

This is exactly the schema a recovery studio theme needs.

Shopify translation options:
- **Option A (theme-only)**: represent each service as a **page** with a strict section template + blocks.
- **Option B (recommended)**: represent each service as a **collection or metaobject** (if available) + metafields:
  - title/subtitle, hero media, accent color
  - benefits list, steps list, safety list

### 4.3 Presale / scarcity messaging
Vital Ice repeatedly uses:
- limited availability notes (orange highlight)
- “founding memberships are sold out but presales available” messaging
This pattern is broadly reusable as a “launch mode” preset for studios.

Shopify translation:
- Theme preset: “Launch Mode”
  - show presale badge
  - show waitlist section
  - replace “Book now” with “Join waitlist” if schedule not live

### 4.4 SEO support content embedded in the CMS
The `page.serverSideSEO` object supports:
- explicit H1/H2 lists + internal link list + descriptive paragraph

```99:150:/Users/malzone/projects/vital-ice/lib/sanity/schemas/documents/page.ts
serverSideSEO: { h1, h2[], links[{href,text}], content }
```

Shopify translation:
- for critical pages, provide a **“SEO helper” section**:
  - optional hidden-on-screen but visible-to-crawlers content (careful; Shopify + Google guidelines)
  - or simply render SEO copy in a collapsible “Learn more” content area

---

## STEP 5 — Section architecture (composition patterns → Shopify templates)

### Vital Ice pattern: “block renderer”
CMS pages are composed by mapping block `_type` → component:

```19:57:/Users/malzone/projects/vital-ice/apps/web/src/components/shared/DynamicContentRenderer/DynamicContentRenderer.tsx
switch (block._type) {
  case 'hero': return <HeroBlock ... />
  case 'textSection': ...
  case 'serviceGrid': ...
  case 'testimonials': ...
  case 'newsletter': ...
}
```

Shopify equivalent:
- **templates JSON** determine the list of sections
- each section is a controlled type with an editable schema

### Vital Ice pattern: “templates for high-conversion page types”
Example: `ServiceTemplate` enforces a narrative order:
Hero → Intro → Benefits → Callout quote → Process → CTA.

Shopify translation:
- build page templates as a **fixed section order** with optional toggles:
  - `templates/page.service.json`
  - `templates/page.pricing.json`
  - `templates/page.booking.json`

---

## STEP 6 — Interaction patterns (what to preserve vs simplify)

### Preserve (Shopify-friendly)
- **Hover lift + glow** on cards (CSS transitions)
- **FAQ accordion** with accessible toggles
- **Scroll-to-section** CTA (native `scrollIntoView`)
- **Reduced motion gating** (important for accessibility)

### Simplify (avoid heavy JS)
- Replace Framer Motion scroll-linked transforms with:
  - CSS `position: sticky` and subtle transforms
  - or small JS with `requestAnimationFrame` if absolutely needed

---

## STEP 7 — Performance strategies (transfer to Shopify)

### Relevant patterns
- **Media discipline**: only load what is visible / needed (active + next video preload)
- **Video fallback**: degrade to image on low-end devices
- **Defer non-critical scripts**: analytics after load; load only on pages that need it

### Shopify equivalents
- Use Shopify image CDN with `srcset`/`sizes` and `loading="lazy"`.
- Prefer a single hero video (or very small rotation), poster-first, `preload="metadata"`.
- Keep JS modular and lazy-loaded per section using Shopify’s `data-section-type` pattern.

---

## STEP 8 — Simplification for Shopify (what not to port)

### Too complex / not portable
- **Sanity + dynamic block rendering** (replace with theme sections + blocks)
- **Next.js headers/CSP control** (Shopify themes cannot fully control CSP/headers)
- **Mindbody modal embed** (CSP + iframe restrictions vary; prefer Shopify-native checkout)
- **Framer Motion everywhere** (replace with CSS; optional add-on “enhanced motion” bundle)

### What should become merchant-editable settings
- Hero messaging and CTA
- Service cards and protocol blocks
- Testimonials and FAQ items
- Launch mode switches (presale vs booking live)
- Brand palette + typography preset choices
- Business info (hours, address, contact, social)

### What should remain fixed structure
- Section ordering for core templates (home/service/booking/pricing)
- Layout primitives (container widths, spacing rhythm)
- Button/card system (variants, sizes)

---

## STEP 9 — Priority extraction list (what to replicate first)

### High value (build these first)
- **Hero media** (image/video + overlay + CTA)
- **Services grid** (cards + accent colors)
- **Protocol feature rows** (metrics + protocol + effect + image)
- **Membership/pricing tiers** (simple tiers + CTA; Shopify-native checkout)
- **FAQ accordion** (SEO-first)
- **Testimonials** (grid + optional slider)
- **Footer contact/hours** (studio-specific essentials)

### Medium value
- Video hero rotator (advanced preset)
- Logo marquee (partners/press)
- Smooth scroll polish

### Low value (don’t port initially)
- Sanity Studio and GROQ query layer
- complex analytics pipeline (GTM/Mixpanel/Meta Pixel)
- Next.js caching headers and SSR-only SEO hacks
- Mindbody modal checkout implementation (keep as optional integration guide)

---

## STEP 10 — Build recommendations for “Studio Launch System”

### Recommended theme section catalog (ideal MVP)
Home template:
- `hero-media`
- `trust-bar` (optional: logos/press)
- `services-grid`
- `feature-rows-protocol`
- `testimonials-grid`
- `membership-tiers` (or `pricing-highlight`)
- `faq`
- `newsletter-waitlist`
- `location-hours` (map optional)

Service page template:
- `service-hero` (media + accent)
- `service-intro` (description + image)
- `service-benefits` (bullets)
- `service-process` (steps timeline)
- `service-safety` (contraindications)
- `booking-cta`
- `faq` (service-specific)

Booking/pricing template:
- `membership-tiers`
- `what-you-get` (benefits accordion)
- `faq`
- `contact-cta` / `application-form` (Shopify form)

### Structural improvements vs Vital Ice (Shopify-first)
- Replace CMS block mapping with **theme editor schema** + strong guardrails (field length validation, limited variants).
- Treat “service accent color” as a first-class block setting to unify the treatment system across pages.
- Build a single **protocol schema** used in multiple sections (card, feature row, service page).

### Pitfalls to avoid (learned from Vital Ice)
- Don’t ship third-party checkout modals without validating **CSP + iframe + style-src** constraints (Shopify often blocks/changes this).
- Don’t over-control third-party embed subtrees with CSS resets (`contain`, `isolation`, `* { position: ... }`).
- Keep “advanced motion” optional; default should be CSS-only and fast.

---

## Appendix — Key reusable “content schemas” to encode in Shopify

### A) Service schema (metaobject/metafields)
- `service_title`, `service_subtitle`
- `hero_media` (image/video), `accent_color`
- `benefits[]` (title, description)
- `process_steps[]` (step label, title, description)
- `protocol` (temp, time, type, focus)
- `safety_notes[]` (contraindications)
- `cta_title`, `cta_text`, `cta_link`

### B) Launch-mode switches (theme settings)
- `launch_mode_enabled` (boolean)
- `primary_cta_mode`: booking | presale | waitlist
- `presale_badge_text`
- `availability_note_text`

