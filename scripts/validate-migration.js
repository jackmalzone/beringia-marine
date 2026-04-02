#!/usr/bin/env node

/**
 * Sanity Migration Validation Script
 *
 * This script validates migrated content in Sanity to ensure data integrity,
 * schema compliance, and proper content rendering.
 *
 * Usage:
 *   node scripts/validate-migration.js [--type=services|business|seo|all] [--fix]
 *
 * Options:
 *   --type=TYPE    Validate specific content type (default: all)
 *   --fix          Attempt to fix validation issues automatically
 *   --help         Show this help message
 */

const { createClient } = require('@sanity/client');

// Configuration
const SANITY_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
};

// Validation rules
const VALIDATION_RULES = {
  service: {
    required: [
      'title',
      'slug',
      'subtitle',
      'description',
      'heroImage',
      'backgroundImage',
      'accentColor',
      'tagline',
      'benefits',
      'process',
      'cta',
    ],
    maxLengths: {
      title: 100,
      subtitle: 200,
      description: 2000,
      tagline: 100,
    },
    minArrayLengths: {
      benefits: 1,
      process: 1,
    },
    maxArrayLengths: {
      benefits: 8,
      process: 10,
    },
  },
  globalSettings: {
    required: ['businessInfo'],
    businessInfoRequired: ['name', 'phone', 'email', 'address', 'coordinates', 'hours'],
  },
  page: {
    required: ['title', 'slug'],
    maxLengths: {
      'seo.title': 60,
      'seo.description': 160,
    },
  },
};

// Validate environment variables
function validateEnvironment() {
  const required = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env.local file');
    process.exit(1);
  }
}

// Initialize Sanity client
function createSanityClient() {
  return createClient(SANITY_CONFIG);
}

// Validate service documents
async function validateServices(client, fix = false) {
  console.log('\n📋 Validating service documents...');

  const services = await client.fetch('*[_type == "service"]');
  const issues = [];

  for (const service of services) {
    const serviceIssues = [];

    // Check required fields
    VALIDATION_RULES.service.required.forEach(field => {
      if (!getNestedValue(service, field)) {
        serviceIssues.push(`Missing required field: ${field}`);
      }
    });

    // Check field lengths
    Object.entries(VALIDATION_RULES.service.maxLengths).forEach(([field, maxLength]) => {
      const value = getNestedValue(service, field);
      if (value && value.length > maxLength) {
        serviceIssues.push(`Field '${field}' exceeds max length (${value.length}/${maxLength})`);
      }
    });

    // Check array lengths
    Object.entries(VALIDATION_RULES.service.minArrayLengths).forEach(([field, minLength]) => {
      const value = getNestedValue(service, field);
      if (!value || !Array.isArray(value) || value.length < minLength) {
        serviceIssues.push(
          `Field '${field}' has insufficient items (${value?.length || 0}/${minLength} minimum)`
        );
      }
    });

    Object.entries(VALIDATION_RULES.service.maxArrayLengths).forEach(([field, maxLength]) => {
      const value = getNestedValue(service, field);
      if (value && Array.isArray(value) && value.length > maxLength) {
        serviceIssues.push(
          `Field '${field}' has too many items (${value.length}/${maxLength} maximum)`
        );
      }
    });

    // Check slug format
    if (service.slug?.current && !/^[a-z0-9-]+$/.test(service.slug.current)) {
      serviceIssues.push(
        'Slug contains invalid characters (should be lowercase letters, numbers, and hyphens only)'
      );
    }

    // Check color format
    if (service.accentColor?.hex && !/^#[0-9A-Fa-f]{6}$/.test(service.accentColor.hex)) {
      serviceIssues.push('Accent color is not a valid hex color');
    }

    // Check image assets
    if (service.heroImage && !service.heroImage.asset?._ref) {
      serviceIssues.push('Hero image missing asset reference');
    }

    if (service.backgroundImage && !service.backgroundImage.asset?._ref) {
      serviceIssues.push('Background image missing asset reference');
    }

    // Check benefits structure
    if (service.benefits && Array.isArray(service.benefits)) {
      service.benefits.forEach((benefit, index) => {
        if (!benefit.title || !benefit.description) {
          serviceIssues.push(`Benefit ${index + 1} missing title or description`);
        }
      });
    }

    // Check process structure
    if (service.process && Array.isArray(service.process)) {
      service.process.forEach((step, index) => {
        if (!step.step || !step.title || !step.description) {
          serviceIssues.push(
            `Process step ${index + 1} missing step number, title, or description`
          );
        }
      });
    }

    // Check CTA structure
    if (service.cta) {
      if (!service.cta.title || !service.cta.text) {
        serviceIssues.push('CTA missing title or text');
      }
    }

    if (serviceIssues.length > 0) {
      issues.push({
        type: 'service',
        id: service._id,
        title: service.title || 'Untitled Service',
        issues: serviceIssues,
      });
    }
  }

  // Report results
  if (issues.length === 0) {
    console.log(`   ✅ All ${services.length} services are valid`);
  } else {
    console.log(`   ❌ Found issues in ${issues.length}/${services.length} services:`);
    issues.forEach(issue => {
      console.log(`      ${issue.title} (${issue.id}):`);
      issue.issues.forEach(msg => console.log(`        - ${msg}`));
    });
  }

  return {
    total: services.length,
    valid: services.length - issues.length,
    invalid: issues.length,
    issues,
  };
}

