/**
 * Schema Validation System
 *
 * Provides runtime validation and testing utilities for structured data markup
 * with fallback mechanisms and error handling.
 */

// Schema validation types are imported for type checking only when needed

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  score: number;
  schemaType: string;
}

export interface SchemaValidationOptions {
  strict?: boolean;
  includeWarnings?: boolean;
  includeRecommendations?: boolean;
}

/**
 * Schema validation rules for different schema types
 */
const VALIDATION_RULES = {
  LocalBusiness: {
    required: ['@context', '@type', 'name', 'address', 'telephone'],
    recommended: ['description', 'url', 'geo', 'openingHoursSpecification', 'image'],
    optional: ['sameAs', 'areaServed', 'priceRange', 'paymentAccepted'],
  },
  Service: {
    required: ['@context', '@type', 'name', 'provider'],
    recommended: ['description', 'serviceType', 'areaServed', 'offers'],
    optional: ['image', 'category', 'duration', 'benefits'],
  },
  Organization: {
    required: ['@context', '@type', 'name', 'url'],
    recommended: ['description', 'logo', 'contactPoint'],
    optional: ['sameAs', 'address'],
  },
  FAQPage: {
    required: ['@context', '@type', 'mainEntity'],
    recommended: [],
    optional: ['name', 'description'],
  },
  Review: {
    required: ['@context', '@type', 'itemReviewed', 'author', 'reviewRating'],
    recommended: ['reviewBody', 'datePublished'],
    optional: ['name'],
  },
  BreadcrumbList: {
    required: ['@context', '@type', 'itemListElement'],
    recommended: [],
    optional: ['name'],
  },
  Offer: {
    required: ['@context', '@type', 'name'],
    recommended: ['description', 'price', 'priceCurrency', 'availability'],
    optional: ['priceRange', 'validFrom', 'validThrough', 'url'],
  },
};

/**
 * Validate a schema object against Schema.org standards
 */
export function validateSchema(
  schema: Record<string, unknown>,
  options: SchemaValidationOptions = {}
): SchemaValidationResult {
  const { strict = false, includeWarnings = true, includeRecommendations = true } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Basic structure validation
  if (!schema || typeof schema !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid schema: must be an object'],
      warnings: [],
      recommendations: [],
      score: 0,
      schemaType: 'Unknown',
    };
  }

  const schemaType = schema['@type'] as string;
  if (!schemaType) {
    errors.push('Missing required @type property');
    score -= 30;
  }

  if (!schema['@context']) {
    errors.push('Missing required @context property');
    score -= 20;
  } else if (schema['@context'] !== 'https://schema.org') {
    warnings.push('@context should be "https://schema.org"');
    score -= 5;
  }

  // Type-specific validation
  if (schemaType && VALIDATION_RULES[schemaType as keyof typeof VALIDATION_RULES]) {
    const rules = VALIDATION_RULES[schemaType as keyof typeof VALIDATION_RULES];

    // Check required properties
    rules.required.forEach(prop => {
      if (!schema[prop]) {
        errors.push(`Missing required property: ${prop}`);
        score -= 15;
      }
    });

    // Check recommended properties
    if (includeRecommendations) {
      rules.recommended.forEach(prop => {
        if (!schema[prop]) {
          recommendations.push(`Consider adding recommended property: ${prop}`);
          score -= 3;
        }
      });
    }

    // Type-specific validations
    switch (schemaType) {
      case 'LocalBusiness':
        validateLocalBusinessSchema(schema, errors, warnings, recommendations);
        break;
      case 'Service':
        validateServiceSchema(schema, errors, warnings, recommendations);
        break;
      case 'FAQPage':
        validateFAQPageSchema(schema, errors, warnings, recommendations);
        break;
      case 'Review':
        validateReviewSchema(schema, errors, warnings, recommendations);
        break;
      case 'BreadcrumbList':
        validateBreadcrumbListSchema(schema, errors, warnings, recommendations);
        break;
      case 'Offer':
        validateOfferSchema(schema, errors, warnings, recommendations);
        break;
    }
  } else if (schemaType) {
    warnings.push(`Unknown schema type: ${schemaType}`);
    score -= 10;
  }

  // Apply strict mode penalties
  if (strict) {
    score -= warnings.length * 5;
    score -= recommendations.length * 2;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: includeWarnings ? warnings : [],
    recommendations: includeRecommendations ? recommendations : [],
    score: Math.max(0, score),
    schemaType: schemaType || 'Unknown',
  };
}

