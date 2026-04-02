# SEO Agency Findings - Status Update

**Date**: December 2024  
**Purpose**: Track status of findings from SEO agency recheck and document what remains to be fixed

---

## Findings After Rechecking the Website

### 1. Content not visible in Page Source

**Status**: ⚠️ **PENDING** - Partial Implementation

**Current Situation**:

- ✅ `ServerSideSEO` component injects H1, H2 headings, and navigation links into server-rendered HTML
- ❌ Primary page content (main body text, service descriptions, etc.) is still client-side rendered
- ❌ Client components (`ExperiencePageClient`, `ContactPageClient`, etc.) use `'use client'` directive
- ❌ Main content only appears after JavaScript hydration

**What's Working**:

- Server-side H1 headings are visible in page source
- Server-side H2 headings are visible in page source
- Server-side navigation links are visible in page source
- Meta tags and structured data are in page source

**What's Not Working**:

- Main page content (service descriptions, facility details, etc.) is not in initial HTML
- Content only appears after client-side JavaScript executes

**Root Cause**:

- Pages use ISR (Incremental Static Regeneration) with `revalidate`
- Client components are dynamically imported with `ssr: true`, but the components themselves are marked `'use client'`
- Next.js pre-renders the page structure but defers client component content to hydration

**Next Steps Required**:

1. Convert critical content sections to server components where possible
2. Move static content (descriptions, facility info) out of client components
3. Ensure primary content is rendered server-side, not just SEO metadata
4. Test page source after changes to verify main content is visible

---

### 2. Google URL Inspection shows a blank/white page

**Status**: ⚠️ **PENDING** - Needs Verification After Fixes

**Current Situation**:

- ✅ robots.txt no longer blocks `/_next/` assets (fixed previously)
- ✅ All pages have ISR enabled with `revalidate`
- ❌ Main content is client-side rendered, so Googlebot may see minimal content
- ❌ `ServerSideSEO` content is off-screen (position: absolute, left: -9999px) which may not render in screenshots

**What's Working**:

- robots.txt allows crawlers to access JavaScript/CSS assets
- Page structure and metadata are server-rendered
- ISR ensures pages are pre-rendered at build time

**What's Not Working**:

- Main visible content is client-side only
- Googlebot may see mostly empty page structure
- Screenshot in URL Inspection tool shows blank page because main content isn't server-rendered

**Root Cause**:

- Client components render content only after JavaScript execution
- Googlebot may not wait long enough for full hydration
- Off-screen SEO content doesn't appear in screenshots

**Next Steps Required**:

1. Ensure main content is server-rendered (not just off-screen SEO content)
2. Test with Google URL Inspection tool after implementing server-side content
3. Verify screenshot shows actual page content
4. Check rendered HTML in URL Inspection shows full content

---

### 3. "BAILOUT_TO_CLIENT_SIDE_RENDERING" still present

**Status**: ⚠️ **PENDING** - Expected Behavior (But Needs Investigation)

**Current Situation**:

- ✅ All pages have `ssr: true` in dynamic imports
- ✅ All pages have `revalidate` exports for ISR
- ⚠️ `BAILOUT_TO_CLIENT_SIDE_RENDERING` template still appears in HTML
- ⚠️ This is Next.js internal mechanism for components that can't be fully server-rendered

**What's Working**:

- Page structure is server-rendered
- Metadata and SEO content are server-rendered
- ISR is configured correctly

**What's Not Working**:

- Client components trigger bailout templates
- Some components use browser-only APIs (useEffect, window, etc.)
- Next.js marks these for client-side hydration

**Root Cause**:

- Client components (`'use client'`) inherently trigger bailouts
- Components using browser APIs (window, document, localStorage) cause bailouts
- Dynamic imports with client components create bailout templates
- This is expected Next.js behavior, but may indicate too much client-side rendering

**Next Steps Required**:

