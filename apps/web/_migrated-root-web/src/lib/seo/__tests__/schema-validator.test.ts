/**
 * Schema Validator Tests
 *
 * Tests for the schema validation system including validation rules,
 * fallback mechanisms, and error handling.
 */

import {
  validateSchema,
  validateSchemas,
  generateFallbackSchema,
  withSchemaValidation,
  SchemaMonitor,
  schemaMonitor,
} from '../schema-validator';

describe('Schema Validator', () => {
  beforeEach(() => {
    schemaMonitor.reset();
  });

  describe('validateSchema', () => {
    it('should validate a correct LocalBusiness schema', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Vital Ice',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Marina Blvd',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          postalCode: '94123',
          addressCountry: 'US',
        },
        telephone: '+1-415-555-0123',
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.schemaType).toBe('LocalBusiness');
      expect(result.score).toBeGreaterThan(80);
    });

    it('should identify missing required properties', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Vital Ice',
        // Missing address and telephone
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required property: address');
      expect(result.errors).toContain('Missing required property: telephone');
      expect(result.score).toBeLessThan(100);
    });

    it('should validate Service schema with offers', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Cold Plunge Therapy',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Vital Ice',
        },
        offers: [
          {
            '@context': 'https://schema.org',
            '@type': 'Offer',
            name: 'Single Session',
            price: '35',
            priceCurrency: 'USD',
          },
        ],
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(true);
      expect(result.schemaType).toBe('Service');
    });

    it('should validate FAQPage schema', () => {
      const schema = {
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
          {
            '@type': 'Question',
            name: 'How long should I stay in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We recommend 2-5 minutes for beginners...',
            },
          },
        ],
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(true);
      expect(result.schemaType).toBe('FAQPage');
    });

    it('should warn about insufficient FAQ questions', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is cold plunge therapy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Cold plunge therapy involves...',
            },
          },
        ],
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain(
        'FAQPage should have at least 2 questions for Rich Results'
      );
    });

    it('should validate Review schema', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'LocalBusiness',
          name: 'Vital Ice',
        },
        author: {
          '@type': 'Person',
          name: 'John Doe',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
        },
        reviewBody: 'Amazing experience!',
        datePublished: '2024-01-15',
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(true);
      expect(result.schemaType).toBe('Review');
    });

    it('should catch invalid rating values', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'LocalBusiness',
          name: 'Vital Ice',
        },
        author: {
          '@type': 'Person',
          name: 'John Doe',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 6,
          bestRating: 5,
        },
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ratingValue cannot exceed bestRating');
    });

    it('should validate BreadcrumbList schema', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.vitalicesf.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://www.vitalicesf.com/services',
          },
        ],
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(true);
      expect(result.schemaType).toBe('BreadcrumbList');
    });

    it('should handle invalid schema structure', () => {
      const result = validateSchema(null as unknown as Record<string, unknown>);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid schema: must be an object');
      expect(result.score).toBe(0);
    });

    it('should handle missing @type', () => {
      const schema = {
        '@context': 'https://schema.org',
        name: 'Test',
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required @type property');
    });
  });

  describe('validateSchemas', () => {
    it('should validate multiple schemas', () => {
      const schemas = [
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Vital Ice',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Marina Blvd',
            addressLocality: 'San Francisco',
            addressRegion: 'CA',
            postalCode: '94123',
            addressCountry: 'US',
          },
          telephone: '+1-415-555-0123',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Cold Plunge',
          provider: {
            '@type': 'LocalBusiness',
            name: 'Vital Ice',
          },
        },
      ];

      const results = validateSchemas(schemas);

      expect(results).toHaveLength(2);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(true);
    });
  });

  describe('generateFallbackSchema', () => {
    it('should generate fallback LocalBusiness schema', () => {
      const fallback = generateFallbackSchema('LocalBusiness', 'Test Business');

      expect(fallback['@context']).toBe('https://schema.org');
      expect(fallback['@type']).toBe('LocalBusiness');
      expect(fallback.name).toBe('Test Business');
      expect(fallback.address).toBeDefined();
      expect(fallback.telephone).toBeDefined();
    });

    it('should generate fallback Service schema', () => {
      const fallback = generateFallbackSchema('Service', 'Test Service');

      expect(fallback['@context']).toBe('https://schema.org');
      expect(fallback['@type']).toBe('Service');
      expect(fallback.name).toBe('Test Service');
      expect(fallback.provider).toBeDefined();
    });

    it('should generate fallback Organization schema', () => {
      const fallback = generateFallbackSchema('Organization', 'Test Org');

      expect(fallback['@context']).toBe('https://schema.org');
      expect(fallback['@type']).toBe('Organization');
      expect(fallback.name).toBe('Test Org');
      expect(fallback.url).toBeDefined();
    });
  });

  describe('withSchemaValidation', () => {
    it('should return original schema if valid', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Vital Ice',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Marina Blvd',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          postalCode: '94123',
          addressCountry: 'US',
        },
        telephone: '+1-415-555-0123',
      };

      const result = withSchemaValidation(schema);

      expect(result).toBe(schema);
    });

    it('should use fallback for invalid schema', () => {
      const invalidSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Test',
        // Missing required fields
      };

      const fallback = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Fallback',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          addressCountry: 'US',
        },
        telephone: '+1-415-555-0123',
      };

      const result = withSchemaValidation(invalidSchema, () => fallback);

      expect(result).toBe(fallback);
    });
  });

  describe('SchemaMonitor', () => {
    it('should track validation statistics', () => {
      const monitor = new SchemaMonitor();

      const validResult = {
        isValid: true,
        errors: [],
        warnings: [],
        recommendations: [],
        score: 100,
        schemaType: 'LocalBusiness',
      };

      const invalidResult = {
        isValid: false,
        errors: ['Missing required property'],
        warnings: ['Consider adding property'],
        recommendations: [],
        score: 70,
        schemaType: 'Service',
      };

      monitor.addValidation(validResult);
      monitor.addValidation(invalidResult);

      const stats = monitor.getStats();

      expect(stats.totalValidations).toBe(2);
      expect(stats.validSchemas).toBe(1);
      expect(stats.validationRate).toBe(50);
      expect(stats.averageScore).toBe(85);
      expect(stats.totalErrors).toBe(1);
      expect(stats.totalWarnings).toBe(1);
    });

    it('should reset statistics', () => {
      const monitor = new SchemaMonitor();

      monitor.addValidation({
        isValid: true,
        errors: [],
        warnings: [],
        recommendations: [],
        score: 100,
        schemaType: 'LocalBusiness',
      });

      monitor.reset();
      const stats = monitor.getStats();

      expect(stats.totalValidations).toBe(0);
      expect(stats.totalErrors).toBe(0);
      expect(stats.totalWarnings).toBe(0);
    });
  });

  describe('Offer schema validation', () => {
    it('should validate Offer schema', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Cold Plunge Session',
        description: 'Single cold plunge therapy session',
        price: '35',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      };

      const result = validateSchema(schema);

      expect(result.isValid).toBe(true);
      expect(result.schemaType).toBe('Offer');
    });

    it('should warn about conflicting price properties', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Cold Plunge Session',
        price: '35',
        priceRange: '$30-$40',
        priceCurrency: 'USD',
      };

      const result = validateSchema(schema);

      expect(result.warnings).toContain('Use either price or priceRange, not both');
    });

    it('should validate availability values', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Cold Plunge Session',
        price: '35',
        priceCurrency: 'USD',
        availability: 'in-stock', // Invalid format
      };

      const result = validateSchema(schema);

      expect(result.warnings).toContain(
        'Use schema.org availability values (e.g., https://schema.org/InStock)'
      );
    });
  });
});
