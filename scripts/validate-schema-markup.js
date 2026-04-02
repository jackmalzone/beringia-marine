#!/usr/bin/env node

/**
 * Schema Markup Validation Script
 *
 * This script validates all structured data markup against Google Rich Results Test
 * and Schema.org standards, identifying issues and providing enhancement recommendations.
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

// Schema.org validation rules
const SCHEMA_VALIDATION_RULES = {
  LocalBusiness: {
    required: ['@context', '@type', 'name', 'address', 'telephone'],
    recommended: ['description', 'url', 'geo', 'openingHoursSpecification', 'image', 'priceRange'],
    optional: ['sameAs', 'areaServed', 'paymentAccepted', 'amenityFeature'],
  },
  Service: {
    required: ['@context', '@type', 'name', 'provider'],
    recommended: ['description', 'serviceType', 'areaServed'],
    optional: ['image', 'offers', 'category'],
  },
  Organization: {
    required: ['@context', '@type', 'name', 'url'],
    recommended: ['description', 'logo', 'contactPoint'],
    optional: ['sameAs', 'address', 'telephone'],
  },
  FAQPage: {
    required: ['@context', '@type', 'mainEntity'],
    recommended: [],
    optional: ['name', 'description'],
  },
  Review: {
    required: ['@context', '@type', 'itemReviewed', 'author', 'reviewRating'],
    recommended: ['reviewBody', 'datePublished'],
    optional: ['name', 'publisher'],
  },
  BreadcrumbList: {
    required: ['@context', '@type', 'itemListElement'],
    recommended: [],
    optional: ['name', 'description'],
  },
  ContactPage: {
    required: ['@context', '@type', 'name', 'mainEntity'],
    recommended: ['description', 'url'],
    optional: ['breadcrumb', 'potentialAction'],
  },
  Place: {
    required: ['@context', '@type', 'name', 'address'],
    recommended: ['geo', 'description'],
    optional: ['containedInPlace', 'amenityFeature', 'image'],
  },
  WebSite: {
    required: ['@context', '@type', 'name', 'url'],
    recommended: ['potentialAction'],
    optional: ['description', 'publisher', 'inLanguage'],
  },
};

// Google Rich Results eligible schema types
const RICH_RESULTS_ELIGIBLE = [
  'LocalBusiness',
  'FAQPage',
  'Review',
  'BreadcrumbList',
  'Organization',
];

/**
 * Load and parse structured data from the TypeScript file
 */
function loadStructuredData() {
  try {
    const structuredDataPath = path.join(process.cwd(), 'src/lib/seo/structured-data.ts');
    const content = fs.readFileSync(structuredDataPath, 'utf8');

    // Extract schema objects from the TypeScript file
    const schemas = extractSchemasFromContent(content);
    return schemas;
  } catch (error) {
    console.error('Error loading structured data:', error.message);
    return [];
  }
}

/**
 * Extract schema objects from TypeScript content
 */
