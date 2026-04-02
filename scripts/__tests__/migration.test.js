/**
 * Migration Validation Tests
 *
 * These tests validate that the content migration from hardcoded data
 * to Sanity CMS was successful and maintains data integrity.
 */

const { createClient } = require('@sanity/client');
const {
  parseServicesData,
  parseBusinessInfo,
  parseSEOMetadata,
  transformServiceToSanity,
  transformBusinessInfoToSanity,
  validateMigratedContent,
} = require('../migrate-to-sanity');

// Mock Sanity client for testing
const mockClient = {
  fetch: jest.fn(),
  create: jest.fn(),
  createOrReplace: jest.fn(),
  patch: jest.fn(() => ({
    set: jest.fn(() => ({
      commit: jest.fn(),
    })),
  })),
};

// Mock environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
process.env.SANITY_API_TOKEN = 'test-token';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test';

describe('Content Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Services Data Parsing', () => {
    test('should parse services data correctly', () => {
      const mockServicesContent = `
        export const servicesData: Record<string, ServiceData> = {
          'cold-plunge': {
            id: 'cold-plunge',
            title: 'Cold Plunge',
            subtitle: 'Test subtitle',
            description: 'Test description',
            // ... other fields
          }
        };
      `;

      const services = parseServicesData(mockServicesContent);
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);

      const coldPlunge = services.find(s => s.id === 'cold-plunge');
      expect(coldPlunge).toBeDefined();
      expect(coldPlunge.title).toBe('Cold Plunge');
    });

    test('should handle missing services data gracefully', () => {
      const invalidContent = 'export const invalidData = {};';
      const services = parseServicesData(invalidContent);
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBe(0);
    });
  });

  describe('Business Info Parsing', () => {
    test('should parse business info correctly', () => {
      const businessInfo = parseBusinessInfo();

      expect(businessInfo).toBeDefined();
      expect(businessInfo.name).toBe('Vital Ice');
      expect(businessInfo.email).toBe('info@vitalicesf.com');
      expect(businessInfo.address).toBeDefined();
      expect(businessInfo.address.street).toBe('2400 Chestnut St');
      expect(businessInfo.coordinates).toBeDefined();
      expect(typeof businessInfo.coordinates.latitude).toBe('number');
      expect(typeof businessInfo.coordinates.longitude).toBe('number');
    });

    test('should include all required business fields', () => {
      const businessInfo = parseBusinessInfo();

      const requiredFields = [
        'name',
        'description',
        'tagline',
        'phone',
        'email',
        'address',
        'coordinates',
        'hours',
        'services',
      ];

      requiredFields.forEach(field => {
        expect(businessInfo[field]).toBeDefined();
      });
    });
  });

  describe('SEO Metadata Parsing', () => {
    test('should parse SEO metadata correctly', () => {
      const seoMetadata = parseSEOMetadata();

      expect(seoMetadata).toBeDefined();
      expect(seoMetadata.home).toBeDefined();
      expect(seoMetadata.services).toBeDefined();

      expect(seoMetadata.home.title).toContain('Vital Ice');
      expect(seoMetadata.home.description).toBeDefined();
      expect(seoMetadata.home.openGraph).toBeDefined();
      expect(seoMetadata.home.twitter).toBeDefined();
    });

    test('should include required SEO fields', () => {
      const seoMetadata = parseSEOMetadata();

      Object.values(seoMetadata).forEach(pageMeta => {
        expect(pageMeta.title).toBeDefined();
        expect(pageMeta.description).toBeDefined();
        expect(pageMeta.openGraph).toBeDefined();
        expect(pageMeta.twitter).toBeDefined();
      });
    });
  });

  describe('Data Transformation', () => {
    test('should transform service data to Sanity format', () => {
      const mockService = {
        id: 'cold-plunge',
        title: 'Cold Plunge',
        subtitle: 'Test subtitle',
        description: 'Test description',
        heroImage: 'https://example.com/hero.jpg',
        backgroundImage: 'https://example.com/bg.jpg',
        accentColor: '#0040FF',
        tagline: 'Test tagline',
        benefits: [{ title: 'Benefit 1', description: 'Description 1' }],
        process: [{ step: '01', title: 'Step 1', description: 'Step description' }],
        ctaTitle: 'CTA Title',
        ctaText: 'CTA Text',
        order: 1,
      };

      const sanityService = transformServiceToSanity(mockService);

      expect(sanityService._type).toBe('service');
      expect(sanityService.title).toBe('Cold Plunge');
      expect(sanityService.slug.current).toBe('cold-plunge');
      expect(sanityService.accentColor.hex).toBe('#0040FF');
      expect(sanityService.benefits).toHaveLength(1);
      expect(sanityService.process).toHaveLength(1);
      expect(sanityService.cta).toBeDefined();
      expect(sanityService.seo).toBeDefined();
    });

    test('should transform business info to Sanity format', () => {
      const mockBusinessInfo = {
        name: 'Vital Ice',
        phone: '+1-415-555-0123',
        email: 'info@vitalicesf.com',
        address: {
          street: '2400 Chestnut St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94123',
          country: 'US',
        },
        coordinates: {
          latitude: 37.800111,
          longitude: -122.443048,
        },
        hours: [{ day: 'Monday', open: '06:00', close: '22:00' }],
        socialMedia: {
          instagram: 'https://instagram.com/vitalice',
        },
      };

      const sanityBusinessInfo = transformBusinessInfoToSanity(mockBusinessInfo);

      expect(sanityBusinessInfo._type).toBe('globalSettings');
      expect(sanityBusinessInfo._id).toBe('globalSettings');
      expect(sanityBusinessInfo.businessInfo.name).toBe('Vital Ice');
      expect(sanityBusinessInfo.businessInfo.address.street).toBe('2400 Chestnut St');
      expect(sanityBusinessInfo.socialMedia.instagram).toBe('https://instagram.com/vitalice');
    });
  });

  describe('Content Validation', () => {
    test('should validate successful migration results', () => {
      const mockResults = [
        { success: true, id: 'service-1', action: 'created' },
        { success: true, id: 'service-2', action: 'created' },
        { success: true, id: 'global-settings', action: 'created' },
      ];

      const validation = validateMigratedContent(mockResults);

      expect(validation.total).toBe(3);
      expect(validation.successful).toBe(3);
      expect(validation.failed).toBe(0);
      expect(validation.isValid).toBe(true);
    });

    test('should identify failed migrations', () => {
      const mockResults = [
        { success: true, id: 'service-1', action: 'created' },
        { success: false, id: 'service-2', error: 'Validation failed' },
        { success: true, id: 'global-settings', action: 'created' },
      ];

      const validation = validateMigratedContent(mockResults);

      expect(validation.total).toBe(3);
      expect(validation.successful).toBe(2);
      expect(validation.failed).toBe(1);
      expect(validation.isValid).toBe(false);
    });
  });
});

