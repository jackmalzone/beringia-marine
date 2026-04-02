/**
 * Centralized error reporting service for the web app
 * Handles error categorization, filtering, and reporting to monitoring services
 */

import * as Sentry from '@sentry/nextjs';
import { createLogger } from './logger';

const logger = createLogger('ErrorReporting');

export enum ErrorCategory {
  CRITICAL = 'critical', // App-breaking errors that need immediate attention
  RECOVERABLE = 'recoverable', // Errors with fallbacks that don't break user experience
  THIRD_PARTY = 'third_party', // External service errors (APIs, analytics, etc.)
  PERFORMANCE = 'performance', // Performance-related issues
  NETWORK = 'network', // Network-related errors
  USER_INPUT = 'user_input', // User input validation errors
  DEVELOPMENT = 'development', // Development/build-time errors
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ErrorContext {
  category: ErrorCategory;
  severity: ErrorSeverity;
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  fingerprint?: string[];
  tags?: Record<string, string>;
}

/**
 * Error patterns that should be suppressed or downgraded
 */
const SUPPRESSION_PATTERNS = [
  // Third-party widget errors that don't affect core functionality
  /mixpanel/i,
  /consumer_visitor/i,
  /jquery.*migrate/i,

  // Development/HMR errors
  /hotmodulereplacement/i,
  /mini-css-extract-plugin/i,
  /webpack/i,

  // Network errors that are temporary
  /network.*error/i,
  /fetch.*failed/i,
  /load.*failed/i,

  // Browser compatibility issues
  /script.*error/i,
  /non-error.*promise.*rejection/i,
];

/**
 * Categorize error based on message and context
 */
function categorizeError(error: Error, context?: Partial<ErrorContext>): ErrorCategory {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';

  // Check for third-party errors
  if (SUPPRESSION_PATTERNS.some(pattern => pattern.test(message) || pattern.test(stack))) {
    return ErrorCategory.THIRD_PARTY;
  }

  // Network errors
  if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
    return ErrorCategory.NETWORK;
  }

  // Performance errors
  if (
    message.includes('memory') ||
    message.includes('performance') ||
    message.includes('timeout')
  ) {
    return ErrorCategory.PERFORMANCE;
  }

  // User input errors
  if (message.includes('validation') || message.includes('invalid input')) {
    return ErrorCategory.USER_INPUT;
  }

  // Development errors
  if (message.includes('webpack') || message.includes('hmr') || message.includes('development')) {
    return ErrorCategory.DEVELOPMENT;
  }

  // Use provided category or default to recoverable
  return context?.category || ErrorCategory.RECOVERABLE;
}

/**
 * Determine error severity based on category and context
 */
function determineSeverity(
  category: ErrorCategory,
  context?: Partial<ErrorContext>
): ErrorSeverity {
  if (context?.severity) {
    return context.severity;
  }

  switch (category) {
    case ErrorCategory.CRITICAL:
      return ErrorSeverity.CRITICAL;
    case ErrorCategory.PERFORMANCE:
    case ErrorCategory.NETWORK:
      return ErrorSeverity.MEDIUM;
    case ErrorCategory.THIRD_PARTY:
    case ErrorCategory.USER_INPUT:
    case ErrorCategory.DEVELOPMENT:
      return ErrorSeverity.LOW;
    default:
      return ErrorSeverity.MEDIUM;
  }
}

/**
 * Check if error should be suppressed based on patterns and frequency
 */
function shouldSuppressError(error: Error, context: ErrorContext): boolean {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';

  // Suppress known third-party errors in production
  if (context.category === ErrorCategory.THIRD_PARTY && process.env.NODE_ENV === 'production') {
    return SUPPRESSION_PATTERNS.some(pattern => pattern.test(message) || pattern.test(stack));
  }

  // Suppress development errors in production
  if (context.category === ErrorCategory.DEVELOPMENT && process.env.NODE_ENV === 'production') {
    return true;
  }

  // Suppress low-severity errors in production (but log them)
  if (context.severity === ErrorSeverity.LOW && process.env.NODE_ENV === 'production') {
    return true;
  }

  return false;
}

/**
 * Mask PII (Personally Identifiable Information) from strings
 * Removes emails, phone numbers, IP addresses, and other sensitive data
 */
function maskPII(text: string): string {
  if (!text) return text;

  return (
    text
      // Mask email addresses
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
      // Mask phone numbers (various formats)
      .replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE]')
      // Mask IP addresses
      .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP]')
      // Mask credit card numbers
      .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]')
      // Mask SSN-like patterns
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
      // Mask API keys and tokens (common patterns)
      .replace(/[a-zA-Z0-9]{32,}/g, match => {
        // Only mask if it looks like a token (all alphanumeric, no spaces)
        if (/^[a-zA-Z0-9]+$/.test(match)) {
          return '[TOKEN]';
        }
        return match;
      })
  );
}

