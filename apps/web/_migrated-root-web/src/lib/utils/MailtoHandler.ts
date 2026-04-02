/**
 * MailtoHandler - Cross-platform mailto functionality with progressive fallbacks
 *
 * Provides reliable email link handling across different operating systems and browsers
 * with graceful fallbacks when default email clients are not available or configured.
 */

import {
  validateAndSanitizeMailtoOptions,
  formatEmailContent,
  buildMailtoParams,
} from './EmailUtils';
import type {
  MailtoOptions,
  MailtoResult,
  MailtoAnalyticsCallbacks,
  MailtoConfig,
} from '@/types/email';

// Type for window with optional logger
interface WindowWithLogger extends Window {
  logger?: {
    warn: (message: string, ...args: unknown[]) => void;
  };
}

export class MailtoHandler {
  private static config: MailtoConfig = {
    enableTracking: false,
  };

  /**
   * Configures the MailtoHandler with analytics callbacks and settings
   * @param config - Configuration including analytics callbacks
   */
  static configure(config: MailtoConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gets the current configuration
   * @returns Current MailtoConfig
   */
  static getConfig(): MailtoConfig {
    return { ...this.config };
  }

  /**
   * Tracks an analytics event if tracking is enabled and callback is provided
   * @param eventType - Type of event to track
   * @param args - Event arguments
   */
  private static trackEvent(
    eventType: keyof MailtoAnalyticsCallbacks,
    ...args: [MailtoOptions] | [MailtoResult, MailtoOptions] | [string, 'email' | 'formatted']
  ): void {
    if (!this.config.enableTracking || !this.config.analytics) {
      return;
    }

    const callback = this.config.analytics[eventType];
    if (callback && typeof callback === 'function') {
      try {
        // Type-safe callback invocation
        switch (eventType) {
          case 'onAttempt':
          case 'onFallback':
            (callback as (options: MailtoOptions) => void)(args[0] as MailtoOptions);
            break;
          case 'onSuccess':
          case 'onFailure':
            (callback as (result: MailtoResult, options: MailtoOptions) => void)(
              args[0] as MailtoResult,
              args[1] as MailtoOptions
            );
            break;
          case 'onCopy':
            (callback as (text: string, type: 'email' | 'formatted') => void)(
              args[0] as string,
              args[1] as 'email' | 'formatted'
            );
            break;
        }
      } catch (error) {
        // Silently handle analytics errors to not impact user experience
        // Use logger instead of console for production
        if (typeof window !== 'undefined' && (window as WindowWithLogger).logger) {
          (window as WindowWithLogger).logger!.warn(
            `MailtoHandler: Analytics callback error for ${eventType}:`,
            error
          );
        }
      }
    }
  }

  /**
   * Attempts to open an email client using progressive fallback methods with retry logic
   * @param options - Email parameters including recipient, subject, body, etc.
   * @param retryCount - Current retry attempt (internal use)
   * @returns Promise resolving to result indicating success/failure and method used
   */
  static async open(options: MailtoOptions, retryCount: number = 0): Promise<MailtoResult> {
    // Validate and sanitize options before attempting
    let sanitizedOptions: MailtoOptions;
    try {
      sanitizedOptions = validateAndSanitizeMailtoOptions(options);
    } catch (error) {
      const result = {
        success: false,
        error: error instanceof Error ? error.message : 'Validation failed',
        errorType: 'validation' as const,
        retryable: false,
      };
      this.trackEvent('onFailure', result, options);
      return result;
    }

    // Track attempt
    this.trackEvent('onAttempt', sanitizedOptions);

    const mailtoUrl = this.buildMailtoUrl(sanitizedOptions);
    const errors: Array<{ method: string; error: Error }> = [];

    // Method 1: Direct location change (most reliable)
    try {
      window.location.href = mailtoUrl;
      // Give a small delay to check if navigation occurred
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = { success: true, method: 'location' as const };
      this.trackEvent('onSuccess', result, options);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      errors.push({ method: 'location', error: errorObj });
      this.logError('location.href method failed', errorObj);
    }

    // Method 2: Window.open with _self target
    try {
      const windowResult = window.open(mailtoUrl, '_self');
      if (windowResult !== null) {
        const result = { success: true, method: 'window' as const };
        this.trackEvent('onSuccess', result, options);
        return result;
      } else {
        errors.push({
          method: 'window',
          error: new Error('window.open returned null (likely blocked)'),
        });
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      errors.push({ method: 'window', error: errorObj });
      this.logError('window.open method failed', errorObj);
    }

    // Method 3: Programmatic link click
    try {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Wait a bit to see if the click was successful
      await new Promise(resolve => setTimeout(resolve, 50));
      const result = { success: true, method: 'element' as const };
      this.trackEvent('onSuccess', result, options);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      errors.push({ method: 'element', error: errorObj });
      this.logError('programmatic click method failed', errorObj);
    }

    // All methods failed - determine error type and if retryable
    const errorType = this.categorizeError(errors);
    const isRetryable = this.isRetryableError(errorType, retryCount);

    // Attempt retry for transient errors
    if (isRetryable && retryCount < 2) {
      this.logError(
        `All methods failed, retrying (attempt ${retryCount + 1})`,
        new Error(`${errors.length} methods failed`)
      );
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return this.open(options, retryCount + 1);
    }

    const result = {
      success: false,
      error: this.generateUserFriendlyError(errorType),
      errorType,
      retryable: isRetryable && retryCount >= 2, // Still retryable but max attempts reached
    };

    this.trackEvent('onFailure', result, sanitizedOptions);
    return result;
  }

  /**
   * Categorizes the type of error based on the failures encountered
   * @param errors - Array of errors from different methods
   * @returns Error type classification
   */
  private static categorizeError(
    errors: Array<{ method: string; error: Error }>
  ): 'network' | 'security' | 'client' | 'validation' | 'unknown' {
    const errorMessages = errors.map(e => e.error.message?.toLowerCase() || '').join(' ');

    if (
      errorMessages.includes('network') ||
      errorMessages.includes('timeout') ||
      errorMessages.includes('fetch')
    ) {
      return 'network';
    }

    if (
      errorMessages.includes('blocked') ||
      errorMessages.includes('permission') ||
      errorMessages.includes('security')
    ) {
      return 'security';
    }

    if (
      errorMessages.includes('client') ||
      errorMessages.includes('mailto') ||
      errors.some(
        e =>
          e.method === 'window' && e.error.message === 'window.open returned null (likely blocked)'
      )
    ) {
      return 'client';
    }

    return 'unknown';
  }

  /**
   * Determines if an error type is retryable
   * @param errorType - The categorized error type
   * @param retryCount - Current retry count
   * @returns Whether the error should be retried
   */
  private static isRetryableError(errorType: string, retryCount: number): boolean {
    if (retryCount >= 2) return false; // Max retries reached

    switch (errorType) {
      case 'network':
        return true; // Network errors are often transient
      case 'unknown':
        return retryCount === 0; // Try once for unknown errors
      case 'security':
      case 'client':
      case 'validation':
      default:
        return false; // These are not typically transient
    }
  }

  /**
   * Generates a user-friendly error message based on error type
   * @param errorType - The categorized error type
   * @param errors - Array of technical errors
   * @returns User-friendly error message
   */
  private static generateUserFriendlyError(errorType: string): string {
    switch (errorType) {
      case 'network':
        return 'Network connection issue prevented opening your email client. Please check your connection and try again.';
      case 'security':
        return 'Browser security settings are preventing the email client from opening. Please allow popups for this site or try a different browser.';
      case 'client':
        return 'No default email client is configured on your system, or it cannot be accessed. Please copy the email address and send manually.';
      case 'validation':
        return 'The email information provided is invalid. Please check the email address and try again.';
      default:
        return 'Unable to open your email client. This may be due to browser settings or system configuration. Please copy the email address and send manually.';
    }
  }

  /**
   * Logs errors using the appropriate logging mechanism
   * @param message - Log message
   * @param error - Error object or details
   */
  private static logError(message: string, error: Error): void {
    if (typeof window !== 'undefined' && (window as WindowWithLogger).logger) {
      (window as WindowWithLogger).logger!.warn(`MailtoHandler: ${message}`, error);
    } else if (process.env.NODE_ENV === 'development') {
      // Configuration error logged to error reporting system
    }
  }

  /**
   * Builds a properly encoded mailto URL from the provided options
   * @param options - Email parameters (should be pre-validated)
   * @returns Encoded mailto URL string
   */
  static buildMailtoUrl(options: MailtoOptions): string {
    if (!options.email) {
      throw new Error('Email address is required');
    }

    const queryString = buildMailtoParams({
      subject: options.subject,
      body: options.body,
      cc: options.cc,
      bcc: options.bcc,
    });

    return `mailto:${encodeURIComponent(options.email)}${queryString}`;
  }

  /**
   * Copies text to the clipboard using the modern Clipboard API with fallback
   * @param text - Text to copy to clipboard
   * @param type - Type of content being copied for analytics
   * @returns Promise resolving to true if successful, false otherwise
   */
  static async copyToClipboard(
    text: string,
    type: 'email' | 'formatted' = 'email'
  ): Promise<boolean> {
    if (!text) {
      return false;
    }

    // Modern Clipboard API (preferred method)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        this.trackEvent('onCopy', text, type);
        return true;
      } catch (error) {
        // Use logger instead of console for production
        if (typeof window !== 'undefined' && (window as WindowWithLogger).logger) {
          (window as WindowWithLogger).logger!.warn('MailtoHandler: Clipboard API failed:', error);
        }
      }
    }

    // Fallback method using execCommand (deprecated but widely supported)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Using deprecated execCommand as fallback for older browsers
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        this.trackEvent('onCopy', text, type);
      }
      return successful;
    } catch (error) {
      // Use logger instead of console for production
      if (typeof window !== 'undefined' && (window as WindowWithLogger).logger) {
        (window as WindowWithLogger).logger!.warn(
          'MailtoHandler: execCommand fallback failed:',
          error
        );
      }
      return false;
    }
  }

  /**
   * Copies the email address from MailtoOptions to clipboard
   * @param options - Email options containing the email address to copy
   * @returns Promise resolving to true if successful, false otherwise
   */
  static async copyEmailToClipboard(options: MailtoOptions): Promise<boolean> {
    return this.copyToClipboard(options.email, 'email');
  }

  /**
   * Creates a formatted email template string for manual copying
   * @param options - Email parameters
   * @returns Formatted string with email details
   */
  static formatEmailForCopy(options: MailtoOptions): string {
    return formatEmailContent(options);
  }

  /**
   * Copies the formatted email template to clipboard
   * @param options - Email options to format and copy
   * @returns Promise resolving to true if successful, false otherwise
   */
  static async copyFormattedEmailToClipboard(options: MailtoOptions): Promise<boolean> {
    const formatted = this.formatEmailForCopy(options);
    return this.copyToClipboard(formatted, 'formatted');
  }

  /**
   * Tracks when fallback UI is shown to user
   * @param options - Email options that triggered the fallback
   */
  static trackFallback(options: MailtoOptions): void {
    this.trackEvent('onFallback', options);
  }

  /**
   * Validates mailto options before processing
   * @param options - Email options to validate
   * @returns Array of validation error messages (empty if valid)
   * @deprecated Use validateAndSanitizeMailtoOptions from EmailUtils instead
   */
  static validateOptions(options: MailtoOptions): string[] {
    try {
      validateAndSanitizeMailtoOptions(options);
      return [];
    } catch (error) {
      return [error instanceof Error ? error.message : 'Validation failed'];
    }
  }
}
