# Vital Ice Sanity Studio

Standalone Sanity Studio application for managing content for the Vital Ice website.

## Quick Start

```bash
# Development
npm run dev

# Build
npm run build

# Deploy
npm run deploy
```

The studio will be available at `http://localhost:3000` (or the port shown in the terminal)

⚠️ **Note:** This is a Next.js app with embedded Sanity Studio. Use `npm run dev`, not `sanity dev`.

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide (Vercel + Cloudflare)
- **[ENV_SECURITY.md](./ENV_SECURITY.md)** - Environment variables security guide
- **[SECURITY.md](./SECURITY.md)** - Basic Auth and security configuration

---

## Environment Variables

### Required (All Environments)

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### Production Only

```bash
STUDIO_USERNAME=your-username
STUDIO_PASSWORD=your-secure-password
```

See [ENV_SECURITY.md](./ENV_SECURITY.md) for security details.

---

## Deployment

Deployed to `studio.vitalicesf.com` via Vercel.

**Quick Setup:**

1. Create separate Vercel project
2. Set root directory: `apps/studio`
3. Configure build settings (see [DEPLOYMENT.md](./DEPLOYMENT.md))
4. Add environment variables
5. Add custom domain: `studio.vitalicesf.com`
6. Configure Cloudflare CNAME

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

---

## Security

The studio is protected by Basic Auth middleware in production. See [SECURITY.md](./SECURITY.md) for details.

---

## Current Status

✅ **Standalone** - Has its own schemas and configuration  
✅ **Ready to Deploy** - No monorepo dependencies  
✅ **Secure** - Basic Auth protection configured