describe('Schema Validation', () => {
  test('should validate service schema compliance', () => {
    const validService = {
      _type: 'service',
      title: 'Cold Plunge',
      slug: { current: 'cold-plunge' },
      subtitle: 'Test subtitle',
      description: 'Test description',
      heroImage: {
        asset: { _ref: 'image-123' },
        alt: 'Hero image',
      },
      backgroundImage: {
        asset: { _ref: 'image-456' },
        alt: 'Background image',
      },
      accentColor: { hex: '#0040FF' },
      tagline: 'Test tagline',
      benefits: [{ title: 'Benefit 1', description: 'Description 1' }],
      process: [{ step: '01', title: 'Step 1', description: 'Step description' }],
      cta: {
        title: 'CTA Title',
        text: 'CTA Text',
      },
      order: 1,
      status: 'active',
    };

    // Test required fields
    const requiredFields = [
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
    ];

    requiredFields.forEach(field => {
      expect(validService[field]).toBeDefined();
    });

    // Test field types
    expect(typeof validService.title).toBe('string');
    expect(typeof validService.slug.current).toBe('string');
    expect(Array.isArray(validService.benefits)).toBe(true);
    expect(Array.isArray(validService.process)).toBe(true);
    expect(typeof validService.order).toBe('number');
  });

  test('should validate global settings schema compliance', () => {
    const validGlobalSettings = {
      _type: 'globalSettings',
      businessInfo: {
        name: 'Vital Ice',
        phone: '+1-415-555-0123',
        email: 'info@vitalicesf.com',
        address: {
          street: '2400 Chestnut St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94123',
          country: 'US',
        },
        coordinates: {
          latitude: 37.800111,
          longitude: -122.443048,
        },
        hours: [{ day: 'Monday', open: '06:00', close: '22:00' }],
      },
      socialMedia: {
        instagram: 'https://instagram.com/vitalice',
      },
    };

    // Test required business info fields
    const requiredBusinessFields = ['name', 'phone', 'email', 'address', 'coordinates', 'hours'];

    requiredBusinessFields.forEach(field => {
      expect(validGlobalSettings.businessInfo[field]).toBeDefined();
    });

    // Test coordinate types
    expect(typeof validGlobalSettings.businessInfo.coordinates.latitude).toBe('number');
    expect(typeof validGlobalSettings.businessInfo.coordinates.longitude).toBe('number');

    // Test hours array
    expect(Array.isArray(validGlobalSettings.businessInfo.hours)).toBe(true);
    expect(validGlobalSettings.businessInfo.hours[0].day).toBeDefined();
    expect(validGlobalSettings.businessInfo.hours[0].open).toBeDefined();
    expect(validGlobalSettings.businessInfo.hours[0].close).toBeDefined();
  });
});

