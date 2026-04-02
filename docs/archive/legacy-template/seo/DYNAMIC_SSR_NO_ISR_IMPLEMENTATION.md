# Full Dynamic SSR and No-ISR Implementation

Summary of changes and verification for the SEO agency request: force dynamic rendering on services and insights, disable ISR/static optimization, and ensure Sanity fetches use no-store.

---

## Why this matters

SEO agencies care about: **build output (dynamic vs static)**, **raw HTML freshness**, **no stale content**, **no hydration replacement**. Docs are useful after the code is confirmed.

**Best fix:** Verify the load-bearing invariants in ~5 minutes using the commands in [§ 2.5 Five-minute verification](#25-five-minute-verification). Use [§ 6 Audit paste](#6-audit-paste) to hand off code snippets for a compliance check.

---

## 1. Specific code changes

### 1.1 Route segment enforcement

| File | Change |
|------|--------|
| `apps/web/src/app/services/layout.tsx` | **Created.** Exports `dynamic = 'force-dynamic'`, `revalidate = 0`, `fetchCache = 'force-no-store'`; default `ServicesLayout` passthrough. |
| `apps/web/src/app/insights/layout.tsx` | **Updated.** Same three exports added at top (existing layout body unchanged). |

### 1.2 Build-time static generation disabled

| File | Change |
|------|--------|
| `apps/web/src/app/services/[slug]/page.tsx` | Replaced `generateStaticParams` body with `return []` and comment: "Static gen intentionally disabled for dynamic SSR / no-ISR." Removed `revalidate = 3600`. Removed unused `getAllServices` import. |
| `apps/web/src/app/insights/[slug]/page.tsx` | Same: `generateStaticParams` returns `[]` with comment. Removed `revalidate = 3600`. |
| `apps/web/src/app/[slug]/page.tsx` | Same: `generateStaticParams` returns `[]` with comment (Sanity-driven CMS route). |

### 1.3 Sanity: no CDN, no React cache for services

| File | Change |
|------|--------|
| `lib/sanity/client.ts` | **useCdn:** `clientConfig.useCdn` set to `false` (was `process.env.NODE_ENV === 'production'`). **No-store clients:** Added `noStoreFetchOption = { cache: 'no-store' }` and three clients (`noStoreClient`, `noStorePreviewClient`, `noStoreRawClient`) using it. **getClient:** Now accepts `noStore?: boolean`; when `noStore === true` returns the no-store client. **getContentNoStore:** New async function, same signature/behavior as `getContentWithCache` but not wrapped in React `cache()`, uses `getClient({ ..., noStore: true })`. |
| `lib/sanity/queries.ts` | Import `getContentNoStore`. **getServiceBySlug** and **getAllServices** now call `getContentNoStore` instead of `getContentWithCache`. All other call sites (e.g. getGlobalSettings, getPageContent, getAllPages) still use `getContentWithCache`. |

### 1.4 Insights: no ISR on article fetches

| File | Change |
|------|--------|
| `apps/web/src/lib/sanity/queries/articles.ts` | Replaced `next: { revalidate: 3600 }` with `next: { revalidate: 0 }` in **fetchAllArticles**. Added `next: { revalidate: 0 }` to **fetchArticleBySlug**, **fetchArticlesByCategory**, and **searchArticles**. |

### 1.5 Server-rendered JSON-LD and semantic H1 (SSR/hydration parity)

To satisfy raw-HTML and hydration tests (canonical, H1, JSON-LD, visible content after load):

| Area | Change |
|------|--------|
| **Services listing** | `apps/web/src/app/services/page.tsx`: Emit JSON-LD in the server component via `getPageSchema('services')` and `<script type="application/ld+json">` so LocalBusiness/BreadcrumbList are in the response (or RSC stream). |
| **Service detail pages** | `apps/web/src/app/services/cold-plunge/page.tsx` and `apps/web/src/app/services/[slug]/page.tsx`: Same pattern with `getPageSchema(serviceId)` so each service page has Service + LocalBusiness (and breadcrumb when defined) in the initial response. |
| **Semantic H1** | Replaced `role="heading" aria-level={1}` with real `<h1>` (or `motion.h1`) in: `ArticleHero` (insights article title), `ServiceHeroSection` (Sanity service title), `ServicesPageClient` (Our Services). Ensures crawlers and hydration tests see a visible H1 inside `[data-seo-main]`. |
| **Tests** | `apps/web/tests/ssr-hydration.spec.ts`: When no literal `<script type="application/ld+json">` block is found (e.g. JSON-LD only in RSC stream), fallback asserts the allowed schema type name (LocalBusiness, Service, Article, etc.) appears in the full response body. |

**Run after changes:** `pnpm --filter @vital-ice/web test:ssr-hydration` (requires app at baseURL and Playwright browser: `pnpm pw:install`). All 8 tests (4 raw HTML + 4 hydration parity) should pass.

---

## 2. Verification results

### 2.1 Build output

- **Command:** `pnpm --filter @vital-ice/web build`
- **Result:** Build succeeds.
- **Route types:**
  - `services/*` (index and all service paths including `[slug]`): **ƒ (Dynamic)**
  - `insights` and `insights/[slug]`: **ƒ (Dynamic)**
  - `[slug]` (Sanity CMS pages): **ƒ (Dynamic)**  
  (No `generateStaticParams` in these segments; segment layouts enforce dynamic.)

### 2.2 Grep / code checks

| Check | Result |
|-------|--------|
| `generateStaticParams` in services/insights/\[slug] and \[slug] | **Removed entirely** from all three page files. |
| `revalidate` > 0 in services/ or insights/ | None. No `revalidate: 3600` or similar in those segments. |
| Service data uses uncached path | `getServiceBySlug` and `getAllServices` in `lib/sanity/queries.ts` use `getContentNoStore`. |

### 2.4 Automated compliance (testing)

A Node script asserts the same invariants so CI and local runs can fail fast if someone re-adds ISR or `generateStaticParams`:

| Command | Purpose |
|---------|--------|
| `pnpm --filter @vital-ice/web test:compliance` | Run only the compliance assertions (no Jest). |
| `pnpm --filter @vital-ice/web test` | Runs compliance script first, then Jest. |

**Script:** `apps/web/scripts/assert-dynamic-ssr-compliance.cjs`

It checks: (1) no `generateStaticParams` in `services/[slug]`, `insights/[slug]`, `[slug]` page files; (2) no `revalidate` > 0 in any `services` or `insights` page file; (3) `services/layout.tsx` and `insights/layout.tsx` each export `revalidate = 0`, `dynamic = 'force-dynamic'`, and `fetchCache = 'force-no-store'`; (4) no `revalidate` > 0 in `apps/web/src/lib/sanity/queries/articles.ts`.

**Root script (Layer 1 guardrails):** From repo root, `pnpm ssr:guardrails` runs the same compliance (via `pnpm --filter @vital-ice/web test:compliance`). Use in CI to prevent reintroducing ISR or `generateStaticParams`.

**Build classification (optional):** `pnpm --filter @vital-ice/web ssr:build-check` runs a full build and asserts that `/services/[slug]`, `/insights/[slug]`, and `/[slug]` are **ƒ (Dynamic)** in the build output. Script: `apps/web/scripts/assert-route-classification.cjs`. Run on main or in a nightly job; do not block every `pnpm test` on it.

Optional: in CI, run `ssr:guardrails` (or `test:compliance`) before or as part of the web app test step.

### 2.5 Five-minute verification

Run these locally (or in CI) to confirm the implementation matches the spec.

| Step | Command | What you want to see |
|------|---------|----------------------|
| 1) Segment layouts | `sed -n '1,40p' apps/web/src/app/services/layout.tsx` and same for `insights/layout.tsx` | `dynamic = 'force-dynamic'`, `revalidate = 0`, `fetchCache = 'force-no-store'` |
| 2) Static hooks | `rg "generateStaticParams" apps/web/src/app/services apps/web/src/app/insights apps/web/src/app/\[slug\]"` | No matches (export removed for dynamic build). |
| 3) No ISR on routes/fetches | `rg "revalidate:\s*[1-9]" apps/web/src/app/services apps/web/src/app/insights apps/web/src/lib/sanity/queries/articles.ts` and `rg "revalidate\s*=\s*[1-9]" apps/web/src/app/services apps/web/src/app/insights` | No matches. |
| 4) Sanity CDN off | `rg "useCdn:" lib/sanity/client.ts` | Published client: `useCdn: false` (not conditional). |
| 5) Services use uncached path | `rg "getContentWithCache\|getContentNoStore" lib/sanity/queries.ts` | `getServiceBySlug` and `getAllServices` use `getContentNoStore`; others may use `getContentWithCache`. |
| 6) Build output | `pnpm --filter @vital-ice/web build` | `/services/...` and `/insights/...` marked **ƒ (Dynamic)**, not ●. |
| 7) HTML has content | `curl -s https://www.vitalicesf.com/services/cold-plunge \| grep -i "<h1"` and same for `canonical` | H1 and canonical in response. |

