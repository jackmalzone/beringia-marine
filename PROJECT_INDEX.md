# Beringia Marine — project index

**Last indexed:** 2026-03-30  
**Repository role:** Primary monorepo for rebuilding the Beringia Marine marketing site and related tooling, from a pasted **Vital Ice**–style template that has been **partially rebranded** toward Beringia.

**Related:** `INDEX_PLAN.md` (staged work plan), `migration-legacy/` (prior app archive, Sanity client schema snapshot, copy/config extracts).

---

## 1. Executive summary

| Aspect | Current state |
|--------|----------------|
| **Intent** | Production site for **Beringia Marine Technologies** (marine technology sales engineering & consulting), not the original wellness/booking template. |
| **Stack** | **pnpm** monorepo + **Turborepo**; web app **Next.js 16** + **React 19**; Studio **Sanity 4** embedded in `apps/studio`. |
| **Content** | Core marketing pages (`/`, `/about`, `/contact`, `/terms`, `/solutions`, `/insights`) wired toward Beringia **static modules** and shell config; **legacy template routes** (`/book`, `/services/*`, `/experience`, Mindbody APIs, etc.) still exist in the tree. |
| **Sanity** | Studio schemas target **generic pages, services, articles, global settings** (template CMS model). Docs claim ~60% migration; **Beringia’s prior `client`-document model** lives in `migration-legacy/sanity-studio-snapshot/` and is **not** the active Studio schema today. |
| **Risk** | Package names remain `@vital-ice/*`; `wrangler.toml` and some tooling still reference **vital-ice** R2 buckets. Cleanup and rename are backlog items. |

---

## 2. Monorepo layout

| Path | Package / purpose |
|------|-------------------|
| `apps/web` | `@vital-ice/web` — public Next.js site |
| `apps/studio` | `vital-ice-studio` — Sanity Studio (Next-hosted) |
| `packages/config` | `@vital-ice/config` — `SITE_CONFIG`, `TEMPLATE_BUSINESS`, `SHELL_*` nav/footer, env parsing |
| `packages/ui` | `@vital-ice/ui` — forms/widgets (Mindbody-oriented) |
| `packages/mindbody-sdk` | API client for Mindbody |
| `packages/transactional` | Email/templates |
| `packages/test-utils` | Shared test helpers |
| `tools/performance-budget` | Perf checks |
| `tools/seo-crawl` | SEO crawl utility |
| `scripts/` | Root helpers (e.g. `next-dev.cjs`, migration docs) |
| `docs/` | Sanity migration docs, guides |
| `.kiro/specs/` | Specs (e.g. sanity-cms-migration) |
| `sanity/` | Minimal README only (not main schema root) |
| `migration-legacy/` | Archived first migration + `beringia` extracts + Studio snapshot |

**Root scripts** (`package.json`): `dev` → web, `dev:studio` → studio, `build` recursive, `lint`, `type-check`, `test`, perf guards.

---

## 3. Web app — routes (`apps/web/src/app`)

### 3.1 Beringia-aligned (primary product surface)

| Route | Role |
|-------|------|
| `/` | Home — `beringia-static` copy, CSS modules, SEO |
| `/about` | About |
| `/contact` | Contact |
| `/terms` | Terms |
| `/solutions` | Solutions listing — `lib/content/solutions.ts` registry |
| `/solutions/[slug]` | Solution detail (static registry-driven) |
| `/insights` | Insights listing (CMS/static hybrid per implementation) |
| `/insights/[slug]` | Article detail |

### 3.2 Legacy template routes (still present — decide keep/remove)

| Route | Notes |
|-------|--------|
| `/book`, `/book/thank-you` | Booking flow — likely **obsolete** for Beringia |
| `/services`, `/services/[slug]` | Sanity/dynamic **service** pages (wellness-shaped) |
| `/services/*` (fixed slugs: cold-plunge, sauna, etc.) | Old marketing pages |
| `/experience` | Experience landing |
| `/faq`, `/careers`, `/partners`, `/register`, `/client-policy` | Template sections |
| `/home` | Possible duplicate/alias of home |
| `/[slug]` | Catch-all dynamic pages from CMS |
| `/debug/analytics` | Dev/debug |

**Goal implication:** Navigation shell (`SHELL_PRIMARY_NAV`) already omits booking; crawler links omit `/book`. Full removal of dead routes/APIs reduces bundle, confusion, and security surface.

---

## 4. Key libraries (`apps/web/src/lib`)

