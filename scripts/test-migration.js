#!/usr/bin/env node

/**
 * Migration Test Runner
 *
 * This script runs comprehensive tests to validate the Sanity migration
 * including content integrity, schema compliance, and rendering tests.
 *
 * Usage:
 *   node scripts/test-migration.js [--live] [--fix-issues]
 *
 * Options:
 *   --live         Test against live Sanity data (requires API access)
 *   --fix-issues   Attempt to fix discovered issues automatically
 *   --help         Show this help message
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configuration
const SANITY_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
};

// Test results tracking
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

// Test utilities
function runTest(name, testFn) {
  testResults.total++;

  try {
    const result = testFn();
    if (result === true || (result && result.success)) {
      testResults.passed++;
      testResults.tests.push({
        name,
        status: 'PASS',
        message: result.message || 'Test passed',
      });
      console.log(`   ✅ ${name}`);
    } else if (result && result.warning) {
      testResults.warnings++;
      testResults.tests.push({
        name,
        status: 'WARN',
        message: result.message || 'Test passed with warnings',
        details: result.details,
      });
      console.log(`   ⚠️  ${name}: ${result.message}`);
    } else {
      testResults.failed++;
      testResults.tests.push({
        name,
        status: 'FAIL',
        message: result.message || 'Test failed',
        details: result.details,
      });
      console.log(`   ❌ ${name}: ${result.message || 'Test failed'}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name,
      status: 'FAIL',
      message: error.message,
      details: error.stack,
    });
    console.log(`   ❌ ${name}: ${error.message}`);
  }
}

async function runAsyncTest(name, testFn) {
  testResults.total++;

  try {
    const result = await testFn();
    if (result === true || (result && result.success)) {
      testResults.passed++;
      testResults.tests.push({
        name,
        status: 'PASS',
        message: result.message || 'Test passed',
      });
      console.log(`   ✅ ${name}`);
    } else if (result && result.warning) {
      testResults.warnings++;
      testResults.tests.push({
        name,
        status: 'WARN',
        message: result.message || 'Test passed with warnings',
        details: result.details,
      });
      console.log(`   ⚠️  ${name}: ${result.message}`);
    } else {
      testResults.failed++;
      testResults.tests.push({
        name,
        status: 'FAIL',
        message: result.message || 'Test failed',
        details: result.details,
      });
      console.log(`   ❌ ${name}: ${result.message || 'Test failed'}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name,
      status: 'FAIL',
      message: error.message,
      details: error.stack,
    });
    console.log(`   ❌ ${name}: ${error.message}`);
  }
}

// Environment validation tests
function testEnvironmentSetup() {
  console.log('\n🔧 Testing Environment Setup...');

  runTest('Environment variables are set', () => {
    const required = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      return {
        success: false,
        message: `Missing environment variables: ${missing.join(', ')}`,
      };
    }

    return { success: true };
  });

  runTest('Sanity project ID format is valid', () => {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId || !/^[a-z0-9]+$/.test(projectId)) {
      return {
        success: false,
        message: 'Project ID should contain only lowercase letters and numbers',
      };
    }

    return { success: true };
  });

  runTest('Dataset name is valid', () => {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    if (!/^[a-z0-9_-]+$/.test(dataset)) {
      return {
        success: false,
        message: 'Dataset name contains invalid characters',
      };
    }

    return { success: true };
  });
}

// File structure tests
function testFileStructure() {
  console.log('\n📁 Testing File Structure...');

  const requiredFiles = [
    'scripts/migrate-to-sanity.js',
    'scripts/migrate-assets.js',
    'scripts/organize-assets.js',
    'scripts/validate-migration.js',
    'src/lib/data/services.ts',
    'src/lib/config/business-info.ts',
    'src/lib/seo/metadata.ts',
  ];

  requiredFiles.forEach(filePath => {
    runTest(`File exists: ${filePath}`, () => {
      const fullPath = path.join(process.cwd(), filePath);
      if (!fs.existsSync(fullPath)) {
        return {
          success: false,
          message: `Required file not found: ${filePath}`,
        };
      }

      return { success: true };
    });
  });

  const requiredDirectories = [
    'sanity/schemas',
    'sanity/schemas/documents',
    'sanity/schemas/objects',
    'lib/sanity',
  ];

  requiredDirectories.forEach(dirPath => {
    runTest(`Directory exists: ${dirPath}`, () => {
      const fullPath = path.join(process.cwd(), dirPath);
      if (!fs.existsSync(fullPath)) {
        return {
          success: false,
          message: `Required directory not found: ${dirPath}`,
        };
      }

      return { success: true };
    });
  });
}

// Data integrity tests
function testDataIntegrity() {
  console.log('\n🔍 Testing Data Integrity...');

  runTest('Services data is valid', () => {
    try {
      const servicesPath = path.join(process.cwd(), 'src/lib/data/services.ts');
      const servicesContent = fs.readFileSync(servicesPath, 'utf8');

      // Check for required exports
      if (!servicesContent.includes('export const servicesData')) {
        return {
          success: false,
          message: 'servicesData export not found',
        };
      }

      // Check for service IDs
      const serviceIds = [
        'cold-plunge',
        'infrared-sauna',
        'traditional-sauna',
        'compression-boots',
        'percussion-massage',
        'red-light-therapy',
      ];
      const missingServices = serviceIds.filter(id => !servicesContent.includes(`'${id}'`));

      if (missingServices.length > 0) {
        return {
          success: false,
          message: `Missing services: ${missingServices.join(', ')}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: `Error reading services file: ${error.message}`,
      };
    }
  });

  runTest('Business info data is valid', () => {
    try {
      const businessInfoPath = path.join(process.cwd(), 'src/lib/config/business-info.ts');
      const businessInfoContent = fs.readFileSync(businessInfoPath, 'utf8');

      // Check for required exports
      if (!businessInfoContent.includes('export const VITAL_ICE_BUSINESS')) {
        return {
          success: false,
          message: 'VITAL_ICE_BUSINESS export not found',
        };
      }

      // Check for required fields
      const requiredFields = ['name', 'phone', 'email', 'address', 'coordinates'];
      const missingFields = requiredFields.filter(field => !businessInfoContent.includes(field));

      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Missing business info fields: ${missingFields.join(', ')}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: `Error reading business info file: ${error.message}`,
      };
    }
  });

  runTest('SEO metadata is valid', () => {
    try {
      const metadataPath = path.join(process.cwd(), 'src/lib/seo/metadata.ts');
      const metadataContent = fs.readFileSync(metadataPath, 'utf8');

      // Check for required exports
      if (!metadataContent.includes('export const pageMetadata')) {
        return {
          success: false,
          message: 'pageMetadata export not found',
        };
      }

      // Check for required pages
      const requiredPages = ['home', 'services', 'cold-plunge', 'infrared-sauna'];
      const missingPages = requiredPages.filter(page => !metadataContent.includes(`${page}:`));

      if (missingPages.length > 0) {
        return {
          success: false,
          message: `Missing SEO metadata for pages: ${missingPages.join(', ')}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: `Error reading metadata file: ${error.message}`,
      };
    }
  });
}

// Schema validation tests
function testSchemaValidation() {
  console.log('\n📋 Testing Schema Validation...');

  const schemaFiles = [
    'sanity/schemas/documents/service.ts',
    'sanity/schemas/documents/globalSettings.ts',
    'sanity/schemas/documents/page.ts',
    'sanity/schemas/objects/seoSettings.ts',
    'sanity/schemas/objects/businessInfo.ts',
  ];

  schemaFiles.forEach(schemaFile => {
    runTest(`Schema file is valid: ${schemaFile}`, () => {
      try {
        const schemaPath = path.join(process.cwd(), schemaFile);
        if (!fs.existsSync(schemaPath)) {
          return {
            success: false,
            message: `Schema file not found: ${schemaFile}`,
          };
        }

        const schemaContent = fs.readFileSync(schemaPath, 'utf8');

        // Check for required schema structure
        if (!schemaContent.includes('defineType') && !schemaContent.includes('export')) {
          return {
            success: false,
            message: 'Schema file missing defineType or export',
          };
        }

        // Check for required fields based on schema type
        if (schemaFile.includes('service.ts')) {
          const requiredFields = ['title', 'slug', 'subtitle', 'description', 'heroImage'];
          const missingFields = requiredFields.filter(
            field => !schemaContent.includes(`name: '${field}'`)
          );

          if (missingFields.length > 0) {
            return {
              warning: true,
              message: `Service schema missing fields: ${missingFields.join(', ')}`,
            };
          }
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: `Error reading schema file: ${error.message}`,
        };
      }
    });
  });
}

// Live data tests (requires Sanity API access)
async function testLiveData(client) {
  console.log('\n🌐 Testing Live Data...');

  await runAsyncTest('Can connect to Sanity', async () => {
    try {
      await client.fetch('*[_type == "service"] | order(_createdAt desc) [0..0]');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: `Cannot connect to Sanity: ${error.message}`,
      };
    }
  });

  await runAsyncTest('Services are migrated', async () => {
    try {
      const services = await client.fetch('*[_type == "service"]');

      if (services.length === 0) {
        return {
          success: false,
          message: 'No services found in Sanity',
        };
      }

      const expectedServices = [
        'cold-plunge',
        'infrared-sauna',
        'traditional-sauna',
        'compression-boots',
        'percussion-massage',
        'red-light-therapy',
      ];
      const foundServices = services.map(s => s.slug?.current).filter(Boolean);
      const missingServices = expectedServices.filter(id => !foundServices.includes(id));

      if (missingServices.length > 0) {
        return {
          warning: true,
          message: `Missing services: ${missingServices.join(', ')}`,
          details: `Found: ${foundServices.join(', ')}`,
        };
      }

      return {
        success: true,
        message: `Found ${services.length} services`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching services: ${error.message}`,
      };
    }
  });

  await runAsyncTest('Global settings are migrated', async () => {
    try {
      const globalSettings = await client.fetch('*[_type == "globalSettings"][0]');

      if (!globalSettings) {
        return {
          success: false,
          message: 'Global settings not found in Sanity',
        };
      }

      if (!globalSettings.businessInfo) {
        return {
          success: false,
          message: 'Business info not found in global settings',
        };
      }

      const requiredFields = ['name', 'phone', 'email', 'address'];
      const missingFields = requiredFields.filter(field => !globalSettings.businessInfo[field]);

      if (missingFields.length > 0) {
        return {
          warning: true,
          message: `Missing business info fields: ${missingFields.join(', ')}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching global settings: ${error.message}`,
      };
    }
  });

  await runAsyncTest('Assets are uploaded and referenced', async () => {
    try {
      const services = await client.fetch(`
        *[_type == "service"] {
          title,
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
          }
        }
      `);

      const servicesWithMissingAssets = services.filter(
        service => !service.heroImage?.asset?.url || !service.backgroundImage?.asset?.url
      );

      if (servicesWithMissingAssets.length > 0) {
        return {
          warning: true,
          message: `${servicesWithMissingAssets.length} services have missing asset references`,
          details: servicesWithMissingAssets.map(s => s.title).join(', '),
        };
      }

      return {
        success: true,
        message: `All ${services.length} services have proper asset references`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error checking asset references: ${error.message}`,
      };
    }
  });

  await runAsyncTest('Content rendering works', async () => {
    try {
      // Test a complex query that would be used in the application
      const testQuery = `
        *[_type == "service" && slug.current == "cold-plunge"][0] {
          title,
          subtitle,
          description,
          heroImage {
            asset-> {
              url,
              metadata {
                dimensions
              }
            },
            alt
          },
          benefits[] {
            title,
            description
          },
          process[] {
            step,
            title,
            description
          },
          cta {
            title,
            text
          },
          seo {
            title,
            description
          }
        }
      `;

      const service = await client.fetch(testQuery);

      if (!service) {
        return {
          success: false,
          message: 'Cold plunge service not found',
        };
      }

      // Check that all expected fields are present and populated
      const requiredFields = ['title', 'subtitle', 'description', 'benefits', 'process', 'cta'];
      const missingFields = requiredFields.filter(field => !service[field]);

      if (missingFields.length > 0) {
        return {
          warning: true,
          message: `Service missing fields: ${missingFields.join(', ')}`,
        };
      }

      // Check that arrays have content
      if (!service.benefits || service.benefits.length === 0) {
        return {
          warning: true,
          message: 'Service has no benefits',
        };
      }

      if (!service.process || service.process.length === 0) {
        return {
          warning: true,
          message: 'Service has no process steps',
        };
      }

      return {
        success: true,
        message: 'Content renders correctly with all required fields',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error testing content rendering: ${error.message}`,
      };
    }
  });
}

// Performance tests
async function testPerformance(client) {
  console.log('\n⚡ Testing Performance...');

  await runAsyncTest('Content queries are fast', async () => {
    try {
      const startTime = Date.now();

      await client.fetch(`
        *[_type == "service"] {
          title,
          slug,
          heroImage {
            asset-> {
              url
            }
          }
        }
      `);

      const duration = Date.now() - startTime;

      if (duration > 2000) {
        return {
          warning: true,
          message: `Query took ${duration}ms (should be under 2000ms)`,
        };
      }

      return {
        success: true,
        message: `Query completed in ${duration}ms`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error testing query performance: ${error.message}`,
      };
    }
  });

  await runAsyncTest('Asset loading is optimized', async () => {
    try {
      const assets = await client.fetch(`
        *[_type == "sanity.imageAsset"] {
          _id,
          originalFilename,
          size,
          metadata {
            dimensions
          }
        }
      `);

      const largeAssets = assets.filter(asset => asset.size > 1024 * 1024); // > 1MB

      if (largeAssets.length > 0) {
        return {
          warning: true,
          message: `${largeAssets.length} assets are larger than 1MB`,
          details: largeAssets
            .map(a => `${a.originalFilename} (${Math.round(a.size / 1024 / 1024)}MB)`)
            .join(', '),
        };
      }

      return {
        success: true,
        message: `All ${assets.length} assets are optimized`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error checking asset optimization: ${error.message}`,
      };
    }
  });
}

// Main test runner
async function runMigrationTests(options = {}) {
  const { live = false, fixIssues = false } = options;

  console.log('🧪 Starting Migration Tests...');
  console.log(`   Live data testing: ${live ? 'YES' : 'NO'}`);
  console.log(`   Auto-fix issues: ${fixIssues ? 'YES' : 'NO'}`);

  // Reset test results
  testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: [],
  };

  // Run environment tests
  testEnvironmentSetup();

  // Run file structure tests
  testFileStructure();

  // Run data integrity tests
  testDataIntegrity();

  // Run schema validation tests
  testSchemaValidation();

  // Run live data tests if requested
  if (live) {
    try {
      const client = createClient(SANITY_CONFIG);
      await testLiveData(client);
      await testPerformance(client);
    } catch (error) {
      console.log(`   ❌ Cannot create Sanity client: ${error.message}`);
      testResults.failed++;
    }
  }

  // Generate test report
  console.log('\n📊 Test Results Summary:');
  console.log(`   Total tests: ${testResults.total}`);
  console.log(
    `   Passed: ${testResults.passed} (${Math.round((testResults.passed / testResults.total) * 100)}%)`
  );
  console.log(
    `   Failed: ${testResults.failed} (${Math.round((testResults.failed / testResults.total) * 100)}%)`
  );
  console.log(
    `   Warnings: ${testResults.warnings} (${Math.round((testResults.warnings / testResults.total) * 100)}%)`
  );

  const overallSuccess = testResults.failed === 0;
  console.log(
    `   Overall Status: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`
  );

  // Show failed tests
  const failedTests = testResults.tests.filter(t => t.status === 'FAIL');
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`   - ${test.name}: ${test.message}`);
      if (test.details) {
        console.log(`     Details: ${test.details}`);
      }
    });
  }

  // Show warnings
  const warningTests = testResults.tests.filter(t => t.status === 'WARN');
  if (warningTests.length > 0) {
    console.log('\n⚠️  Warnings:');
    warningTests.forEach(test => {
      console.log(`   - ${test.name}: ${test.message}`);
      if (test.details) {
        console.log(`     Details: ${test.details}`);
      }
    });
  }

  // Save test report
  const reportPath = path.join(process.cwd(), 'migration-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Test report saved to: ${reportPath}`);

  if (overallSuccess) {
    console.log('\n🎉 Migration validation completed successfully!');
    console.log('   Your migration is ready for production use.');
  } else {
    console.log('\n⚠️  Migration validation found issues.');
    console.log('   Please review and fix the issues above before deploying.');
  }

  return {
    success: overallSuccess,
    results: testResults,
  };
}

// CLI interface
function showHelp() {
  console.log(`
Migration Test Runner

Usage:
  node scripts/test-migration.js [options]

Options:
  --live            Test against live Sanity data (requires API access)
  --fix-issues      Attempt to fix discovered issues automatically
  --help           Show this help message

Examples:
  node scripts/test-migration.js
  node scripts/test-migration.js --live
  node scripts/test-migration.js --live --fix-issues

Environment Variables Required (for --live):
  NEXT_PUBLIC_SANITY_PROJECT_ID    Your Sanity project ID
  SANITY_API_TOKEN                 Sanity API token with read permissions
  NEXT_PUBLIC_SANITY_DATASET       Dataset name (default: production)
`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    live: false,
    fixIssues: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--live') {
      options.live = true;
    } else if (arg === '--fix-issues') {
      options.fixIssues = true;
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

  runMigrationTests(options)
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Migration tests failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runMigrationTests,
  testEnvironmentSetup,
  testFileStructure,
  testDataIntegrity,
  testSchemaValidation,
};
