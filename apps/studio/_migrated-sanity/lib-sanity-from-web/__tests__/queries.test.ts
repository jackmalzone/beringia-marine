import { describe, it, expect, jest } from '@jest/globals';
import {
  queries,
  validatePageContent,
  validateServiceData,
  validateGlobalSettings,
  getCacheKey,
} from '../queries';

describe('Sanity Queries', () => {
  describe('GROQ queries', () => {
    it('should have all required queries defined', () => {
      expect(queries.globalSettings).toBeDefined();
      expect(queries.pageBySlug).toBeDefined();
      expect(queries.allPages).toBeDefined();
      expect(queries.serviceBySlug).toBeDefined();
      expect(queries.allServices).toBeDefined();
      expect(queries.pageMetadata).toBeDefined();
      expect(queries.serviceMetadata).toBeDefined();
      expect(queries.allSlugs).toBeDefined();
    });

    it('should contain proper GROQ syntax', () => {
      expect(queries.pageBySlug).toContain('*[_type == "page" && slug.current == $slug][0]');
      expect(queries.serviceBySlug).toContain('*[_type == "service" && slug.current == $slug][0]');
      expect(queries.allServices).toContain('| order(order asc)');
    });
  });

  describe('Content validation', () => {
    describe('validatePageContent', () => {
      it('should return true for valid page content', () => {
        const validPage = {
          _id: 'page-1',
          _type: 'page',
          _createdAt: '2024-01-01',
          _updatedAt: '2024-01-01',
          _rev: 'rev-1',
          title: 'Test Page',
          slug: { current: 'test-page' },
          content: [],
        };

        expect(validatePageContent(validPage)).toBe(true);
      });

      it('should return false for invalid page content', () => {
        const invalidPage = {
          title: 'Test Page',
          // Missing required fields
        };

        expect(validatePageContent(invalidPage)).toBe(false);
      });

      it('should return false for null or undefined', () => {
        expect(validatePageContent(null)).toBe(false);
        expect(validatePageContent(undefined)).toBe(false);
      });
    });

    describe('validateServiceData', () => {
      it('should return true for valid service data', () => {
        const validService = {
          _id: 'service-1',
          _type: 'service',
          _createdAt: '2024-01-01',
          _updatedAt: '2024-01-01',
          _rev: 'rev-1',
          title: 'Test Service',
          slug: { current: 'test-service' },
          description: 'Test description',
        };

        expect(validateServiceData(validService)).toBe(true);
      });

      it('should return false for invalid service data', () => {
        const invalidService = {
          title: 'Test Service',
          // Missing required fields
        };

        expect(validateServiceData(invalidService)).toBe(false);
      });
    });

    describe('validateGlobalSettings', () => {
      it('should return true for valid global settings', () => {
        const validSettings = {
          _id: 'global-1',
          _type: 'globalSettings',
          _createdAt: '2024-01-01',
          _updatedAt: '2024-01-01',
          _rev: 'rev-1',
          businessInfo: {
            name: 'Test Business',
            description: 'Test description',
            tagline: 'Test tagline',
            phone: '123-456-7890',
            email: 'test@example.com',
            address: {
              street: '123 Test St',
              city: 'Test City',
              state: 'TS',
              zipCode: '12345',
              country: 'US',
            },
            coordinates: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
            hours: [],
            socialMedia: {},
          },
        };

        expect(validateGlobalSettings(validSettings)).toBe(true);
      });

      it('should return false for invalid global settings', () => {
        const invalidSettings = {
          // Missing businessInfo
        };

        expect(validateGlobalSettings(invalidSettings)).toBe(false);
      });
    });
  });

  describe('Cache utilities', () => {
    describe('getCacheKey', () => {
      it('should generate consistent cache keys', () => {
        const query = 'test-query';
        const params = { slug: 'test-slug' };

        const key1 = getCacheKey(query, params);
        const key2 = getCacheKey(query, params);

        expect(key1).toBe(key2);
        expect(key1).toContain('sanity:');
        expect(key1).toContain(query);
      });

      it('should generate different keys for different params', () => {
        const query = 'test-query';
        const params1 = { slug: 'test-slug-1' };
        const params2 = { slug: 'test-slug-2' };

        const key1 = getCacheKey(query, params1);
        const key2 = getCacheKey(query, params2);

        expect(key1).not.toBe(key2);
      });

      it('should handle empty params', () => {
        const query = 'test-query';
        const key = getCacheKey(query);

        expect(key).toBeDefined();
        expect(key).toContain('sanity:');
      });
    });
  });
});
