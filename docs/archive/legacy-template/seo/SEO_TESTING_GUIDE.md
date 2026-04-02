# SEO Testing Guide

**Date:** November 30, 2024  
**Purpose:** Step-by-step guide to test SEO implementation after deployment

## 🧪 Testing Methods

### 1. Local Testing (Before/After Deployment)

#### A. View Page Source (Critical Test)

**What to Test:** Verify content is in the HTML source (not just JavaScript)

**Steps:**
1. Open your site in browser (localhost:3000 or production URL)
2. Right-click → **"View Page Source"** (NOT "Inspect Element")
3. Look for:
   - ✅ Actual HTML content (headings, text, images)
   - ✅ Meta tags in `<head>`
   - ✅ Structured data (JSON-LD)
   - ❌ Should NOT see only JavaScript/loading states

**Pages to Test:**
- `http://localhost:3000/services`
- `http://localhost:3000/services/cold-plunge`
- `http://localhost:3000/experience`

**What Good Looks Like:**
```html
<!-- Good: Content visible in HTML -->
<h1>Our Services</h1>
<div class="serviceCard">
  <h3>Cold Plunge</h3>
  <p>Step in cold. Step out clear.</p>
</div>
```

**What Bad Looks Like:**
```html
<!-- Bad: Only loading states or templates -->
<div>Loading services...</div>
<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"></template>
```

---

#### B. Test with cURL (Server-Side Rendering)

**What to Test:** Verify server returns HTML content

**Command:**
```bash
# Test homepage
curl -s http://localhost:3000 | grep -i "<h1\|<title\|Our Services" | head -10

# Test services page
curl -s http://localhost:3000/services | grep -i "<h1\|service\|Cold Plunge" | head -10

# Test service detail page
curl -s http://localhost:3000/services/cold-plunge | grep -i "<h1\|cold\|plunge" | head -10
```

**What to Look For:**
- ✅ Should see actual content in HTML
- ✅ Should see meta tags
- ✅ Should NOT see only scripts

---

#### C. Check robots.txt

**What to Test:** Verify robots.txt is accessible and correct

**Command:**
```bash
curl http://localhost:3000/robots.txt
```

**Expected Output:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: *.json

Sitemap: https://www.vitalicesf.com/sitemap.xml
```

**What to Verify:**
- ✅ No `/_next/` in disallow list (CRITICAL)
- ✅ Sitemap URL is correct
- ✅ Properly formatted

---

#### D. Check sitemap.xml

**What to Test:** Verify sitemap is accessible and complete

**Command:**
```bash
curl http://localhost:3000/sitemap.xml
```

**What to Verify:**
- ✅ All pages listed
- ✅ URLs use `www.vitalicesf.com`
- ✅ Proper priorities set
- ✅ Last modified dates

---

### 2. Google Search Console - URL Inspection Tool ⭐ RECOMMENDED

**What to Test:** How Google sees your pages

**Steps:**

1. **Go to Google Search Console:**
   - https://search.google.com/search-console
   - Select your property (`www.vitalicesf.com`)

2. **Open URL Inspection Tool:**
   - Click "URL Inspection" in left sidebar
   - Or go to: https://search.google.com/search-console/inspect

3. **Enter a URL to test:**
   ```
   https://www.vitalicesf.com/services/cold-plunge
   ```

4. **Click "Test Live URL"** (or "Request Indexing" if not indexed)

5. **Review Results:**

   **✅ Good Signs:**
   - "Fetch successful"
   - "Page fetch: Success"
   - Screenshot shows fully rendered page
   - "Rendered HTML" shows actual content
   - No errors in "Coverage"

   **❌ Bad Signs:**
   - "Fetch partially successful"
   - Screenshot shows blank/white page
   - "Rendered HTML" shows only loading states
   - `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">` in HTML
   - Errors about JavaScript rendering

6. **Check the Screenshot:**
   - Should show actual page content
   - Should NOT be blank or white
   - Should NOT show only loading spinners

