# Beringia Marine Studio

Sanity Studio for the Beringia Marine site, mounted as a Next.js app and deployed to its own Vercel project at `studio.beringia-marine.com`.

## Local dev

```bash
pnpm install
cp .env.example .env.local         # fill in SANITY_API_AGENT_TOKEN
pnpm --filter @beringia/studio dev # serves at http://localhost:3333
```

## Schemas

- `insight` — articles, white papers, case studies, field reports (Portable Text body)
- `partner` — solution partner pages (Anchorbot, Mission Robotics, Advanced Navigation, etc.)
- `siteSettings` (singleton) — business info, social links, SEO defaults

## Migration seed

Idempotent script that imports the existing static content under `apps/web/src/lib/content/` (insights + partners) into the dataset. HTML article bodies are converted to Portable Text.

```bash
pnpm --filter @beringia/studio seed:dry   # preview without writing
pnpm --filter @beringia/studio seed       # write to dataset
```

Requires `SANITY_API_AGENT_TOKEN` (Editor scope) in `.env.local`.

## Deploy

Separate Vercel project rooted at `apps/studio`. See `vercel.json`.

CORS allowlist (manage.sanity.io → Project → API → CORS origins) must include:
- `https://studio.beringia-marine.com` (Allow credentials: yes)
- `https://beringia-marine.com` and any preview branch domains (Allow credentials: no)
