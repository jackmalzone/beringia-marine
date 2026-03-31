# Migration inventory — Beringia source repo

**Scope:** `beringia-marine` (Next.js 15 App Router + Sanity). **Excludes** any separate “template” repository.

## 1. Static page content

| Page | Staged extract |
|------|----------------|
| Home | `copy/pages/home.json` |
| About | `copy/pages/about.md` |
| Contact | `copy/pages/contact.md` |
| Terms | `copy/pages/terms.md` |
| Clients listing + detail behavior | `copy/pages/clients-and-solutions.md` |
| Insights / articles | `copy/pages/insights.md` (none in app) |

## 2. Business identity

| Item | Staged |
|------|--------|
| Names, tagline, default meta | `config/site-identity.json` |
| Email, phone, location | `config/contact.json` |
| Social (About) + credits | `config/social-and-credits.json` |

## 3. Client-related content

- **Dynamic:** Sanity `client` documents (not exported in this phase).
- **Static summaries / slugs / UI notes:** `copy/pages/clients-and-solutions.md`
- **Types:** `src/types/cms.ts/index.ts` (reference in repo only)

## 4. Assets referenced by app

- **Inventory:** `metadata/asset-inventory.md`
- **Empty staging folders:** `assets/brand`, `imagery`, `fonts`, `documents` (README placeholders only until you copy files)

## 5. CMS / Sanity

- **Dependencies:** `cms/sanity-dependencies.md`
- **Static vs dynamic:** `cms/static-vs-cms-driven.md`
- **Phase 2 schema notes:** `cms/schema-notes-phase-2.md`
- **Authoritative schema file:** `cms/studio-beringia-marine/schemas/client.ts` (in repo)

## 6. Reusable patterns (reference, not code)

- **Component behaviors:** `components/component-patterns-reference.md`

## 7. Normalized config bundle

- `config/site-identity.json`
- `config/contact.json`
- `config/navigation.json`
- `config/footer.json`
- `config/legal.json`
- `config/social-and-credits.json`

## 8. Chrome copy

- `copy/chrome/header-and-navigation.md`
- `copy/chrome/footer.md`

## Key files in original app (for traceability)

| Path | Role |
|------|------|
| `src/app/page.tsx` | Home |
| `src/app/about/page.tsx` | About |
| `src/app/contact/page.tsx` | Contact |
| `src/app/terms/page.tsx` | Terms |
| `src/app/clients/page.tsx` | Client list |
| `src/app/clients/[slug]/page.tsx` | Client page loader |
| `src/app/clients/[slug]/ClientPageContent.tsx` | Client sections |
| `src/lib/sanity.ts` | GROQ + client |
| `src/components/Header/Header.tsx` | Nav |
| `src/components/Footer/Footer.tsx` | Footer |
| `src/components/Hero/Hero.tsx` | Hero |
| `src/app/layout.tsx` | Metadata + tokens |
| `src/app/globals.css` | Global + fonts |
| `next.config.ts` | Sanity image domain |
