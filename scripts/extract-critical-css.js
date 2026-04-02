#!/usr/bin/env node

/**
 * Script to extract critical CSS from existing stylesheets
 * This helps identify which styles are needed for above-the-fold content
 */

const fs = require('fs');
const path = require('path');

// Critical selectors that should be included in critical CSS
const criticalSelectors = [
  // Base styles
  ':root',
  '*',
  'html',
  'body',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',

  // Header components
  '.header',
  '.logoLink',
  '.logo',
  '.desktopNav',
  '.iceCube',

  // Hero section
  '.hero',
  '.hero__content',
  '.hero__textContainer',
  '.hero__location',
  '.hero__logoContainer',
  '.heroLogo',
  '.hero__headline',
  '.hero__button',
  '.hero__gradientOverlay',

  // Loading states
  '.sectionLoading',
  '.video-loading',

  // Layout
  '.mainContainer',

  // Error boundaries
  '.page-error-container',
  '.error-boundary-page',
];

/**
 * Check if a CSS rule is critical
 */
function isCriticalRule(rule) {
  if (!rule.selectorText) return false;

  return criticalSelectors.some(selector => {
    return rule.selectorText.includes(selector);
  });
}

/**
 * Extract critical CSS from a CSS file
 */
function extractCriticalCSS(cssContent) {
  const criticalRules = [];

  // Simple regex-based extraction (for basic CSS)
  const rules = cssContent.match(/[^{}]+\{[^{}]*\}/g) || [];

  rules.forEach(rule => {
    const selector = rule.split('{')[0].trim();

    if (
      criticalSelectors.some(criticalSelector => {
        return selector.includes(criticalSelector);
      })
    ) {
      criticalRules.push(rule);
    }
  });

  return criticalRules.join('\n\n');
}

/**
 * Process CSS files and extract critical CSS
 */
function processCSSFiles() {
  const srcDir = path.join(__dirname, '../src');
  const criticalCSSPath = path.join(srcDir, 'styles/critical.css');

  console.log('🔍 Extracting critical CSS...');

  // Find all CSS files
  const cssFiles = [];

  function findCSSFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findCSSFiles(filePath);
      } else if (file.endsWith('.css') || file.endsWith('.module.css')) {
        cssFiles.push(filePath);
      }
    });
  }

  findCSSFiles(srcDir);

  console.log(`📁 Found ${cssFiles.length} CSS files`);

  let allCriticalCSS = '';

  cssFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const critical = extractCriticalCSS(content);

      if (critical) {
        allCriticalCSS += `\n/* From ${path.relative(srcDir, file)} */\n${critical}\n`;
      }
    } catch (error) {
      console.warn(`⚠️  Could not process ${file}:`, error.message);
    }
  });

  // Add base critical CSS
  const baseCriticalCSS = `
/* Critical CSS Variables */
:root {
  --font-heading: 'Bebas Neue', sans-serif;
  --font-body: 'Montserrat', sans-serif;
  --font-ui: 'Inter', sans-serif;
  --color-primary: #00b7b5;
  --color-background: #000000;
  --color-text: #ffffff;
}

/* Critical Base Styles */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-background);
  overflow-x: hidden;
}
`;

  const finalCSS = baseCriticalCSS + allCriticalCSS;

  // Ensure styles directory exists
  const stylesDir = path.dirname(criticalCSSPath);
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
  }

  // Write critical CSS
  fs.writeFileSync(criticalCSSPath, finalCSS);

  console.log(`✅ Critical CSS extracted to ${path.relative(process.cwd(), criticalCSSPath)}`);
  console.log(`📊 Size: ${(finalCSS.length / 1024).toFixed(2)} KB`);
}

/**
 * Analyze CSS usage and provide recommendations
 */
function analyzeCSSUsage() {
  console.log('\n📈 CSS Usage Analysis:');

  const recommendations = [
    '• Inline critical CSS in HTML head for faster FCP',
    '• Load non-critical CSS asynchronously after page load',
    '• Use CSS containment for better rendering performance',
    '• Consider CSS-in-JS for component-specific styles',
    '• Minimize CSS bundle size with tree-shaking',
  ];

  recommendations.forEach(rec => console.log(rec));
}

// Run the script
if (require.main === module) {
  processCSSFiles();
  analyzeCSSUsage();
}

module.exports = {
  extractCriticalCSS,
  isCriticalRule,
  criticalSelectors,
};
