#!/bin/bash

# Script to commit SEO changes in logical groups
# Usage: ./scripts/commit-seo-changes.sh

cd /Users/malzone/projects/vital-ice || exit 1

echo "Committing SEO changes..."

# Commit 1: Dynamic sitemap and canonical URLs
echo "Commit 1: Dynamic sitemap and canonical URLs"
git add apps/web/src/app/sitemap.ts
git add "apps/web/src/app/insights/[slug]/page.tsx"
git commit -m "feat(seo): Add dynamic sitemap with insights articles and exact canonical URLs

- Update sitemap.ts to dynamically fetch and include all insights articles
- Articles now appear in sitemap automatically when published
- Set exact canonical URLs for article pages (matches page URL exactly)
- Fixes SEO agency issues: sitemap not updating with new blog posts and canonical URL requirements"

# Commit 2: Server-rendered navigation links
echo "Commit 2: Server-rendered navigation links"
git add apps/web/src/components/layout/Navigation/VisibleNavigation.tsx
git add apps/web/src/components/pages/ServicesPage/VisibleServiceLinks.tsx
git add apps/web/src/app/layout.tsx
git add apps/web/src/app/services/page.tsx
git commit -m "feat(seo): Add visible server-rendered navigation for crawler discovery

- Add VisibleNavigation component with all main navigation links
- Add VisibleServiceLinks component with service page links
- Links are server-rendered and in HTML source for Screaming Frog discovery
- Fixes SEO agency issue: Screaming Frog only detecting homepage"

# Commit 3: Homepage SEO content improvements
echo "Commit 3: Homepage SEO content improvements"
git add apps/web/src/components/pages/HomePage/HomePageContent.tsx
git add apps/web/src/app/page.tsx
git commit -m "feat(seo): Add comprehensive SEO content to homepage

- Add H1 tag: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco'
- Add multiple H2 tags (Our Mission, Wellness Services, Site Navigation, etc.)
- Add extensive descriptive content (600+ words) for word count
- Add all internal navigation links and service links in HTML source
- Fixes Screaming Frog issues: missing H1, missing H2, low word count, no internal links"

# Commit 4: Slug validation fix
echo "Commit 4: Slug validation fix"
git add "apps/web/src/app/[slug]/page.tsx"
git commit -m "fix(seo): Fix slug validation errors during static generation

- Add normalizeSlug function to decode URL-encoded slugs
- Validate slugs before querying Sanity to prevent validation errors
- Filter out invalid slugs (like %2F) during static generation
- Prevents build failures from invalid slugs"

# Commit 5: Documentation
echo "Commit 5: Documentation and verification guides"
git add docs/seo/
git add scripts/verify-seo.sh
git add scripts/test-sitemap-local.sh
git commit -m "docs(seo): Add comprehensive SEO documentation and verification guides

- Add SEO_FOLLOWUP_RESPONSE.md for agency communication
- Add VERIFICATION_GUIDE.md with detailed testing methods
- Add QUICK_VERIFICATION.md for quick reference
- Add SEO_CHANGES_EMAIL_PLAIN.txt for agency update
- Add verification scripts for automated testing"

# Push all commits
echo "Pushing commits..."
git push

echo "Done! All SEO changes committed and pushed."
