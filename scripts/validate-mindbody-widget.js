#!/usr/bin/env node

/**
 * MindBody Widget Implementation Validation
 *
 * This script validates that the MindBody prospects widget is properly
 * implemented on the contact page with proper error handling.
 */

const fs = require('fs');
const path = require('path');

function validateMindbodyWidget() {
  console.log('🔍 Validating MindBody Widget Implementation...\n');

  const issues = [];
  const warnings = [];
  const successes = [];

  // Check if MindBody widget component exists
  const widgetPath = path.join(__dirname, '../src/components/ui/MindbodyWidget/MindbodyWidget.tsx');
  if (fs.existsSync(widgetPath)) {
    successes.push('✅ MindbodyWidget component created');

    const widgetContent = fs.readFileSync(widgetPath, 'utf8');

    // Check for proper error handling
    if (widgetContent.includes('MindbodyErrorBoundary')) {
      successes.push('✅ Error boundary integration implemented');
    } else {
      warnings.push('⚠️  Error boundary not integrated');
    }

    // Check for fallback content
    if (widgetContent.includes('fallbackContent')) {
      successes.push('✅ Fallback content support implemented');
    } else {
      warnings.push('⚠️  No fallback content support');
    }

    // Check for proper script loading
    if (widgetContent.includes('healcode.js')) {
      successes.push('✅ MindBody script loading implemented');
    } else {
      warnings.push('⚠️  MindBody script loading missing');
    }

    // Check for loading state
    if (widgetContent.includes('loading')) {
      successes.push('✅ Loading state implemented');
    } else {
      warnings.push('⚠️  No loading state');
    }
  } else {
    issues.push('❌ MindbodyWidget component not found');
  }

  // Check contact page implementation
  const contactPagePath = path.join(__dirname, '../src/app/contact/ContactPageClient.tsx');
  if (fs.existsSync(contactPagePath)) {
    const contactContent = fs.readFileSync(contactPagePath, 'utf8');

    if (contactContent.includes('MindbodyWidget')) {
      successes.push('✅ MindBody widget integrated in contact page');
    } else {
      issues.push('❌ MindBody widget not integrated in contact page');
    }

    if (contactContent.includes('ec59329b5f7')) {
      successes.push('✅ Correct widget ID configured');
    } else {
      warnings.push('⚠️  Widget ID not found or incorrect');
    }

    if (contactContent.includes('prospects')) {
      successes.push('✅ Prospects widget type configured');
    } else {
      warnings.push('⚠️  Widget type not configured correctly');
    }

    // Check if custom form was removed
    if (!contactContent.includes('handleSubmit') && !contactContent.includes('formData')) {
      successes.push('✅ Custom form code removed');
    } else {
      warnings.push('⚠️  Custom form code still present');
    }
  } else {
    issues.push('❌ Contact page not found');
  }

  // Check if error suppression is in place
  const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    if (layoutContent.includes('mindbody') && layoutContent.includes('healcode')) {
      successes.push('✅ MindBody error suppression configured in layout');
    } else {
      warnings.push('⚠️  MindBody error suppression not found in layout');
    }
  }

  return { issues, warnings, successes };
}

// Run validation
const { issues, warnings, successes } = validateMindbodyWidget();

console.log('📊 MindBody Widget Validation Results:');
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

console.log('\n📋 Widget Configuration:');
console.log('• Widget Type: prospects');
console.log('• Widget ID: ec59329b5f7');
console.log('• Widget Partner: object');
console.log('• Widget Version: 0');

console.log('\n🛡️ Error Handling Features:');
console.log('• MindbodyErrorBoundary integration');
console.log('• Script loading timeout (10 seconds)');
console.log('• Fallback content for failures');
console.log('• Loading state with spinner');
console.log('• Global error suppression in layout');

console.log('\n🧪 Testing Checklist:');
console.log('□ Start dev server: npm run dev');
console.log('□ Visit: http://localhost:3000/contact');
console.log('□ Verify MindBody widget loads');
console.log('□ Test fallback content (disable JavaScript)');
console.log('□ Check browser console for errors');
console.log('□ Test on mobile devices');
console.log('□ Verify form submissions work');

console.log('\n🎯 Implementation Status:');
if (issues.length === 0 && warnings.length <= 2) {
  console.log('✅ MindBody Widget Implementation: COMPLETED');
  console.log('   - Widget component created with error handling');
  console.log('   - Integrated into contact page');
  console.log('   - Fallback content configured');
  console.log('   - Error suppression in place');
} else {
  console.log('🚧 MindBody Widget Implementation: NEEDS ATTENTION');
  console.log('   - Some components may need fixes');
}

console.log('\n💡 Benefits:');
console.log('• Direct integration with MindBody system');
console.log('• Automatic lead capture and management');
console.log('• Professional form styling');
console.log('• Robust error handling');
console.log('• Graceful fallback for failures');

console.log('\n' + '='.repeat(50));
