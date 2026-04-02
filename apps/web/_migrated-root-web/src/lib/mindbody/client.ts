/**
 * Mindbody API 6.0 Client
 * Handles authentication, request/response processing, error handling, and retry logic
 */

import * as Sentry from '@sentry/nextjs';
import type {
  MindbodyApiConfig,
  ApiError,
  AddClientRequest,
  AddClientResponse,
  GetRequiredClientFieldsResponse,
  GetMembershipsResponse,
  GetProspectStagesResponse,
  GetLiabilityWaiverResponse,
} from './types';

export class MindbodyApiClient {
  private config: MindbodyApiConfig;
  private baseUrl: string;
  private requestCache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: MindbodyApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.mindbodyonline.com/public/v6';
  }

  /**
   * Get required headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'api-key': this.config.apiKey,
      'siteId': this.config.siteId,
    };

    if (this.config.authorization) {
      headers['authorization'] = this.config.authorization;
    }

    return headers;
  }

  /**
   * Make a request to the Mindbody API with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const cacheKey = `${method}:${endpoint}`;

    // Check cache for GET requests
    if (method === 'GET' && this.requestCache.has(cacheKey)) {
      const cached = this.requestCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data as T;
      }
      this.requestCache.delete(cacheKey);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...this.getHeaders(),
            ...options.headers,
          },
        });

        // Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : (attempt + 1) * 1000;
          
          if (attempt < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }

        // Handle other errors
        if (!response.ok) {
          let errorData: ApiError | null = null;
          try {
            errorData = await response.json();
          } catch {
            // If response is not JSON, create a generic error
          }

          const errorMessage = errorData?.Error?.Message || response.statusText;
          const errorCode = errorData?.Error?.Code || `HTTP_${response.status}`;

          // Don't retry on client errors (4xx) except 429
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new MindbodyApiError(errorMessage, errorCode, response.status);
          }

          // Retry on server errors (5xx) or rate limits
          if (attempt < retries - 1) {
            lastError = new MindbodyApiError(errorMessage, errorCode, response.status);
            await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
            continue;
          }

          throw new MindbodyApiError(errorMessage, errorCode, response.status);
        }

        const data = await response.json();

        // Cache GET requests
        if (method === 'GET') {
          this.requestCache.set(cacheKey, {
            data,
            timestamp: Date.now(),
          });
        }

        return data as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on certain errors
        if (error instanceof MindbodyApiError && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }

        // Log error to Sentry
        if (attempt === retries - 1) {
          Sentry.captureException(error, {
            tags: {
              component: 'MindbodyApiClient',
              endpoint,
              attempt: attempt + 1,
            },
            extra: {
              url,
              method,
              error: error instanceof Error ? error.message : String(error),
            },
          });
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Get required client fields
   */
  async getRequiredClientFields(): Promise<GetRequiredClientFieldsResponse> {
    return this.request<GetRequiredClientFieldsResponse>('/client/requiredclientfields', {
      method: 'GET',
    });
  }

  /**
   * Add a new client (prospect/lead)
   */
  async addClient(clientData: AddClientRequest): Promise<AddClientResponse> {
    return this.request<AddClientResponse>('/client/addclient', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  /**
   * Get memberships
   */
  async getMemberships(): Promise<GetMembershipsResponse> {
    return this.request<GetMembershipsResponse>('/site/memberships', {
      method: 'GET',
    });
  }

  /**
   * Get prospect stages
   */
  async getProspectStages(): Promise<GetProspectStagesResponse> {
    return this.request<GetProspectStagesResponse>('/site/prospectstages', {
      method: 'GET',
    });
  }

  /**
   * Get liability waiver
   */
  async getLiabilityWaiver(): Promise<GetLiabilityWaiverResponse> {
    return this.request<GetLiabilityWaiverResponse>('/site/liabilitywaiver', {
      method: 'GET',
    });
  }

  /**
   * Clear request cache
   */
  clearCache(): void {
    this.requestCache.clear();
  }
}

/**
 * Custom error class for Mindbody API errors
 */
export class MindbodyApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'MindbodyApiError';
  }
}

/**
 * Create a Mindbody API client instance
 */
export function createMindbodyClient(): MindbodyApiClient {
  const apiKey = process.env.MINDBODY_API_KEY;
  const siteId = process.env.MINDBODY_SITE_ID;
  const baseUrl = process.env.MINDBODY_API_BASE_URL;
  const authorization = process.env.MINDBODY_AUTHORIZATION; // Optional staff token

  if (!apiKey) {
    throw new Error('MINDBODY_API_KEY environment variable is required');
  }

  if (!siteId) {
    throw new Error('MINDBODY_SITE_ID environment variable is required');
  }

  return new MindbodyApiClient({
    apiKey,
    siteId,
    baseUrl,
    authorization,
  });
}