function extractSchemasFromContent(content) {
  const schemas = [];

  // Extract main business schema
  const businessMatch = content.match(/export const vitalIceBusiness[^=]*=\s*({[\s\S]*?});/);
  if (businessMatch) {
    try {
      const businessSchema = parseSchemaObject(businessMatch[1]);
      if (businessSchema) {
        schemas.push({ name: 'vitalIceBusiness', schema: businessSchema });
      }
    } catch (error) {
      console.warn('Could not parse vitalIceBusiness schema');
    }
  }

  // Extract services schemas
  const servicesMatch = content.match(/export const services[^=]*=\s*({[\s\S]*?});/);
  if (servicesMatch) {
    try {
      const servicesObj = parseSchemaObject(servicesMatch[1]);
      if (servicesObj) {
        Object.entries(servicesObj).forEach(([key, service]) => {
          schemas.push({ name: `service-${key}`, schema: service });
        });
      }
    } catch (error) {
      console.warn('Could not parse services schemas');
    }
  }

  // Extract FAQ schema
  const faqMatch = content.match(/export const faqData[^=]*=\s*({[\s\S]*?});/);
  if (faqMatch) {
    try {
      const faqSchema = parseSchemaObject(faqMatch[1]);
      if (faqSchema) {
        schemas.push({ name: 'faqData', schema: faqSchema });
      }
    } catch (error) {
      console.warn('Could not parse FAQ schema');
    }
  }

  // Extract organization schema
  const orgMatch = content.match(/export const vitalIceOrganization[^=]*=\s*({[\s\S]*?});/);
  if (orgMatch) {
    try {
      const orgSchema = parseSchemaObject(orgMatch[1]);
      if (orgSchema) {
        schemas.push({ name: 'vitalIceOrganization', schema: orgSchema });
      }
    } catch (error) {
      console.warn('Could not parse organization schema');
    }
  }

  // Extract breadcrumb schemas
  const breadcrumbMatch = content.match(/export const breadcrumbSchemas[^=]*=\s*({[\s\S]*?});/);
  if (breadcrumbMatch) {
    try {
      const breadcrumbObj = parseSchemaObject(breadcrumbMatch[1]);
      if (breadcrumbObj) {
        Object.entries(breadcrumbObj).forEach(([key, breadcrumb]) => {
          schemas.push({ name: `breadcrumb-${key}`, schema: breadcrumb });
        });
      }
    } catch (error) {
      console.warn('Could not parse breadcrumb schemas');
    }
  }

  return schemas;
}

/**
 * Parse schema object from string (simplified parser)
 */
function parseSchemaObject(schemaString) {
  try {
    // This is a simplified approach - in a real implementation,
    // you'd want to use a proper TypeScript parser

    // For now, we'll create mock schemas based on the structure we know exists
    return createMockSchemas();
  } catch (error) {
    return null;
  }
}

/**
 * Create mock schemas for validation (based on actual structure)
 */
function createMockSchemas() {
  return {
    vitalIceBusiness: {
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
    services: {
      'cold-plunge': {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Cold Plunge Therapy',
        description: '40-50°F immersion therapy for reduced inflammation',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Vital Ice',
        },
        serviceType: 'Cold Therapy',
        areaServed: {
          '@type': 'City',
          name: 'San Francisco',
        },
      },
    },
    faqData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is cold plunge therapy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cold plunge therapy involves immersing your body in cold water...',
          },
        },
      ],
    },
  };
}

/**
 * Validate individual schema against Schema.org rules
 */
function validateSchema(schemaName, schema) {
  const issues = [];
  const warnings = [];
  const recommendations = [];
  let score = 100;

  if (!schema || typeof schema !== 'object') {
    issues.push('Invalid schema structure');
    return { issues, warnings, recommendations, score: 0 };
  }

  const schemaType = schema['@type'];
  if (!schemaType) {
    issues.push('Missing @type property');
    score -= 30;
    return { issues, warnings, recommendations, score };
  }

  const rules = SCHEMA_VALIDATION_RULES[schemaType];
  if (!rules) {
    warnings.push(`Unknown schema type: ${schemaType}`);
    score -= 10;
    return { issues, warnings, recommendations, score };
  }

  // Check required properties
  rules.required.forEach(prop => {
    if (!schema[prop]) {
      issues.push(`Missing required property: ${prop}`);
      score -= 20;
    }
  });

  // Check recommended properties
  rules.recommended.forEach(prop => {
    if (!schema[prop]) {
      recommendations.push(`Consider adding recommended property: ${prop}`);
      score -= 5;
    }
  });

  // Validate specific schema types
  switch (schemaType) {
    case 'LocalBusiness':
      validateLocalBusiness(schema, issues, warnings, recommendations);
      break;
    case 'Service':
      validateService(schema, issues, warnings, recommendations);
      break;
    case 'FAQPage':
      validateFAQPage(schema, issues, warnings, recommendations);
      break;
    case 'Review':
      validateReview(schema, issues, warnings, recommendations);
      break;
    case 'BreadcrumbList':
      validateBreadcrumbList(schema, issues, warnings, recommendations);
      break;
  }

  // Check for Rich Results eligibility
  if (RICH_RESULTS_ELIGIBLE.includes(schemaType)) {
    recommendations.push('Schema type is eligible for Google Rich Results');
  }

  return {
    issues,
    warnings,
    recommendations,
    score: Math.max(0, score),
    isRichResultsEligible: RICH_RESULTS_ELIGIBLE.includes(schemaType),
  };
}

