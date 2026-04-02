# SEO Verification Guide

**Date**: January 2026  
**Purpose**: Step-by-step guide to verify all SEO fixes and implementations

---

## Quick Verification Checklist

- [ ] Sitemap includes all articles
- [ ] Canonical URLs match exact page URLs
- [ ] Content visible in HTTP response / page source (curl is canonical; View Source secondary)
- [ ] Navigation links in HTML source
- [ ] Screaming Frog discovers all pages
- [ ] Google URL Inspection shows content

---

## 1. Verify Dynamic Sitemap

### Method 1: Direct URL Check

1. **Visit the sitemap URL**:
   ```
   https://www.vitalicesf.com/sitemap.xml
   ```

2. **Check for insights articles**:
   - Should see URLs like: `https://www.vitalicesf.com/insights/[article-slug]`
   - Verify all published articles are listed
   - Check that new articles appear after publishing

3. **Verify structure**:
   - Should contain static pages (home, services, etc.)
   - Should contain all 6 service pages
   - Should contain all insights articles dynamically

### Method 2: Command Line Check

```bash
# Fetch sitemap and check for articles
curl https://www.vitalicesf.com/sitemap.xml | grep -i "insights"

# Count total URLs
curl https://www.vitalicesf.com/sitemap.xml | grep -c "<url>"
```

### Method 3: Browser DevTools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit `https://www.vitalicesf.com/sitemap.xml`
4. Check response contains article URLs
5. Verify `lastModified` dates are recent

### Expected Results

✅ Sitemap should include:
- All static pages (home, services, book, about, contact, etc.)
- All 6 service pages
- All published insights articles
- Proper priorities and change frequencies

---

## 2. Verify Canonical URLs

**Canonical check:** The HTTP response body (e.g. curl) is the canonical source; View Source (Ctrl+U) is secondary (streaming can make View Source misleading).

### Method 1: Command line (curl) — primary

```bash
curl -s https://www.vitalicesf.com/insights/holiday-glow-red-light-therapy-christmas | \
  grep -i 'rel="canonical"' | head -1
```

### Method 2: View Page Source (secondary)

1. **Open an article page**:
   ```
   https://www.vitalicesf.com/insights/holiday-glow-red-light-therapy-christmas
   ```

2. **View page source** (Right-click → View Page Source, or `Ctrl+U` / `Cmd+U`)

3. **Search for canonical** (Ctrl+F / Cmd+F, search for "canonical")

4. **Verify the tag**:
   ```html
   <link rel="canonical" href="https://www.vitalicesf.com/insights/holiday-glow-red-light-therapy-christmas" />
   ```

5. **Check it matches**:
   - Canonical URL should match the page URL exactly
   - Should use `https://www.vitalicesf.com` (not relative path)
   - Should include the full path including slug

### Method 3: Browser DevTools Elements Tab

1. Open DevTools (F12)
2. Go to Elements tab
3. Find `<head>` section
4. Look for `<link rel="canonical">` tag
5. Verify `href` attribute matches page URL

### Expected Results

✅ Canonical URL should:
- Match exact page URL: `https://www.vitalicesf.com/insights/[slug]`
- Use absolute URL (not relative)
- Include `www` subdomain
- Be in the `<head>` section

---

## 3. Verify Server-Side Rendered Content

### Canonical source of truth: HTTP response body (curl)

**The canonical way to verify SEO content is the raw HTTP response body** (e.g. `curl <url>` or any plain HTTP client). This is what crawlers and tools like Screaming Frog see when not using JavaScript rendering. View Page Source (Ctrl+U) can be misleading due to streaming; use it only as a secondary check.

### Method 1: Command line (curl) — primary

```bash
# Fetch page HTML
curl -s https://www.vitalicesf.com/services > page-source.html

# Search for content
grep -i "Cold Plunge" page-source.html
grep -i "Our Services" page-source.html
grep -o '<a[^>]*href[^>]*>' page-source.html | head -20

# Check for navigation links
grep -i "href=\"/services/" page-source.html
```

Or use the SSR audit script (Layer 2): `pnpm --filter @vital-ice/web ssr:audit` (set `BASE_URL` or `SSR_AUDIT_BASE_URL` to the deployed or local URL).

### Method 2: View Page Source (secondary)

1. **Navigate to a page** (e.g., `/services`)
2. **View page source**: Right-click → View Page Source, or `Ctrl+U` (Windows) / `Cmd+U` (Mac)
3. **Search for content** (Ctrl+F): service titles (e.g. "Cold Plunge"), `<h1>`, links
4. **Verify**: Content, links, and H1/H2 should be present in source. If not found, content may be client-side only.

**Note:** Inspect Element shows the DOM after JavaScript execution; for SSR verification, prefer the raw response (curl) or View Page Source.

