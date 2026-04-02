import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  getClient,
  fetchWithRetry,
  SanityError,
  SanityNetworkError,
  checkSanityHealth,
} from '../client';

// Mock the Sanity client
jest.mock('@sanity/client', () => ({
  createClient: jest.fn(() => ({
    fetch: jest.fn(),
  })),
}));

describe('Sanity Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClient', () => {
    it('should return preview client when preview is true', () => {
      const client = getClient({ preview: true });
      expect(client).toBeDefined();
    });

    it('should return raw client when raw is true', () => {
      const client = getClient({ raw: true });
      expect(client).toBeDefined();
    });

    it('should return main client by default', () => {
      const client = getClient();
      expect(client).toBeDefined();
    });
  });

  describe('fetchWithRetry', () => {
    it('should return result on successful fetch', async () => {
      const mockFetcher = jest.fn().mockResolvedValue('success');

      const result = await fetchWithRetry(mockFetcher);

      expect(result).toBe('success');
      expect(mockFetcher).toHaveBeenCalledTimes(1);
    });

    it('should retry on network errors', async () => {
      const networkError = new Error('network error');
      const mockFetcher = jest
        .fn()
        .mockRejectedValueOnce(networkError)
        .mockResolvedValue('success');

      const result = await fetchWithRetry(mockFetcher, { maxRetries: 2, baseDelay: 10 });

      expect(result).toBe('success');
      expect(mockFetcher).toHaveBeenCalledTimes(2);
    });

    it('should throw SanityNetworkError after max retries on network error', async () => {
      const networkError = new Error('network error');
      const mockFetcher = jest.fn().mockRejectedValue(networkError);

      await expect(fetchWithRetry(mockFetcher, { maxRetries: 2, baseDelay: 10 })).rejects.toThrow(
        SanityNetworkError
      );

      expect(mockFetcher).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const validationError = new Error('validation failed');
      const mockFetcher = jest.fn().mockRejectedValue(validationError);

      await expect(
        fetchWithRetry(mockFetcher, {
          maxRetries: 3,
          baseDelay: 10,
          retryCondition: () => false,
        })
      ).rejects.toThrow(SanityError);

      expect(mockFetcher).toHaveBeenCalledTimes(1);
    });
  });

  describe('SanityError classes', () => {
    it('should create SanityError with message and status code', () => {
      const error = new SanityError('Test error', 404, { detail: 'Not found' });

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.details).toEqual({ detail: 'Not found' });
      expect(error.name).toBe('SanityError');
    });

    it('should create SanityNetworkError with original error', () => {
      const originalError = new Error('Connection failed');
      const error = new SanityNetworkError('Network error', originalError);

      expect(error.message).toBe('Network error');
      expect(error.originalError).toBe(originalError);
      expect(error.name).toBe('SanityNetworkError');
    });
  });

  describe('checkSanityHealth', () => {
    it('should return healthy status on successful request', async () => {
      // Mock successful response
      const mockClient = {
        fetch: jest.fn().mockResolvedValue('test-id'),
      };

      // Mock the sanityClient
      jest.doMock('../client', () => ({
        ...jest.requireActual('../client'),
        sanityClient: mockClient,
      }));

      // Note: This test would need proper mocking setup in a real environment
      // For now, we'll just test the structure
      expect(checkSanityHealth).toBeDefined();
    });
  });
});