/**
 * Validate LocalBusiness schema specifics
 */
function validateLocalBusinessSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[],
  recommendations: string[]
): void {
  // Address validation
  if (schema.address) {
    const address = schema.address as Record<string, unknown>;
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
        errors.push(`Missing address field: ${field}`);
      }
    });
  }

  // Geo coordinates validation
  if (schema.geo) {
    const geo = schema.geo as Record<string, unknown>;
    if (!geo.latitude || !geo.longitude) {
      errors.push('Geo coordinates must include latitude and longitude');
    }
  }

  // Opening hours validation
  if (schema.openingHoursSpecification) {
    const hours = schema.openingHoursSpecification;
    if (!Array.isArray(hours)) {
      errors.push('openingHoursSpecification should be an array');
    }
  }

  // Business enhancements
  if (!schema.priceRange) {
    recommendations.push('Add priceRange for better local search visibility');
  }

  if (!schema.image) {
    recommendations.push('Add business images for rich results');
  }
}

/**
 * Validate Service schema specifics
 */
function validateServiceSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[],
  recommendations: string[]
): void {
  // Provider validation
  if (schema.provider) {
    const provider = schema.provider as Record<string, unknown>;
    if (!provider['@type'] || !provider.name) {
      errors.push('Service provider must have @type and name');
    }
  }

  // Offers validation
  if (schema.offers) {
    const offers = schema.offers;
    if (!Array.isArray(offers)) {
      warnings.push('Service offers should be an array');
    } else {
      offers.forEach((offer, index) => {
        const offerResult = validateSchema(offer as Record<string, unknown>, { strict: false });
        if (!offerResult.isValid) {
          errors.push(`Offer ${index + 1} validation failed: ${offerResult.errors.join(', ')}`);
        }
      });
    }
  } else {
    recommendations.push('Consider adding Offer schema for pricing information');
  }

  // Service enhancements
  if (!schema.category) {
    recommendations.push('Add category for better service classification');
  }

  if (!schema.duration) {
    recommendations.push('Add duration in ISO 8601 format (e.g., PT30M)');
  }
}

/**
 * Validate FAQPage schema specifics
 */
function validateFAQPageSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[],
  _recommendations: string[]
): void {
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    errors.push('FAQPage must have mainEntity as an array');
    return;
  }

  const questions = schema.mainEntity as Record<string, unknown>[];
  questions.forEach((question, index) => {
    if (!question['@type'] || question['@type'] !== 'Question') {
      errors.push(`FAQ question ${index + 1} must have @type: Question`);
    }

    if (!question.name) {
      errors.push(`FAQ question ${index + 1} missing name property`);
    }

    if (!question.acceptedAnswer) {
      errors.push(`FAQ question ${index + 1} missing acceptedAnswer`);
    }
  });

  if (questions.length < 2) {
    warnings.push('FAQPage should have at least 2 questions for Rich Results');
  }
}

/**
 * Validate Review schema specifics
 */
function validateReviewSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[],
  recommendations: string[]
): void {
  // Rating validation
  if (schema.reviewRating) {
    const rating = schema.reviewRating as Record<string, unknown>;
    if (!rating.ratingValue || !rating.bestRating) {
      errors.push('reviewRating must have ratingValue and bestRating');
    }

    const ratingValue = Number(rating.ratingValue);
    const bestRating = Number(rating.bestRating);
    if (ratingValue > bestRating) {
      errors.push('ratingValue cannot exceed bestRating');
    }
  }

  // Review enhancements
  if (!schema.datePublished) {
    recommendations.push('Add datePublished for better review credibility');
  }
}

/**
 * Validate BreadcrumbList schema specifics
 */