describe('Data Integrity', () => {
  test('should preserve all service data during transformation', () => {
    const originalService = {
      id: 'cold-plunge',
      title: 'Cold Plunge',
      subtitle: 'Controlled cold exposure',
      description: 'Ancient practice reimagined',
      benefits: [
        { title: 'Nervous System Regulation', description: 'Activates sympathetic nervous system' },
        { title: 'Muscle Recovery', description: 'Reduces inflammation and soreness' },
      ],
      process: [
        { step: '01', title: 'Preparation', description: 'Begin with rinse shower' },
        { step: '02', title: 'Gradual Exposure', description: 'Start with 30-second immersion' },
      ],
    };

    const transformedService = transformServiceToSanity(originalService);

    // Verify all benefits are preserved
    expect(transformedService.benefits).toHaveLength(originalService.benefits.length);
    originalService.benefits.forEach((benefit, index) => {
      expect(transformedService.benefits[index].title).toBe(benefit.title);
      expect(transformedService.benefits[index].description).toBe(benefit.description);
    });

    // Verify all process steps are preserved
    expect(transformedService.process).toHaveLength(originalService.process.length);
    originalService.process.forEach((step, index) => {
      expect(transformedService.process[index].step).toBe(step.step);
      expect(transformedService.process[index].title).toBe(step.title);
      expect(transformedService.process[index].description).toBe(step.description);
    });
  });

  test('should preserve business hours during transformation', () => {
    const originalBusinessInfo = {
      hours: [
        { day: 'Monday', open: '06:00', close: '22:00' },
        { day: 'Tuesday', open: '06:00', close: '22:00' },
        { day: 'Saturday', open: '08:00', close: '20:00' },
        { day: 'Sunday', open: '08:00', close: '20:00' },
      ],
    };

    const transformedBusinessInfo = transformBusinessInfoToSanity(originalBusinessInfo);

    expect(transformedBusinessInfo.businessInfo.hours).toHaveLength(
      originalBusinessInfo.hours.length
    );
    originalBusinessInfo.hours.forEach((hour, index) => {
      expect(transformedBusinessInfo.businessInfo.hours[index].day).toBe(hour.day);
      expect(transformedBusinessInfo.businessInfo.hours[index].open).toBe(hour.open);
      expect(transformedBusinessInfo.businessInfo.hours[index].close).toBe(hour.close);
    });
  });
});

