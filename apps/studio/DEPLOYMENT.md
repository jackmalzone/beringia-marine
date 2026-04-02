# Studio Deployment Guide

Complete guide for deploying the Sanity Studio to `studio.vitalicesf.com` via Vercel.

---

## 🧪 Testing on Feature Branches (Before Merging)

You can test deployments from feature branches without merging to `main`:

### Option 1: Push Feature Branch (Recommended)

1. **Push your feature branch:**

   ```bash
   git push origin feat/sanity-cms-migration
   ```

2. **Vercel will automatically create a preview deployment:**
   - Go to Vercel Dashboard → Your Studio Project
   - You'll see a new deployment with a preview URL like: `studio-git-feat-sanity-cms-migration-xxx.vercel.app`
   - This is a temporary URL for testing

3. **Test the preview:**
   - Visit the preview URL
   - Verify the studio loads correctly
   - Test all functionality

4. **When ready to deploy to production:**
   - Merge to `main` branch
   - Vercel will automatically deploy to `studio.vitalicesf.com`

### Option 2: Manual Deployment from CLI

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Login:**

   ```bash
   vercel login
   ```

3. **Deploy from feature branch:**

   ```bash
   # Make sure you're on your feature branch
   git checkout feat/sanity-cms-migration

   # Deploy (will create preview, not production)
   cd apps/studio
   vercel
   ```

4. **Follow prompts:**
   - Link to existing project? **Yes**
   - Which project? Select your studio project
   - Override settings? **No** (uses `vercel.json`)

### Option 3: Configure Branch in Vercel Dashboard

1. **Go to Vercel Dashboard** → Your Studio Project → **Settings** → **Git**
2. **Production Branch:** Set to `main` (default)
3. **Preview Deployments:** Enabled (default)
4. **Any push to any branch** will create a preview deployment

### Preview vs Production

- **Preview Deployments:**
  - Created automatically for all branches (except production branch)
  - Temporary URLs: `studio-git-<branch-name>-xxx.vercel.app`
  - Use preview environment variables
  - Safe to test without affecting production

- **Production Deployment:**
  - Only from `main` branch (or your configured production branch)
  - Deploys to `studio.vitalicesf.com`
  - Uses production environment variables
  - Requires merge to `main`

---

## Vercel Configuration

### Project Settings

**Root Directory:**

```
apps/studio
```

**Framework Preset:**

```
Next.js
```

**Build Command:**

```
pnpm run build
```

⚠️ **Important:** Since root directory is `apps/studio`, Vercel already runs from that directory. Don't include `cd apps/studio` in the build command.

**Output Directory:**

```
.next
```

**Install Command:**

```
cd ../.. && pnpm install
```

⚠️ **Important:** For monorepos, install must run from the repository root to install all workspace dependencies. The `cd ../..` navigates from `apps/studio` back to the repo root. Use `pnpm` (not `npm`) since this is a pnpm monorepo.

**Optional: Create `vercel.json`**

You can also create `apps/studio/vercel.json` to ensure Vercel uses the correct settings:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs"
}
```

This file is already created in your repo and will override Vercel dashboard settings.

**Node.js Version:**

```
20.x
```

_(Important: Sanity requires Node 20.19+ or 22.12+, avoid 22.4.1)_

---

## Environment Variables

### Required (All Environments)

Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable                        | Value                  | Environment |
| ------------------------------- | ---------------------- | ----------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | All         |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production`           | All         |
| `SANITY_API_TOKEN`              | Your API token         | All         |

### Production Only

| Variable          | Value               | Environment |
| ----------------- | ------------------- | ----------- |
| `STUDIO_USERNAME` | Basic Auth username | Production  |
| `STUDIO_PASSWORD` | Basic Auth password | Production  |

**Security Note:** See [ENV_SECURITY.md](./ENV_SECURITY.md) for details on which variables are public vs. private.

**Preview Environment Variables:**

- Vercel automatically uses "Preview" environment variables for feature branch deployments
- You can set different values for preview vs production in Vercel dashboard
- Useful for testing with different Sanity datasets or API tokens

---

## Cloudflare DNS Setup

### Step 1: Add Domain in Vercel (Get the CNAME Target)

1. **Go to Vercel Dashboard:**
   - Navigate to your **Studio Project** (not the web app project)
   - Click **Settings** → **Domains**

2. **Add the domain:**
   - Click **"Add Domain"** or **"Add"** button
   - Enter: `studio.vitalicesf.com`
   - Click **"Add"** or **"Continue"**

3. **Vercel will show you DNS configuration:**
   - You'll see a screen with DNS records needed
   - Look for a **CNAME** record
   - The **Target/Value** field will show something like:
     - `cname.vercel-dns.com`
     - `cname-xyz.vercel-dns.com`
     - `76d4c8.vercel-dns.com` (unique to your project)

