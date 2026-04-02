# SEO Agency Technical Audit Requests - January 2025

**Date**: January 2025  
**Status**: ⚠️ **IN PROGRESS** - Significant progress made, critical issues remain  
**Purpose**: Document all findings and action items from SEO agency recheck

---

## Executive Summary

The SEO agency has completed a comprehensive recheck of the website and identified several critical technical SEO issues that prevent proper search engine crawling and indexing. While we have made significant progress implementing SSR infrastructure (ISR, ServerSideSEO components, metadata), **the main page content is still client-side rendered**, which means search engines and AI crawlers cannot see the actual content.

### Current Status
- ✅ **Fixed**: robots.txt configuration (uses www, allows crawlers)
- ✅ **Fixed**: Sitemap placement (Next.js App Router pattern)
- ✅ **Fixed**: Domain consistency (www.vitalicesf.com throughout)
- ✅ **Partial**: SSR infrastructure in place (ISR, ServerSideSEO components)
- ❌ **Critical**: Main page content is client-side rendered (not visible in page source)
- ❌ **Critical**: Google URL Inspection shows blank pages
- ❌ **Critical**: Internal links are client-side (Screaming Frog can't discover pages)

---

## Issue 1: Content Not Visible in Page Source

### Status: ❌ **CRITICAL** - Main content is client-side rendered

### Observation
When inspecting the page source for updated pages, the primary content still does not appear in the HTML. This indicates pages are still rendering client-side, not server-side.

### Current Implementation
- ✅ **ServerSideSEO Component**: Injects H1, H2 headings, and navigation links into server-rendered HTML (positioned off-screen)
- ✅ **ISR Configuration**: All pages have `export const revalidate` for Incremental Static Regeneration
- ✅ **Dynamic Imports with SSR**: Client components use `dynamic()` with `ssr: true`
- ❌ **Main Content**: Primary page content (service descriptions, facility details, body text) is in client components (`'use client'` directive)
- ❌ **Content Visibility**: Main content only appears after JavaScript hydration

### Root Cause
- Pages use ISR (Incremental Static Regeneration) with `revalidate`
- Client components are dynamically imported with `ssr: true`, but components themselves are marked `'use client'`
- Next.js pre-renders page structure but defers client component content to hydration
- The `ServerSideSEO` component only provides off-screen SEO content, not the main visible content

### Impact
- Search engines cannot see main page content in initial HTML
- AI crawlers (ChatGPT, Gemini, Perplexity) only see blank HTML shell
- Page source inspection shows minimal content
- Organic visibility severely limited

### What's Working
- Server-side H1 headings are visible in page source (via ServerSideSEO)
- Server-side H2 headings are visible in page source (via ServerSideSEO)
- Server-side navigation links are visible in page source (via ServerSideSEO)
- Meta tags and structured data are in page source

### What's Not Working
- Main page content (service descriptions, facility details, etc.) is not in initial HTML
- Content only appears after client-side JavaScript executes
- Primary body text is missing from page source

### Required Fix
Move critical page content (descriptions, facility info, service details) from client components to server components, ensuring it's rendered server-side and visible in page source.

**Priority**: 🔴 **CRITICAL**  
**Estimated Effort**: 4-8 hours

---

## Issue 2: Google URL Inspection Shows Blank/White Page

### Status: ❌ **CRITICAL** - Googlebot sees empty pages

### Observation
When testing with "Fetch as Google" (Live Test), the tool is not showing the fully rendered HTML or a proper screenshot. Only a white/empty page is visible, which means Google may still not be able to render the content.

### Current Situation
- ✅ robots.txt no longer blocks `/_next/` assets (fixed previously)
- ✅ All pages have ISR enabled with `revalidate`
- ❌ Main content is client-side rendered, so Googlebot may see minimal content
- ❌ `ServerSideSEO` content is off-screen (position: absolute, left: -9999px) which may not render in screenshots

### Root Cause
- Client components render content only after JavaScript execution
- Googlebot may not wait long enough for full hydration
- Off-screen SEO content doesn't appear in screenshots
- Main visible content isn't server-rendered

### Impact
- Google cannot properly index page content
- Search results may show blank or minimal snippets
- Rich snippets and structured data may not render correctly
- Indexing delays or failures

### Required Fix
Ensure main content is server-rendered (not just off-screen SEO content), and verify Google URL Inspection shows actual page content with proper screenshot.

**Priority**: 🔴 **CRITICAL**  
**Estimated Effort**: 4-8 hours (same as Issue 1)

---

## Issue 3: "BAILOUT_TO_CLIENT_SIDE_RENDERING" Still Present

### Status: ⚠️ **MEDIUM** - Expected behavior but needs minimization

### Observation
We still see `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">` on several pages, which suggests parts of the page are still falling back to CSR instead of SSR.

### Current Situation
- ✅ All pages have `ssr: true` in dynamic imports
- ✅ All pages have `revalidate` exports for ISR
- ⚠️ `BAILOUT_TO_CLIENT_SIDE_RENDERING` template still appears in HTML
- ⚠️ This is Next.js internal mechanism for components that can't be fully server-rendered

### Root Cause
- Client components (`'use client'`) inherently trigger bailouts
- Components using browser APIs (window, document, localStorage) cause bailouts
- Dynamic imports with client components create bailout templates
- This is expected Next.js behavior, but indicates too much client-side rendering

### Impact
- May affect page quality scores
- Indicates over-reliance on client-side rendering
- Could impact SEO if bailouts affect critical content

### Required Fix
- Audit which components are causing bailouts
- Move non-interactive content to server components
- Minimize use of browser-only APIs in critical content
- Consider using `force-dynamic` for pages that need full SSR
- Test if bailout templates affect SEO (they may not if critical content is server-rendered)

**Priority**: 🟡 **MEDIUM**  
**Estimated Effort**: 2-4 hours

---

## Issue 4: Uncertainty About Which Pages Are Fully Fixed

### Status: ⚠️ **HIGH** - Needs clear documentation and status

### Observation
You mentioned that SSR is applied to "most pages," but we need confirmation on exactly which URLs are now updated. This will help us verify them individually from an SEO perspective.

### Current Situation
- ✅ All 18 pages have ISR enabled (`revalidate` exports)
- ✅ All 18 pages have `ssr: true` in dynamic imports
- ✅ All 18 pages have `ServerSideSEO` component
- ❌ Not all pages have main content server-rendered
- ❌ Status is inconsistent across pages

### Pages with SSR Infrastructure (But Main Content Client-Side)
All 18 pages have SSR infrastructure but main content is client-side:
- ✅ Homepage (`/`) - Has ServerSideSEO
- ✅ About (`/about`) - Has ServerSideSEO
- ✅ Contact (`/contact`) - Has ServerSideSEO
- ✅ Services (`/services`) - Has ServerSideSEO
- ✅ Experience (`/experience`) - Has ServerSideSEO
- ✅ Book (`/book`) - Has ServerSideSEO
- ✅ FAQ (`/faq`) - Has ServerSideSEO
- ✅ All 6 service pages - Have ServerSideSEO
- ✅ Insights listing (`/insights`) - Has ServerSideSEO
- ✅ Article pages (`/insights/[slug]`) - Has ServerSideSEO
- ✅ Careers (`/careers`) - Has ServerSideSEO
- ✅ Partners (`/partners`) - Has ServerSideSEO
- ✅ Client Policy (`/client-policy`) - Has ServerSideSEO

### Required Documentation
Create comprehensive status document listing:
1. **Fully Fixed**: Main content is server-rendered, visible in page source, no bailouts
2. **Partially Fixed**: SEO content server-rendered, but main content is client-side (current status for all pages)
3. **Pending**: No server-side content

### Current Status Classification
**All 18 pages are currently "Partially Fixed"** - SEO metadata is server-rendered, but main content is client-side.

### Required Fix
- Create clear status document for each page
- Provide to SEO agency for verification
- Update as fixes are implemented

**Priority**: 🟠 **HIGH**  
**Estimated Effort**: 1 hour (documentation)

---

## Issue 5: Screaming Frog Crawl Only Detects Homepage

### Status: ❌ **CRITICAL** - Internal links not discoverable

### Observation
When we run a crawl using Screaming Frog (JavaScript rendering), it still only picks up the homepage and does not crawl internal URLs. This usually means Googlebot will also have difficulty discovering and indexing deeper pages.

### Current Situation
- ✅ Sitemap.xml includes all pages
- ✅ robots.txt allows crawling
- ✅ `ServerSideSEO` component includes navigation links (off-screen)
- ❌ Main page content links are client-side rendered
- ❌ Screaming Frog may not discover internal links if they're only in JavaScript

### Root Cause
- Navigation links in main content are rendered client-side
- Service cards, buttons, and other interactive elements are client-side
- Screaming Frog may not execute JavaScript long enough to discover all links
- Only homepage is discovered because it's the entry point
- Main navigation menu is likely client-side rendered

### Impact
- Googlebot may not discover all pages
- Internal linking structure is invisible to crawlers
- Pages may not be indexed if not in sitemap or linked from homepage
- Site architecture may not be properly understood by search engines

### Required Fix
- Ensure main navigation is server-rendered (not just in ServerSideSEO)
- Ensure service cards and links are in server-rendered HTML
- Ensure footer navigation is server-rendered
- Test Screaming Frog crawl after implementing server-side links

**Priority**: 🔴 **CRITICAL**  
**Estimated Effort**: 2-4 hours

---

## Issue 6: Robots.txt Configuration

### Status: ✅ **FIXED** - Already corrected

### Observation (From Agency)
The sitemap link inside robots.txt currently points to:
```
Sitemap: https://vitalicesf.com/sitemap.xml
```
Recommended correction:
```
Sitemap: https://www.vitalicesf.com/sitemap.xml
```

### Current Implementation
✅ **FIXED** - File: `apps/web/src/app/robots.ts`

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/', '*.json'],
    },
    sitemap: 'https://www.vitalicesf.com/sitemap.xml', // ✅ Correct
  };
}
```

**Status**: Already using www version. No action needed.

---

## Issue 7: Sitemap Placement

### Status: ✅ **FIXED** - Using Next.js App Router pattern

### Observation (From Agency)
It appears that the sitemap file is located inside the src folder instead of public. Files inside the src directory are part of the build process and are not directly accessible to crawlers.

### Current Implementation
✅ **FIXED** - File: `apps/web/src/app/sitemap.ts`

**Next.js App Router Pattern**: In Next.js 13+ App Router, `sitemap.ts` in `src/app/` is the **correct location**. Next.js automatically:
- Generates `/sitemap.xml` at the root URL
- Serves it at `https://www.vitalicesf.com/sitemap.xml`
- Updates it on each build