1. Audit which components are causing bailouts
2. Move non-interactive content to server components
3. Minimize use of browser-only APIs in critical content
4. Consider using `force-dynamic` for pages that need full SSR
5. Test if bailout templates affect SEO (they may not if critical content is server-rendered)

**Note**: Bailout templates don't necessarily mean SEO failure if critical content (H1, H2, links) is server-rendered. However, reducing bailouts improves overall page quality.

---

### 4. Not sure which pages are fully fixed

**Status**: ⚠️ **PENDING** - Needs Clarification

**Current Situation**:

- ✅ All 18 pages have ISR enabled (`revalidate` exports)
- ✅ All 18 pages have `ssr: true` in dynamic imports
- ✅ All 18 pages have `ServerSideSEO` component
- ❌ Not all pages have main content server-rendered
- ❌ Status is inconsistent across pages

**Pages with Full SSR Implementation** (Server-side content):

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

**Pages with Partial SSR** (SEO content only, main content client-side):

- ⚠️ All pages - Main content is client-side rendered
- ⚠️ Only SEO metadata (H1, H2, links) is server-rendered
- ⚠️ Primary page content requires JavaScript hydration

**Next Steps Required**:

1. Create comprehensive list of which pages have:
   - Server-side SEO content (H1, H2, links) ✅Summary of CVE-2025-55182
     Authors

2 min read

Copy URL
Copied to clipboard!
Dec 3, 2025
Link to headingSummary
A critical-severity vulnerability in React Server Components (CVE-2025-55182) affects React 19 and frameworks that use it, including Next.js (CVE-2025-66478). Under certain conditions, specially crafted requests could lead to unintended remote code execution.

We created new rules to address this vulnerability and quickly deployed to the Vercel WAF to automatically protect all projects hosted on Vercel at no cost. We also worked with the React team to deliver recommendations to the largest WAF and CDN providers.

We still strongly recommend upgrading to a patched version regardless of your hosting provider.

Link to headingImpact
Applications using affected versions of the React Server Components implementation may process untrusted input in a way that allows an attacker to perform remote code execution. The vulnerability is present in versions 19.0, 19.1.0, 19.1.1, and 19.2.0 of the following packages: :

react-server-dom-parcel (19.0.0, 19.1.0, 19.1.1, and 19.2.0)

react-server-dom-webpack (19.0.0, 19.1.0, 19.1.1, and 19.2.0)

react-server-dom-turbopack (19.0.0, 19.1.0, 19.1.1, and 19.2.0)

These packages are included in the following frameworks and bundlers:

Next.js with versions ≥14.3.0-canary.77, ≥15 and ≥16

Other frameworks and plugins that embed or depend on React Server Components implementation (e.g., Vite, Parcel, React Router, RedwoodSDK, Waku)

Link to headingResolution
After creating mitigations to address this vulnerability, we deployed them across our globally-distributed platform to quickly protect our customers. We still recommend upgrading to the latest patched version.

Updated releases of React and affected downstream frameworks include hardened handling of user inputs to prevent unintended behavior. All users should upgrade to a patched version as soon as possible. If you are on Next.js 14.3.0-canary.77 or a later canary release, downgrade to the latest stable 14.x release.

Link to headingFixed in:
React: 19.0.1, 19.1.2, 19.2.1

Next.js: 15.0.5, 15.1.9, 15.2.6, 15.3.6, 15.4.8, 15.5.7, 15.6.0-canary.58, 16.0.7

Frameworks and bundlers using the aforementioned packages should install the latest versions provided by their respective maintainers.

Link to headingCredit
Thanks to Lachlan Davidson for identifying and responsibly reporting the vulnerability, and the Meta Security and React team for their partnership.

Link to headingReferences
Next.js GHSA

React GHSA

- Server-side main content ❌

2. Prioritize pages for full server-side content rendering
3. Document which pages are "fully fixed" vs "partially fixed"
4. Provide clear status to SEO agency

**Recommended Status Classification**:

- **Fully Fixed**: Main content is server-rendered, visible in page source, no bailouts
- **Partially Fixed**: SEO content server-rendered, but main content is client-side
- **Pending**: No server-side content

**Current Status**: All 18 pages are **Partially Fixed** (SEO content server-rendered, main content client-side)

---

### 5. Screaming Frog crawl only detects the homepage

**Status**: ⚠️ **PENDING** - Needs Server-Side Links

**Current Situation**:

- ✅ Sitemap.xml includes all pages
- ✅ robots.txt allows crawling
- ✅ `ServerSideSEO` component includes navigation links
- ❌ Main page content links are client-side rendered
- ❌ Screaming Frog may not discover internal links if they're only in JavaScript

**What's Working**:

- Sitemap.xml is accessible and includes all pages
- robots.txt doesn't block crawlers
- Server-side navigation links exist (in ServerSideSEO component)

**What's Not Working**:

- Main content links (service cards, navigation menus, etc.) are client-side
- Screaming Frog with JavaScript rendering may not wait for full hydration
- Internal links in main content aren't discoverable without JavaScript

**Root Cause**:

- Navigation links in main content are rendered client-side
- Service cards, buttons, and other interactive elements are client-side
- Screaming Frog may not execute JavaScript long enough to discover all links
- Only homepage is discovered because it's the entry point

**Next Steps Required**:

1. Ensure main navigation is server-rendered (not just in ServerSideSEO)
2. Ensure service cards and links are in server-rendered HTML
3. Test Screaming Frog crawl after implementing server-side links
4. Verify all pages are discovered via:
   - Sitemap.xml ✅ (should work)
   - Internal links in main content ❌ (needs fixing)
   - Direct URL entry ✅ (should work)

**Note**: Sitemap.xml should allow Screaming Frog to discover all pages even if internal links aren't server-rendered. If it's only finding the homepage, there may be additional issues with:

- Sitemap.xml accessibility
- robots.txt configuration
- JavaScript rendering settings in Screaming Frog

---

## Summary of Status

| Finding                                         | Status     | Priority | Notes                                   |
| ----------------------------------------------- | ---------- | -------- | --------------------------------------- |
| **1. Content not visible in Page Source**       | ⚠️ PENDING | HIGH     | SEO content visible, main content not   |
| **2. Google URL Inspection shows blank page**   | ⚠️ PENDING | HIGH     | Needs main content server-rendered      |
| **3. BAILOUT_TO_CLIENT_SIDE_RENDERING present** | ⚠️ PENDING | MEDIUM   | Expected but should be minimized        |
| **4. Which pages are fully fixed?**             | ⚠️ PENDING | HIGH     | Need to clarify status for agency       |
| **5. Screaming Frog only detects homepage**     | ⚠️ PENDING | HIGH     | Needs server-side links in main content |

---

## What's Left Before More Checks

### Critical Issues (Must Fix Before Re-Testing)

1. **Server-Side Rendering of Main Content**

   - **Problem**: Main page content (service descriptions, facility info, etc.) is client-side only
   - **Impact**: Content not visible in page source, Googlebot sees blank pages
   - **Solution**: Move critical content to server components or ensure it's rendered server-side
   - **Estimated Effort**: 4-8 hours (depending on number of pages)

2. **Server-Side Navigation Links**

   - **Problem**: Main navigation and service card links are client-side rendered
   - **Impact**: Screaming Frog can't discover pages via internal links
   - **Solution**: Ensure main navigation is server-rendered in page HTML
   - **Estimated Effort**: 2-4 hours

3. **Clarify Page Status**
   - **Problem**: Unclear which pages are "fully fixed" vs "partially fixed"
   - **Impact**: SEO agency can't verify individual pages
   - **Solution**: Create clear status document listing each page's SSR status
   - **Estimated Effort**: 1 hour

### Medium Priority Issues

4. **Reduce BAILOUT Templates**

   - **Problem**: Too many client components causing bailouts
   - **Impact**: May affect page quality scores
   - **Solution**: Audit and minimize client-side rendering where possible
   - **Estimated Effort**: 2-4 hours