// Validate global settings
async function validateGlobalSettings(client, fix = false) {
  console.log('\n🏢 Validating global settings...');

  const globalSettings = await client.fetch('*[_type == "globalSettings"][0]');
  const issues = [];

  if (!globalSettings) {
    issues.push('Global settings document not found');
  } else {
    // Check required fields
    VALIDATION_RULES.globalSettings.required.forEach(field => {
      if (!getNestedValue(globalSettings, field)) {
        issues.push(`Missing required field: ${field}`);
      }
    });

    // Check business info required fields
    if (globalSettings.businessInfo) {
      VALIDATION_RULES.globalSettings.businessInfoRequired.forEach(field => {
        if (!getNestedValue(globalSettings.businessInfo, field)) {
          issues.push(`Missing required business info field: ${field}`);
        }
      });

      // Validate email format
      if (globalSettings.businessInfo.email && !isValidEmail(globalSettings.businessInfo.email)) {
        issues.push('Business email is not a valid email address');
      }

      // Validate phone format
      if (
        globalSettings.businessInfo.phone &&
        globalSettings.businessInfo.phone.includes('555-0123')
      ) {
        issues.push('Business phone appears to be a placeholder value');
      }

      // Validate coordinates
      if (globalSettings.businessInfo.coordinates) {
        const { latitude, longitude } = globalSettings.businessInfo.coordinates;
        if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
          issues.push('Invalid latitude coordinate');
        }
        if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
          issues.push('Invalid longitude coordinate');
        }
      }

      // Validate hours format
      if (globalSettings.businessInfo.hours && Array.isArray(globalSettings.businessInfo.hours)) {
        globalSettings.businessInfo.hours.forEach((hour, index) => {
          if (!hour.day || (!hour.closed && (!hour.open || !hour.close))) {
            issues.push(`Business hours entry ${index + 1} missing required fields`);
          }
          if (hour.open && hour.close && !isValidTimeFormat(hour.open)) {
            issues.push(`Business hours entry ${index + 1} has invalid open time format`);
          }
          if (hour.open && hour.close && !isValidTimeFormat(hour.close)) {
            issues.push(`Business hours entry ${index + 1} has invalid close time format`);
          }
        });
      }
    }

    // Check social media URLs
    if (globalSettings.socialMedia) {
      Object.entries(globalSettings.socialMedia).forEach(([platform, url]) => {
        if (url && !isValidUrl(url)) {
          issues.push(`Invalid ${platform} URL`);
        }
      });
    }
  }

  // Report results
  if (issues.length === 0) {
    console.log('   ✅ Global settings are valid');
  } else {
    console.log(`   ❌ Found ${issues.length} issues in global settings:`);
    issues.forEach(issue => console.log(`      - ${issue}`));
  }

  return {
    exists: !!globalSettings,
    valid: issues.length === 0,
    issues,
  };
}

