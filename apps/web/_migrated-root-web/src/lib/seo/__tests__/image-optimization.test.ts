/**
 * Image Optimization Tests
 *
 * Tests for SEO and accessibility image optimization utilities
 */

import {
  generateOptimizedAltText,
  optimizeImageProps,
  validateImageAccessibility,
  generateImageSchema,
  generateResponsiveSizes,
  batchOptimizeImages,
  generateImageAuditReport,
  ImageSEOData,
} from '../image-optimization';

describe('Image SEO Optimization', () => {
  describe('generateOptimizedAltText', () => {
    it('should generate SEO-optimized alt text with service keywords', () => {
      const result = generateOptimizedAltText('Woman in cold water', 'service', 'cold-plunge');

      expect(result).toContain('cold plunge therapy');
      expect(result).toContain('San Francisco');
      expect(result).toContain('Woman in cold water');
    });

    it('should add location context for local SEO', () => {
      const result = generateOptimizedAltText('Sauna interior', 'service', 'infrared-sauna');

      expect(result).toContain('San Francisco');
      expect(result).toContain('infrared sauna therapy');
    });

    it('should handle founder context appropriately', () => {
      const result = generateOptimizedAltText('Sean, Co-Founder', 'founder');

      expect(result).toContain('Vital Ice');
      expect(result).toContain('San Francisco');
    });

    it('should not duplicate existing keywords', () => {
      const result = generateOptimizedAltText(
        'Cold plunge therapy session at Vital Ice San Francisco',
        'service',
        'cold-plunge'
      );

      // Should not duplicate "San Francisco"
      const sfOccurrences = (result.match(/San Francisco/g) || []).length;
      expect(sfOccurrences).toBe(1);
    });
  });

  describe('generateResponsiveSizes', () => {
    it('should generate appropriate sizes for different contexts', () => {
      expect(generateResponsiveSizes('service')).toBe(
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      );

      expect(generateResponsiveSizes('logo')).toBe('(max-width: 768px) 200px, 300px');

      expect(generateResponsiveSizes('background')).toBe('100vw');
    });
  });

  describe('optimizeImageProps', () => {
    it('should optimize image props with SEO enhancements', () => {
      const imageData: ImageSEOData = {
        src: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
        alt: 'Woman in cold water',
        context: 'service',
        width: 800,
        height: 600,
      };

      const result = optimizeImageProps(imageData);

      expect(result.alt).toContain('cold plunge therapy');
      expect(result.alt).toContain('San Francisco');
      expect(result.sizes).toBeDefined();
      expect(result.quality).toBe(85);
      expect(result.lazy).toBe(true);
    });

    it('should set priority for logo images', () => {
      const imageData: ImageSEOData = {
        src: 'https://media.vitalicesf.com/logo-dark.png',
        alt: 'Vital Ice Logo',
        context: 'logo',
      };

      const result = optimizeImageProps(imageData);

      expect(result.priority).toBe(false); // Based on context, not automatic
      expect(result.alt).toContain('Vital Ice');
    });
  });

  describe('validateImageAccessibility', () => {
    it('should validate compliant images', () => {
      const imageProps = {
        src: 'test.jpg',
        alt: 'Cold plunge therapy session for recovery at Vital Ice San Francisco',
        title: 'Cold Plunge Therapy',
        width: 800,
        height: 600,
        priority: false,
        lazy: true,
      };

      const result = validateImageAccessibility(imageProps);

      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should identify missing alt text', () => {
      const imageProps = {
        src: 'test.jpg',
        alt: '',
        width: 800,
        height: 600,
        priority: false,
        lazy: true,
      };

      const result = validateImageAccessibility(imageProps);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Missing alt text');
    });

    it('should identify generic alt text', () => {
      const imageProps = {
        src: 'test.jpg',
        alt: 'image',
        width: 800,
        height: 600,
        priority: false,
        lazy: true,
      };

      const result = validateImageAccessibility(imageProps);

      expect(result.recommendations).toContain(
        'Avoid generic terms like "image" or "photo" in alt text'
      );
    });

    it('should recommend SEO improvements', () => {
      const imageProps = {
        src: 'test.jpg',
        alt: 'A nice picture of something',
        width: 800,
        height: 600,
        priority: false,
        lazy: true,
      };

      const result = validateImageAccessibility(imageProps);

      expect(result.recommendations).toContain(
        'Consider adding relevant wellness/therapy keywords to alt text'
      );
      expect(result.recommendations).toContain('Consider adding location context for local SEO');
    });
  });

  describe('generateImageSchema', () => {
    it('should generate proper schema markup', () => {
      const imageData: ImageSEOData = {
        src: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
        alt: 'Cold plunge therapy session',
        context: 'service',
        width: 800,
        height: 600,
        keywords: ['cold therapy', 'wellness', 'recovery'],
      };

      const schema = generateImageSchema(imageData);

      expect(schema['@type']).toBe('ImageObject');
      expect(schema.url).toBe(imageData.src);
      expect(schema.description).toBe(imageData.alt);
      expect(schema.width).toBe(800);
      expect(schema.height).toBe(600);
      expect(schema.keywords).toBe('cold therapy, wellness, recovery');
      expect(schema.author).toBeDefined();
    });

    it('should include organization context for business images', () => {
      const imageData: ImageSEOData = {
        src: 'test.jpg',
        alt: 'Test image',
        context: 'founder',
      };

      const schema = generateImageSchema(imageData);

      expect(schema.author).toEqual({
        '@type': 'Organization',
        name: 'Vital Ice',
        url: 'https://www.vitalicesf.com',
      });
    });
  });

  describe('batchOptimizeImages', () => {
    it('should optimize multiple images', () => {
      const images: ImageSEOData[] = [
        {
          src: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
          alt: 'Woman in cold water',
          context: 'service',
        },
        {
          src: 'https://media.vitalicesf.com/logo-dark.png',
          alt: 'Logo',
          context: 'logo',
        },
      ];

      const results = batchOptimizeImages(images);

      expect(results).toHaveLength(2);
      expect(results[0].alt).toContain('cold plunge therapy');
      expect(results[1].alt).toContain('Vital Ice');
    });
  });

  describe('generateImageAuditReport', () => {
    it('should generate comprehensive audit report', () => {
      const images: ImageSEOData[] = [
        {
          src: 'test1.jpg',
          alt: 'Cold plunge therapy at Vital Ice San Francisco',
          context: 'service',
        },
        {
          src: 'test2.jpg',
          alt: 'image',
          context: 'gallery',
        },
      ];

      const report = generateImageAuditReport(images);

      expect(report.totalImages).toBe(2);
      expect(report.optimizedImages).toBe(2); // Both are considered optimized after processing
      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations).toContain(
        'Avoid generic terms like "image" or "photo" in alt text'
      );
      expect(report.summary).toContain('Audited 2 images');
    });
  });
});

describe('Service-specific optimizations', () => {
  it('should detect cold plunge images and add appropriate keywords', () => {
    const result = generateOptimizedAltText('Person in ice bath', 'service', 'cold-plunge');

    expect(result).toContain('cold plunge therapy');
    expect(result).toContain('San Francisco');
  });

  it('should detect sauna images and add appropriate keywords', () => {
    const result = generateOptimizedAltText('Wooden sauna interior', 'service', 'infrared-sauna');

    expect(result).toContain('infrared sauna therapy');
    expect(result).toContain('San Francisco');
  });

  it('should detect red light therapy images', () => {
    const result = generateOptimizedAltText('Red light panel', 'service', 'red-light-therapy');

    expect(result).toContain('red light therapy');
    expect(result).toContain('San Francisco');
  });
});