### Method 3: Disable JavaScript

1. **Open browser DevTools** (F12)
2. **Go to Settings** (gear icon) or `F1`
3. **Check "Disable JavaScript"**
4. **Refresh the page**
5. **Check if content is visible**:
   - ✅ If visible → content is server-rendered
   - ❌ If blank → content is client-side only

### Method 4: Check Network Response

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Doc" (document)
4. Refresh page
5. Click on the main document request
6. Go to "Response" tab
7. Search for content in the raw HTML response

### Expected Results for Each Page Type

#### Services Page (`/services`)
✅ Should find in source:
- H1: "Our Services"
- Service titles: "Cold Plunge", "Infrared Sauna", etc.
- Links to service pages: `/services/cold-plunge`, `/services/infrared-sauna`, etc.
- Navigation links: `/`, `/book`, `/about`, `/contact`, etc.

#### Home Page (`/`)
✅ Should find in source:
- H1: Main heading
- Service descriptions or links
- Navigation links
- Hero content text

#### Article Pages (`/insights/[slug]`)
✅ Should find in source:
- H1: Article title
- Article content (at least first paragraph)
- Navigation links
- Author information

---

## 4. Verify Navigation Links in HTML

### Method 1: View Page Source Search

1. **View page source** (as described above)

2. **Search for navigation**:
   ```html
   <!-- Look for these patterns -->
   <nav
   <a href="/"
   <Link href="/"
   href="/services"
   href="/book"
   ```

3. **Verify main navigation links**:
   - `/` (Home)
   - `/services`
   - `/book`
   - `/about`
   - `/experience`
   - `/contact`
   - `/insights`

4. **Verify service links** (on services page):
   - `/services/cold-plunge`
   - `/services/infrared-sauna`
   - `/services/traditional-sauna`
   - `/services/red-light-therapy`
   - `/services/compression-boots`
   - `/services/percussion-massage`

### Method 2: Extract All Links

```bash
# Extract all internal links from page source
curl -s https://www.vitalicesf.com/services | \
  grep -oE 'href="(/[^"]+)"' | \
  sort -u
```

### Expected Results

✅ Should find:
- Main navigation links in `<head>` or early in `<body>`
- Service card links (if on services page)
- Footer links
- Internal links throughout content

---

## 5. Verify Screaming Frog Discovery

### Prerequisites

1. **Install Screaming Frog SEO Spider**
   - Download from: https://www.screamingfrog.co.uk/seo-spider/
   - Free version works for up to 500 URLs

2. **Configure Settings**:
   - Mode: "Spider" (not "List")
   - JavaScript rendering: **ENABLED** (important!)
   - Rendering: Use "JavaScript Rendering" option

### Method 1: Basic Crawl Test

1. **Open Screaming Frog**
2. **Enter start URL**: `https://www.vitalicesf.com`
3. **Configure**:
   - Mode: Spider
   - Check "JavaScript Rendering"
   - Wait time: 3-5 seconds (for JS to load)
4. **Click "Start"**
5. **Monitor progress**:
   - Should discover more than just homepage
   - Check "Internal" tab
   - Should see service pages, article pages, etc.

### Method 2: Check Discovery Sources

1. **After crawl, go to "Internal" tab**
2. **Check "Inlinks" column**:
   - Should show how each page was discovered
   - Look for pages discovered via internal links (not just sitemap)
3. **Go to "Response Codes" tab**:
   - Should see 200 OK for all pages
   - Check if any pages weren't discovered

### Method 3: Test from Sitemap

1. **Mode: List** (not Spider)
2. **Import from**: `https://www.vitalicesf.com/sitemap.xml`
3. **Check "JavaScript Rendering"**
4. **Click "Start"**
5. **Verify all URLs from sitemap are crawled**

### Expected Results

✅ Screaming Frog should discover:
- Homepage (entry point)
- All service pages (via navigation or service cards)
- All insights articles (via sitemap or internal links)
- About, Contact, Book, Experience pages (via navigation)
- At least 20+ pages total

❌ If only homepage discovered:
- JavaScript rendering may not be working
- Internal links may not be in HTML
- Check that links are in page source (see Method 1 above)

---

## 6. Verify Google URL Inspection

### Method 1: Google Search Console

1. **Go to**: https://search.google.com/search-console
2. **Select property**: `https://www.vitalicesf.com`
3. **Use URL Inspection tool** (top search bar)
4. **Enter URL** (e.g., `/services/cold-plunge`)
5. **Click "Test Live URL"**
6. **Check "Screenshot" tab**:
   - ✅ Should show actual page content
   - ❌ If blank/white → content not server-rendered

### Method 2: Check Rendered HTML

1. **In URL Inspection, click "View Tested Page"**
2. **Check "HTML" tab**:
   - Should see full HTML content
   - Search for service descriptions, links, etc.
