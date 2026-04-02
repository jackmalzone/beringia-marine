# Google URL Inspection Tool Guide

## Overview

The URL Inspection tool (formerly "Fetch as Google") is a powerful feature in Google Search Console that lets you test how Google sees and renders your pages. This is essential for verifying that your SSR implementation is working correctly.

---

## Prerequisites

1. **Google Search Console Access**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your property: `https://www.vitalicesf.com`
   - Verify ownership (via DNS, HTML file, or meta tag)

2. **Wait for Initial Crawl**
   - Google needs to discover your site first
   - This can take a few hours to days after verification

---

## Step-by-Step: Using URL Inspection Tool

### Step 1: Access the Tool

1. Log into [Google Search Console](https://search.google.com/search-console)
2. Select your property: `www.vitalicesf.com`
3. In the left sidebar, click **"URL Inspection"** (or search for it in the top search bar)

### Step 2: Enter Your URL

1. In the search bar at the top, paste the full URL you want to test:
   ```
   https://www.vitalicesf.com
   ```
   or test specific pages:
   ```
   https://www.vitalicesf.com/services/cold-plunge
   https://www.vitalicesf.com/experience
   ```

2. Press **Enter** or click the search icon

### Step 3: Review the Results

The tool will show you several sections:

#### A. **URL Status**
- ✅ **"URL is on Google"** - Page is indexed
- ⚠️ **"URL is not on Google"** - Not yet indexed (normal for new pages)
- ❌ **"URL is not on Google (Crawl anomaly)"** - Issue detected

#### B. **Coverage**
- Shows if the page is indexed, why it's not (if applicable), or if there are issues

#### C. **Page Fetching**
This is the key section for verifying SSR:

1. Click **"TEST LIVE URL"** button
   - This fetches the current live version of the page
   - Waits for page to fully render (important for SSR verification)

2. Review the results:

   **✅ Good Signs:**
   - "Fetch successful"
   - "Page fetch: Success"
   - Screenshot shows fully rendered page with content
   - "Rendered HTML" shows actual page content (not just loading states)

   **❌ Warning Signs:**
   - "Fetch partially successful"
   - Screenshot shows blank/white page
   - "Rendered HTML" shows only loading states or empty content
   - Error messages about JavaScript rendering

---

## Step 4: Verify SSR Implementation

### Check the Rendered HTML

1. In the test results, click **"View Tested Page"** or expand **"Rendered HTML"**
2. Look for:

   **✅ Success Indicators:**
   - Page content visible in HTML
   - Headings (h1, h2, etc.) present
   - Text content present (not just in script tags)
   - Meta tags present
   - Structured data (JSON-LD) visible

   **❌ Problems to Watch For:**
   - `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">`
   - Only loading states visible
   - Content wrapped in script tags only
   - Empty HTML body

### Check the Screenshot

1. Review the **"Screenshot"** tab in the results
2. Should show:
   - ✅ Fully rendered page with content
   - ✅ Images visible
   - ✅ Text readable
   - ✅ Proper layout

3. If screenshot shows:
   - ❌ Blank/white page
   - ❌ Only loading spinners
   - ❌ Partial content

   → This indicates SSR isn't working correctly

---

## Step 5: Request Indexing (If Needed)

After verifying the page renders correctly:

1. Click **"REQUEST INDEXING"** button
2. This tells Google to:
   - Re-crawl the page
   - Re-render it
   - Add/update it in the index

3. **Note**: 
   - Don't request indexing too frequently (Google limits this)
   - Wait for results before requesting again
   - Indexing can take hours to days

---

## Testing Multiple Pages

### Priority Pages to Test

Test these pages first to verify SSR implementation:

**High Priority:**
1. `https://www.vitalicesf.com` - Homepage
2. `https://www.vitalicesf.com/services/cold-plunge` - Service page
3. `https://www.vitalicesf.com/experience` - Experience page
4. `https://www.vitalicesf.com/contact` - Contact page

**Medium Priority:**
5. `https://www.vitalicesf.com/about` - About page
6. `https://www.vitalicesf.com/services` - Services listing
7. `https://www.vitalicesf.com/book` - Book page

**Content Pages:**
8. `https://www.vitalicesf.com/insights` - Insights listing
9. Individual insight article pages

---

## Common Issues & Solutions

### Issue 1: "URL is not on Google"

**Cause**: Page hasn't been indexed yet

**Solutions**:
- Request indexing after verifying page renders correctly
- Submit sitemap in Search Console
- Wait for natural crawl (can take days)

### Issue 2: Blank Screenshot / Empty HTML

**Cause**: SSR not working - page rendering client-side only

**Solutions**:
- Verify `ssr: true` is in dynamic imports
- Check for `BAILOUT_TO_CLIENT_SIDE_RENDERING` in HTML
- Ensure `revalidate` is exported
- Check server logs for SSR errors

### Issue 3: Partial Rendering

**Cause**: Some components still client-side only

**Solutions**:
- Review page components for `'use client'` directives
- Ensure all client components are dynamically imported with SSR
- Check for hydration errors in console

### Issue 4: "Crawl Anomaly"

**Cause**: Server errors or blocking

**Solutions**:
- Check robots.txt isn't blocking
- Verify server is responding correctly
- Check for 500 errors in server logs
- Ensure proper HTTP status codes

---

## Best Practices

### 1. Test After Deployments
- Always test key pages after deploying changes
- Verify SSR is still working
- Request indexing if needed

### 2. Monitor Regularly
- Check Search Console weekly
- Watch for crawl errors
- Monitor indexing status

### 3. Test Different Page Types
- Don't just test homepage
- Test service pages, blog posts, dynamic routes
- Verify all page types render correctly

### 4. Compare Before/After
- Take screenshots before SSR fixes
- Compare with after implementation
- Document improvements

---

## What to Look For: Before vs After SSR

### Before SSR Fixes ❌
```
- Screenshot: Blank/white page
- HTML: Empty or only loading states
- Content: Not visible to crawlers
- Status: "Crawl anomaly" or "Not indexed"
```

### After SSR Fixes ✅
```
- Screenshot: Fully rendered page with content
- HTML: Actual page content visible
- Content: All text, images, structured data present
- Status: "URL is on Google" or "Indexable"
```

---

## Troubleshooting Checklist

If pages aren't rendering correctly:

- [ ] Verify `ssr: true` in all dynamic imports
- [ ] Check `revalidate` export is present
- [ ] Review page source (View Source in browser) - should show content
- [ ] Check for JavaScript errors in server logs
- [ ] Verify Next.js build completed successfully
- [ ] Test locally with `npm run build && npm run start`
- [ ] Check Vercel deployment logs
- [ ] Verify no blocking in robots.txt
- [ ] Check server response times (slow pages may timeout)

---

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters/answer/9012289)
- [URL Inspection Tool Documentation](https://support.google.com/webmasters/answer/9012289?hl=en)
- [Testing Your Site](https://developers.google.com/search/docs/crawling-indexing/test-your-site)

---

## Quick Reference

### Testing Workflow

```
1. Deploy changes to production
2. Wait for deployment to complete (2-5 minutes)
3. Open Google Search Console
4. Go to URL Inspection tool
5. Enter full URL (e.g., https://www.vitalicesf.com)
6. Click "TEST LIVE URL"
7. Wait for results (30-60 seconds)
8. Review screenshot and rendered HTML
9. If good → Request indexing
10. If bad → Check SSR configuration and server logs
```

---

**Last Updated**: December 2024  
**Status**: Ready for testing after deployment

