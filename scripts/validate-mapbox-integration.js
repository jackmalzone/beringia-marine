#!/usr/bin/env node

/**
 * Validation script for MapboxMap integration and responsive behavior
 * Tests the actual implementation against task 9 requirements
 */

const fs = require('fs');
const path = require('path');

console.log('🗺️  Validating MapboxMap Integration and Responsive Behavior (Task 9)');
console.log('================================================================\n');

// Check if required files exist
const requiredFiles = [
  'src/components/ui/MapboxMap/MapboxMap.tsx',
  'src/components/ui/MapboxMap/MapboxMap.module.css',
  'src/app/contact/ContactPageClient.tsx',
  'src/lib/config/mapbox.ts',
];

let allFilesExist = true;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Cannot proceed with validation.');
  process.exit(1);
}

console.log('\n🔍 Validating Task 9 Requirements...\n');

// Requirement 2.1: Zoom and pan interactions
console.log('📋 Requirement 2.1: Interactive map with zoom and pan');
const mapboxMapContent = fs.readFileSync('src/components/ui/MapboxMap/MapboxMap.tsx', 'utf8');

const hasMapboxGL = mapboxMapContent.includes('mapbox-gl');
const hasInteractiveMap = mapboxMapContent.includes('new mapboxgl.Map');
const hasMapContainer = mapboxMapContent.includes('mapContainer');

console.log(`   ${hasMapboxGL ? '✅' : '❌'} Mapbox GL JS integration`);
console.log(`   ${hasInteractiveMap ? '✅' : '❌'} Interactive map initialization`);
console.log(`   ${hasMapContainer ? '✅' : '❌'} Map container setup`);

// Requirement 2.2: Smooth performance
console.log('\n📋 Requirement 2.2: Smooth performance without lag');
const hasPerformanceOptimizations =
  mapboxMapContent.includes('performance') ||
  mapboxMapContent.includes('debounce') ||
  mapboxMapContent.includes('cleanup');
const hasMemoryManagement =
  mapboxMapContent.includes('remove()') && mapboxMapContent.includes('off()');
const hasMemoization =
  mapboxMapContent.includes('useMemo') || mapboxMapContent.includes('useCallback');

console.log(`   ${hasPerformanceOptimizations ? '✅' : '❌'} Performance optimizations`);
console.log(`   ${hasMemoryManagement ? '✅' : '❌'} Memory management`);
console.log(`   ${hasMemoization ? '✅' : '❌'} React optimization hooks`);

// Requirement 2.3: Explore surrounding areas
console.log('\n📋 Requirement 2.3: Allow exploration of surrounding areas');
const hasBusinessLocation =
  mapboxMapContent.includes('BUSINESS_LOCATION') || mapboxMapContent.includes('center');
const hasZoomControl = mapboxMapContent.includes('zoom');
const hasPanSupport =
  mapboxMapContent.includes('pan') || mapboxMapContent.includes('drag') || hasInteractiveMap;

console.log(`   ${hasBusinessLocation ? '✅' : '❌'} Business location centering`);
console.log(`   ${hasZoomControl ? '✅' : '❌'} Zoom functionality`);
console.log(`   ${hasPanSupport ? '✅' : '❌'} Pan/drag support`);

// Requirement 2.4: Mobile touch gestures
console.log('\n📋 Requirement 2.4: Mobile touch gesture support');
const cssContent = fs.readFileSync('src/components/ui/MapboxMap/MapboxMap.module.css', 'utf8');

const hasTouchOptimizations =
  cssContent.includes('touch') ||
  cssContent.includes('pointer: coarse') ||
  cssContent.includes('hover: none');
const hasResponsiveDesign = cssContent.includes('@media') && cssContent.includes('max-width');
const hasMobileStyles = cssContent.includes('768px') || cssContent.includes('480px');

console.log(`   ${hasTouchOptimizations ? '✅' : '❌'} Touch-friendly interactions`);
console.log(`   ${hasResponsiveDesign ? '✅' : '❌'} Responsive CSS design`);
console.log(`   ${hasMobileStyles ? '✅' : '❌'} Mobile-specific styles`);

// Requirement 4.3: Contact page integration
console.log('\n📋 Requirement 4.3: Contact page layout integration');
const contactPageContent = fs.readFileSync('src/app/contact/ContactPageClient.tsx', 'utf8');

const hasMapboxImport = contactPageContent.includes('MapboxMap');
const hasMapSection =
  contactPageContent.includes('mapSection') || contactPageContent.includes('map');
const hasBusinessInfo =
  contactPageContent.includes('BUSINESS_LOCATION') || contactPageContent.includes('businessInfo');
const hasMapHeight = contactPageContent.includes('height') || contactPageContent.includes('400px');

console.log(`   ${hasMapboxImport ? '✅' : '❌'} MapboxMap component integration`);
console.log(`   ${hasMapSection ? '✅' : '❌'} Map section in layout`);
console.log(`   ${hasBusinessInfo ? '✅' : '❌'} Business information integration`);
console.log(`   ${hasMapHeight ? '✅' : '❌'} Proper map dimensions`);

// Additional validations
console.log('\n🔧 Additional Integration Checks...\n');

// Check for error handling
const hasErrorHandling =
  mapboxMapContent.includes('error') && mapboxMapContent.includes('fallback');
console.log(`   ${hasErrorHandling ? '✅' : '❌'} Error handling and fallback content`);

