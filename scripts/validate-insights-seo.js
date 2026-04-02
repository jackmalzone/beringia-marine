#!/usr/bin/env node

/**
 * Validation script for Insights blog SEO implementation
 * Checks that all required SEO components are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Insights Blog SEO Implementation...\n');

let hasErrors = false;

// Check 1: Verify metadata.ts has insights configuration
console.log('✓ Checking metadata configuration...');
const metadataPath = path.join(__dirname, '../src/lib/seo/metadata.ts');
const metadataContent = fs.readFileSync(metadataPath, 'utf-8');

if (!metadataContent.includes('insights:')) {
  console.error('  ✗ Missing insights metadata configuration');
  hasErrors = true;
} else if (!metadataContent.includes('Wellness Insights & Recovery Research')) {
  console.error('  ✗ Insights metadata title not found');
  hasErrors = true;
} else {
  console.log('  ✓ Insights metadata configured correctly');
}

// Check 2: Verify structured-data.ts has article schema functions
console.log('✓ Checking structured data functions...');
const structuredDataPath = path.join(__dirname, '../src/lib/seo/structured-data.ts');
const structuredDataContent = fs.readFileSync(structuredDataPath, 'utf-8');

const requiredFunctions = [
  'generateArticleSchema',
  'generateArticleBreadcrumb',
  'generateBlogSchema',
];

requiredFunctions.forEach(funcName => {
  if (!structuredDataContent.includes(`export function ${funcName}`)) {
    console.error(`  ✗ Missing function: ${funcName}`);
    hasErrors = true;
  } else {
    console.log(`  ✓ Function ${funcName} exists`);
  }
});

// Check 3: Verify Article interface exists
if (!structuredDataContent.includes('export interface Article')) {
  console.error('  ✗ Missing Article interface');
  hasErrors = true;
} else {
  console.log('  ✓ Article interface defined');
}

// Check 4: Verify Blog interface exists
if (!structuredDataContent.includes('export interface Blog')) {
  console.error('  ✗ Missing Blog interface');
  hasErrors = true;
} else {
  console.log('  ✓ Blog interface defined');
}

// Check 5: Verify insights breadcrumb exists
if (!structuredDataContent.includes('insights:')) {
  console.error('  ✗ Missing insights breadcrumb schema');
  hasErrors = true;
} else {
  console.log('  ✓ Insights breadcrumb schema exists');
}

// Check 6: Verify article page has structured data
console.log('✓ Checking article page implementation...');
const articlePagePath = path.join(__dirname, '../src/app/insights/[slug]/page.tsx');
const articlePageContent = fs.readFileSync(articlePagePath, 'utf-8');

if (!articlePageContent.includes('generateArticleSchema')) {
  console.error('  ✗ Article page missing generateArticleSchema import');
  hasErrors = true;
} else {
  console.log('  ✓ Article page imports generateArticleSchema');
}

if (!articlePageContent.includes('generateArticleBreadcrumb')) {
  console.error('  ✗ Article page missing generateArticleBreadcrumb import');
  hasErrors = true;
} else {
  console.log('  ✓ Article page imports generateArticleBreadcrumb');
}

if (!articlePageContent.includes('type="application/ld+json"')) {
  console.error('  ✗ Article page missing JSON-LD script tags');
  hasErrors = true;
} else {
  console.log('  ✓ Article page includes JSON-LD script tags');
}

if (!articlePageContent.includes('generateMetadata')) {
  console.error('  ✗ Article page missing generateMetadata function');
  hasErrors = true;
} else {
  console.log('  ✓ Article page has generateMetadata function');
}

// Check 7: Verify listing page has structured data
console.log('✓ Checking listing page implementation...');
const listingPagePath = path.join(__dirname, '../src/app/insights/page.tsx');
const listingPageContent = fs.readFileSync(listingPagePath, 'utf-8');

if (!listingPageContent.includes('generateBlogSchema')) {
  console.error('  ✗ Listing page missing generateBlogSchema import');
  hasErrors = true;
} else {
  console.log('  ✓ Listing page imports generateBlogSchema');
}

if (!listingPageContent.includes('breadcrumbSchemas')) {
  console.error('  ✗ Listing page missing breadcrumbSchemas import');
  hasErrors = true;
} else {
  console.log('  ✓ Listing page imports breadcrumbSchemas');
}

if (!listingPageContent.includes('type="application/ld+json"')) {
  console.error('  ✗ Listing page missing JSON-LD script tags');
  hasErrors = true;
} else {
  console.log('  ✓ Listing page includes JSON-LD script tags');
}

// Check 8: Verify metadata includes Open Graph and Twitter Card
console.log('✓ Checking Open Graph and Twitter Card configuration...');

if (!articlePageContent.includes('openGraph:')) {
  console.error('  ✗ Article page missing Open Graph configuration');
  hasErrors = true;
} else {
  console.log('  ✓ Article page has Open Graph configuration');
}

if (!articlePageContent.includes('twitter:')) {
  console.error('  ✗ Article page missing Twitter Card configuration');
  hasErrors = true;
} else {
  console.log('  ✓ Article page has Twitter Card configuration');
}

// Check 9: Verify tests exist
console.log('✓ Checking test coverage...');
const testPath = path.join(__dirname, '../src/lib/seo/__tests__/insights-seo.test.ts');

if (!fs.existsSync(testPath)) {
  console.error('  ✗ Missing insights SEO tests');
  hasErrors = true;
} else {
  const testContent = fs.readFileSync(testPath, 'utf-8');

  const testSuites = [
    'Article Schema',
    'Breadcrumb Schema',
    'Blog Schema',
    'Structured Data Generation',
  ];

  testSuites.forEach(suite => {
    if (!testContent.includes(suite)) {
      console.error(`  ✗ Missing test suite: ${suite}`);
      hasErrors = true;
    } else {
      console.log(`  ✓ Test suite exists: ${suite}`);
    }
  });
}

// Check 10: Verify documentation exists
console.log('✓ Checking documentation...');
const docPath = path.join(__dirname, '../src/app/insights/SEO_IMPLEMENTATION.md');

if (!fs.existsSync(docPath)) {
  console.error('  ✗ Missing SEO implementation documentation');
  hasErrors = true;
} else {
  console.log('  ✓ SEO implementation documentation exists');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Validation failed! Please fix the errors above.');
  process.exit(1);
} else {
  console.log('✅ All SEO components validated successfully!');
  console.log('\nNext steps:');
  console.log('1. Run tests: npm test -- src/lib/seo/__tests__/insights-seo.test.ts');
  console.log('2. Test with Google Rich Results: https://search.google.com/test/rich-results');
  console.log('3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/');
  console.log('4. Test with Twitter Card Validator: https://cards-dev.twitter.com/validator');
  process.exit(0);
}