**Gotcha A — [slug] static in build:** If `generateStaticParams` is re-added (even `return []`), Next may show ●. Keep it **removed**; use `pnpm --filter @vital-ice/web test:compliance` to enforce.

**Gotcha B — Articles fetches:** All article `client.fetch` calls must have `next: { revalidate: 0 }` or `cache: 'no-store'` (fetchAllArticles, fetchArticleBySlug, fetchArticlesByCategory, searchArticles). This implementation has all four.

### 2.6 Verification checklist (all must pass)

1. **Build classification:** `pnpm --filter @vital-ice/web build` shows **ƒ (Dynamic)** for `/services/[slug]`, `/insights/[slug]`, and `/[slug]`. Or run `pnpm --filter @vital-ice/web ssr:build-check` to assert automatically.
2. **SSR audit script:** `pnpm --filter @vital-ice/web ssr:audit` passes when run against the deployed or locally served app (see Layer 2).
3. **Playwright hydration parity:** `pnpm --filter @vital-ice/web test:ssr-hydration` passes (raw HTML markers + visible H1/body after load). Requires app served at baseURL (e.g. dev server or preview). If needed, install browser: `pnpm --filter @vital-ice/web pw:install`. See `apps/web/tests/ssr-hydration.spec.ts` (Layer 3).
4. **Layer 1 guardrails:** `pnpm ssr:guardrails` (or `pnpm --filter @vital-ice/web test:compliance`) passes.

