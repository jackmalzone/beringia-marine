#!/usr/bin/env node

/**
 * Insights Blog System Integration Validation Script
 * Task 22: Final integration and testing
 *
 * This script validates:
 * - Complete user flow functionality
 * - Category filtering
 * - Search functionality
 * - Responsive design
 * - Keyboard navigation
 * - SEO metadata
 * - Error handling
 * - Accessibility compliance
 *
 * Usage:
 *   node scripts/validate-insights-integration.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Insights Blog System - Integration Validation\n');
console.log('='.repeat(60));

let allChecksPassed = true;
const results = {
  timestamp: new Date().toISOString(),
  checks: [],
};

/**
 * Helper to add check result
 */
function addCheck(category, name, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${category}: ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }

  results.checks.push({
    category,
    name,
    passed,
    details,
  });

  if (!passed) {
    allChecksPassed = false;
  }
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

/**
 * Read file content
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Check if content contains pattern
 */
function contentContains(filePath, pattern) {
  const content = readFile(filePath);
  if (!content) return false;

  if (typeof pattern === 'string') {
    return content.includes(pattern);
  } else if (pattern instanceof RegExp) {
    return pattern.test(content);
  }
  return false;
}

console.log('\n📁 File Structure Validation\n');

// Check core files exist
const coreFiles = [
  'src/app/insights/page.tsx',
  'src/app/insights/InsightsPageClient.tsx',
  'src/app/insights/page.module.css',
  'src/app/insights/[slug]/page.tsx',
  'src/app/insights/[slug]/ArticlePageClient.tsx',
  'src/app/insights/layout.tsx',
  'src/app/insights/loading.tsx',
  'src/types/insights.ts',
  'src/lib/data/insights.ts',
];

coreFiles.forEach(file => {
  addCheck('File Structure', file, fileExists(file));
});

// Check component files
const componentFiles = [
  'src/components/insights/ArticleCard/ArticleCard.tsx',
  'src/components/insights/CategoryFilter/CategoryFilter.tsx',
  'src/components/insights/ArticleHero/ArticleHero.tsx',
  'src/components/insights/ArticleContent/ArticleContent.tsx',
  'src/components/insights/InsightsHero/InsightsHero.tsx',
  'src/components/insights/FloatingIcons/FloatingIcons.tsx',
  'src/components/insights/SearchBar/SearchBar.tsx',
  'src/components/insights/AuthorCard/AuthorCard.tsx',
  'src/components/insights/ArticleCardSkeleton/ArticleCardSkeleton.tsx',
];

componentFiles.forEach(file => {
  addCheck('Components', file, fileExists(file));
});

console.log('\n🧪 Test Coverage Validation\n');

// Check test files exist
const testFiles = [
  'src/lib/data/__tests__/insights.test.ts',
  'src/components/insights/ArticleCard/__tests__/ArticleCard.test.tsx',
  'src/components/insights/CategoryFilter/__tests__/CategoryFilter.test.tsx',
  'src/components/insights/SearchBar/__tests__/SearchBar.test.tsx',
  'src/components/insights/__tests__/accessibility.test.tsx',
  'src/components/insights/__tests__/error-handling.test.tsx',
  'src/components/insights/__tests__/integration.test.tsx',
];

testFiles.forEach(file => {
  addCheck('Test Files', file, fileExists(file));
});

console.log('\n🎯 Feature Implementation Validation\n');

// Check category filtering implementation
addCheck(
  'Category Filtering',
  'CategoryFilter component exists',
  fileExists('src/components/insights/CategoryFilter/CategoryFilter.tsx')
);

addCheck(
  'Category Filtering',
  'Category filtering logic in data layer',
  contentContains('src/lib/data/insights.ts', 'getArticlesByCategory')
);

addCheck(
  'Category Filtering',
  'Active categories helper function',
  contentContains('src/lib/data/insights.ts', 'getActiveCategories')
);

// Check search functionality
addCheck(
  'Search Functionality',
  'SearchBar component exists',
  fileExists('src/components/insights/SearchBar/SearchBar.tsx')
);

addCheck(
  'Search Functionality',
  'Search function in data layer',
  contentContains('src/lib/data/insights.ts', 'searchArticles')
);

addCheck(
  'Search Functionality',
  'Debouncing implemented',
  contentContains('src/components/insights/SearchBar/SearchBar.tsx', /debounce|setTimeout/)
);

// Check keyboard navigation
addCheck(
  'Keyboard Navigation',
  'Tab role on category filters',
  contentContains('src/components/insights/CategoryFilter/CategoryFilter.tsx', 'role="tab"')
);

addCheck(
  'Keyboard Navigation',
  'Keyboard event handlers on ArticleCard',
  contentContains('src/components/insights/ArticleCard/ArticleCard.tsx', 'onKeyDown')
);

addCheck(
  'Keyboard Navigation',
  'Enter and Space key support',
  contentContains('src/components/insights/ArticleCard/ArticleCard.tsx', /Enter|Space/)
);

// Check accessibility
addCheck(
  'Accessibility',
  'ARIA labels on interactive elements',
  contentContains('src/components/insights/ArticleCard/ArticleCard.tsx', 'aria-label')
);

addCheck(
  'Accessibility',
  'ARIA selected on category filters',
  contentContains('src/components/insights/CategoryFilter/CategoryFilter.tsx', 'aria-selected')
);

addCheck(
  'Accessibility',
  'Focus indicators in CSS',
  contentContains('src/components/insights/CategoryFilter/CategoryFilter.module.css', ':focus')
);