function validateBreadcrumbListSchema(
  schema: Record<string, unknown>,
  errors: string[],
  _warnings: string[],
  _recommendations: string[]
): void {
  if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
    errors.push('BreadcrumbList must have itemListElement as an array');
    return;
  }

  const items = schema.itemListElement as Record<string, unknown>[];
  items.forEach((item, index) => {
    if (!item['@type'] || item['@type'] !== 'ListItem') {
      errors.push(`Breadcrumb item ${index + 1} must have @type: ListItem`);
    }

    if (typeof item.position !== 'number') {
      errors.push(`Breadcrumb item ${index + 1} must have numeric position`);
    }

    if (!item.name || !item.item) {
      errors.push(`Breadcrumb item ${index + 1} missing name or item URL`);
    }
  });
}

/**
 * Validate Offer schema specifics
 */
function validateOfferSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[],
  recommendations: string[]
): void {
  // Price validation
  if (schema.price && schema.priceRange) {
    warnings.push('Use either price or priceRange, not both');
  }

  if (!schema.price && !schema.priceRange) {
    recommendations.push('Add price or priceRange for better offer visibility');
  }

  // Currency validation
  if (schema.price && !schema.priceCurrency) {
    warnings.push('Price should include priceCurrency (e.g., USD)');
  }

  // Availability validation
  if (schema.availability && typeof schema.availability === 'string') {
    const validAvailability = [
      'https://schema.org/InStock',
      'https://schema.org/OutOfStock',
      'https://schema.org/PreOrder',
      'https://schema.org/BackOrder',
    ];

    if (!validAvailability.includes(schema.availability)) {
      warnings.push('Use schema.org availability values (e.g., https://schema.org/InStock)');
    }
  }
}

/**
 * Batch validate multiple schemas
 */
export function validateSchemas(
  schemas: Record<string, unknown>[],
  options: SchemaValidationOptions = {}
): SchemaValidationResult[] {
  return schemas.map(schema => validateSchema(schema, options));
}

/**
 * Generate fallback schema with minimal required properties
 */
export function generateFallbackSchema(schemaType: string, name: string): Record<string, unknown> {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
  };

  switch (schemaType) {
    case 'LocalBusiness':
      return {
        ...baseSchema,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Riverton',
          addressRegion: 'ST',
          addressCountry: 'US',
        },
        telephone: '+10000000000',
      };

    case 'Service':
      return {
        ...baseSchema,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Premium Service Business',
        },
      };

    case 'Organization':
      return {
        ...baseSchema,
        url: 'https://www.example.com',
      };

    default:
      return baseSchema;
  }
}

/**
 * Schema validation middleware for error handling
 */
export function withSchemaValidation<T extends Record<string, unknown>>(
  schema: T,
  fallbackGenerator?: () => T
): T {
  try {
    const validation = validateSchema(schema);

    if (!validation.isValid) {
      // eslint-disable-next-line no-console
      console.warn('Schema validation failed:', validation.errors);

      if (fallbackGenerator) {
        // eslint-disable-next-line no-console
        console.log('Using fallback schema');
        return fallbackGenerator();
      }
    }

    return schema;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Schema validation error:', error);

    if (fallbackGenerator) {
      return fallbackGenerator();
    }

    return schema;
  }
}

/**
 * Monitor schema performance and errors
 */
export class SchemaMonitor {
  private validationHistory: SchemaValidationResult[] = [];
  private errorCount = 0;
  private warningCount = 0;

  addValidation(result: SchemaValidationResult): void {
    this.validationHistory.push(result);
    this.errorCount += result.errors.length;
    this.warningCount += result.warnings.length;
  }

  getStats() {
    const totalValidations = this.validationHistory.length;
    const validSchemas = this.validationHistory.filter(r => r.isValid).length;
    const averageScore =
      this.validationHistory.reduce((sum, r) => sum + r.score, 0) / totalValidations;

    return {
      totalValidations,
      validSchemas,
      validationRate: totalValidations > 0 ? (validSchemas / totalValidations) * 100 : 0,
      averageScore,
      totalErrors: this.errorCount,
      totalWarnings: this.warningCount,
    };
  }

  reset(): void {
    this.validationHistory = [];
    this.errorCount = 0;
    this.warningCount = 0;
  }
}

// Global schema monitor instance
export const schemaMonitor = new SchemaMonitor();