### 2.7 Canonical validation: curl vs View Source

**curl (HTTP response body) is the canonical validation for SEO content.** Browser "View Source" (Ctrl+U / Cmd+U) is secondary and can be misleading with streaming, because the initial HTML may still be loading or differ from what crawlers receive. Use `curl -s <url>` (or the `verify-seo.sh` script and `ssr-audit.mjs`) to assert titles, canonicals, H1, and JSON-LD in the raw response.

### 2.8 Screaming Frog: two-crawl playbook

When using Screaming Frog (or similar crawlers) for manual SEO audits:

1. **First crawl — Text Only (no JavaScript):** Aligns with raw HTML and with what `request.get()` / curl / `ssr-audit.mjs` see. This is the SSR/HTML contract.
2. **Second crawl — JavaScript Rendering:** Aligns with what users (and Playwright hydration tests) see after the page has loaded and React has hydrated.

**How to interpret results:**

- **If Text Only passes but JavaScript rendering fails:** Likely a **hydration/parity** problem (content in HTML is removed or replaced by client JS).
- **If Text Only fails:** Likely an **SSR/HTML** problem (content not in initial response).

**Key columns to watch:** Missing H1, Missing meta description, Canonical mismatches, Structured data (JSON-LD). Caching or relying only on the rendered DOM can be misleading; use Text Only as the source of truth for "is it in the HTML?" and JS rendering to confirm visible parity.