5. **Verify Sitemap Discovery**
   - **Problem**: Screaming Frog should discover pages via sitemap even if links aren't server-rendered
   - **Impact**: If sitemap isn't working, need to fix sitemap configuration
   - **Solution**: Test sitemap.xml accessibility and verify Screaming Frog can read it
   - **Estimated Effort**: 30 minutes

### Testing Required After Fixes

1. **Page Source Verification**

   - View page source (not Inspect Element) for each page
   - Verify main content is visible in HTML
   - Check that headings, text, and links are in raw HTML

2. **Google URL Inspection**

   - Test each page with Google URL Inspection tool
   - Verify screenshot shows actual content (not blank)
   - Check rendered HTML contains full page content
   - Request indexing for key pages

3. **Screaming Frog Crawl**

   - Run full crawl with JavaScript rendering enabled
   - Verify all 18+ pages are discovered
   - Check that internal links are found
   - Verify content is detected (not just loading states)

4. **Build and Deployment Verification**
   - Clear build cache before deployment (`rm -rf .next`)
   - Verify production build includes server-rendered content
   - Test locally with `npm run build && npm run start`
   - Check server logs for SSR rendering

---

## Recommended Next Steps

### Immediate Actions (Before Next SEO Check)

1. **Audit Current Implementation**

   - [ ] List all pages and their current SSR status
   - [ ] Identify which content is client-side vs server-side
   - [ ] Document what's working vs what needs fixing

2. **Prioritize Pages for Full SSR**

   - [ ] Start with high-traffic pages (homepage, services, book)
   - [ ] Move critical content to server components
   - [ ] Test page source after each change

3. **Fix Server-Side Links**

   - [ ] Ensure main navigation is server-rendered
   - [ ] Ensure service cards have server-rendered links
   - [ ] Test Screaming Frog discovery

4. **Create Status Document**

   - [ ] List each page with clear status (Fully Fixed / Partially Fixed / Pending)
   - [ ] Document what's server-rendered vs client-rendered
   - [ ] Provide to SEO agency for verification

5. **Test After Implementation**
   - [ ] View page source for all pages
   - [ ] Test with Google URL Inspection
   - [ ] Run Screaming Frog crawl
   - [ ] Document results

### Timeline Estimate

- **Audit and Planning**: 2 hours
- **Implement Server-Side Content**: 4-8 hours
- **Implement Server-Side Links**: 2-4 hours
- **Testing and Verification**: 2-3 hours
- **Documentation**: 1 hour

**Total Estimated Time**: 11-18 hours

---

## Technical Notes

### Current Architecture

- **Pages**: Server components with ISR (`revalidate` exports)
- **Client Components**: Dynamically imported with `ssr: true`
- **SEO Content**: `ServerSideSEO` component provides H1, H2, links (off-screen)
- **Main Content**: Client components with `'use client'` directive

### Why Current Approach Has Limitations

1. **ISR with Client Components**: ISR pre-renders page structure, but client components hydrate on the client
2. **Dynamic Imports**: Even with `ssr: true`, client components marked `'use client'` render client-side
3. **Off-Screen SEO**: `ServerSideSEO` content is positioned off-screen, which may not appear in screenshots
4. **Bailout Templates**: Client components trigger bailouts, which is expected but indicates client-side rendering

### Recommended Architecture Changes

1. **Move Static Content to Server Components**

   - Service descriptions
   - Facility information
   - Static text content
   - These don't need client-side interactivity

2. **Keep Interactive Elements Client-Side**

   - Animations
   - Form interactions
   - Dynamic state management
   - These require client-side JavaScript

3. **Hybrid Approach**
   - Server-render critical content
   - Client-render interactive elements
   - Ensure links and navigation are server-rendered

---

**Last Updated**: December 2024  
**Next Review**: After implementing server-side content rendering  
**Status**: ⚠️ **PENDING** - Critical fixes needed before re-testing
