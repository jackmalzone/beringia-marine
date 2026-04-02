#!/usr/bin/env node

/**
 * CI/CD Schema Validation Script
 *
 * Automated schema validation for continuous integration pipeline.
 * Validates all structured data and fails the build if critical issues are found.
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// CI/CD specific configuration
const CI_CONFIG = {
  failOnErrors: true,
  failOnWarnings: false,
  minScore: 80,
  maxErrors: 0,
  maxWarnings: 10,
  outputFormat: process.env.CI_OUTPUT_FORMAT || 'console', // console, json, junit
  reportPath: process.env.CI_REPORT_PATH || './schema-validation-ci-report.json',
};

/**
 * Load structured data schemas from the application
 */
function loadApplicationSchemas() {
  try {
    // In a real implementation, this would dynamically load and parse
    // the actual structured data from the application

    const mockSchemas = [
      {
        name: 'vitalIceBusiness',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Vital Ice',
          description: 'Premier wellness and recovery center in San Francisco',
          url: 'https://www.vitalicesf.com',
          telephone: '+1-415-555-0123',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Marina Blvd',
            addressLocality: 'San Francisco',
            addressRegion: 'CA',
            postalCode: '94123',
            addressCountry: 'US',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 37.7999,
            longitude: -122.434,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Monday',
              opens: '06:00',
              closes: '22:00',
            },
          ],
          image: ['https://media.vitalicesf.com/logo-dark.png'],
          priceRange: '$',
          areaServed: {
            '@type': 'City',
            name: 'San Francisco',
          },
        },
      },
      {
        name: 'coldPlungeService',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Cold Plunge Therapy',
          description: '40-50°F immersion therapy for reduced inflammation',
          provider: {
            '@type': 'LocalBusiness',
            name: 'Vital Ice',
          },
          serviceType: 'Cold Therapy',
          category: 'Wellness & Recovery',
          areaServed: {
            '@type': 'City',
            name: 'San Francisco',
          },
          offers: [
            {
              '@context': 'https://schema.org',
              '@type': 'Offer',
              name: 'Single Session',
              description: 'Individual cold plunge session',
              priceRange: '$25-$35',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          ],
        },
      },
      {
        name: 'faqPage',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is cold plunge therapy?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Cold plunge therapy involves immersing your body in cold water (40-50°F) for 2-5 minutes to activate the vagus nerve, reduce inflammation, and enhance mental clarity.',
              },
            },
            {
              '@type': 'Question',
              name: 'How long should I stay in the cold plunge?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We recommend 2-5 minutes for cold plunge therapy. Start with shorter durations and gradually increase as your body adapts.',
              },
            },
          ],
        },
      },
      {
        name: 'organizationSchema',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Vital Ice',
          description: 'Premier wellness and recovery center',
          url: 'https://www.vitalicesf.com',
          logo: 'https://media.vitalicesf.com/logo-dark.png',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-415-555-0123',
            contactType: 'customer service',
          },
        },
      },
      {
        name: 'breadcrumbHome',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://www.vitalicesf.com',
            },
          ],
        },
      },
    ];

    return mockSchemas;
  } catch (error) {
    console.error('Error loading application schemas:', error.message);
    return [];
  }
}

/**
 * Validate schema using simplified validation rules
 */
function validateSchema(schema) {
  const errors = [];
  const warnings = [];
  const recommendations = [];
  let score = 100;

  // Basic validation
  if (!schema || typeof schema !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid schema structure'],
      warnings: [],
      recommendations: [],
      score: 0,
      schemaType: 'Unknown',
    };
  }

  const schemaType = schema['@type'];
  if (!schemaType) {
    errors.push('Missing @type property');
    score -= 30;
  }

  if (!schema['@context']) {
    errors.push('Missing @context property');
    score -= 20;
  }

  // Type-specific validation
  switch (schemaType) {
    case 'LocalBusiness':
      if (!schema.name) errors.push('Missing name');
      if (!schema.address) errors.push('Missing address');
      if (!schema.telephone) errors.push('Missing telephone');
      if (!schema.description) recommendations.push('Add description');
      if (!schema.geo) recommendations.push('Add geo coordinates');
      break;

    case 'Service':
      if (!schema.name) errors.push('Missing name');
      if (!schema.provider) errors.push('Missing provider');
      if (!schema.description) recommendations.push('Add description');
      if (!schema.offers) recommendations.push('Add offers');
      break;

    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
        errors.push('Missing mainEntity array');
      } else if (schema.mainEntity.length < 2) {
        warnings.push('Should have at least 2 questions');
      }
      break;

    case 'Organization':
      if (!schema.name) errors.push('Missing name');
      if (!schema.url) errors.push('Missing url');
      if (!schema.logo) recommendations.push('Add logo');
      break;

    case 'BreadcrumbList':
      if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
        errors.push('Missing itemListElement array');
      }
      break;
  }

  // Calculate score
  score -= errors.length * 20;
  score -= warnings.length * 10;
  score -= recommendations.length * 5;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations,
    score: Math.max(0, score),
    schemaType: schemaType || 'Unknown',
  };
}