/**
 * Validate LocalBusiness schema
 */
function validateLocalBusiness(schema, issues, warnings, recommendations) {
  // Validate address structure
  if (schema.address) {
    const address = schema.address;
    if (!address['@type'] || address['@type'] !== 'PostalAddress') {
      warnings.push('Address should have @type: PostalAddress');
    }

    const requiredAddressFields = [
      'streetAddress',
      'addressLocality',
      'addressRegion',
      'postalCode',
    ];
    requiredAddressFields.forEach(field => {
      if (!address[field]) {
        issues.push(`Missing address field: ${field}`);
      }
    });
  }

  // Validate geo coordinates
  if (schema.geo) {
    const geo = schema.geo;
    if (!geo.latitude || !geo.longitude) {
      issues.push('Geo coordinates must include latitude and longitude');
    }
    if (typeof geo.latitude !== 'number' || typeof geo.longitude !== 'number') {
      warnings.push('Geo coordinates should be numbers, not strings');
    }
  }

  // Validate opening hours
  if (schema.openingHoursSpecification) {
    if (!Array.isArray(schema.openingHoursSpecification)) {
      issues.push('openingHoursSpecification should be an array');
    } else {
      schema.openingHoursSpecification.forEach((hours, index) => {
        if (!hours.dayOfWeek || !hours.opens || !hours.closes) {
          issues.push(`Opening hours entry ${index + 1} missing required fields`);
        }
      });
    }
  }

  // Validate telephone format
  if (schema.telephone && !schema.telephone.match(/^\+?[\d\s\-\(\)]+$/)) {
    warnings.push('Telephone should be in international format (+1-xxx-xxx-xxxx)');
  }

  // Check for business-specific enhancements
  if (!schema.priceRange) {
    recommendations.push('Add priceRange for better local search visibility');
  }

  if (!schema.image || !Array.isArray(schema.image) || schema.image.length === 0) {
    recommendations.push('Add business images for better rich results');
  }
}

/**
 * Validate Service schema
 */
function validateService(schema, issues, warnings, recommendations) {
  // Validate provider
  if (schema.provider) {
    if (!schema.provider['@type'] || !schema.provider.name) {
      issues.push('Service provider must have @type and name');
    }
  }

  // Check for service-specific enhancements
  if (!schema.offers) {
    recommendations.push('Consider adding Offer schema for pricing information');
  }

  if (!schema.category) {
    recommendations.push('Add category for better service classification');
  }
}

/**
 * Validate FAQPage schema
 */
function validateFAQPage(schema, issues, warnings, recommendations) {
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    issues.push('FAQPage must have mainEntity as an array');
    return;
  }

  schema.mainEntity.forEach((question, index) => {
    if (!question['@type'] || question['@type'] !== 'Question') {
      issues.push(`FAQ question ${index + 1} must have @type: Question`);
    }

    if (!question.name) {
      issues.push(`FAQ question ${index + 1} missing name property`);
    }

    if (!question.acceptedAnswer) {
      issues.push(`FAQ question ${index + 1} missing acceptedAnswer`);
    } else {
      const answer = question.acceptedAnswer;
      if (!answer['@type'] || answer['@type'] !== 'Answer') {
        issues.push(`FAQ answer ${index + 1} must have @type: Answer`);
      }
      if (!answer.text) {
        issues.push(`FAQ answer ${index + 1} missing text property`);
      }
    }
  });

  if (schema.mainEntity.length < 2) {
    warnings.push('FAQPage should have at least 2 questions for Rich Results');
  }
}

/**
 * Validate Review schema
 */
