# Deploying the Beringia Marine Studio

The studio is a standalone Next.js app under `apps/studio`. It is deployed as its own Vercel project (separate from `apps/web`) and served at `studio.beringia-marine.com`.

## 1. First-time Vercel setup

1. Create a **new** Vercel project (don't reuse the existing `beringia-marine` web project).
2. Import the same GitHub repo, but set:
   - **Root directory**: `apps/studio`
   - **Framework preset**: Next.js
   - **Build command**: `pnpm run build`
   - **Install command**: `cd ../.. && pnpm install --no-frozen-lockfile`
   - **Output directory**: `.next`
3. Environment variables (Production + Preview):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=l183gjut`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19`
4. Add the custom domain `studio.beringia-marine.com` and follow Vercel's DNS instructions (CNAME → `cname.vercel-dns.com`).

> The studio doesn't need the write token at runtime — Sanity-native auth gates editor access via project membership. Only the migration seed script (run locally) needs `SANITY_API_WRITE_TOKEN`.

## 2. Sanity project setup

### CORS allowlist

manage.sanity.io → project `l183gjut` → API → CORS origins. Add:

| Origin                                | Allow credentials |
| ------------------------------------- | ----------------- |
| `https://studio.beringia-marine.com`  | ✅ Yes             |
| `https://beringia-marine.com`         | ❌ No              |
| `https://*.vercel.app`                | ❌ No (for preview branches) |
| `http://localhost:3333`               | ✅ Yes (local studio dev) |
| `http://localhost:3000`               | ❌ No (local web dev) |

Without **Allow credentials** on the studio origin, the studio's Vision tool will fail to load drafts.

### Editors

manage.sanity.io → project `l183gjut` → Members → invite teammates. Sanity-native auth is the only access gate (no perimeter Basic Auth).

## 3. Seeding the dataset (one-time)

```bash
# From repo root
pnpm install
# Make sure SANITY_API_WRITE_TOKEN is set in the repo-root .env.local
pnpm seed:dry   # preview
pnpm seed       # write
```

This populates:
- `siteSettings` singleton (only if missing)
- 4 `insight` documents (Anchorbot TEAMER report, Unified Marine Architecture, Anchorbot Alaska mariculture, Hydrus AUV evaluation)
- 3 `partner` documents (Advanced Navigation, Anchorbot, Mission Robotics)

Re-running is safe — documents use deterministic `_id`s (`insight.<slug>` / `partner.<slug>`) and Sanity dedups image asset uploads by content hash.

## 4. Local dev

```bash
pnpm install
pnpm dev:studio   # http://localhost:3333
```

The studio opens to a Sanity login. Sign in with the email invited as a member; you'll see the Content desk with `Site settings`, `Insights`, `Partners`.

## 5. After deploying

The web app (`apps/web`) is already wired Sanity-first for `/insights/[slug]` and `/solutions/[slug]`:

- If the slug exists in the dataset, content comes from Sanity (Portable Text body → HTML, Sanity CDN images).
- Otherwise it falls back to the verbatim TS/JSON in `apps/web/src/lib/content/`.

Listings (`/insights`, `/solutions`) still read from the static registries — wiring them to Sanity is a phase-2 follow-up.