| Area | Path | Notes |
|------|------|--------|
| Beringia copy | `lib/content/beringia-static.ts` | Home/mission/expertise/terms-style static content |
| Solutions registry | `lib/content/solutions.ts` | Rich `Solution` types; maps to `/solutions/[slug]` |
| Site URL / SEO | `lib/config/site-config.ts` | Re-exports `@vital-ice/config` |
| Business defaults | `lib/config/business-info.ts` | Re-exports `TEMPLATE_BUSINESS` (Beringia-staged) |
| Sanity | `lib/sanity/*` | Client, queries, SEO helpers, transformers — template article/service/page model |
| SEO | `lib/seo/*` | Metadata merge, structured data, validators, tests |
| Analytics | `lib/analytics/*` | Vercel, Meta pixel, audits |
| Email | `lib/email.ts` | Nodemailer paths |
| Mindbody | `app/api/mindbody/*` | Contact, waitlist, newsletter, membership |

---

## 5. Shared config package (`packages/config`)

- **`site.ts`:** Canonical **Beringia** defaults (`beringia-marine.com`, site name, description, OG, keywords, env overrides).
- **`shell.ts`:** Header/footer/nav copy, CTA, credits, legal metadata, **contact data quality note** (tel/email alignment).
- **`constants.ts`:** `TEMPLATE_BUSINESS` — address SLO area, services list, categories, **amenities** reframed as consulting capabilities.

**Branding TODOs** in source: production assets (OG, favicon, logos) referenced in comments.

---

## 6. Studio (`apps/studio`)

- **Stack:** Next 16 + `sanity` 4 + `next-sanity` 11; auth routes (`login`, `api/auth`, etc.).
- **Schemas (documents):** `article`, `globalSettings`, `page`, `service`.
- **Objects:** SEO, businessInfo, content blocks (hero, testimonials, service grid, newsletter, etc.).
- **Docs:** `apps/studio/README.md`, `DEPLOYMENT.md`, `ENV_SECURITY.md`, `SECURITY.md`.

**Gap vs Beringia legacy:** Prior marine **client** case-study schema is in `migration-legacy/sanity-studio-snapshot/schemas/` — **not** registered in this Studio’s `schemas/index.ts`. Unifying or replacing `/solutions` data with CMS is a product decision.

---

## 7. Testing & quality

- **Jest** + Testing Library in web and ui packages; **jest-axe** in web.
- **Playwright:** analytics, SSR/hydration specs.
- **Compliance scripts:** `assert-dynamic-ssr-compliance.cjs`, route classification — important for App Router correctness.

---

## 8. Deployment & infra

- **`vercel.json`:** Security headers, Mapbox API rewrite — review Mapbox necessity for Beringia.
- **`wrangler.toml`:** Still **vital-ice** R2 video buckets — replace or drop if unused.
- **Sentry:** `@sentry/nextjs` in web app.

---

## 9. Goals (inferred)

1. **Ship a credible Beringia Marine marketing site** — marine positioning, solutions detail, insights, contact, legal.
2. **Retire or quarantine template-only features** — booking, Mindbody, wellness services, experience/faq/careers unless explicitly in scope.
3. **Resolve CMS strategy** — keep template page/service/article model, adopt **client** documents from legacy snapshot, or stay static/registry-first for solutions.
4. **Rename and de-Vital-Ice the repo** — package names, R2, docs, root `package.json` name, `README.md` at repo root (still points only at `migration-legacy`; should eventually describe this monorepo).
5. **Close migration doc promises** — preview/draft, webhooks/revalidation (per `docs/sanity/SANITY_MIGRATION_STATUS.md`) if Sanity remains central.
6. **Use `migration-legacy/beringia`** for copy QA, asset inventory, and component behavior reference during rebuild.

---

## 10. Quick navigation

| Need | Location |
|------|----------|
| Staged copy & config JSON | `migration-legacy/beringia/` |
| Prior Next + Sanity integration notes | `migration-legacy/INITIAL_NEXTJS_MIGRATION_ARCHIVE.md` |
| Legacy Studio **client** schema | `migration-legacy/sanity-studio-snapshot/schemas/` |
| Execution checklist | `INDEX_PLAN.md` |
| Sanity migration status | `docs/sanity/SANITY_MIGRATION_STATUS.md` |
| Doc map | `DOCUMENTATION_ORGANIZATION.md` |

---

*Update this file when routes are removed, packages renamed, or Sanity schema strategy changes.*