**Status**: This is the recommended Next.js pattern. Sitemap is accessible and working correctly.

---

## Issue 8: Canonical URL Consistency

### Status: ⚠️ **NEEDS VERIFICATION** - Should be fixed but needs confirmation

### Observation (From Agency)
Please use the same URL for the canonical tag (presumably referring to consistent www usage).

### Current Implementation
- ✅ **Base Metadata**: `metadataBase` is set to `https://www.vitalicesf.com` (with www)
- ✅ **Canonical URLs**: All pages use relative paths (e.g., `/services`, `/book`)
- ✅ **Resolution**: Next.js automatically resolves relative canonical URLs using `metadataBase`
- ✅ **Result**: All canonical URLs should resolve to `https://www.vitalicesf.com/[path]`

### Files to Verify
- `apps/web/src/lib/seo/metadata.ts` - Base metadata configuration
- `apps/web/src/app/*/page.tsx` - Page-specific metadata
- `apps/web/src/lib/sanity/seo.ts` - Sanity content metadata generation

### Required Verification
- Verify all pages use consistent canonical URL format (www.vitalicesf.com)
- Ensure no hardcoded non-www URLs exist
- Test canonical tags in production

**Priority**: 🟡 **MEDIUM**  
**Estimated Effort**: 1 hour (verification)