// Validate page documents
async function validatePages(client, fix = false) {
  console.log('\n📄 Validating page documents...');

  const pages = await client.fetch('*[_type == "page"]');
  const issues = [];

  for (const page of pages) {
    const pageIssues = [];

    // Check required fields
    VALIDATION_RULES.page.required.forEach(field => {
      if (!getNestedValue(page, field)) {
        pageIssues.push(`Missing required field: ${field}`);
      }
    });

    // Check field lengths
    Object.entries(VALIDATION_RULES.page.maxLengths).forEach(([field, maxLength]) => {
      const value = getNestedValue(page, field);
      if (value && value.length > maxLength) {
        pageIssues.push(`Field '${field}' exceeds max length (${value.length}/${maxLength})`);
      }
    });

    // Check slug format
    if (
      page.slug?.current &&
      page.slug.current !== '/' &&
      !/^[a-z0-9-]+$/.test(page.slug.current)
    ) {
      pageIssues.push('Slug contains invalid characters');
    }

    // Check SEO settings
    if (page.seo) {
      if (page.seo.openGraph?.image && !page.seo.openGraph.image.asset?._ref) {
        pageIssues.push('Open Graph image missing asset reference');
      }

      if (page.seo.twitter?.image && !page.seo.twitter.image.asset?._ref) {
        pageIssues.push('Twitter image missing asset reference');
      }

      if (page.seo.canonicalUrl && !isValidUrl(page.seo.canonicalUrl)) {
        pageIssues.push('Invalid canonical URL');
      }
    }

    if (pageIssues.length > 0) {
      issues.push({
        type: 'page',
        id: page._id,
        title: page.title || page.slug?.current || 'Untitled Page',
        issues: pageIssues,
      });
    }
  }

  // Report results
  if (issues.length === 0) {
    console.log(`   ✅ All ${pages.length} pages are valid`);
  } else {
    console.log(`   ❌ Found issues in ${issues.length}/${pages.length} pages:`);
    issues.forEach(issue => {
      console.log(`      ${issue.title} (${issue.id}):`);
      issue.issues.forEach(msg => console.log(`        - ${msg}`));
    });
  }

  return {
    total: pages.length,
    valid: pages.length - issues.length,
    invalid: issues.length,
    issues,
  };
}