4. **Copy the CNAME target:**
   - **This is what you'll use in Cloudflare**
   - It's unique to your Vercel project
   - Copy the entire value (e.g., `cname.vercel-dns.com`)

5. **Note the domain status:**
   - Initially it will show **"Invalid Configuration"** (red)
   - This is normal - it will change to **"Valid Configuration"** (green) after you add the DNS record in Cloudflare

### Step 2: Add CNAME Record in Cloudflare

1. Log into **Cloudflare Dashboard**
2. Select your domain: **`vitalicesf.com`**
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Fill in the fields:

   **Type:**

   ```
   CNAME
   ```

   **Name:**

   ```
   studio
   ```

   ⚠️ **Important:** Just type `studio` (NOT `studio.vitalicesf.com`). Cloudflare automatically adds your domain.

   **Target:**

   ```
   cname.vercel-dns.com
   ```

   ⚠️ **Important:** Paste the exact CNAME target that Vercel provided in Step 1.

   **Proxy status:**
   - ✅ **Proxied** (orange cloud icon) - **Recommended**
     - Routes traffic through Cloudflare's CDN
     - Provides DDoS protection
     - Hides your origin IP
     - Free SSL via Cloudflare
   - ⚠️ **DNS only** (grey cloud icon) - Only use if you need direct DNS resolution
     - No CDN benefits
     - No DDoS protection
     - Origin IP visible

   **TTL:**

   ```
   Auto
   ```

   (Cloudflare will manage this automatically)

6. Click **"Save"**

### Step 3: Verify

1. **Wait 5-15 minutes** for DNS propagation
2. **Check Vercel dashboard:**
   - Go to Project Settings → Domains
   - `studio.vitalicesf.com` should show **"Valid Configuration"** (green checkmark)
   - Vercel will automatically provision SSL certificate (may take a few minutes)
3. **Test the domain:**
   - Visit `https://studio.vitalicesf.com`
   - Should load your Sanity Studio
   - Should show a valid SSL certificate (lock icon in browser)

### Example CNAME Record

**In Cloudflare DNS Records, it should look like:**

```
Type: CNAME
Name: studio
Target: cname.vercel-dns.com  (or your unique Vercel target)
Proxy: 🟠 Proxied (orange cloud)
TTL: Auto
```

**What this does:**

- Creates: `studio.vitalicesf.com` → `cname.vercel-dns.com` (via Cloudflare CDN)
- Routes traffic through Cloudflare's CDN
- Provides DDoS protection and caching

### Where to Find the Target Value

**If you need to find it again:**

1. **Vercel Dashboard** → Your Studio Project → **Settings** → **Domains**
2. Click on `studio.vitalicesf.com`
3. You'll see the DNS configuration with the CNAME target
4. Copy the value from the **Target/Value** field

**The target is unique to:**

- Your Vercel project
- Your domain
- It won't change unless you remove and re-add the domain

---

## Setup Checklist

### Vercel:

- [ ] Create **separate** project: `vital-ice-studio` (NOT the same as web app)
- [ ] **Root Directory:** `apps/studio` ⚠️ **CRITICAL - Must be set correctly**
- [ ] **Build Command:** `pnpm run build` (or leave empty - `vercel.json` handles it)
- [ ] **Output Directory:** `.next`
- [ ] **Install Command:** `cd ../.. && pnpm install` ⚠️ **Must install from monorepo root using pnpm**
- [ ] **Node Version:** `20.x`
- [ ] Add environment variables (see above)
- [ ] Add custom domain: `studio.vitalicesf.com`

**⚠️ Important:** Make sure you're configuring the **Studio project**, not the web app project. They are separate projects in Vercel.

### Cloudflare:

- [ ] Add CNAME record: `studio` → Vercel's target
- [ ] Set proxy to Proxied (orange cloud)
- [ ] Verify DNS propagation

### Testing:

- [ ] Visit `studio.vitalicesf.com` (should show Studio)
- [ ] Verify Basic Auth works (production)
- [ ] Test content editing
- [ ] Verify SSL certificate (HTTPS)

---

## Verification Checklist

Before deploying, verify your Vercel project is configured correctly:

### Check Project Settings