7. **Check Rendered HTML:**
   - Expand "Rendered HTML" section
   - Look for actual content (headings, text, images)
   - Should NOT see only scripts or templates

**Pages to Test:**
1. Homepage: `https://www.vitalicesf.com`
2. Services overview: `https://www.vitalicesf.com/services`
3. Service page: `https://www.vitalicesf.com/services/cold-plunge`
4. Experience page: `https://www.vitalicesf.com/experience`

**Note:** Wait 24-48 hours after deployment before testing, as Google needs to re-crawl.

---

### 3. Screaming Frog SEO Spider

**What to Test:** Discover all pages and verify they're crawlable

**Steps:**

1. **Download Screaming Frog:**
   - https://www.screamingfrog.co.uk/seo-spider/
   - Free version is sufficient for testing

2. **Configure Settings:**
   - Mode: "Spider"
   - Enter URL: `https://www.vitalicesf.com`
   - Check "Render JavaScript" (IMPORTANT)
   - Set User Agent: "Googlebot"

3. **Run Crawl:**
   - Click "Start"
   - Wait for crawl to complete

4. **Review Results:**

   **What to Check:**
   - ✅ Number of pages discovered (should be 18+)
   - ✅ All pages return 200 status codes
   - ✅ No blocked by robots.txt errors
   - ✅ Pages show content in rendered view

   **Where to Look:**
   - **Response Codes:** Should see mostly 200 OK
   - **Rendering:** Switch to "Rendered HTML" tab to see content
   - **Internal Links:** Should discover all pages via links
   - **JavaScript:** Should render pages with JavaScript enabled

5. **Check Specific Issues:**
   - Filter for 404 errors (should be minimal)
   - Filter for blocked by robots.txt (should be none for public pages)
   - Check if service pages are discovered

**Expected Results:**
- Should discover all 18+ pages
- Should render content (not just loading states)
- Should follow all internal links
- Should discover via sitemap.xml

---

### 4. Online SEO Testing Tools

#### A. Google's Mobile-Friendly Test

**URL:** https://search.google.com/test/mobile-friendly

**What to Test:**
- Mobile usability
- Page rendering
- View screenshot of how Google sees the page

**Steps:**
1. Enter your URL
2. Click "Test URL"
3. Review results

**What to Look For:**
- ✅ "Page is mobile-friendly"
- ✅ Screenshot shows content
- ✅ No critical errors

---

#### B. PageSpeed Insights

**URL:** https://pagespeed.web.dev/

**What to Test:**
- Page performance
- Core Web Vitals
- Mobile and desktop scores

**Steps:**
1. Enter your URL
2. Click "Analyze"
3. Review scores

**What to Look For:**
- ✅ Performance score > 70 (good) or > 90 (excellent)
- ✅ Good Core Web Vitals
- ✅ Content visible in preview

---

#### C. Rich Results Test (Structured Data)

**URL:** https://search.google.com/test/rich-results

**What to Test:**
- Structured data validation
- Rich snippet eligibility

**Steps:**
1. Enter your URL
2. Click "Test URL"
3. Review structured data

**What to Look For:**
- ✅ No errors
- ✅ Valid structured data detected
- ✅ Rich results eligible

---

### 5. Manual Browser Testing

#### A. Test with JavaScript Disabled

**What to Test:** Verify page works without JavaScript (good SEO practice)

**Steps:**
1. Open Chrome DevTools (F12)
2. Go to Settings → More Tools → Rendering
3. Enable "Disable JavaScript"
4. Refresh page
5. Check if content is visible

**Expected:** Some content should be visible (at least headings, text)

---

#### B. Test with Slow Network

**What to Test:** Verify content appears quickly

**Steps:**
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Reload page
5. Check when content appears

**Expected:** Content should appear within 3-5 seconds

---

### 6. Check Specific SEO Elements

#### A. Meta Tags

**Command:**
```bash
curl -s https://www.vitalicesf.com/services | grep -i "meta name\|meta property" | head -20
```