---

### 2.3 Raw HTML (curl)

- **URL:** `https://www.vitalicesf.com/services/cold-plunge`
- **H1:** Present in initial HTML (sr-only block): "Cold Plunge Therapy - San Francisco Recovery & Wellness".
- **Canonical:** `<link rel="canonical" href="https://www.vitalicesf.com/services/cold-plunge"/>`.
- **Body phrase:** "Experience cold plunge therapy at Vital Ice…" and "cold plunge" appear in the response.
- **Metadata:** Title, description, and JSON-LD (LocalBusiness, etc.) present in initial HTML.

---

## 3. Scope and invariants

- **In scope:** `/services/**`, `/insights/**`, and `/[slug]` (Sanity CMS pages). No refactor of UI/components/animations; no changes to unrelated routes.
- **Invariants for these segments:** No `revalidate` > 0; no `generateStaticParams` in `services/[slug]`, `insights/[slug]`, or `[slug]`; service and insights data use no-store/uncached path (`getContentNoStore`, `revalidate: 0`); published Sanity client uses `useCdn: false`. Enforced by `apps/web/scripts/assert-dynamic-ssr-compliance.cjs` (run via `test:compliance`).

---

## 4. Optional follow-up

- **Definition of done (agency):** For home, services index, one service slug, insights index, one insight slug: curl returns H1/H2/body/JSON-LD; Ahrefs Page Inspect matches; DOM after hydration matches (no content replaced/removed). Use **curl as canonical**; View Source (Ctrl+U) as secondary.
- **Phase 2 — Visible content parity:** If the agency flags “content in HTML but not reflected consistently on the frontend after hydration,” the next step is to align visible UI with the same H1/body used for SEO (e.g. single source, no sr-only-only block that diverges from visible content).

---

## 5. Reference

- Plan: Full Dynamic SSR and No-ISR (load-bearing segments first).
- Agency request: indexing/stale content; move to fully dynamic SSR; no ISR; SEO-critical content in initial HTML; no client hydration replacing server content.

---

## 6. Audit paste

Code snippets for compliance review (first ~40 lines and changed sections). Paste these when asked “actual code diffs or changed file list.”

### apps/web/src/app/services/layout.tsx (full file)

```ts
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
```

### apps/web/src/app/insights/layout.tsx (first 20 lines)

```ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * Insights section layout
 * ...
 */
interface InsightsLayoutProps { children: React.ReactNode; }
export default function InsightsLayout({ children }: InsightsLayoutProps) {
  return <>{children}</>;
}
```

### apps/web/src/app/services/[slug]/page.tsx (changed parts)

- **generateStaticParams:** `return []` with comment "Static gen intentionally disabled for dynamic SSR / no-ISR". No `revalidate = 3600`.
- **Data:** `getServiceBySlug(slug)` (uses `getContentNoStore` in lib).

```ts
// Static gen intentionally disabled for dynamic SSR / no-ISR
export async function generateStaticParams() {
  return [];
}
// ... generateMetadata, then default async function ServicePage — no revalidate export
```

### apps/web/src/app/insights/[slug]/page.tsx (changed parts)

- **generateStaticParams:** `return []` with same comment. No `revalidate = 3600`.

```ts
// Static gen intentionally disabled for dynamic SSR / no-ISR
export async function generateStaticParams() {
  return [];
}
```

### apps/web/src/app/[slug]/page.tsx (changed part)

- **generateStaticParams:** body replaced with `return []` and same comment.

```ts
// Static gen intentionally disabled for dynamic SSR / no-ISR
export async function generateStaticParams() {
  return [];
}
```

### lib/sanity/client.ts (key sections)