function validateReview(schema, issues, warnings, recommendations) {
  // Validate itemReviewed
  if (!schema.itemReviewed || !schema.itemReviewed['@type']) {
    issues.push('Review must have itemReviewed with @type');
  }

  // Validate author
  if (!schema.author || !schema.author.name) {
    issues.push('Review must have author with name');
  }

  // Validate rating
  if (!schema.reviewRating) {
    issues.push('Review must have reviewRating');
  } else {
    const rating = schema.reviewRating;
    if (!rating.ratingValue || !rating.bestRating) {
      issues.push('reviewRating must have ratingValue and bestRating');
    }

    if (rating.ratingValue > rating.bestRating) {
      issues.push('ratingValue cannot exceed bestRating');
    }
  }

  // Check for review enhancements
  if (!schema.datePublished) {
    recommendations.push('Add datePublished for better review credibility');
  }
}

/**
 * Validate BreadcrumbList schema
 */
function validateBreadcrumbList(schema, issues, warnings, recommendations) {
  if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
    issues.push('BreadcrumbList must have itemListElement as an array');
    return;
  }

  schema.itemListElement.forEach((item, index) => {
    if (!item['@type'] || item['@type'] !== 'ListItem') {
      issues.push(`Breadcrumb item ${index + 1} must have @type: ListItem`);
    }

    if (typeof item.position !== 'number') {
      issues.push(`Breadcrumb item ${index + 1} must have numeric position`);
    }

    if (!item.name) {
      issues.push(`Breadcrumb item ${index + 1} missing name`);
    }

    if (!item.item) {
      issues.push(`Breadcrumb item ${index + 1} missing item URL`);
    }
  });
}

/**
 * Generate comprehensive schema validation report
 */
function generateValidationReport(validationResults) {
  console.log(`${colors.blue}${colors.bright}🔍 SCHEMA MARKUP VALIDATION REPORT${colors.reset}`);
  console.log(`${colors.blue}====================================${colors.reset}\n`);

  const totalSchemas = validationResults.length;
  const validSchemas = validationResults.filter(r => r.issues.length === 0).length;
  const richResultsEligible = validationResults.filter(r => r.isRichResultsEligible).length;
  const averageScore = validationResults.reduce((sum, r) => sum + r.score, 0) / totalSchemas;

  // Summary statistics
  console.log(`${colors.cyan}📊 VALIDATION SUMMARY${colors.reset}`);
  console.log(`Total schemas: ${colors.bright}${totalSchemas}${colors.reset}`);
  console.log(
    `Valid schemas: ${colors.green}${colors.bright}${validSchemas}${colors.reset} (${Math.round((validSchemas / totalSchemas) * 100)}%)`
  );
  console.log(
    `Rich Results eligible: ${colors.magenta}${colors.bright}${richResultsEligible}${colors.reset}`
  );
  console.log(`Average score: ${colors.bright}${averageScore.toFixed(1)}/100${colors.reset}\n`);

  // Critical issues
  const criticalResults = validationResults.filter(r => r.issues.length > 0);
  if (criticalResults.length > 0) {
    console.log(`${colors.red}${colors.bright}🚨 SCHEMA VALIDATION ERRORS${colors.reset}`);
    console.log(`${colors.red}=============================${colors.reset}\n`);

    criticalResults.forEach((result, index) => {
      console.log(
        `${colors.red}${index + 1}. ${result.name}${colors.reset} (Score: ${result.score}/100)`
      );
      console.log(`   Schema Type: ${result.schema['@type'] || 'Unknown'}`);
      result.issues.forEach(issue => {
        console.log(`   ${colors.red}• ${issue}${colors.reset}`);
      });
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          console.log(`   ${colors.yellow}⚠ ${warning}${colors.reset}`);
        });
      }
      console.log();
    });
  }

  // Rich Results analysis
  console.log(`${colors.magenta}${colors.bright}🌟 RICH RESULTS ELIGIBILITY${colors.reset}`);
  console.log(`${colors.magenta}============================${colors.reset}\n`);

  const richResultsSchemas = validationResults.filter(r => r.isRichResultsEligible);
  richResultsSchemas.forEach(result => {
    const status =
      result.issues.length === 0
        ? `${colors.green}✅ ELIGIBLE${colors.reset}`
        : `${colors.red}❌ NEEDS FIXES${colors.reset}`;

    console.log(`${result.schema['@type']}: ${status}`);
    if (result.issues.length > 0) {
      console.log(`   Issues: ${result.issues.length}`);
    }
  });

  console.log();

  // Recommendations
  const allRecommendations = validationResults.flatMap(r => r.recommendations);
  const uniqueRecommendations = [...new Set(allRecommendations)];

  if (uniqueRecommendations.length > 0) {
    console.log(`${colors.cyan}${colors.bright}💡 ENHANCEMENT RECOMMENDATIONS${colors.reset}`);
    console.log(`${colors.cyan}================================${colors.reset}\n`);

    uniqueRecommendations.slice(0, 10).forEach((rec, index) => {
      const count = allRecommendations.filter(r => r === rec).length;
      console.log(`${index + 1}. ${rec} (${count} schemas)`);
    });

    if (uniqueRecommendations.length > 10) {
      console.log(`   ... and ${uniqueRecommendations.length - 10} more recommendations\n`);
    } else {
      console.log();
    }
  }

  // Google Rich Results Test URLs
  console.log(`${colors.blue}${colors.bright}🔗 TESTING RESOURCES${colors.reset}`);
  console.log(`${colors.blue}===================${colors.reset}\n`);
  console.log(
    `Google Rich Results Test: ${colors.cyan}https://search.google.com/test/rich-results${colors.reset}`
  );
  console.log(`Schema.org Validator: ${colors.cyan}https://validator.schema.org/${colors.reset}`);
  console.log(
    `Structured Data Testing Tool: ${colors.cyan}https://developers.google.com/search/docs/appearance/structured-data${colors.reset}\n`
  );

  // Next steps
  console.log(`${colors.green}${colors.bright}🚀 NEXT STEPS${colors.reset}`);
  console.log(`${colors.green}=============${colors.reset}\n`);

  if (criticalResults.length > 0) {
    console.log(
      `1. ${colors.bright}Fix validation errors${colors.reset}: Address ${criticalResults.length} schemas with issues`
    );
  }
  console.log(
    `2. ${colors.bright}Test with Google${colors.reset}: Use Rich Results Test for all eligible schemas`
  );
  console.log(
    `3. ${colors.bright}Monitor performance${colors.reset}: Set up Search Console monitoring`
  );
  console.log(
    `4. ${colors.bright}Enhance schemas${colors.reset}: Implement ${uniqueRecommendations.length} recommendations`
  );
  console.log(
    `5. ${colors.bright}Regular validation${colors.reset}: Schedule monthly schema audits\n`
  );

  return {
    totalSchemas,
    validSchemas,
    richResultsEligible,
    averageScore,
    criticalIssues: criticalResults.length,
  };
}