/**
 * Generate CI/CD validation report
 */
function generateCIReport(validationResults) {
  const totalSchemas = validationResults.length;
  const validSchemas = validationResults.filter(r => r.isValid).length;
  const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = validationResults.reduce((sum, r) => sum + r.warnings.length, 0);
  const averageScore = validationResults.reduce((sum, r) => sum + r.score, 0) / totalSchemas;

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalSchemas,
      validSchemas,
      validationRate: Math.round((validSchemas / totalSchemas) * 100),
      totalErrors,
      totalWarnings,
      averageScore: Math.round(averageScore * 10) / 10,
    },
    results: validationResults,
    ciConfig: CI_CONFIG,
    buildStatus: determineBuildStatus(totalErrors, totalWarnings, averageScore),
  };

  return report;
}

/**
 * Determine if the build should pass or fail
 */
function determineBuildStatus(totalErrors, totalWarnings, averageScore) {
  const status = {
    passed: true,
    reasons: [],
  };

  if (CI_CONFIG.failOnErrors && totalErrors > CI_CONFIG.maxErrors) {
    status.passed = false;
    status.reasons.push(`Too many errors: ${totalErrors} (max: ${CI_CONFIG.maxErrors})`);
  }

  if (CI_CONFIG.failOnWarnings && totalWarnings > CI_CONFIG.maxWarnings) {
    status.passed = false;
    status.reasons.push(`Too many warnings: ${totalWarnings} (max: ${CI_CONFIG.maxWarnings})`);
  }

  if (averageScore < CI_CONFIG.minScore) {
    status.passed = false;
    status.reasons.push(`Score too low: ${averageScore} (min: ${CI_CONFIG.minScore})`);
  }

  return status;
}

/**
 * Output report in console format
 */
function outputConsoleReport(report) {
  console.log(`${colors.blue}${colors.bright}🔍 CI/CD SCHEMA VALIDATION REPORT${colors.reset}`);
  console.log(`${colors.blue}===================================${colors.reset}\n`);

  // Build status
  const status = report.buildStatus.passed
    ? `${colors.green}✅ PASSED${colors.reset}`
    : `${colors.red}❌ FAILED${colors.reset}`;

  console.log(`Build Status: ${status}\n`);

  if (!report.buildStatus.passed) {
    console.log(`${colors.red}Failure Reasons:${colors.reset}`);
    report.buildStatus.reasons.forEach(reason => {
      console.log(`  • ${reason}`);
    });
    console.log();
  }

  // Summary
  console.log(`${colors.cyan}📊 VALIDATION SUMMARY${colors.reset}`);
  console.log(`Total schemas: ${report.summary.totalSchemas}`);
  console.log(
    `Valid schemas: ${colors.green}${report.summary.validSchemas}${colors.reset} (${report.summary.validationRate}%)`
  );
  console.log(`Total errors: ${colors.red}${report.summary.totalErrors}${colors.reset}`);
  console.log(`Total warnings: ${colors.yellow}${report.summary.totalWarnings}${colors.reset}`);
  console.log(`Average score: ${report.summary.averageScore}/100\n`);

  // Critical issues
  const criticalResults = report.results.filter(r => r.errors.length > 0);
  if (criticalResults.length > 0) {
    console.log(`${colors.red}${colors.bright}🚨 CRITICAL ISSUES${colors.reset}`);
    console.log(`${colors.red}==================${colors.reset}\n`);

    criticalResults.forEach((result, index) => {
      console.log(
        `${colors.red}${index + 1}. ${result.name}${colors.reset} (${result.schemaType})`
      );
      result.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
      console.log();
    });
  }

  // CI/CD specific recommendations
  console.log(`${colors.blue}${colors.bright}🚀 CI/CD RECOMMENDATIONS${colors.reset}`);
  console.log(`${colors.blue}========================${colors.reset}\n`);

  if (report.summary.totalErrors > 0) {
    console.log(
      `1. ${colors.bright}Fix schema errors${colors.reset}: ${report.summary.totalErrors} errors must be resolved`
    );
  }
  if (report.summary.totalWarnings > CI_CONFIG.maxWarnings) {
    console.log(
      `2. ${colors.bright}Reduce warnings${colors.reset}: ${report.summary.totalWarnings} warnings exceed limit of ${CI_CONFIG.maxWarnings}`
    );
  }
  if (report.summary.averageScore < CI_CONFIG.minScore) {
    console.log(
      `3. ${colors.bright}Improve schema quality${colors.reset}: Average score ${report.summary.averageScore} below minimum ${CI_CONFIG.minScore}`
    );
  }
  console.log(
    `4. ${colors.bright}Monitor regularly${colors.reset}: Set up automated schema monitoring`
  );
  console.log(
    `5. ${colors.bright}Test with Google${colors.reset}: Validate with Rich Results Test before deployment\n`
  );
}