---

## Summary of Issues and Priorities

| Issue | Status | Priority | Estimated Effort | Notes |
|-------|--------|----------|------------------|-------|
| **1. Content not visible in Page Source** | ❌ Critical | 🔴 HIGH | 4-8 hours | Main content needs server-side rendering |
| **2. Google URL Inspection shows blank page** | ❌ Critical | 🔴 HIGH | Same as #1 | Related to Issue #1 |
| **3. BAILOUT_TO_CLIENT_SIDE_RENDERING** | ⚠️ Medium | 🟡 MEDIUM | 2-4 hours | Minimize but not critical |
| **4. Which pages are fully fixed?** | ⚠️ High | 🟠 HIGH | 1 hour | Documentation needed |
| **5. Screaming Frog only detects homepage** | ❌ Critical | 🔴 HIGH | 2-4 hours | Server-side links needed |
| **6. Robots.txt configuration** | ✅ Fixed | - | - | Already corrected |
| **7. Sitemap placement** | ✅ Fixed | - | - | Using Next.js pattern |
| **8. Canonical URL consistency** | ⚠️ Needs Verification | 🟡 MEDIUM | 1 hour | Should be fixed, needs confirmation |

---

## Progress Made So Far

### ✅ Completed
1. **ISR Infrastructure**: All pages have `revalidate` exports for Incremental Static Regeneration
2. **SSR-Enabled Dynamic Imports**: All pages use `dynamic()` with `ssr: true`
3. **ServerSideSEO Components**: All pages have off-screen SEO content (H1, H2, links)
4. **Robots.txt**: Correctly configured with www domain and proper sitemap reference
5. **Sitemap**: Using Next.js App Router pattern, accessible at root
6. **Domain Consistency**: Using www.vitalicesf.com throughout configuration
7. **Metadata**: Comprehensive metadata configuration with canonical URLs