1. **Go to Vercel Dashboard** → Your Studio Project (make sure it's the studio project, not web)
2. **Settings → General:**
   - Root Directory: `apps/studio` ✅
   - Framework Preset: `Next.js` ✅
   - Build Command: `pnpm run build` (or empty - uses `vercel.json`) ✅
   - Output Directory: `.next` ✅
   - Install Command: `cd ../.. && pnpm install` ✅
   - Node.js Version: `20.x` ✅

3. **Check Build Log:**
   - Should show: `Running "pnpm run build"` (not `cd apps/web && pnpm run build`)
   - Should show: `> vital-ice-studio@0.1.0 build` (not `> website@0.1.0 build`)
   - Should show: `Creating an optimized production build` from `apps/studio`

### Common Mistakes

❌ **Wrong:** Root Directory is empty or set to root  
✅ **Correct:** Root Directory is `apps/studio`

❌ **Wrong:** Install Command is `npm install` or `pnpm install` (runs from `apps/studio`, missing workspace deps)  
✅ **Correct:** Install Command is `cd ../.. && pnpm install` (runs from repo root)

❌ **Wrong:** Building the web app project instead of studio project  
✅ **Correct:** Make sure you're in the **Studio project** in Vercel dashboard

---

## Troubleshooting

### Build Fails: "Node version not supported"

**Problem:** Node.js version 22.4.1 is not supported by Sanity

**Solution:**

- **Option 1 (Recommended):** Use Node.js 20.x

  ```bash
  # Using nvm (if installed)
  nvm install 20
  nvm use 20

  # Or download from nodejs.org
  ```

- **Option 2:** Upgrade to Node.js 22.12+ (if you need Node 22)
- **For Vercel:** Set Node version to `20.x` in project settings

**Supported versions:** `>=20.19 <22 || >=22.12`

### Build Fails: "Cannot find module"

- Ensure root directory is set to `apps/studio`
- Check that install command runs from monorepo root: `cd ../.. && pnpm install`
- **If you see "No such file or directory" for `apps/studio`:**
  - Your build command should be `pnpm run build` (NOT `cd apps/studio && pnpm run build`)
  - When root directory is `apps/studio`, Vercel already runs from that directory

### Build Fails: "routes-manifest.json couldn't be found"

- **This means Vercel is building the wrong app (web instead of studio)**
- **Root cause:** Vercel is reading the root `vercel.json` (for web app) instead of `apps/studio/vercel.json`

**Fix Steps:**

1. **Verify Vercel Project Settings:**
   - Go to Vercel Dashboard → Studio Project → Settings → General
   - **Root Directory:** Must be `apps/studio` (not empty, not root)
   - This tells Vercel to look for `vercel.json` in `apps/studio/`, not root

2. **Verify Build Settings:**
   - **Build Command:** `pnpm run build` (or leave empty - `vercel.json` will handle it)
   - **Output Directory:** `.next`
   - **Install Command:** `cd ../.. && pnpm install` (or leave empty - `vercel.json` will handle it)

3. **Check `apps/studio/vercel.json` exists:**

   ```bash
   cat apps/studio/vercel.json
   ```

   Should contain:

   ```json
   {
     "buildCommand": "pnpm run build",
     "outputDirectory": ".next",
     "installCommand": "cd ../.. && pnpm install",
     "framework": "nextjs"
   }
   ```

4. **If still not working:**
   - The root `vercel.json` might be interfering
   - Try explicitly setting all settings in Vercel dashboard (override `vercel.json`)
   - Or temporarily rename root `vercel.json` to test

5. **Verify you're deploying the right project:**
   - Make sure you're looking at the **Studio project** in Vercel dashboard
   - Not the main web app project
   - They should be separate projects

### Output Directory Not Found

- Verify output directory is `.next` (not `.sanity`)
- Check that build completed successfully

### DNS Not Resolving

**Check these:**

1. **Name field is correct:**
   - Should be just `studio` (not `studio.vitalicesf.com`)
   - Cloudflare automatically appends your domain

2. **Target matches exactly:**
   - Copy/paste the exact value from Vercel (case-sensitive)
   - Should look like: `cname.vercel-dns.com` or `cname-xyz.vercel-dns.com`
   - No trailing dots or spaces

3. **Wait for propagation:**
   - DNS changes can take 5-15 minutes (sometimes up to 48 hours)
   - Check with: `dig studio.vitalicesf.com` or `nslookup studio.vitalicesf.com`

4. **Verify in Cloudflare:**
   - DNS → Records → Find your CNAME
   - Should show "Proxied" (orange cloud) or "DNS only" (grey cloud)
   - Target should match Vercel's value exactly

5. **Check Vercel dashboard:**
   - Settings → Domains → `studio.vitalicesf.com`
   - Should show "Valid Configuration" (green checkmark)
   - If it shows an error, click it to see details

### Environment Variables Not Working

- Ensure variables are set for correct environment (Production/Preview)
- Check variable names match exactly (case-sensitive)
- Verify `NEXT_PUBLIC_` prefix for client-side variables

---

## Related Documentation

- [ENV_SECURITY.md](./ENV_SECURITY.md) - Environment variables security
- [SECURITY.md](./SECURITY.md) - Basic Auth configuration
- [README.md](./README.md) - Studio overview
