# Sanity — dependencies and usage

## Environment variables (from `next.config.ts` + `src/lib/sanity.ts`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Required for client |
| `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production` if unset |
| `SANITY_API_TOKEN` | Exposed in next config env block; optional for reads (commented in client) |

## NPM packages

- `@sanity/client`
- `@sanity/image-url`
- `next-sanity`

## Document type

- **`client`** — primary content type (see `cms/studio-beringia-marine/schemas/client.ts`)

## GROQ entry points

| Function | File | Purpose |
|----------|------|---------|
| `fetchClients` | `src/lib/sanity.ts` | List all clients for `/clients` |
| `fetchClientBySlug` | `src/lib/sanity.ts` | Single client for `/clients/[slug]` |
| `getAllClientSlugs` | `src/lib/sanity.ts` | `generateStaticParams` |
| `urlFor` | `src/lib/sanity.ts` | Image URL builder (requires `@sanity/image-url`) |

## Studio location

- `cms/studio-beringia-marine/` — `sanity.config.ts`, `schemas/client.ts`, `deskStructure.ts`, `constants/sketchfab.ts`

## ISR

- `src/app/clients/page.tsx` and `src/app/clients/[slug]/page.tsx`: `revalidate = 3600`

## Risk

- Build/runtime **requires** valid `NEXT_PUBLIC_SANITY_PROJECT_ID` and reachable dataset for client routes and static generation.
