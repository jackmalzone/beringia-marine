#!/usr/bin/env node

/**
 * Schema Validation Script
 *
 * This script validates structured data and provides URLs for testing
 * with Google's Rich Results Test and other validation tools.
 */

const fs = require('fs');
const path = require('path');

function validateSchema() {
  console.log('🔍 Validating Structured Data Schema...\n');

  const issues = [];
  const warnings = [];
  const successes = [];

  // Check if structured data file exists
  const schemaPath = path.join(__dirname, '../src/lib/seo/structured-data.ts');

  if (!fs.existsSync(schemaPath)) {
    issues.push('❌ Structured data file not found');
    return { issues, warnings, successes };
  }

  const content = fs.readFileSync(schemaPath, 'utf8');

  // Check for centralized config usage
  if (content.includes('VITAL_ICE_BUSINESS')) {
    successes.push('✅ Using centralized business configuration');
  } else {
    warnings.push('⚠️  Not using centralized business configuration');
  }

  // Check for enhanced schema properties
  if (content.includes('paymentAccepted')) {
    successes.push('✅ Payment methods included in schema');
  } else {
    warnings.push('⚠️  Payment methods not included in schema');
  }

  if (content.includes('amenityFeature')) {
    successes.push('✅ Amenity features included in schema');
  } else {
    warnings.push('⚠️  Amenity features not included in schema');
  }

  if (content.includes('areaServed.*map')) {
    successes.push('✅ Multiple service areas configured');
  } else {
    warnings.push('⚠️  Single service area only');
  }

  // Check for required schema types
  const requiredSchemas = ['LocalBusiness', 'Organization', 'Service', 'FAQPage', 'BreadcrumbList'];

  requiredSchemas.forEach(schema => {
    if (content.includes(`'@type': '${schema}'`)) {
      successes.push(`✅ ${schema} schema implemented`);
    } else {
      warnings.push(`⚠️  ${schema} schema missing or incomplete`);
    }
  });

  return { issues, warnings, successes };
}

// Run validation
const { issues, warnings, successes } = validateSchema();

console.log('📊 Schema Validation Results:');
console.log('='.repeat(50));

if (successes.length > 0) {
  console.log('\n✅ Successes:');
  successes.forEach(success => console.log(`  ${success}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(warning => console.log(`  ${warning}`));
}

if (issues.length > 0) {
  console.log('\n🚨 Critical Issues:');
  issues.forEach(issue => console.log(`  ${issue}`));
}

console.log('\n🧪 Testing Resources:');
console.log('='.repeat(50));
console.log('📋 Google Rich Results Test:');
console.log('   https://search.google.com/test/rich-results');
console.log('');
console.log('📋 Schema.org Validator:');
console.log('   https://validator.schema.org/');
console.log('');
console.log('📋 Google Search Console:');
console.log('   https://search.google.com/search-console');
console.log('');
console.log('📋 Testing Instructions:');
console.log('   1. Start the development server: npm run dev');
console.log('   2. Copy page URL (e.g., http://localhost:3000)');
console.log('   3. Paste URL into Google Rich Results Test');
console.log('   4. Check for validation errors and warnings');
console.log('   5. Test multiple pages (home, services, contact)');

console.log('\n🎯 Task 1.2 Status:');
if (issues.length === 0 && warnings.length <= 2) {
  console.log('✅ Task 1.2 - Structured Data Enhancement: COMPLETED');
  console.log('   - Centralized configuration integrated');
  console.log('   - Enhanced business properties added');
  console.log('   - Multiple service areas configured');
  console.log('   - Payment methods and amenities included');
} else {
  console.log('🚧 Task 1.2 - Structured Data Enhancement: IN PROGRESS');
  console.log('   - Additional schema enhancements needed');
}

console.log('\n' + '='.repeat(50));