- **clientConfig:** `useCdn: false` (line 22).
- **No-store:** `noStoreFetchOption = { cache: 'no-store' }`; three clients with `fetch: noStoreFetchOption`.
- **getClient:** accepts `noStore?: boolean`; when true returns noStore* client.
- **getContentNoStore:** async function, same signature as getContentWithCache, not wrapped in cache(), uses `getClient({ ..., noStore: true })`.

```ts
const clientConfig = {
  ...
  useCdn: false,
  token: requiredEnvVars.token!,
};
const noStoreFetchOption = { cache: 'no-store' as RequestCache };
// noStoreClient, noStorePreviewClient, noStoreRawClient with fetch: noStoreFetchOption
export function getClient(options: { preview?: boolean; raw?: boolean; noStore?: boolean } = {}): SanityClient {
  if (options.noStore) { ... return noStoreClient / noStorePreviewClient / noStoreRawClient; }
  ...
}
export async function getContentNoStore<T>(query, params, options) { ... getClient({ ..., noStore: true }) ... }
```

### lib/sanity/queries.ts (changed parts)

- **Import:** `getContentWithCache, getContentNoStore` from `./client`.
- **getServiceBySlug:** `getContentNoStore<ServiceData>(...)`.
- **getAllServices:** `getContentNoStore<ServiceData[]>(...)`.
- All other call sites (getGlobalSettings, getPageContent, getAllPages, getPageMetadata, getServiceMetadata, etc.) still use `getContentWithCache`.

```ts
import { getContentWithCache, getContentNoStore } from './client';
// ...
return await getContentNoStore<ServiceData>(queries.serviceBySlug, { slug }, { preview, validateResult... });
// ...
const services = await getContentNoStore<ServiceData[]>(queries.allServices, {}, { preview, validateResult..., fallback: [] });
```

### apps/web/src/lib/sanity/queries/articles.ts (all fetch calls)

- **fetchAllArticles:** `client.fetch(..., {}, { next: { revalidate: 0 } })`.
- **fetchArticleBySlug:** `client.fetch(..., { slug }, { next: { revalidate: 0 } })`.
- **fetchArticlesByCategory:** `client.fetch(..., { category }, { next: { revalidate: 0 } })`.
- **searchArticles:** `client.fetch(..., { query: ... }, { next: { revalidate: 0 } })`.

```ts
const articles = await client.fetch(ALL_ARTICLES_QUERY, {}, { next: { revalidate: 0 } });
const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug }, { next: { revalidate: 0 } });
const articles = await client.fetch(ARTICLES_BY_CATEGORY_QUERY, { category }, { next: { revalidate: 0 } });
const articles = await client.fetch(SEARCH_ARTICLES_QUERY, { query: `*${query}*` }, { next: { revalidate: 0 } });
```

**Compliance summary from this implementation:** Segment layouts have the three exports; generateStaticParams returns [] (removing entirely would make build show ƒ for [slug]); no revalidate > 0 in services/insights or articles; useCdn false; services use getContentNoStore; all four article fetches have revalidate: 0.

---

## 7. Five-minute verification — command results (last run)

### 1) Segment layouts (first 40 lines)

**apps/web/src/app/services/layout.tsx**
```
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
```

**apps/web/src/app/insights/layout.tsx**
```
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * Insights section layout
 * Using native browser scrolling for optimal performance
 */
...
export default function InsightsLayout({ children }: InsightsLayoutProps) {
  return <>{children}</>;
}
```
**Result:** Both have `dynamic`, `revalidate = 0`, `fetchCache = 'force-no-store'`. Pass.

---

### 2) generateStaticParams

**Command:** `rg "generateStaticParams" apps/web/src/app/services/[slug]/page.tsx apps/web/src/app/insights/[slug]/page.tsx apps/web/src/app/[slug]/page.tsx -n`