**What to Look For:**
- ✅ `<meta name="description" content="...">`
- ✅ `<meta property="og:title" content="...">`
- ✅ `<meta property="og:description" content="...">`
- ✅ `<meta property="og:image" content="...">`
- ✅ Canonical URL

---

#### B. Structured Data (JSON-LD)

**Command:**
```bash
curl -s https://www.vitalicesf.com/services | grep -A 10 "application/ld+json"
```

**What to Look For:**
- ✅ JSON-LD structured data present
- ✅ Valid JSON syntax
- ✅ Relevant schema types (LocalBusiness, Service, etc.)

---

#### C. Headings Hierarchy

**Check:**
- ✅ One `<h1>` per page
- ✅ Logical heading hierarchy (h1 → h2 → h3)
- ✅ Descriptive heading text

---

## 📋 Testing Checklist

### Before Deployment
- [ ] View page source shows HTML content
- [ ] robots.txt is correct (no `/_next/` blocking)
- [ ] sitemap.xml is accessible
- [ ] All meta tags present
- [ ] Structured data present

### After Deployment (Day 1)
- [ ] Test robots.txt at production URL
- [ ] Test sitemap.xml at production URL
- [ ] View page source shows content
- [ ] Test one page with Google URL Inspection
- [ ] Submit sitemap to Search Console

### After 24-48 Hours
- [ ] Re-test with Google URL Inspection
- [ ] Run Screaming Frog crawl
- [ ] Check Search Console for crawl errors
- [ ] Verify pages are being indexed

### After 1 Week
- [ ] Review Search Console coverage report
- [ ] Check if pages are ranking
- [ ] Monitor for any new errors
- [ ] Compare before/after metrics

---

## 🎯 Key Metrics to Monitor

### Google Search Console
- **Coverage:** Pages indexed vs. errors
- **Performance:** Impressions, clicks, CTR
- **Indexing:** Pages successfully indexed
- **Mobile Usability:** Any mobile issues

### Page-Level Tests
- **URL Inspection:** Each page should pass
- **Mobile-Friendly:** All pages mobile-friendly
- **PageSpeed:** Good performance scores
- **Structured Data:** Valid and recognized

---

## 🚨 Common Issues & Solutions

### Issue: Blank Screenshot in URL Inspection
**Cause:** SSR not working or robots.txt blocking assets  
**Solution:** 
- Verify robots.txt doesn't block `/_next/`
- Check if SSR is enabled
- Wait 24-48 hours for re-crawl

### Issue: Screaming Frog Only Finds Homepage
**Cause:** JavaScript rendering disabled or sitemap not submitted  
**Solution:**
- Enable JavaScript rendering in Screaming Frog
- Submit sitemap to Search Console
- Check internal links are rendered server-side

### Issue: BAILOUT_TO_CLIENT_SIDE_RENDERING Still Present
**Cause:** Old cached builds or ISR bailout  
**Solution:**
- Clear build cache
- Wait for fresh build
- May resolve on first request after deployment

### Issue: Pages Not Indexing
**Cause:** Not submitted or crawl errors  
**Solution:**
- Submit sitemap to Search Console
- Request indexing for key pages
- Fix any crawl errors
- Wait 1-7 days for indexing

---

## 📞 Next Steps

1. **Test locally** before deployment
2. **Deploy to production**
3. **Test immediately** with URL Inspection (may need to wait)
4. **Submit sitemap** to Search Console
5. **Wait 24-48 hours** for Google to re-crawl
6. **Re-test** all methods
7. **Monitor** Search Console for next week

---

## 🔗 Quick Links

- **Google Search Console:** https://search.google.com/search-console
- **URL Inspection Tool:** https://search.google.com/search-console/inspect
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Screaming Frog:** https://www.screamingfrog.co.uk/seo-spider/

---

**Remember:** SEO testing takes time. After deployment, allow 24-48 hours for Google to re-crawl and re-index pages before expecting to see changes.