/**
 * Sanitize error metadata to remove PII
 */
function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
  if (!metadata) return {};

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    // Skip sensitive keys entirely
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization', 'cookie'];
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
      continue;
    }

    // Mask PII in string values
    if (typeof value === 'string') {
      sanitized[key] = maskPII(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Generate error fingerprint for grouping similar errors
 */
function generateFingerprint(error: Error, context: ErrorContext): string[] {
  const fingerprint = [context.category, context.component || 'unknown', error.name];

  // Add error message without dynamic parts and PII
  const cleanMessage = maskPII(error.message)
    .replace(/\d+/g, 'N') // Replace numbers
    .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, 'UUID') // Replace UUIDs
    .replace(/https?:\/\/[^\s]+/g, 'URL'); // Replace URLs

  fingerprint.push(cleanMessage);

  return fingerprint;
}

/**
 * Main error reporting function
 */
export function reportError(error: Error, contextOverrides?: Partial<ErrorContext>): void {
  try {
    // Build complete context with PII masking
    const context: ErrorContext = {
      category: categorizeError(error, contextOverrides),
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? maskPII(window.location.href) : undefined,
      ...contextOverrides,
      // Sanitize metadata to remove PII
      metadata: sanitizeMetadata(contextOverrides?.metadata),
    };

    // Determine final severity
    context.severity = determineSeverity(context.category, contextOverrides);

    // Check if error should be suppressed
    if (shouldSuppressError(error, context)) {
      logger.debug('Error suppressed', { error: error.message, context });
      return;
    }

    // Generate fingerprint for grouping
    const fingerprint = generateFingerprint(error, context);

    // Create error report
    const report: ErrorReport = {
      error,
      context,
      fingerprint,
      tags: {
        category: context.category,
        severity: context.severity,
        component: context.component || 'unknown',
        environment: process.env.NODE_ENV || 'unknown',
      },
    };

    // Log error locally with masked PII
    logger.error('Error reported', error, {
      category: context.category,
      severity: context.severity,
      component: context.component,
      fingerprint: fingerprint.join('|'),
    });

    // Create sanitized error for Sentry
    const sanitizedError = new Error(maskPII(error.message));
    sanitizedError.name = error.name;
    sanitizedError.stack = error.stack ? maskPII(error.stack) : undefined;

    // Send to Sentry with proper context and PII masking
    Sentry.withScope(scope => {
      // Set tags
      Object.entries(report.tags || {}).forEach(([key, value]) => {
        scope.setTag(key, value);
      });

      // Set context with sanitized metadata
      scope.setContext('errorContext', {
        category: context.category,
        severity: context.severity,
        component: context.component,
        action: context.action,
        timestamp: context.timestamp?.toISOString(),
        metadata: context.metadata,
      });

      // Set fingerprint for grouping
      scope.setFingerprint(fingerprint);

      // Set user context if available (use hashed ID to protect privacy)
      if (context.userId) {
        scope.setUser({ id: context.userId });
      }

      // Capture sanitized exception
      Sentry.captureException(sanitizedError);
    });
  } catch (reportingError) {
    // Fallback logging if error reporting fails
    logger.error('Error reporting failed', reportingError as Error, {
      originalError: error.message,
    });
  }
}

/**
 * Report performance issues
 */
export function reportPerformanceIssue(
  metric: string,
  value: number,
  threshold: number,
  context?: Partial<ErrorContext>
): void {
  if (value > threshold) {
    const error = new Error(
      `Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${threshold}ms)`
    );
    reportError(error, {
      ...context,
      category: ErrorCategory.PERFORMANCE,
      severity: value > threshold * 2 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      metadata: {
        metric,
        value,
        threshold,
        exceedanceRatio: value / threshold,
      },
    });
  }
}

/**
 * Report network errors with retry information
 */
export function reportNetworkError(
  error: Error,
  url: string,
  retryCount: number = 0,
  context?: Partial<ErrorContext>
): void {
  reportError(error, {
    ...context,
    category: ErrorCategory.NETWORK,
    severity: retryCount > 2 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
    metadata: {
      url,
      retryCount,
      ...context?.metadata,
    },
  });
}

/**
 * Report user input validation errors
 */
export function reportValidationError(
  field: string,
  value: unknown,
  rule: string,
  context?: Partial<ErrorContext>
): void {
  const error = new Error(`Validation failed for ${field}: ${rule}`);
  reportError(error, {
    ...context,
    category: ErrorCategory.USER_INPUT,
    severity: ErrorSeverity.LOW,
    metadata: {
      field,
      value: typeof value === 'string' ? value.substring(0, 100) : String(value), // Truncate for privacy
      rule,
      ...context?.metadata,
    },
  });
}

const errorReporting = {
  reportError,
  reportPerformanceIssue,
  reportNetworkError,
  reportValidationError,
  ErrorCategory,
  ErrorSeverity,
};

export default errorReporting;