### ❌ Remaining Work
1. **Server-Side Main Content**: Move critical content from client to server components
2. **Server-Side Navigation Links**: Ensure main nav and footer are server-rendered
3. **Page Status Documentation**: Create clear status document for agency
4. **Bailout Minimization**: Reduce client-side rendering where possible
5. **Canonical URL Verification**: Confirm all pages use consistent format

---

## Next Steps Required

### Immediate Actions (Before Next SEO Check)

1. **Server-Side Content Rendering** (Priority: Critical)
   - Convert critical content sections to server components
   - Move static content (descriptions, facility info) out of client components
   - Ensure primary content is rendered server-side
   - Test page source after changes

2. **Server-Side Navigation Links** (Priority: Critical)
   - Ensure main navigation is server-rendered
   - Ensure service cards have server-rendered links
   - Ensure footer navigation is server-rendered
   - Test Screaming Frog discovery

3. **Page Status Documentation** (Priority: High)
   - Create comprehensive status document
   - List each page with clear status (Fully Fixed / Partially Fixed / Pending)
   - Document what's server-rendered vs client-rendered
   - Provide to SEO agency for verification

4. **Testing and Verification** (Priority: Critical)
   - View page source for all pages (verify main content visible)
   - Test with Google URL Inspection tool (verify screenshot shows content)
   - Run Screaming Frog crawl (verify all pages discovered)
   - Verify canonical URLs consistency

5. **Bailout Minimization** (Priority: Medium)
   - Audit which components are causing bailouts
   - Move non-interactive content to server components
   - Minimize browser-only APIs in critical content

---

## Testing Requirements

After implementing fixes, the SEO agency will perform:

1. **Fresh Crawl**
   - Full Screaming Frog crawl with JavaScript rendering
   - Verify all pages are discovered
   - Verify content is detected (not just loading states)

2. **Rendering Tests**
   - Google URL Inspection for key pages
   - Verify screenshot shows actual content
   - Verify rendered HTML contains full page content

3. **Indexability Checks**
   - Verify pages can be indexed
   - Check for crawl errors in Google Search Console
   - Verify structured data is accessible

4. **Page Source Verification**
   - View page source (not Inspect Element) for all pages
   - Verify main content is visible in HTML
   - Verify headings, text, and links are in raw HTML

5. **Google Search Console Inspections**
   - Test live URLs with URL Inspection tool
   - Request indexing for key pages
   - Monitor indexing status

---

## Timeline Estimate

- **Server-Side Content Rendering**: 4-8 hours
- **Server-Side Navigation Links**: 2-4 hours
- **Page Status Documentation**: 1 hour
- **Canonical URL Verification**: 1 hour
- **Bailout Minimization**: 2-4 hours
- **Testing and Verification**: 2-3 hours

**Total Estimated Time**: 12-21 hours

---

## Questions for Clarification

1. **Propagation Time**: Do these changes need time to propagate before they become visible in source code and crawl tests?
   - Answer: After deployment, changes should be immediately visible. May need to clear cache or wait for ISR revalidation.

2. **Caching**: Are there any caching or deployment steps still in progress?
   - Answer: ISR pages are cached and revalidated based on `revalidate` values. Production deployment should make changes live immediately.

3. **Page Prioritization**: Which pages should be prioritized for full server-side content rendering?
   - Recommendation: Start with high-traffic pages (homepage, services, book) then proceed to other pages.

---

**Last Updated**: January 2025  
**Next Review**: After implementing server-side content rendering  
**Status**: ⚠️ **IN PROGRESS** - Critical fixes needed
