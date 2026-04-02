#!/usr/bin/env node

/**
 * Accessibility Validation Script for MapboxMap Component
 * Validates that accessibility features are properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating MapboxMap Accessibility Implementation...\n');

// Check MapboxMap component file
const mapboxMapPath = path.join(__dirname, '../src/components/ui/MapboxMap/MapboxMap.tsx');
const mapboxMapContent = fs.readFileSync(mapboxMapPath, 'utf8');

// Check CSS file
const cssPath = path.join(__dirname, '../src/components/ui/MapboxMap/MapboxMap.module.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

let passed = 0;
let total = 0;

function checkFeature(description, condition) {
  total++;
  if (condition) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
  }
}

console.log('📋 Checking ARIA Implementation:');
checkFeature('ARIA region role for map container', mapboxMapContent.includes('role="region"'));
checkFeature(
  'ARIA application role for map instance',
  mapboxMapContent.includes('role="application"')
);
checkFeature('ARIA status role for loading state', mapboxMapContent.includes('role="status"'));
checkFeature(
  'ARIA live region for screen readers',
  mapboxMapContent.includes('aria-live="polite"')
);
checkFeature('ARIA labels for interactive elements', mapboxMapContent.includes('aria-label='));
checkFeature('ARIA describedby for instructions', mapboxMapContent.includes('aria-describedby='));

console.log('\n⌨️  Checking Keyboard Navigation:');
checkFeature('Keyboard navigation enabled in config', mapboxMapContent.includes('keyboard: true'));
checkFeature(
  'Arrow key navigation handler',
  mapboxMapContent.includes('ArrowUp') && mapboxMapContent.includes('ArrowDown')
);
checkFeature(
  'Zoom keyboard shortcuts',
  mapboxMapContent.includes('zoomIn()') && mapboxMapContent.includes('zoomOut()')
);
checkFeature(
  'Enter/Space key support',
  mapboxMapContent.includes('Enter') && mapboxMapContent.includes('Space')
);
checkFeature('Escape key support', mapboxMapContent.includes('Escape'));

console.log('\n🎯 Checking Focus Management:');
checkFeature(
  'Tabindex management',
  mapboxMapContent.includes('tabIndex=') || mapboxMapContent.includes('tabindex=')
);
checkFeature('Focus after popup open', mapboxMapContent.includes('focusAfterOpen: true'));
checkFeature('Focus return on popup close', mapboxMapContent.includes('focus()'));

console.log('\n📱 Checking Screen Reader Support:');
checkFeature(
  'Screen reader only class',
  cssContent.includes('.srOnly') || cssContent.includes('sr-only')
);
checkFeature('Business info in instructions', mapboxMapContent.includes('businessInfo?.name'));
checkFeature(
  'Live announcements for popup',
  mapboxMapContent.includes('aria-live') && mapboxMapContent.includes('announcement')
);

console.log('\n🎨 Checking CSS Accessibility:');
checkFeature('Focus indicators', cssContent.includes(':focus'));
checkFeature('High contrast support', cssContent.includes('prefers-contrast: high'));
checkFeature('Reduced motion support', cssContent.includes('prefers-reduced-motion'));
checkFeature(
  'Screen reader only styles',
  cssContent.includes('position: absolute') && cssContent.includes('width: 1px')
);

console.log('\n🔧 Checking Popup Accessibility:');
checkFeature('Popup dialog role', mapboxMapContent.includes('role="dialog"'));
checkFeature('Popup ARIA labelledby', mapboxMapContent.includes('aria-labelledby='));
checkFeature('Popup ARIA describedby', mapboxMapContent.includes('aria-describedby='));
checkFeature('Accessible phone links', mapboxMapContent.includes('aria-label="Call'));

console.log('\n📊 Results:');
console.log(`Passed: ${passed}/${total} accessibility checks`);

if (passed === total) {
  console.log('🎉 All accessibility features are properly implemented!');
  process.exit(0);
} else {
  console.log(`⚠️  ${total - passed} accessibility features need attention.`);
  process.exit(1);
}
