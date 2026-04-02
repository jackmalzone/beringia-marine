# SSR Changes and Current Status

One-page summary of all SSR/SEO-related work and where things stand.

---

## 1. Summary of All Changes

### 1.1 Dynamic rendering (no ISR for services/insights)

| What | Where |
|------|--------|
| Force dynamic + no revalidate | `apps/web/src/app/services/layout.tsx` — `dynamic = 'force-dynamic'`, `revalidate = 0`, `fetchCache = 'force-no-store'` |
| Same for insights | `apps/web/src/app/insights/layout.tsx` — same three exports |
| No static generation | `services/[slug]`, `insights/[slug]`, `[slug]` — `generateStaticParams` returns `[]` (or removed); no `revalidate = 3600` on these routes |

**Result:** Build shows **ƒ (Dynamic)** for `services/*`, `insights/*`, and `[slug]` (Sanity CMS). No ISR on these segments.

### 1.2 Sanity: fresh data for services/insights

| What | Where |
|------|--------|
| CDN off for published client | `lib/sanity/client.ts` — `useCdn: false` |
| No-store clients | `lib/sanity/client.ts` — `noStoreClient`, `noStorePreviewClient`, `noStoreRawClient`; `getClient({ noStore: true })`; `getContentNoStore()` (no React `cache()`) |
| Services use no-store | `lib/sanity/queries.ts` — `getServiceBySlug`, `getAllServices` use `getContentNoStore` |
| Articles no revalidate | `apps/web/src/lib/sanity/queries/articles.ts` — all article fetches use `revalidate: 0` |

**Result:** Services and insights data are always fetched without CDN or Next cache; no stale content from Sanity.

### 1.3 Server-rendered JSON-LD

| What | Where |
|------|--------|
| Services listing | `apps/web/src/app/services/page.tsx` — `<script type="application/ld+json">` with `getPageSchema('services')` (LocalBusiness, BreadcrumbList, etc.) |
| Service detail (cold-plunge) | `apps/web/src/app/services/cold-plunge/page.tsx` — same pattern with `getPageSchema('cold-plunge')` |
| Service detail (dynamic) | `apps/web/src/app/services/[slug]/page.tsx` — same with `getPageSchema(serviceId)` |
| Insights | Already in server components: `insights/page.tsx` (Blog + Breadcrumb), `insights/[slug]/page.tsx` (Article + Breadcrumb) |

**Result:** JSON-LD is emitted in the server response (or RSC stream) for services and insights so crawlers see structured data.

### 1.4 Semantic H1 and `data-seo-main`

| What | Where |
|------|--------|
| Real `<h1>` | `ArticleHero` (insights article title), `ServiceHeroSection` (Sanity service title), `ServicesPageClient` (Our Services) — replaced `role="heading" aria-level={1}` with `<h1>` / `motion.h1` |
| SEO main container | `[data-seo-main]` on main content in `DynamicPageRenderer`, `SanityServiceTemplateContent`, `ServicesPageClient`, `insights/[slug]/page.tsx` |

**Result:** One visible H1 per page inside the main content area; hydration does not remove or replace it. Crawlers and tests see H1 + body in raw HTML and after load.

### 1.5 Testing and tooling

| Layer | What | Command / file |
|-------|------|----------------|
| **1 – Guardrails** | No ISR/revalidate in services/insights; layout exports | `pnpm ssr:guardrails` or `pnpm --filter web test:compliance` — `assert-dynamic-ssr-compliance.cjs` |
| **2 – HTTP SSR** | Title, canonical, H1, JSON-LD, body phrase in raw response | `pnpm --filter web ssr:audit` — `scripts/ssr-audit.mjs`; optional `scripts/verify-seo.sh` |
| **3 – Hydration** | Same content visible after load; H1 in `[data-seo-main]` | `pnpm --filter web test:ssr-hydration` — `tests/ssr-hydration.spec.ts` (Playwright); run with app at baseURL; `pnpm pw:install` if needed |

**Test behavior:** JSON-LD assertion accepts either (a) literal `<script type="application/ld+json">` blocks or (b) schema type name (e.g. LocalBusiness, Article) in the full response body (covers RSC streaming).

### 1.6 Documentation

| Doc | Purpose |
|-----|--------|
| `docs/seo/DYNAMIC_SSR_NO_ISR_IMPLEMENTATION.md` | Full implementation details, verification steps, five-minute checklist, audit paste, Screaming Frog playbook |
| `docs/seo/SSR_CHANGES_AND_STATUS.md` | This file — short summary and status |

---

## 2. Current Status

### Done and verified

- **Dynamic build:** `services/*`, `insights/*`, `[slug]` build as **ƒ (Dynamic)**.
- **No ISR:** No `revalidate` > 0 or static generation in those segments; compliance script enforces it.
- **Sanity:** Services and insights use no-store clients and `revalidate: 0` on article fetches; CDN off.
- **JSON-LD:** Emitted server-side for services listing, all service detail pages, insights listing, and insight articles.
- **H1:** Semantic `<h1>` used on services listing, service pages, and insight articles; visible in `[data-seo-main]` after hydration.
- **Tests:** All 8 SSR hydration tests pass locally (4 raw HTML + 4 hydration parity) when app is running and Playwright browser is installed.

### In scope (unchanged)

- **Scope:** `/services/**`, `/insights/**`, `/[slug]` (Sanity). Other routes (home, about, book, contact, etc.) may still use `revalidate` for performance; not part of this SSR/SEO pass.

### Optional next steps

- **CI:** Add a job that runs `test:ssr-hydration` (and Playwright install) against a running app to catch regressions.
- **Post-deploy:** After web deploys, run the five-minute verification in `DYNAMIC_SSR_NO_ISR_IMPLEMENTATION.md` §2.5 and §2.6 (including `ssr:audit` and `test:ssr-hydration` if desired).

---

## 3. Quick verification commands

```bash
# Guardrails (no ISR re-introduced)
pnpm ssr:guardrails

# HTTP SSR (app must be running)
pnpm --filter web ssr:audit

# Full SSR + hydration (app must be running; install browser once)
pnpm --filter web pw:install
pnpm --filter web test:ssr-hydration
```

**Canonical for SEO:** Use **curl** (or `ssr-audit.mjs` / `verify-seo.sh`) for raw HTML. Browser “View Source” can be misleading with streaming.
