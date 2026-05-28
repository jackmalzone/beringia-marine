# Monorepo Setup Complete

## Structure

```
vital-ice/
├── packages/
│   ├── config/          # @beringia/config - Environment vars & constants
│   ├── mindbody-sdk/    # @beringia/mindbody-sdk - Mindbody API client
│   ├── ui/              # @beringia/ui - Form components & validation
│   └── test-utils/      # @beringia/test-utils - Testing utilities
├── apps/
│   └── web/             # Next.js application
└── .vital-ice/         # Shared linting/formatting configs
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Environment Variables

Create `.env.local` in the root directory (or set in Vercel):

```bash
# Required
MBO_API_KEY=your_api_key_here
MBO_SITE_ID=your_site_id_here

# Optional
MBO_API_BASE_URL=https://api.mindbodyonline.com/public/v6
MBO_AUTHORIZATION=your_staff_token_here
```

### 3. Development

```bash
# Run dev server (with Turbopack enabled for faster builds)
pnpm dev

# Or from apps/web directory
cd apps/web
pnpm dev
```

**Note**: The dev server uses Turbopack (Next.js's new bundler) for significantly faster development builds. The `--turbo` flag is enabled by default in the dev script.

### 4. Build

```bash
# Build all packages and app
pnpm build

# Or build just the web app
pnpm --filter web build
```

## Package Details

### @beringia/config

- Environment variable validation (Zod)
- Business constants (VITAL_ICE_BUSINESS)
- Shared types

### @beringia/mindbody-sdk

- Mindbody API client
- Retry logic, caching, error handling
- All Mindbody API types

### @beringia/ui

- Form components (ContactForm, WaitlistForm, MembershipInquiryForm)
- React Hook Form + Zod validation
- Form submission utilities

### @beringia/test-utils

- Testing utilities
- Mock data for Mindbody API
- renderWithProviders helper

## Import Paths

In `apps/web`, use:

- `@/*` - App-specific code (components, lib, etc.)
- `@beringia/mindbody-sdk` - Mindbody SDK
- `@beringia/ui` - UI components
- `@beringia/config` - Config & constants
- `@beringia/test-utils` - Test utilities

## Troubleshooting

If you see "Module not found" errors:

1. Make sure you're running commands from the root directory
2. Run `pnpm install` to ensure all workspace dependencies are linked
3. Check that `apps/web/tsconfig.json` has correct path mappings
4. Try deleting `.next` folder and rebuilding: `pnpm --filter web clean && pnpm --filter web build`
