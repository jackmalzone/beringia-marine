#!/usr/bin/env node

/**
 * Technical SEO Validation Script
 *
 * Validates the technical SEO fixes implemented for Vital Ice website:
 * - Domain consistency (www vs non-www)
 * - SSR vs CSR detection
 * - Robots.txt and sitemap accessibility
 * - Canonical URL consistency
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Technical SEO Validation Report\n');

// 1. Check domain consistency in key files
console.log('1. Domain Consistency Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const filesToCheck = [
  'src/app/sitemap.ts',
  'src/lib/config/business-info.ts',
  'src/lib/seo/structured-data.ts',
];

let domainIssues = [];

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');

    // Check for non-www URLs
    const nonWwwMatches = content.match(/https:\/\/vitalicesf\.com(?!\/)/g);
    if (nonWwwMatches) {
      domainIssues.push(`❌ ${file}: Found ${nonWwwMatches.length} non-www URLs`);
    } else {
      console.log(`✅ ${file}: All URLs use www consistently`);
    }
  } else {
    console.log(`⚠️  ${file}: File not found`);
  }
});

if (domainIssues.length > 0) {
  console.log('\nDomain Issues Found:');
  domainIssues.forEach(issue => console.log(issue));
} else {
  console.log('✅ All domains consistent with www.vitalicesf.com');
}

// 2. Check for SSR/CSR issues
console.log('\n2. Server-Side Rendering Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const pageFiles = [
  'src/app/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/about/page.tsx',
  'src/app/services/page.tsx',
  'src/app/experience/page.tsx',
  'src/app/faq/page.tsx',
  'src/app/careers/page.tsx',
  'src/app/partners/page.tsx',
  'src/app/client-policy/page.tsx',
  'src/app/services/cold-plunge/page.tsx',
  'src/app/services/infrared-sauna/page.tsx',
  'src/app/services/traditional-sauna/page.tsx',
  'src/app/services/red-light-therapy/page.tsx',
  'src/app/services/compression-boots/page.tsx',
  'src/app/services/percussion-massage/page.tsx',
  'src/app/insights/page.tsx',
  'src/app/insights/[slug]/page.tsx',
];

let ssrIssues = [];

pageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');

    // Check if page uses dynamic imports with SSR
    if (content.includes('dynamic(') && content.includes('ssr: true')) {
      // Also check for revalidate
      if (content.includes('revalidate')) {
        console.log(`✅ ${file}: Uses SSR-enabled dynamic imports with ISR`);
      } else {
        ssrIssues.push(`⚠️  ${file}: Uses SSR but missing revalidate for ISR`);
      }
    } else if (content.includes('dynamic(') && !content.includes('ssr: true')) {
      ssrIssues.push(`❌ ${file}: Uses dynamic imports without ssr: true`);
    } else if (!content.includes("'use client'") && !content.includes('dynamic(')) {
      // Server component that might be using direct imports (which is fine if the component can SSR)
      console.log(`✅ ${file}: Server component`);
    } else if (content.includes("'use client'") && !content.includes('dynamic(')) {
      ssrIssues.push(`❌ ${file}: Direct import of 'use client' component - needs dynamic import with SSR`);
    } else {
      ssrIssues.push(`❌ ${file}: May have CSR issues - needs review`);
    }
  } else {
    console.log(`⚠️  ${file}: File not found`);
  }
});

if (ssrIssues.length > 0) {
  console.log('\nSSR Issues Found:');
  ssrIssues.forEach(issue => console.log(issue));
} else {
  console.log('✅ All pages properly configured for SSR');
}

// 3. Check robots.ts and sitemap.ts
console.log('\n3. Robots and Sitemap Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (fs.existsSync('src/app/robots.ts')) {
  const robotsContent = fs.readFileSync('src/app/robots.ts', 'utf8');
  if (robotsContent.includes('www.vitalicesf.com/sitemap.xml')) {
    console.log('✅ robots.ts: Correctly references www.vitalicesf.com/sitemap.xml');
  } else {
    console.log('❌ robots.ts: Incorrect sitemap URL reference');
  }
} else {
  console.log('❌ robots.ts: File missing');
}

if (fs.existsSync('src/app/sitemap.ts')) {
  const sitemapContent = fs.readFileSync('src/app/sitemap.ts', 'utf8');
  if (sitemapContent.includes('www.vitalicesf.com')) {
    console.log('✅ sitemap.ts: Uses www.vitalicesf.com consistently');
  } else {
    console.log('❌ sitemap.ts: Does not use www consistently');
  }
} else {
  console.log('❌ sitemap.ts: File missing');
}

// 4. Check for geo meta tags
console.log('\n4. Geo Meta Tags Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const contactPage = 'src/app/contact/page.tsx';
if (fs.existsSync(contactPage)) {
  const content = fs.readFileSync(contactPage, 'utf8');
  if (content.includes('geo.region') && content.includes('geo.placename')) {
    console.log('✅ Contact page: Geo meta tags implemented');
  } else {
    console.log('❌ Contact page: Missing geo meta tags');
  }
}

// 5. Summary
console.log('\n📊 Summary');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const totalIssues = domainIssues.length + ssrIssues.length;
if (totalIssues === 0) {
  console.log('🎉 All technical SEO checks passed!');
  console.log('\nNext steps:');
  console.log('1. Deploy changes to production');
  console.log('2. Test with "Fetch as Google" in Search Console');
  console.log('3. Verify sitemap accessibility at www.vitalicesf.com/sitemap.xml');
  console.log('4. Check robots.txt at www.vitalicesf.com/robots.txt');
} else {
  console.log(`⚠️  Found ${totalIssues} issues that need attention`);
  console.log('\nPlease fix the issues above before deploying to production.');
}

console.log('\n' + '='.repeat(50));