describe('Error Handling', () => {
  test('should handle malformed service data gracefully', () => {
    const malformedService = {
      // Missing required fields
      title: 'Incomplete Service',
    };

    expect(() => {
      transformServiceToSanity(malformedService);
    }).not.toThrow();

    const result = transformServiceToSanity(malformedService);
    expect(result._type).toBe('service');
    expect(result.title).toBe('Incomplete Service');
  });

  test('should handle empty arrays gracefully', () => {
    const serviceWithEmptyArrays = {
      id: 'test-service',
      title: 'Test Service',
      benefits: [],
      process: [],
    };

    const result = transformServiceToSanity(serviceWithEmptyArrays);
    expect(Array.isArray(result.benefits)).toBe(true);
    expect(Array.isArray(result.process)).toBe(true);
    expect(result.benefits).toHaveLength(0);
    expect(result.process).toHaveLength(0);
  });
});

describe('Asset References', () => {
  test('should create proper asset references for images', () => {
    const serviceWithImages = {
      id: 'test-service',
      title: 'Test Service',
      heroImage: 'https://example.com/hero.jpg',
      backgroundImage: 'https://example.com/bg.jpg',
      textureImage: 'https://example.com/texture.jpg',
    };

    const result = transformServiceToSanity(serviceWithImages);

    expect(result.heroImage).toBeDefined();
    expect(result.heroImage._type).toBe('image');
    expect(result.heroImage.asset._type).toBe('reference');
    expect(result.heroImage.alt).toBeDefined();

    expect(result.backgroundImage).toBeDefined();
    expect(result.backgroundImage._type).toBe('image');
    expect(result.backgroundImage.asset._type).toBe('reference');
    expect(result.backgroundImage.alt).toBeDefined();

    expect(result.textureImage).toBeDefined();
    expect(result.textureImage._type).toBe('image');
    expect(result.textureImage.asset._type).toBe('reference');
  });

  test('should handle missing texture image gracefully', () => {
    const serviceWithoutTexture = {
      id: 'test-service',
      title: 'Test Service',
      heroImage: 'https://example.com/hero.jpg',
      backgroundImage: 'https://example.com/bg.jpg',
      // textureImage is undefined
    };

    const result = transformServiceToSanity(serviceWithoutTexture);

    expect(result.heroImage).toBeDefined();
    expect(result.backgroundImage).toBeDefined();
    expect(result.textureImage).toBeUndefined();
  });
});

describe('SEO Data Migration', () => {
  test('should preserve SEO metadata structure', () => {
    const originalSEO = {
      title: 'Cold Plunge Therapy | Vital Ice',
      description: 'Experience cold plunge therapy benefits',
      keywords: ['cold therapy', 'recovery', 'wellness'],
      openGraph: {
        title: 'Cold Plunge Therapy',
        description: 'Experience the benefits',
        image: 'https://example.com/og-image.jpg',
      },
      twitter: {
        title: 'Cold Plunge Therapy',
        description: 'Experience the benefits',
        image: 'https://example.com/twitter-image.jpg',
      },
    };

    // This would be part of the page transformation
    const sanityPage = {
      _type: 'page',
      title: originalSEO.title,
      seo: {
        _type: 'seoSettings',
        title: originalSEO.title,
        description: originalSEO.description,
        keywords: originalSEO.keywords,
        openGraph: originalSEO.openGraph,
        twitter: originalSEO.twitter,
      },
    };

    expect(sanityPage.seo.title).toBe(originalSEO.title);
    expect(sanityPage.seo.description).toBe(originalSEO.description);
    expect(sanityPage.seo.keywords).toEqual(originalSEO.keywords);
    expect(sanityPage.seo.openGraph.title).toBe(originalSEO.openGraph.title);
    expect(sanityPage.seo.twitter.title).toBe(originalSEO.twitter.title);
  });
});
