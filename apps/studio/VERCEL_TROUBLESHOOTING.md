# Vercel Deployment Troubleshooting

## Error: "No Next.js version detected"

This error occurs when Vercel cannot detect Next.js in your project. For monorepos, this can happen if framework detection runs before dependencies are installed.

## Solution Steps

### 1. Verify Vercel Dashboard Settings

Go to **Vercel Dashboard → Your Studio Project → Settings → General** and ensure:

- **Root Directory:** `apps/studio` ✅
- **Framework Preset:** `Next.js` (explicitly set, NOT "Other" or "Auto-detect") ✅
- **Build Command:** `pnpm run build` ✅
- **Install Command:** `cd ../.. && pnpm install` ✅
- **Output Directory:** `.next` ✅
- **Node.js Version:** `20.x` ✅

**Critical:** The Framework Preset MUST be explicitly set to "Next.js" in the dashboard. If it's set to "Other" or "Auto-detect", Vercel will try to detect the framework before running the install command, which fails for monorepos.

### 2. Verify package.json

Ensure `apps/studio/package.json` has `next` in dependencies:

```json
{
  "dependencies": {
    "next": "^16.0.8"
  }
}
```

### 3. Try Alternative: Remove Install Command Override

Sometimes Vercel's auto-detection works better. Try:

1. In Vercel Dashboard → Settings → General
2. **Clear the "Install Command" field** (leave it empty)
3. Vercel will auto-detect: `pnpm install`
4. This should work if Root Directory is correctly set

### 4. Verify vercel.json

Ensure `apps/studio/vercel.json` exists and has:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs"
}
```

### 5. Check Build Logs

Look for these in the build logs:

- ✅ `Detected pnpm-lock.yaml` - Good, Vercel detected pnpm
- ✅ `Running "install" command` - Good, install is running
- ❌ `Warning: Could not identify Next.js version` - This is the problem
- ❌ `Error: No Next.js version detected` - Framework detection failed

### 6. Nuclear Option: Create Root vercel.json

If nothing else works, create a root-level `vercel.json`:

```json
{
  "builds": [
    {
      "src": "apps/studio/package.json",
      "use": "@vercel/next"
    }
  ]
}
```

But this is usually not necessary if Framework Preset is correctly set.

## Most Common Fix

**90% of the time, the issue is Framework Preset not being explicitly set in the Vercel Dashboard.**

1. Go to Vercel Dashboard → Your Studio Project → Settings → General
2. Find "Framework Preset"
3. Change it from "Other" or "Auto-detect" to **"Next.js"**
4. Save
5. Redeploy

This tells Vercel to skip auto-detection and just use Next.js, which prevents the detection-before-install issue.

## If Framework Preset is Already Set to Next.js

If you've already set Framework Preset to Next.js but still get the error, try these steps in order:

### Step 1: Clear Install Command Override

1. In Vercel Dashboard → Settings → General
2. **Clear the "Install Command" field completely** (delete `cd ../.. && pnpm install`)
3. Leave it empty
4. Save and redeploy

Vercel will auto-detect `pnpm install` and run it from the Root Directory (`apps/studio`). This sometimes works better than the manual override.

### Step 2: Verify Root vercel.json Isn't Interfering

The root `vercel.json` (for the web app) might be interfering. Check:

1. Root `vercel.json` has `"rootDirectory": "apps/web"` - this is correct for the web app
2. Studio project in Dashboard has Root Directory: `apps/studio` - this should be separate

**If the Studio project is accidentally reading the root vercel.json:**
- Make sure you created a **separate Vercel project** for the Studio (not using the same project as the web app)
- The Studio project should be named something like `vital-ice-studio` (different from the web app project)

### Step 3: Force Fresh Install

Update `apps/studio/vercel.json` to force a fresh install:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && rm -rf node_modules apps/studio/node_modules && pnpm install"
}
```

This clears any cached node_modules and forces a fresh install.

### Step 4: Check pnpm Workspace Configuration

In a pnpm monorepo, dependencies might be hoisted to the root. Vercel might be looking for Next.js in `apps/studio/node_modules` but it's in the root `node_modules`.

**Temporary workaround:** Add a `.npmrc` file in `apps/studio/`:

```ini
shamefully-hoist=true
```

This forces pnpm to create a local `node_modules` in `apps/studio/` with all dependencies, making Next.js easier for Vercel to find.

### Step 5: Nuclear Option - Separate Repository (Last Resort)

If nothing works, the issue might be Vercel's monorepo detection. As a last resort:
1. Create a separate git repository for just the Studio
2. Deploy that as a standalone Next.js project
3. This eliminates all monorepo complexity

But this should only be necessary if all other steps fail.
