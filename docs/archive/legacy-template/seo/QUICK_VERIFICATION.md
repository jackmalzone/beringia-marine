# Quick SEO Verification Guide

**Quick reference for verifying SEO fixes**

---

## 🚀 Quick Start

Run the verification script:

```bash
./scripts/verify-seo.sh
```

Or manually check these key points:

---

## ✅ 1. Sitemap (30 seconds)

**Visit**: `https://www.vitalicesf.com/sitemap.xml`

**Check**:

- ✅ Sitemap loads successfully
- ✅ Contains insights articles (should see `/insights/[slug]` URLs)
- ✅ Includes all service pages
- ✅ Includes main pages (home, about, contact, etc.)

**Expected**: 20+ URLs including all published articles

---

## ✅ 2. Canonical URLs (1 minute)

**Canonical source of truth:** Use the HTTP response (curl). View Source (Cmd+U) is secondary.

```bash
curl -s https://www.vitalicesf.com/insights/holiday-glow-red-light-therapy-christmas | grep -i 'rel="canonical"'
```

- Should see: `rel="canonical"` and `href=".../insights/holiday-glow-red-light-therapy-christmas"`
- ✅ Canonical URL should match the page URL exactly

---

## ✅ 3. Content in HTTP Response / Page Source (2 minutes)

**Canonical:** Verify via curl (HTTP response body). View Page Source (Cmd+U) is secondary; it can be misleading with streaming.

```bash
curl -s https://www.vitalicesf.com/services | grep -i "Cold Plunge"
curl -s https://www.vitalicesf.com/services | grep -i "<h1"
curl -s https://www.vitalicesf.com/services | grep -i 'href="/services/cold-plunge"'
```

- ✅ Should find "Cold Plunge", `<h1>`, and service links in the response
- Or run: `pnpm --filter @vital-ice/web ssr:audit` (with `BASE_URL` or `SSR_AUDIT_BASE_URL` set to your URL)

**If not found**: Content may be client-side only (needs architectural fix)

---

## ✅ 4. Navigation Links (1 minute)

**Visit**: `https://www.vitalicesf.com/services`

**HTTP response (curl) or View page source** — search for:

- `href="/book"`
- `href="/about"`
- `href="/contact"`
- `href="/insights"`

**Expected**: Should find all navigation links in HTML source

---

## ✅ 5. Screaming Frog Test (5 minutes)

1. **Open Screaming Frog SEO Spider**
2. **Mode**: Spider
3. **Start URL**: `https://www.vitalicesf.com`
4. **Rendering**: Start with **Text Only** (no JS) to align with raw HTML (what crawlers get). Optionally run a second crawl with **JavaScript Rendering** to compare.
5. **Settings** (if using JS crawl): Wait time 3–5 seconds
6. **Click Start**

**Expected Results**:

- ✅ Discovers more than just homepage
- ✅ Finds all service pages
- ✅ Finds insights articles (if in sitemap or linked)
- ✅ Total: 20+ pages discovered

**If only homepage found**:

- Check that JavaScript rendering is enabled
- Verify links are in HTML (use View Page Source check above)

---

## ✅ 6. Google URL Inspection (2 minutes)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select property: `https://www.vitalicesf.com`
3. Use URL Inspection tool
4. Enter URL: `/services/cold-plunge`
5. Click "Test Live URL"
6. Check "Screenshot" tab

**Expected**:

- ✅ Screenshot shows actual page content (not blank)
- ✅ "Rendered HTML" contains full content

---

## 🎯 Most Important Checks

**Priority 1 - Must Verify**:

1. ✅ Sitemap includes articles (Issue 1 - FIXED)
2. ✅ Canonical URLs match exact URLs (Issue 2 - FIXED)
3. ✅ Links in page source (Issue 4 - Screaming Frog)

**Priority 2 - Should Verify**: 4. ⚠️ Content in page source (Issue 3 - Full SSR)

- Current: May be client-side (architectural limitation)
- Expected: Should be in HTML for production builds

---

## 🐛 Troubleshooting

### Content not in page source?

**Check**:

1. Are you using "View Page Source" (not Inspect Element)?
2. Are you testing on production? (Dev mode may not SSR fully)
3. Try production build locally: `pnpm build && pnpm start`

### Screaming Frog only finds homepage?

**Check**:

1. JavaScript rendering enabled?
2. Links actually in HTML? (use View Page Source)
3. Sitemap accessible? (`/sitemap.xml`)

### Canonical URL wrong?

**Check**:

1. Article page metadata generation
2. Should use: `https://www.vitalicesf.com/insights/[slug]`
3. Not relative path

---

## 📋 Verification Checklist

Copy this checklist for your verification:

```
[ ] Sitemap accessible at /sitemap.xml
[ ] Sitemap includes insights articles
[ ] Article canonical URLs match exact page URLs
[ ] Navigation links found in page source
[ ] Service links found in page source
[ ] H1 tags found in page source
[ ] Content visible in page source (services page)
[ ] Screaming Frog discovers all pages
[ ] Google URL Inspection shows content
```

---

**Last Updated**: January 2026
