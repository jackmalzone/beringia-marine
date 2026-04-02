# Git Commit Instructions for SEO Fixes

Run these commands to commit the SEO updates:

## Step 1: Check Status
```bash
git status
```

## Step 2: Stage Changes

### Core SEO Fixes
```bash
# Dynamic sitemap with insights articles
git add apps/web/src/app/sitemap.ts

# Exact canonical URLs for article pages
git add apps/web/src/app/insights/[slug]/page.tsx

# Visible navigation components for crawlers
git add apps/web/src/components/layout/Navigation/VisibleNavigation.tsx
git add apps/web/src/components/pages/ServicesPage/VisibleServiceLinks.tsx

# Updated layout to include visible navigation
git add apps/web/src/app/layout.tsx
git add apps/web/src/app/services/page.tsx
```

### Documentation
```bash
# SEO documentation
git add docs/seo/SEO_FOLLOWUP_RESPONSE.md
git add docs/seo/SEO_FOLLOWUP_PLAN.md
git add docs/seo/VERIFICATION_GUIDE.md
git add docs/seo/QUICK_VERIFICATION.md
git add docs/seo/TEST_SITEMAP_LOCALLY.md

# Scripts
git add scripts/verify-seo.sh
git add scripts/test-sitemap-local.sh
```

## Step 3: Make Commits

### Commit 1: Dynamic Sitemap and Canonical URLs
```bash
git commit -m "feat(seo): Add dynamic sitemap with insights articles and exact canonical URLs

- Update sitemap.ts to dynamically fetch and include all insights articles
- Set exact canonical URLs for article pages (matches page URL)
- Articles now appear in sitemap automatically when published
- Fixes SEO agency issue: sitemap not updating with new blog posts"
```

### Commit 2: Server-Rendered Navigation Links
```bash
git commit -m "feat(seo): Add visible server-rendered navigation for crawlers

- Add VisibleNavigation component with all main navigation links
- Add VisibleServiceLinks component with service page links
- Links are server-rendered and in HTML source for Screaming Frog discovery
- Fixes SEO agency issue: Screaming Frog only detecting homepage"
```

### Commit 3: Documentation and Verification Tools
```bash
git commit -m "docs(seo): Add comprehensive verification guides and response documentation

- Add SEO_FOLLOWUP_RESPONSE.md for agency communication
- Add VERIFICATION_GUIDE.md with detailed testing methods
- Add QUICK_VERIFICATION.md for quick reference
- Add TEST_SITEMAP_LOCALLY.md for local testing
- Add verification scripts for automated testing"
```

## Step 4: Push Changes
```bash
git push
```

---

## Or: Single Commit (if you prefer)

```bash
git add -A
git commit -m "feat(seo): Fix dynamic sitemap, canonical URLs, and crawler discovery

- Update sitemap.ts to dynamically include insights articles
- Set exact canonical URLs for article pages
- Add visible server-rendered navigation links for Screaming Frog
- Add comprehensive SEO verification documentation and scripts

Fixes:
- Sitemap not updating with new blog posts
- Canonical URLs should match exact page URLs
- Screaming Frog discovery issues"
git push
```
