# Studio Deployment Checklist

**Status:** Ready to Deploy ✅  
**Target:** `studio.vitalicesf.com`  
**Platform:** Vercel + Cloudflare

---

## What's Already Done ✅

- ✅ Studio code is ready (Next.js app with Sanity Studio)
- ✅ Basic Auth middleware configured (`apps/studio/middleware.ts`)
- ✅ Build configuration (`apps/studio/vercel.json`)
- ✅ Environment variable documentation
- ✅ Deployment guide (`apps/studio/DEPLOYMENT.md`)
- ✅ Security configuration (`apps/studio/SECURITY.md`)

---

## What's Left to Do

### 1. Create Vercel Project for Studio

**Action Required:**

- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click **"Add New Project"**
- [ ] Import your repository (if not already imported)
- [ ] **Important:** Create a **separate project** for Studio (not the same as your web app)

**Project Settings:**

- [ ] **Project Name:** `vital-ice-studio` (or similar)
- [ ] **Root Directory:** `apps/studio` ⚠️ **CRITICAL**
- [ ] **Framework Preset:** `Next.js`
- [ ] **Build Command:** `pnpm run build` (or leave empty - `vercel.json` handles it)
- [ ] **Output Directory:** `.next`
- [ ] **Install Command:** `cd ../.. && pnpm install` ⚠️ **Must install from monorepo root using pnpm**
- [ ] **Node.js Version:** `20.x`

---

### 2. Configure Environment Variables in Vercel

**Go to:** Vercel Dashboard → Your Studio Project → Settings → Environment Variables

#### Required for All Environments:

- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` = `u2atn42r` (your project ID)
- [ ] `NEXT_PUBLIC_SANITY_DATASET` = `production`
- [ ] `SANITY_API_TOKEN` = (your Sanity API token with write permissions)

#### Required for Production Only:

- [ ] `STUDIO_USERNAME` = (choose a username for Basic Auth)
- [ ] `STUDIO_PASSWORD` = (generate a secure password - see below)

**Generate Secure Password:**

```bash
openssl rand -hex 32
```

**Note:** Use hex encoding to avoid `=` characters that can conflict with `.env` files.

**Where to Find Sanity API Token:**

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project (`u2atn42r`)
3. Go to **API** → **Tokens**
4. Create a new token with **Editor** permissions (or use existing)
5. Copy the token value

---

### 3. Add Custom Domain in Vercel

**Go to:** Vercel Dashboard → Your Studio Project → Settings → Domains

- [ ] Click **"Add Domain"** or **"Add"**
- [ ] Enter: `studio.vitalicesf.com`
- [ ] Click **"Add"** or **"Continue"**
- [ ] **Copy the CNAME target** that Vercel shows you (e.g., `cname.vercel-dns.com` or `cname-xyz.vercel-dns.com`)
- [ ] Note: Domain will show "Invalid Configuration" until DNS is set up (this is normal)

---

### 4. Configure Cloudflare DNS

**Go to:** [Cloudflare Dashboard](https://dash.cloudflare.com) → Select `vitalicesf.com` → DNS → Records

- [ ] Click **"Add record"**
- [ ] **Type:** `CNAME`
- [ ] **Name:** `studio` (NOT `studio.vitalicesf.com` - Cloudflare adds the domain automatically)
- [ ] **Target:** Paste the exact CNAME target from Vercel (Step 3)
- [ ] **Proxy status:** ✅ **Proxied** (orange cloud icon) - Recommended
- [ ] **TTL:** `Auto`
- [ ] Click **"Save"**

**Wait 5-15 minutes** for DNS propagation.

---

### 5. Verify Deployment

**Check Vercel:**

- [ ] Go to Vercel Dashboard → Your Studio Project → Deployments
- [ ] Verify latest deployment succeeded
- [ ] Go to Settings → Domains
- [ ] `studio.vitalicesf.com` should show **"Valid Configuration"** (green checkmark)

**Test the Domain:**

- [ ] Visit `https://studio.vitalicesf.com`
- [ ] Should see Basic Auth login prompt
- [ ] Enter `STUDIO_USERNAME` and `STUDIO_PASSWORD` (from Step 2)
- [ ] Should load Sanity Studio interface
- [ ] Verify SSL certificate is valid (lock icon in browser)

**Test Functionality:**

- [ ] Create/edit an article in Studio
- [ ] Verify it appears on the website (after webhook triggers or ISR revalidation)
- [ ] Test image uploads
- [ ] Test all content types

---

## Quick Reference

### Environment Variables Summary

```env
# Public (safe to expose)
NEXT_PUBLIC_SANITY_PROJECT_ID=u2atn42r
NEXT_PUBLIC_SANITY_DATASET=production

# Private (server-side only)
SANITY_API_TOKEN=your-token-here
STUDIO_USERNAME=your-username-here
STUDIO_PASSWORD=your-secure-password-here
```

### Vercel Project Settings Summary

```
Root Directory: apps/studio
Framework: Next.js
Build Command: pnpm run build
Output Directory: .next
Install Command: cd ../.. && pnpm install
Node Version: 20.x
```

### Cloudflare DNS Record Summary

```
Type: CNAME
Name: studio
Target: [from Vercel]
Proxy: Proxied (orange cloud)
TTL: Auto
```

---

## Troubleshooting

### Build Fails

- Verify **Root Directory** is `apps/studio` (not empty)
- Verify **Install Command** is `cd ../.. && npm install`
- Check build logs in Vercel dashboard

### DNS Not Resolving

- Wait 5-15 minutes for propagation
- Verify CNAME target matches exactly (case-sensitive)
- Check Cloudflare shows "Proxied" status
- Use `dig studio.vitalicesf.com` to check DNS

### Basic Auth Not Working

- Verify `STUDIO_USERNAME` and `STUDIO_PASSWORD` are set in Vercel (Production environment)
- Check Vercel logs for auth errors
- Verify environment variables are set for correct environment (Production vs Preview)

### Can't Access Studio

- Check Vercel deployment succeeded
- Verify domain shows "Valid Configuration" in Vercel
- Check SSL certificate is provisioned (may take a few minutes)
- Verify Basic Auth credentials are correct

---

## Related Documentation

- **[DEPLOYMENT.md](../apps/studio/DEPLOYMENT.md)** - Complete deployment guide
- **[SECURITY.md](../apps/studio/SECURITY.md)** - Basic Auth configuration
- **[ENV_SECURITY.md](../apps/studio/ENV_SECURITY.md)** - Environment variables security
- **[WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)** - Webhook configuration for content updates

---

## Estimated Time

- **Vercel Project Setup:** 5-10 minutes
- **Environment Variables:** 5 minutes
- **Domain Configuration:** 5 minutes
- **Cloudflare DNS:** 5 minutes
- **Verification:** 10-15 minutes
- **Total:** ~30-40 minutes

---

**Last Updated:** 2025-01-27  
**Status:** Ready to deploy - all code and configuration complete ✅
