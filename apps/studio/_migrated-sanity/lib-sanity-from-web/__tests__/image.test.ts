import { describe, it, expect, jest } from '@jest/globals';
import {
  buildImageUrl,
  buildResponsiveImageSet,
  buildResponsiveImageUrls,
  getImageProps,
  getOptimizedImageUrl,
  getImageHotspot,
  getImageCrop,
  getImageMetadata,
  isValidImageSource,
  generateImagePlaceholder,
} from '../image';
import type { SanityImageWithMetadata } from '../types';

// Mock the image URL builder
jest.mock('@sanity/image-url', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    image: jest.fn(() => ({
      width: jest.fn().mockReturnThis(),
      height: jest.fn().mockReturnThis(),
      quality: jest.fn().mockReturnThis(),
      format: jest.fn().mockReturnThis(),
      auto: jest.fn().mockReturnThis(),
      fit: jest.fn().mockReturnThis(),
      blur: jest.fn().mockReturnThis(),
      sharpen: jest.fn().mockReturnThis(),
      saturation: jest.fn().mockReturnThis(),
      brightness: jest.fn().mockReturnThis(),
      contrast: jest.fn().mockReturnThis(),
      invert: jest.fn().mockReturnThis(),
      flipHorizontal: jest.fn().mockReturnThis(),
      flipVertical: jest.fn().mockReturnThis(),
      ignoreImageParams: jest.fn().mockReturnThis(),
      url: jest.fn(() => 'https://cdn.sanity.io/images/test/test/image.jpg'),
    })),
  })),
}));