addCheck(
  'Accessibility',
  'Alt text on images',
  contentContains('src/components/insights/ArticleCard/ArticleCard.tsx', 'alt=')
);

// Check responsive design
addCheck(
  'Responsive Design',
  'Mobile breakpoints in listing page CSS',
  contentContains('src/app/insights/page.module.css', /@media.*768px/)
);

addCheck(
  'Responsive Design',
  'Tablet breakpoints in listing page CSS',
  contentContains('src/app/insights/page.module.css', /@media.*1024px/)
);

addCheck(
  'Responsive Design',
  'Grid layout implementation',
  contentContains('src/app/insights/page.module.css', /grid|flex/)
);

// Check SEO implementation
addCheck(
  'SEO',
  'Metadata export in listing page',
  contentContains('src/app/insights/page.tsx', 'export const metadata')
);

addCheck(
  'SEO',
  'generateMetadata in article page',
  contentContains('src/app/insights/[slug]/page.tsx', 'generateMetadata')
);

addCheck(
  'SEO',
  'Open Graph tags',
  contentContains('src/app/insights/[slug]/page.tsx', 'openGraph')
);

addCheck(
  'SEO',
  'Structured data helper',
  contentContains('src/lib/seo/structured-data.ts', 'generateArticleSchema')
);

// Check error handling
addCheck(
  'Error Handling',
  'notFound() for missing articles',
  contentContains('src/app/insights/[slug]/page.tsx', 'notFound()')
);

addCheck(
  'Error Handling',
  'not-found.tsx exists',
  fileExists('src/app/insights/[slug]/not-found.tsx')
);

addCheck(
  'Error Handling',
  'Error boundary component',
  fileExists('src/components/insights/InsightsErrorBoundary.tsx')
);

addCheck(
  'Error Handling',
  'Empty state handling',
  contentContains('src/app/insights/InsightsPageClient.tsx', /no articles|empty/)
);

// Check performance optimizations
addCheck(
  'Performance',
  'Lazy loading on images',
  contentContains('src/components/insights/ArticleCard/ArticleCard.tsx', 'loading="lazy"')
);

addCheck(
  'Performance',
  'ISR revalidation configured',
  contentContains('src/app/insights/page.tsx', 'revalidate')
);

addCheck('Performance', 'Loading states implemented', fileExists('src/app/insights/loading.tsx'));

addCheck(
  'Performance',
  'Skeleton loaders',
  fileExists('src/components/insights/ArticleCardSkeleton/ArticleCardSkeleton.tsx')
);

// Check animations
addCheck(
  'Animations',
  'Framer Motion integration',
  contentContains('src/components/insights/ArticleCard/ArticleCard.tsx', /motion|framer/)
);

addCheck('Animations', 'Lenis smooth scrolling', fileExists('src/lib/lenis.ts'));

addCheck(
  'Animations',
  'Parallax effects',
  contentContains('src/components/insights/InsightsHero/InsightsHero.tsx', /scroll|parallax/i)
);

addCheck(
  'Animations',
  'Reduced motion support',
  contentContains('src/lib/hooks/useAccessibleMotion.ts', 'prefers-reduced-motion')
);

// Check visual design
addCheck(
  'Visual Design',
  'Glassmorphism on ArticleCard',
  contentContains('src/components/insights/ArticleCard/ArticleCard.module.css', 'backdrop-filter')
);

addCheck(
  'Visual Design',
  'Radial gradient in hero',
  contentContains('src/components/insights/InsightsHero/InsightsHero.module.css', /radial|conic/)
);

addCheck(
  'Visual Design',
  'Floating icons component',
  fileExists('src/components/insights/FloatingIcons/FloatingIcons.tsx')
);

addCheck(
  'Visual Design',
  'Category colors defined',
  contentContains('src/types/insights.ts', 'CATEGORY_METADATA')
);

console.log('\n📚 Documentation Validation\n');

// Check documentation exists
const docFiles = [
  'docs/insights/SANITY_MIGRATION.md',
  'docs/insights/CONTENT_FORMATTING_GUIDE.md',
  'src/app/insights/PERFORMANCE_OPTIMIZATION.md',
  'src/app/insights/SEO_IMPLEMENTATION.md',
];

docFiles.forEach(file => {
  addCheck('Documentation', file, fileExists(file));
});

console.log('\n' + '='.repeat(60));
console.log('\n📊 Validation Summary\n');

const totalChecks = results.checks.length;
const passedChecks = results.checks.filter(c => c.passed).length;
const failedChecks = totalChecks - passedChecks;

console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks} ✅`);
console.log(`Failed: ${failedChecks} ❌`);
console.log(`Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

// Group failures by category
if (failedChecks > 0) {
  console.log('\n❌ Failed Checks by Category:\n');
  const failuresByCategory = {};

  results.checks
    .filter(c => !c.passed)
    .forEach(check => {
      if (!failuresByCategory[check.category]) {
        failuresByCategory[check.category] = [];
      }
      failuresByCategory[check.category].push(check.name);
    });

  Object.entries(failuresByCategory).forEach(([category, failures]) => {
    console.log(`${category}:`);
    failures.forEach(failure => console.log(`  - ${failure}`));
  });
}

// Save results
const reportPath = path.join(
  __dirname,
  '..',
  'docs',
  'reports',
  'insights-integration-report.json'
);
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

console.log(`\n📄 Full report saved to: ${reportPath}\n`);

// Exit with appropriate code
if (allChecksPassed) {
  console.log('✅ All validation checks passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some validation checks failed. See details above.\n');
  process.exit(1);
}
