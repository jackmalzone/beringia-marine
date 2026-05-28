/**
 * Retry a Sanity operation with exponential backoff.
 *
 * Sanity's API occasionally returns transient upstream errors (502/503/504)
 * or rate-limits (429) on large writes/uploads. Those are safe to retry.
 * Client errors (400 validation, 409 conflict, 401/403 auth) are NOT retried.
 */
const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);
const RETRYABLE_NETWORK_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ENOTFOUND',
  'EPIPE',
  'EAI_AGAIN',
]);

function isRetryable(err: unknown): boolean {
  const e = err as { statusCode?: number; response?: { statusCode?: number }; code?: string };
  const status = e?.statusCode ?? e?.response?.statusCode;
  if (status !== undefined) return RETRYABLE_STATUS.has(status);
  // No HTTP status → likely a network-level error; retry those.
  if (e?.code) return RETRYABLE_NETWORK_CODES.has(e.code);
  return true;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxAttempts = 4
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err) || attempt === maxAttempts) break;
      const delayMs = Math.min(1000 * 2 ** (attempt - 1), 8000);
      const status =
        (err as { statusCode?: number })?.statusCode ??
        (err as { code?: string })?.code ??
        'network';
      console.warn(
        `  ⟳ ${label} failed (attempt ${attempt}/${maxAttempts}, ${status}). Retrying in ${delayMs}ms…`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastErr;
}