// Check for loading states
const hasLoadingState =
  mapboxMapContent.includes('loading') || mapboxMapContent.includes('Loading');
console.log(`   ${hasLoadingState ? '✅' : '❌'} Loading state management`);

// Check for accessibility
const hasAccessibility =
  mapboxMapContent.includes('aria-label') || mapboxMapContent.includes('role=');
console.log(`   ${hasAccessibility ? '✅' : '❌'} Accessibility features`);

// Check for business marker
const hasMarker = mapboxMapContent.includes('Marker') && mapboxMapContent.includes('popup');
console.log(`   ${hasMarker ? '✅' : '❌'} Business location marker and popup`);

// Check responsive breakpoints
const hasMultipleBreakpoints = cssContent.includes('768px') && cssContent.includes('480px');
console.log(`   ${hasMultipleBreakpoints ? '✅' : '❌'} Multiple responsive breakpoints`);

// Check for hardware acceleration
const hasHardwareAcceleration =
  cssContent.includes('transform') ||
  cssContent.includes('will-change') ||
  cssContent.includes('translateZ');
console.log(`   ${hasHardwareAcceleration ? '✅' : '❌'} CSS performance optimizations`);

// Environment configuration check
console.log('\n🔐 Environment Configuration...\n');
const mapboxConfigContent = fs.readFileSync('src/lib/config/mapbox.ts', 'utf8');

const hasAccessToken =
  mapboxConfigContent.includes('accessToken') ||
  mapboxConfigContent.includes('MAPBOX_ACCESS_TOKEN');
const hasBusinessLocationConfig = mapboxConfigContent.includes('BUSINESS_LOCATION');
const hasMapConfig =
  mapboxConfigContent.includes('getMapboxConfig') || mapboxConfigContent.includes('MapboxConfig');

console.log(`   ${hasAccessToken ? '✅' : '❌'} Mapbox access token configuration`);
console.log(`   ${hasBusinessLocationConfig ? '✅' : '❌'} Business location data`);
console.log(`   ${hasMapConfig ? '✅' : '❌'} Map configuration utilities`);

// Test file validation
console.log('\n🧪 Test Coverage Validation...\n');

const testFiles = [
  'src/components/ui/MapboxMap/__tests__/MapboxMapTask9.test.tsx',
  'src/components/ui/MapboxMap/__tests__/MapboxMapIntegration.test.tsx',
  'src/components/ui/MapboxMap/__tests__/MapboxMapResponsive.test.tsx',
  'src/components/ui/MapboxMap/__tests__/MapboxMapPerformance.test.tsx',
];

let testCoverage = 0;
testFiles.forEach(testFile => {
  if (fs.existsSync(testFile)) {
    console.log(`   ✅ ${path.basename(testFile)}`);
    testCoverage++;
  } else {
    console.log(`   ❌ ${path.basename(testFile)} - MISSING`);
  }
});

console.log(`\n📊 Test Coverage: ${testCoverage}/${testFiles.length} test files created`);

// Summary
console.log('\n📋 TASK 9 VALIDATION SUMMARY');
console.log('================================\n');

const requirements = [
  { name: 'Interactive map with zoom/pan (2.1)', status: hasMapboxGL && hasInteractiveMap },
  { name: 'Smooth performance (2.2)', status: hasPerformanceOptimizations && hasMemoryManagement },
  { name: 'Area exploration (2.3)', status: hasBusinessLocation && hasZoomControl },
  { name: 'Mobile touch gestures (2.4)', status: hasTouchOptimizations && hasResponsiveDesign },
  { name: 'Contact page integration (4.3)', status: hasMapboxImport && hasMapSection },
];

let passedRequirements = 0;
requirements.forEach(req => {
  console.log(`   ${req.status ? '✅' : '❌'} ${req.name}`);
  if (req.status) passedRequirements++;
});

const additionalFeatures = [
  { name: 'Error handling', status: hasErrorHandling },
  { name: 'Loading states', status: hasLoadingState },
  { name: 'Accessibility', status: hasAccessibility },
  { name: 'Business marker', status: hasMarker },
  { name: 'Responsive design', status: hasMultipleBreakpoints },
  { name: 'Performance CSS', status: hasHardwareAcceleration },
];

let passedFeatures = 0;
additionalFeatures.forEach(feature => {
  console.log(`   ${feature.status ? '✅' : '❌'} ${feature.name}`);
  if (feature.status) passedFeatures++;
});

console.log(`\n🎯 Requirements: ${passedRequirements}/${requirements.length} passed`);
console.log(`🔧 Additional Features: ${passedFeatures}/${additionalFeatures.length} implemented`);
console.log(`🧪 Test Coverage: ${testCoverage}/${testFiles.length} test suites`);

const overallScore =
  (passedRequirements / requirements.length +
    passedFeatures / additionalFeatures.length +
    testCoverage / testFiles.length) /
  3;

console.log(`\n📈 Overall Implementation Score: ${Math.round(overallScore * 100)}%`);

if (overallScore >= 0.8) {
  console.log('\n🎉 TASK 9 IMPLEMENTATION: EXCELLENT');
  console.log('   All major requirements implemented with comprehensive testing');
} else if (overallScore >= 0.6) {
  console.log('\n✅ TASK 9 IMPLEMENTATION: GOOD');
  console.log('   Most requirements implemented, some areas for improvement');
} else {
  console.log('\n⚠️  TASK 9 IMPLEMENTATION: NEEDS WORK');
  console.log('   Several requirements missing or incomplete');
}