3. **Compare with "Page Source"**:
   - Should match what we see in View Page Source
   - If different, content may be client-rendered

### Expected Results

✅ URL Inspection should show:
- Screenshot with actual content (not blank)
- Rendered HTML contains full content
- All navigation links present
- Meta tags and structured data present

---

## 7. Verify Client Component SSR

### The Question: Are client components rendering content in initial HTML?

This is the critical question for Issue 3 (Full Server-Side Rendering).

### Method 1: Compare Production Build vs Dev

**Development Mode** (doesn't fully SSR):
```bash
# Start dev server
pnpm dev

# Check page source - may not show client component content
curl http://localhost:3000/services | grep -i "Cold Plunge"
```

**Production Build** (true SSR):
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Check page source - should show content
curl http://localhost:3000/services | grep -i "Cold Plunge"
```

⚠️ **Important**: Only production builds do true SSR. Development mode may not show content in source.

### Method 2: Check for Bailout Messages

1. **View page source**
2. **Search for**: `BAILOUT_TO_CLIENT_SIDE_RENDERING`
3. **If found**: Indicates client-side rendering occurred
4. **Note**: Some bailouts are expected (for interactive components)

### Method 3: Network Tab Analysis

1. **Open DevTools → Network tab**
2. **Filter by "Doc"**
3. **Refresh page**
4. **Click main document request**
5. **Response tab**: Shows raw HTML from server
6. **Check if client component content is in response**:
   - ✅ If yes → SSR is working
   - ❌ If no → content rendered client-side

### Method 4: Check for React Hydration

1. **View page source**
2. **Search for**: `__next` or React comments
3. **Look for component structure**:
   - If you see component structure → SSR working
   - If minimal HTML → client-side rendering

---

## 8. Automated Verification Script

Create a simple script to verify all checks:

```bash
#!/bin/bash
# verify-seo.sh

BASE_URL="https://www.vitalicesf.com"

echo "=== SEO Verification Script ==="
echo ""

# 1. Check sitemap
echo "1. Checking sitemap..."
SITEMAP_COUNT=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "<url>")
echo "   Found $SITEMAP_COUNT URLs in sitemap"

# 2. Check for insights articles in sitemap
INSIGHTS_COUNT=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "insights/")
echo "   Found $INSIGHTS_COUNT insights articles in sitemap"

# 3. Check canonical URL on article page
echo ""
echo "2. Checking canonical URL..."
CANONICAL=$(curl -s "$BASE_URL/insights/holiday-glow-red-light-therapy-christmas" | \
  grep -oE '<link[^>]*rel="canonical"[^>]*>' | \
  grep -oE 'href="[^"]*"' | \
  cut -d'"' -f2)
echo "   Canonical: $CANONICAL"

# 4. Check for content in page source
echo ""
echo "3. Checking content in page source..."
if curl -s "$BASE_URL/services" | grep -qi "Cold Plunge"; then
  echo "   ✅ Content found in page source"
else
  echo "   ❌ Content NOT found in page source"
fi

# 5. Check for navigation links
echo ""
echo "4. Checking navigation links..."
NAV_COUNT=$(curl -s "$BASE_URL/services" | grep -oE 'href="(/[^"]+)"' | wc -l)
echo "   Found $NAV_COUNT internal links"

echo ""
echo "=== Verification Complete ==="
```

---

## Summary of Verification Methods

| Check | Method | Expected Result |
|-------|--------|----------------|
| **Sitemap** | Visit `/sitemap.xml` | All articles listed |
| **Canonical** | View page source | Matches exact URL |
| **SSR Content** | View page source (not Inspect) | Content visible in HTML |
| **Navigation Links** | View page source | Links in HTML |
| **Screaming Frog** | Run crawl with JS rendering | Discovers all pages |
| **Google Inspection** | Search Console URL tool | Screenshot shows content |

---

## Troubleshooting

### If content not in page source:

1. **Check if it's a production build**:
   - Dev mode may not SSR client components fully
   - Need to test with `pnpm build && pnpm start`

2. **Check for client component markers**:
   - Search for `__next` or React hydration markers
   - Indicates client-side rendering

3. **Verify `ssr: true` in dynamic imports**:
   - Check page files for dynamic imports
   - Should have `ssr: true` option

### If Screaming Frog only finds homepage:

1. **Enable JavaScript rendering**:
   - Must be enabled in Screaming Frog settings

2. **Check sitemap accessibility**:
   - Verify sitemap is accessible
   - Check robots.txt allows sitemap

3. **Verify links in HTML**:
   - Use View Page Source
   - Check that links are in HTML (not just JS)

---

**Last Updated**: January 2026  
**Next Review**: After deployment and testing
