import { createClient, type SanityClient } from '@sanity/client';
import { cache } from 'react';

// Environment configuration validation
const requiredEnvVars = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
};

// Validate required environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: SANITY_${key.toUpperCase()}`);
  }
});

// Client configuration
const clientConfig = {
  projectId: requiredEnvVars.projectId!,
  dataset: requiredEnvVars.dataset!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: requiredEnvVars.token!,
};

// No-store fetch option for dynamic segments (no request caching)
const noStoreFetchOption = { cache: 'no-store' as RequestCache };

// Main client for published content
export const sanityClient: SanityClient = createClient({
  ...clientConfig,
  perspective: 'published',
});

// Preview client for draft content
export const previewClient: SanityClient = createClient({
  ...clientConfig,
  useCdn: false,
  perspective: 'previewDrafts',
});

// Client for raw queries (no CDN, always fresh)
export const rawClient: SanityClient = createClient({
  ...clientConfig,
  useCdn: false,
  perspective: 'raw',
});

// No-store clients for dynamic segments (no request memoization / CDN)
const noStoreClient: SanityClient = createClient({
  ...clientConfig,
  perspective: 'published',
  fetch: noStoreFetchOption,
});

const noStorePreviewClient: SanityClient = createClient({
  ...clientConfig,
  useCdn: false,
  perspective: 'previewDrafts',
  fetch: noStoreFetchOption,
});

const noStoreRawClient: SanityClient = createClient({
  ...clientConfig,
  useCdn: false,
  perspective: 'raw',
  fetch: noStoreFetchOption,
});

// Get the appropriate client based on context
export function getClient(
  options: { preview?: boolean; raw?: boolean; noStore?: boolean } = {}
): SanityClient {
  if (options.noStore) {
    if (options.raw) return noStoreRawClient;
    if (options.preview) return noStorePreviewClient;
    return noStoreClient;
  }
  if (options.raw) return rawClient;
  if (options.preview) return previewClient;
  return sanityClient;
}

// Error types for better error handling
export class SanityError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SanityError';
  }
}

export class SanityNetworkError extends SanityError {
  constructor(
    message: string,
    public originalError: Error
  ) {
    super(message);
    this.name = 'SanityNetworkError';
  }
}

export class SanityValidationError extends SanityError {
  constructor(
    message: string,
    public validationErrors: unknown[]
  ) {
    super(message);
    this.name = 'SanityValidationError';
  }
}

// Enhanced retry logic with exponential backoff
export const fetchWithRetry = async <T>(
  fetcher: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    retryCondition?: () => boolean;
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryCondition = error => {
      // Retry on network errors, timeouts, and 5xx status codes
      return (
        error.message.includes('network') ||
        error.message.includes('timeout') ||
        error.message.includes('ECONNRESET') ||
        (error as any).statusCode >= 500
      );
    },
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetcher();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if this is the last attempt or if retry condition fails
      if (attempt === maxRetries || !retryCondition(lastError)) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000, maxDelay);

      console.warn(
        `Sanity API call failed (attempt ${attempt}/${maxRetries}), retrying in ${Math.round(delay)}ms:`,
        lastError.message
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Transform error for better debugging
  if (lastError.message.includes('network') || lastError.message.includes('ECONNRESET')) {
    throw new SanityNetworkError('Failed to connect to Sanity API after retries', lastError);
  }

  throw new SanityError(
    `Sanity API call failed after ${maxRetries} attempts: ${lastError.message}`,
    (lastError as any).statusCode,
    lastError
  );
};

// Enhanced cached content fetching with validation (React cache() memoization)
export const getContentWithCache = cache(
  async <T>(
    query: string,
    params: Record<string, unknown> = {},
    options: {
      preview?: boolean;
      raw?: boolean;
      validateResult?: (result: unknown) => result is T;
      fallback?: T;
    } = {}
  ): Promise<T> => {
    const { preview = false, raw = false, validateResult, fallback } = options;
    const client = getClient({ preview, raw });

    try {
      const result = await fetchWithRetry(async () => {
        const data = await client.fetch(query, params);

        // Validate result if validator provided
        if (validateResult && !validateResult(data)) {
          throw new SanityValidationError('Content validation failed', [data]);
        }

        return data;
      });

      if (result === null || result === undefined) {
        if (fallback !== undefined) {
          console.warn(`No content found for query, using fallback:`, query);
          return fallback;
        }
        throw new SanityError(`No content found for query: ${query}`);
      }

      return result;
    } catch (error) {
      // If we have a fallback and this is a network error, use it
      if (fallback !== undefined && error instanceof SanityNetworkError) {
        console.error('Sanity API unavailable, using fallback content:', error.message);
        return fallback;
      }

      // Re-throw with context
      if (error instanceof SanityError) {
        throw error;
      }

      throw new SanityError(
        `Failed to fetch content: ${(error as Error).message}`,
        undefined,
        error
      );
    }
  }
);

// Uncached content fetching for dynamic segments (no React cache(), uses no-store fetch)
export async function getContentNoStore<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: {
    preview?: boolean;
    raw?: boolean;
    validateResult?: (result: unknown) => result is T;
    fallback?: T;
  } = {}
): Promise<T> {
  const { preview = false, raw = false, validateResult, fallback } = options;
  const client = getClient({ preview, raw, noStore: true });

  try {
    const result = await fetchWithRetry(async () => {
      const data = await client.fetch(query, params);

      if (validateResult && !validateResult(data)) {
        throw new SanityValidationError('Content validation failed', [data]);
      }

      return data;
    });

    if (result === null || result === undefined) {
      if (fallback !== undefined) {
        console.warn(`No content found for query, using fallback:`, query);
        return fallback;
      }
      throw new SanityError(`No content found for query: ${query}`);
    }

    return result;
  } catch (error) {
    if (fallback !== undefined && error instanceof SanityNetworkError) {
      console.error('Sanity API unavailable, using fallback content:', error.message);
      return fallback;
    }

    if (error instanceof SanityError) {
      throw error;
    }

    throw new SanityError(
      `Failed to fetch content: ${(error as Error).message}`,
      undefined,
      error
    );
  }
}

// Health check function
export async function checkSanityHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  error?: string;
}> {
  const start = Date.now();

  try {
    await sanityClient.fetch('*[_type == "sanity.imageAsset"][0]._id');
    const latency = Date.now() - start;

    return {
      status: latency < 1000 ? 'healthy' : 'degraded',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - start,
      error: (error as Error).message,
    };
  }
}
