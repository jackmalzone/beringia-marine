# Beringia Marine Technologies

Marketing site for **Beringia Marine Technologies** — sales engineering and consulting for marine technology companies.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| CMS | Sanity 4 (embedded Studio) |
| Styling | CSS Modules, CSS custom properties, no Tailwind |
| Monorepo | pnpm workspaces + Turborepo |
| Deployment | Vercel |
| Error tracking | Sentry |

## Repository Layout

```
apps/
  web/          Next.js site — marketing pages, insights, solutions
  studio/       Sanity Studio — content management

packages/
  config/       Shared site config, shell nav/footer, business defaults
  ui/           Shared UI components
  transactional/ Email templates
  test-utils/   Shared test helpers

docs/           Technical documentation
migration/      Content migration assets (Sanity schemas, legacy extracts)
migration-legacy/ Archived first migration + prior app reference
scripts/        Build and dev helper scripts
tools/          Performance budget, SEO crawl utilities
```

## Getting Started

```bash
pnpm install
```

Copy environment files and configure for local development:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Run the apps:

```bash
pnpm dev            # Next.js — http://localhost:3000
pnpm dev:studio     # Sanity Studio
```

Other commands:

```bash
pnpm build          # Production build (all workspaces)
pnpm lint           # ESLint
pnpm type-check     # TypeScript checking
pnpm test           # Jest tests
```

## Primary Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — scroll-driven ocean depth experience |
| `/about` | Company background |
| `/contact` | Contact form |
| `/solutions` | Solutions listing |
| `/solutions/[slug]` | Solution detail pages |
| `/insights` | Articles and thought leadership |
| `/insights/[slug]` | Article detail |
| `/terms` | Legal terms |

## Homepage Depth System

The homepage features a scroll-driven environmental depth system that maps vertical scroll position to five oceanic zones (Epipelagic → Mesopelagic → Bathypelagic → Abyssal → Hadal). The UI progressively adapts — background lighting, header treatment, card surfaces, accent colors, and typography all respond to the active depth zone via CSS custom properties.

Key files:
- `apps/web/src/lib/depth-zones.ts` — zone definitions
- `apps/web/src/components/home/HomepageDepthObserver.tsx` — scroll observer
- `apps/web/src/components/DepthBackground/` — fixed gradient background layers
- `apps/web/src/app/globals.css` — depth-driven CSS variable definitions

## Documentation

See [`docs/README.md`](docs/README.md) for the full documentation index.

## Legacy Reference

Prior migration work, Sanity schema snapshots, and content extracts are preserved in `migration-legacy/` for reference. See `docs/archive/` for historical planning documents and template-era documentation.