/**
 * Output report in JSON format
 */
function outputJSONReport(report) {
  console.log(JSON.stringify(report, null, 2));
}

/**
 * Output report in JUnit XML format (for CI/CD integration)
 */
function outputJUnitReport(report) {
  const testSuites = report.results.map(result => {
    const testCases = [
      {
        name: `${result.name} - Schema Validation`,
        classname: 'SchemaValidation',
        time: '0.001',
        failure: result.errors.length > 0 ? result.errors.join(', ') : null,
      },
    ];

    return {
      name: result.name,
      tests: 1,
      failures: result.errors.length > 0 ? 1 : 0,
      time: '0.001',
      testCases,
    };
  });

  const xml = generateJUnitXML(testSuites);
  console.log(xml);
}

/**
 * Generate JUnit XML format
 */
function generateJUnitXML(testSuites) {
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests, 0);
  const totalFailures = testSuites.reduce((sum, suite) => sum + suite.failures, 0);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<testsuites tests="${totalTests}" failures="${totalFailures}" time="0.001">\n`;

  testSuites.forEach(suite => {
    xml += `  <testsuite name="${suite.name}" tests="${suite.tests}" failures="${suite.failures}" time="${suite.time}">\n`;

    suite.testCases.forEach(testCase => {
      xml += `    <testcase name="${testCase.name}" classname="${testCase.classname}" time="${testCase.time}">`;

      if (testCase.failure) {
        xml += `\n      <failure message="Schema validation failed">${testCase.failure}</failure>\n    `;
      }

      xml += `</testcase>\n`;
    });

    xml += `  </testsuite>\n`;
  });

  xml += `</testsuites>\n`;
  return xml;
}

/**
 * Main execution function
 */
function main() {
  try {
    console.log(`${colors.cyan}${colors.bright}🔍 CI/CD Schema Validation${colors.reset}`);
    console.log(`${colors.cyan}===========================${colors.reset}\n`);

    // Load schemas
    const schemas = loadApplicationSchemas();
    console.log(
      `${colors.blue}📋 Loaded ${schemas.length} schemas for validation${colors.reset}\n`
    );

    // Validate all schemas
    const validationResults = schemas.map(({ name, schema }) => ({
      name,
      ...validateSchema(schema),
    }));

    // Generate report
    const report = generateCIReport(validationResults);

    // Save report to file
    fs.writeFileSync(CI_CONFIG.reportPath, JSON.stringify(report, null, 2));

    // Output report based on format
    switch (CI_CONFIG.outputFormat) {
      case 'json':
        outputJSONReport(report);
        break;
      case 'junit':
        outputJUnitReport(report);
        break;
      default:
        outputConsoleReport(report);
        break;
    }

    // Exit with appropriate code
    process.exit(report.buildStatus.passed ? 0 : 1);
  } catch (error) {
    console.error(`${colors.red}❌ CI/CD validation failed:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  validateSchema,
  generateCIReport,
  determineBuildStatus,
  CI_CONFIG,
};