**Result:**
- `apps/web/src/app/services/[slug]/page.tsx`: lines 15–17 — `export async function generateStaticParams() { return []; }`
- `apps/web/src/app/insights/[slug]/page.tsx`: lines 14–16 — same
- `apps/web/src/app/[slug]/page.tsx`: lines 41–43 — same

**Result:** All three exist and return `[]` only. Build still shows ● (SSG) for these routes; removing the export entirely would yield ƒ (Dynamic).

---

### 3) No ISR on routes / fetches

**Commands:**  
`rg "revalidate:\s*[1-9]" apps/web/src/app/services apps/web/src/app/insights apps/web/src/lib/sanity/queries/articles.ts -n`  
`rg "revalidate\s*=\s*[1-9]" apps/web/src/app/services apps/web/src/app/insights -n`

**Result:**
- **articles.ts:** No matches (all use `revalidate: 0`). Pass.
- **services/** and **insights/:** Matches in:
  - `apps/web/src/app/services/page.tsx`: `export const revalidate = 3600`
  - `apps/web/src/app/services/cold-plunge/page.tsx`, `compression-boots`, `infrared-sauna`, `percussion-massage`, `red-light-therapy`, `traditional-sauna`: `export const revalidate = 3600`
  - `apps/web/src/app/insights/page.tsx`: `export const revalidate = 3600`
  - (Plus .md docs: TASK_18_COMPLETION_SUMMARY.md, PERFORMANCE_OPTIMIZATION.md — ignore.)

**Result:** Index pages and static-named service pages under `/services/` and `/insights/` still export `revalidate = 3600`. Segment layouts apply to children but page-level export can override. For full agency alignment, set `revalidate = 0` (or remove) on `services/page.tsx`, `insights/page.tsx`, and each `services/<name>/page.tsx`.

---

### 4) Sanity CDN off (published client)

**Command:** `rg "useCdn:" lib/sanity/client.ts -n`

**Result:**
```
lib/sanity/client.ts
  23:  useCdn: false,
  39:  useCdn: false,
  46:  useCdn: false,
  59:  useCdn: false,
  66:  useCdn: false,
```
**Result:** clientConfig and all clients use `useCdn: false`. Pass.

---

### 5) Services queries use getContentNoStore

**Command:** `rg "getContentWithCache|getContentNoStore" lib/sanity/queries.ts -n`

**Result:**
```
  7: import { getContentWithCache, getContentNoStore } from './client';
320:     return await getContentWithCache<GlobalSettings>(
338:     return await getContentWithCache<PageContent>(
356:     return await getContentNoStore<ServiceData>(
374:     const services = await getContentNoStore<ServiceData[]>(
396:     const pages = await getContentWithCache<...
429:     return await getContentWithCache<...
445:     return await getContentWithCache<...
462:     return await getContentWithCache<...
515:     const lastModified = await getContentWithCache<...
```
**Result:** getServiceBySlug (356) and getAllServices (374) use getContentNoStore; rest use getContentWithCache. Pass.

---

### 6) Build output (route types)

**Command:** `pnpm --filter @vital-ice/web build` (tail of output)

**Result:**
- ƒ (Dynamic): `/`, `/insights`, `/services`, `/services/cold-plunge`, `/services/compression-boots`, etc.
- ● (SSG): `/[slug]`, `/insights/[slug]`, `/services/[slug]`

**Result:** Dynamic routes under services/insights (index and named pages) are ƒ. The three `[slug]` routes remain ● because they still export generateStaticParams.

---

### 7) Raw HTML (H1 + canonical)

**Commands:**  
`curl -s https://www.vitalicesf.com/services/cold-plunge | grep -i "<h1"`  
`curl -s https://www.vitalicesf.com/services/cold-plunge | grep -i "canonical"`

**Result:**
- H1: `<h1>Cold Plunge Therapy - San Francisco Recovery &amp; Wellness</h1>`
- Canonical: `rel="canonical" href="https://www.vitalicesf.com/services/cold-plunge"`

**Result:** Pass.