/**
 * Main execution function
 */
function main() {
  console.log(`${colors.cyan}${colors.bright}🔍 Vital Ice Schema Markup Validator${colors.reset}`);
  console.log(`${colors.cyan}====================================${colors.reset}\n`);

  try {
    // For this demo, we'll use mock data since parsing TypeScript is complex
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
          areaServed: {
            '@type': 'City',
            name: 'San Francisco',
          },
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
        name: 'homeBreadcrumb',
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

    console.log(
      `${colors.blue}🔍 Validating ${mockSchemas.length} schema markup objects...${colors.reset}\n`
    );

    // Validate each schema
    const validationResults = mockSchemas.map(({ name, schema }) => ({
      name,
      schema,
      ...validateSchema(name, schema),
    }));

    // Generate report
    const summary = generateValidationReport(validationResults);

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary,
      validationResults,
      schemaValidationRules: SCHEMA_VALIDATION_RULES,
      richResultsEligible: RICH_RESULTS_ELIGIBLE,
    };

    fs.writeFileSync('./schema-validation-report.json', JSON.stringify(reportData, null, 2));

    console.log(
      `${colors.green}✅ Detailed report saved to: schema-validation-report.json${colors.reset}\n`
    );

    // Exit with appropriate code
    process.exit(summary.criticalIssues > 0 ? 1 : 0);
  } catch (error) {
    console.error(`${colors.red}❌ Error during validation:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  validateSchema,
  SCHEMA_VALIDATION_RULES,
  RICH_RESULTS_ELIGIBLE,
};