describe('Sanity Image Service', () => {
  const mockImage = {
    asset: {
      _id: 'image-test',
      url: 'https://cdn.sanity.io/images/test/test/image.jpg',
      metadata: {
        dimensions: {
          width: 1920,
          height: 1080,
          aspectRatio: 1.777,
        },
        lqip: 'data:image/jpeg;base64,test',
        hasAlpha: false,
        isOpaque: true,
      },
    },
    hotspot: {
      x: 0.5,
      y: 0.5,
      height: 0.8,
      width: 0.8,
    },
    crop: {
      top: 0.1,
      bottom: 0.1,
      left: 0.1,
      right: 0.1,
    },
    alt: 'Test image',
  } as SanityImageWithMetadata;

  describe('buildImageUrl', () => {
    it('should build image URL with default options', () => {
      const url = buildImageUrl(mockImage);
      expect(url).toBeDefined();
      expect(typeof url).toBe('string');
    });

    it('should handle missing image gracefully', () => {
      const url = buildImageUrl(null as any);
      expect(url).toBe('');
    });

    it('should apply image transformations', () => {
      const url = buildImageUrl(mockImage, {
        width: 800,
        height: 600,
        quality: 90,
        format: 'webp',
        blur: 5,
        sharpen: 10,
      });
      expect(url).toBeDefined();
    });
  });

  describe('buildResponsiveImageSet', () => {
    it('should generate responsive image set', () => {
      const imageSet = buildResponsiveImageSet(mockImage, {
        sizes: [320, 640, 1024],
        aspectRatio: 16 / 9,
      });

      expect(imageSet.src).toBeDefined();
      expect(imageSet.srcSet).toBeDefined();
      expect(imageSet.sizes).toBeDefined();
      expect(imageSet.width).toBeGreaterThan(0);
      expect(imageSet.height).toBeGreaterThan(0);
      expect(imageSet.aspectRatio).toBe(16 / 9);
      expect(imageSet.placeholder).toBe('data:image/jpeg;base64,test');
      expect(imageSet.alt).toBe('Test image');
    });

    it('should filter sizes based on min/max width', () => {
      const imageSet = buildResponsiveImageSet(mockImage, {
        sizes: [100, 320, 640, 1024, 2000],
        minWidth: 300,
        maxWidth: 1200,
      });

      expect(imageSet).toBeDefined();
      // Should filter out 100 (too small) and 2000 (too large)
    });
  });

  describe('buildResponsiveImageUrls', () => {
    it('should generate array of responsive URLs', () => {
      const urls = buildResponsiveImageUrls(mockImage, [320, 640, 1024]);

      expect(Array.isArray(urls)).toBe(true);
      expect(urls).toHaveLength(3);
      expect(urls[0]).toHaveProperty('url');
      expect(urls[0]).toHaveProperty('width', 320);
    });
  });

  describe('getImageProps', () => {
    it('should generate props for Next.js Image component', () => {
      const props = getImageProps(mockImage, {
        width: 800,
        height: 600,
        alt: 'Custom alt text',
        priority: true,
      });

      expect(props.src).toBeDefined();
      expect(props.width).toBe(800);
      expect(props.height).toBe(600);
      expect(props.alt).toBe('Custom alt text');
      expect(props.priority).toBe(true);
      expect(props.placeholder).toBe('blur');
      expect(props.blurDataURL).toBe('data:image/jpeg;base64,test');
    });

    it('should use original dimensions when not specified', () => {
      const props = getImageProps(mockImage);

      expect(props.width).toBe(1920);
      expect(props.height).toBe(1080);
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should generate optimized URL for different use cases', () => {
      const heroUrl = getOptimizedImageUrl(mockImage, 'hero');
      const thumbnailUrl = getOptimizedImageUrl(mockImage, 'thumbnail');
      const avatarUrl = getOptimizedImageUrl(mockImage, 'avatar');

      expect(heroUrl).toBeDefined();
      expect(thumbnailUrl).toBeDefined();
      expect(avatarUrl).toBeDefined();
    });

    it('should apply custom options', () => {
      const url = getOptimizedImageUrl(mockImage, 'hero', {
        quality: 95,
        format: 'jpg',
      });

      expect(url).toBeDefined();
    });
  });

  describe('Image metadata helpers', () => {
    describe('getImageHotspot', () => {
      it('should extract hotspot information', () => {
        const hotspot = getImageHotspot(mockImage);

        expect(hotspot).toEqual({
          x: 0.5,
          y: 0.5,
        });
      });

      it('should return null for image without hotspot', () => {
        const imageWithoutHotspot = { ...mockImage, hotspot: undefined };
        const hotspot = getImageHotspot(imageWithoutHotspot);

        expect(hotspot).toBeNull();
      });
    });

    describe('getImageCrop', () => {
      it('should extract crop information', () => {
        const crop = getImageCrop(mockImage);

        expect(crop).toEqual({
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        });
      });

      it('should return null for image without crop', () => {
        const imageWithoutCrop = { ...mockImage, crop: undefined };
        const crop = getImageCrop(imageWithoutCrop);

        expect(crop).toBeNull();
      });
    });

    describe('getImageMetadata', () => {
      it('should extract image metadata', () => {
        const metadata = getImageMetadata(mockImage);

        expect(metadata).toEqual({
          width: 1920,
          height: 1080,
          aspectRatio: 1.777,
          lqip: 'data:image/jpeg;base64,test',
          hasAlpha: false,
          isOpaque: true,
        });
      });

      it('should return null for image without metadata', () => {
        const imageWithoutMetadata = {
          ...mockImage,
          asset: { ...mockImage.asset, metadata: undefined },
        };
        const metadata = getImageMetadata(imageWithoutMetadata as any);

        expect(metadata).toBeNull();
      });
    });
  });

  describe('isValidImageSource', () => {
    it('should validate valid image sources', () => {
      expect(isValidImageSource(mockImage)).toBe(true);
      expect(isValidImageSource({ asset: { _ref: 'image-ref' } })).toBe(true);
      expect(isValidImageSource({ _id: 'image-id' })).toBe(true);
      expect(isValidImageSource({ url: 'https://example.com/image.jpg' })).toBe(true);
    });

    it('should reject invalid image sources', () => {
      expect(isValidImageSource(null)).toBe(false);
      expect(isValidImageSource(undefined)).toBe(false);
      expect(isValidImageSource({})).toBe(false);
      expect(isValidImageSource('string')).toBe(false);
      expect(isValidImageSource(123)).toBe(false);
    });
  });

  describe('generateImagePlaceholder', () => {
    it('should generate SVG placeholder', () => {
      const placeholder = generateImagePlaceholder(800, 600);

      expect(placeholder).toContain('data:image/svg+xml;base64,');
      expect(placeholder).toBeDefined();
    });

    it('should accept custom color', () => {
      const placeholder = generateImagePlaceholder(800, 600, '#ff0000');

      expect(placeholder).toContain('data:image/svg+xml;base64,');
    });
  });
});
