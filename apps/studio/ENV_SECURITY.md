# Environment Variables Security Guide

## ⚠️ Important: Which Variables Are Public?

### Public (Visible in Browser) 🔓

Variables with `NEXT_PUBLIC_` prefix are **bundled into the client-side JavaScript** and can be viewed by anyone:

- ✅ **`NEXT_PUBLIC_SANITY_PROJECT_ID`** - **PUBLIC** (safe to expose)
  - This is your Sanity project ID
  - It's meant to be public - Sanity expects this to be client-accessible
  - Anyone can see this in the browser's JavaScript bundle
  - **This is normal and safe** - project IDs are not secret

- ✅ **`NEXT_PUBLIC_SANITY_DATASET`** - **PUBLIC** (safe to expose)
  - Dataset name (usually "production")
  - Also meant to be public
  - Visible in browser JavaScript
  - **This is normal and safe**

### Private (Server-Side Only) 🔒

Variables **without** `NEXT_PUBLIC_` prefix are **server-side only** and **NOT visible** to users:

- 🔒 **`SANITY_API_TOKEN`** - **PRIVATE** (keep secret!)
  - This is your API token with write permissions
  - **NOT exposed to the browser**
  - Only accessible on the server
  - **Never commit to git**
  - **Safe in Vercel environment variables**

- 🔒 **`STUDIO_USERNAME`** - **PRIVATE** (production only)
  - Basic Auth username
  - **NOT exposed to the browser**
  - Only used server-side in middleware
  - **Safe in Vercel environment variables**

- 🔒 **`STUDIO_PASSWORD`** - **PRIVATE** (production only)
  - Basic Auth password
  - **NOT exposed to the browser**
  - Only used server-side in middleware
  - **Safe in Vercel environment variables**

---

## Security Best Practices

### ✅ Safe to Expose (NEXT*PUBLIC*)

These are **intentionally public** and safe:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID  # Public - needed for client-side Sanity queries
NEXT_PUBLIC_SANITY_DATASET     # Public - needed for client-side Sanity queries
```

**Why they're safe:**

- Sanity project IDs are not secret
- They're used for read-only queries
- Sanity uses token-based authentication for write operations
- Anyone can see these in your website's JavaScript (this is normal)

### 🔒 Keep Secret (No NEXT*PUBLIC*)

These are **server-side only** and secure:

```bash
SANITY_API_TOKEN    # Secret - has write permissions
STUDIO_USERNAME     # Secret - Basic Auth credential
STUDIO_PASSWORD     # Secret - Basic Auth credential
```

**Why they're secure:**

- Not included in client-side JavaScript bundle
- Only accessible on the server
- Vercel environment variables are encrypted and secure
- Never exposed to the browser

---

## How to Verify

### Check What's Public:

1. **Build your app:**

   ```bash
   cd apps/studio
   npm run build
   ```

2. **Search the build output:**

   ```bash
   grep -r "NEXT_PUBLIC_SANITY_PROJECT_ID" .next/
   # You'll find it - this is expected and safe

   grep -r "SANITY_API_TOKEN" .next/
   # Should find NOTHING - this is secure ✅
   ```

3. **Check browser:**
   - Open browser DevTools → Sources
   - Search for `NEXT_PUBLIC_SANITY_PROJECT_ID` - you'll see it
   - Search for `SANITY_API_TOKEN` - you won't find it ✅

---

## Vercel Environment Variables Security

### ✅ Vercel Protects Your Secrets

- Environment variables are **encrypted at rest**
- Only accessible during build/runtime
- **NOT visible** in:
  - Build logs (values are masked)
  - Deployment previews
  - Public repositories
  - Browser JavaScript (unless `NEXT_PUBLIC_`)

### 🔒 What Vercel Shows:

- **Variable names:** Visible in dashboard
- **Variable values:** Hidden/masked in logs
- **In code:** Only `NEXT_PUBLIC_` variables are exposed

---

## Current Variable Security Status

### Your Variables:

| Variable                        | Prefix         | Visibility       | Security                     |
| ------------------------------- | -------------- | ---------------- | ---------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `NEXT_PUBLIC_` | Public (browser) | ✅ Safe (meant to be public) |
| `NEXT_PUBLIC_SANITY_DATASET`    | `NEXT_PUBLIC_` | Public (browser) | ✅ Safe (meant to be public) |
| `SANITY_API_TOKEN`              | None           | Server-only      | 🔒 Secure (not exposed)      |
| `STUDIO_USERNAME`               | None           | Server-only      | 🔒 Secure (not exposed)      |
| `STUDIO_PASSWORD`               | None           | Server-only      | 🔒 Secure (not exposed)      |

---

## Important Notes

### ✅ Safe Practices:

1. **Project ID is public by design**
   - Sanity expects this to be client-accessible
   - Used for read-only queries
   - Not a security risk

2. **API Token is secure**
   - No `NEXT_PUBLIC_` prefix = server-side only
   - Never exposed to browser
   - Safe in Vercel environment variables

3. **Basic Auth credentials are secure**
   - Server-side only
   - Used in middleware
   - Not exposed to client

### ⚠️ What NOT to Do:

1. **Don't add `NEXT_PUBLIC_` to secrets:**

   ```bash
   # ❌ WRONG - This would expose your token!
   NEXT_PUBLIC_SANITY_API_TOKEN=...

   # ✅ CORRECT - Server-side only
   SANITY_API_TOKEN=...
   ```

2. **Don't commit tokens to git:**
   - Use `.env.local` (already in `.gitignore`)
   - Use Vercel environment variables
   - Never commit actual token values

3. **Don't log tokens:**
   - Avoid `console.log(process.env.SANITY_API_TOKEN)`
   - Vercel automatically masks them in logs

---

## Summary

**Question: Will env variables be viewable by anyone?**

**Answer:**

- ✅ **`NEXT_PUBLIC_*` variables:** Yes, visible in browser (this is safe and expected)
- 🔒 **Non-`NEXT_PUBLIC_` variables:** No, server-side only and secure

**Your setup is secure:**

- Project ID and Dataset are public (safe - meant to be)
- API Token is private (secure - server-side only)
- Auth credentials are private (secure - server-side only)

**Vercel environment variables are encrypted and secure.** Only variables with `NEXT_PUBLIC_` prefix are exposed to the client, and that's intentional for Sanity's client-side queries.

---

## Verification Checklist

- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` - Public (safe ✅)
- [ ] `NEXT_PUBLIC_SANITY_DATASET` - Public (safe ✅)
- [ ] `SANITY_API_TOKEN` - Private (secure 🔒)
- [ ] `STUDIO_USERNAME` - Private (secure 🔒)
- [ ] `STUDIO_PASSWORD` - Private (secure 🔒)
- [ ] No secrets have `NEXT_PUBLIC_` prefix ✅
- [ ] All secrets are in Vercel environment variables (not committed) ✅

**Your configuration is secure!** 🔒