// Test content rendering
async function testContentRendering(client) {
  console.log('\n🎨 Testing content rendering...');

  const issues = [];

  try {
    // Test service content fetching
    const services = await client.fetch(`
      *[_type == "service"] {
        title,
        slug,
        heroImage {
          asset-> {
            _id,
            url
          }
        },
        backgroundImage {
          asset-> {
            _id,
            url
          }
        },
        benefits,
        process
      }
    `);

    services.forEach(service => {
      if (!service.heroImage?.asset?.url) {
        issues.push(`Service '${service.title}' hero image not rendering`);
      }
      if (!service.backgroundImage?.asset?.url) {
        issues.push(`Service '${service.title}' background image not rendering`);
      }
    });

    // Test global settings fetching
    const globalSettings = await client.fetch(`
      *[_type == "globalSettings"][0] {
        businessInfo,
        socialMedia
      }
    `);

    if (!globalSettings?.businessInfo) {
      issues.push('Global settings business info not accessible');
    }

    // Test page content fetching
    const pages = await client.fetch(`
      *[_type == "page"] {
        title,
        slug,
        seo {
          openGraph {
            image {
              asset-> {
                url
              }
            }
          }
        }
      }
    `);

    pages.forEach(page => {
      if (page.seo?.openGraph?.image && !page.seo.openGraph.image.asset?.url) {
        issues.push(`Page '${page.title}' Open Graph image not rendering`);
      }
    });
  } catch (error) {
    issues.push(`Content fetching failed: ${error.message}`);
  }

  // Report results
  if (issues.length === 0) {
    console.log('   ✅ All content renders correctly');
  } else {
    console.log(`   ❌ Found ${issues.length} rendering issues:`);
    issues.forEach(issue => console.log(`      - ${issue}`));
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// Helper functions
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidTimeFormat(time) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Main validation function
async function runValidation(options = {}) {
  const { type = 'all', fix = false } = options;

  console.log('🔍 Starting Sanity migration validation...');
  console.log(`   Type: ${type}`);
  console.log(`   Auto-fix: ${fix ? 'YES' : 'NO'}`);
  console.log(`   Dataset: ${SANITY_CONFIG.dataset}`);

  // Validate environment
  validateEnvironment();

  // Create Sanity client
  const client = createSanityClient();

  const results = {
    services: null,
    globalSettings: null,
    pages: null,
    rendering: null,
  };

  // Run validations based on type
  if (type === 'all' || type === 'services') {
    results.services = await validateServices(client, fix);
  }

  if (type === 'all' || type === 'business') {
    results.globalSettings = await validateGlobalSettings(client, fix);
  }

  if (type === 'all' || type === 'seo') {
    results.pages = await validatePages(client, fix);
  }

  if (type === 'all') {
    results.rendering = await testContentRendering(client);
  }

  // Calculate overall validation status
  const allValid = Object.values(results).every(result => {
    if (!result) return true; // Skip null results
    if (result.valid !== undefined) return result.valid;
    if (result.invalid !== undefined) return result.invalid === 0;
    return true;
  });

  // Summary
  console.log('\n📊 Validation Summary:');

  if (results.services) {
    console.log(`   Services: ${results.services.valid}/${results.services.total} valid`);
  }

  if (results.globalSettings) {
    console.log(`   Global Settings: ${results.globalSettings.valid ? '✅ Valid' : '❌ Invalid'}`);
  }

  if (results.pages) {
    console.log(`   Pages: ${results.pages.valid}/${results.pages.total} valid`);
  }

  if (results.rendering) {
    console.log(`   Content Rendering: ${results.rendering.valid ? '✅ Valid' : '❌ Invalid'}`);
  }

  console.log(`   Overall Status: ${allValid ? '✅ ALL VALID' : '❌ ISSUES FOUND'}`);

  if (allValid) {
    console.log('\n🎉 Migration validation completed successfully!');
    console.log('   Your migrated content is ready for production use.');
  } else {
    console.log('\n⚠️  Migration validation found issues.');
    console.log('   Please review and fix the issues above before deploying.');
  }

  return {
    success: allValid,
    results,
  };
}

// CLI interface
function showHelp() {
  console.log(`
Sanity Migration Validation Script

Usage:
  node scripts/validate-migration.js [options]

Options:
  --type=TYPE       Validate specific content type (services|business|seo|all)
  --fix             Attempt to fix validation issues automatically
  --help           Show this help message

Examples:
  node scripts/validate-migration.js
  node scripts/validate-migration.js --type=services
  node scripts/validate-migration.js --fix

Environment Variables Required:
  NEXT_PUBLIC_SANITY_PROJECT_ID    Your Sanity project ID
  SANITY_API_TOKEN                 Sanity API token with read permissions
  NEXT_PUBLIC_SANITY_DATASET       Dataset name (default: production)
`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'all',
    fix: false,
    help: false,
  };

  for (const arg of args) {
    if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1];
    } else if (arg === '--fix') {
      options.fix = true;
    } else if (arg === '--help') {
      options.help = true;
    }
  }

  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Validate type option
  const validTypes = ['services', 'business', 'seo', 'all'];
  if (!validTypes.includes(options.type)) {
    console.error(`❌ Invalid type: ${options.type}`);
    console.error(`   Valid types: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  runValidation(options)
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runValidation,
  validateServices,
  validateGlobalSettings,
  validatePages,
  testContentRendering,
};
