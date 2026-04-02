/**
 * Comprehensive TypeScript types for email functionality
 * Provides type safety and documentation for all email-related components
 */

/**
 * Base email options interface for mailto functionality
 */
export interface MailtoOptions {
  /** Primary recipient email address (required) */
  email: string;
  /** Email subject line (optional) */
  subject?: string;
  /** Email body content (optional) */
  body?: string;
  /** Carbon copy recipients, comma-separated (optional) */
  cc?: string;
  /** Blind carbon copy recipients, comma-separated (optional) */
  bcc?: string;
}

/**
 * Result of a mailto operation attempt
 */
export interface MailtoResult {
  /** Whether the mailto operation was successful */
  success: boolean;
  /** Method that succeeded in opening the email client */
  method?: 'location' | 'window' | 'element';
  /** Error message if the operation failed */
  error?: string;
  /** Categorized error type for better handling */
  errorType?: 'network' | 'security' | 'client' | 'validation' | 'unknown';
  /** Whether the error is retryable */
  retryable?: boolean;
}

/**
 * Analytics callbacks for tracking mailto events
 */
export interface MailtoAnalyticsCallbacks {
  /** Called when a mailto attempt is initiated */
  onAttempt?: (options: MailtoOptions) => void;
  /** Called when a mailto operation succeeds */
  onSuccess?: (result: MailtoResult, options: MailtoOptions) => void;
  /** Called when a mailto operation fails */
  onFailure?: (result: MailtoResult, options: MailtoOptions) => void;
  /** Called when fallback UI is shown to user */
  onFallback?: (options: MailtoOptions) => void;
  /** Called when text is copied to clipboard */
  onCopy?: (text: string, type: 'email' | 'formatted') => void;
}

/**
 * Configuration for MailtoHandler service
 */
export interface MailtoConfig {
  /** Analytics callbacks for tracking events */
  analytics?: MailtoAnalyticsCallbacks;
  /** Whether to enable event tracking */
  enableTracking?: boolean;
  /** Custom debounce delay in milliseconds (default: 1000) */
  debounceDelay?: number;
  /** Maximum retry attempts (default: 2) */
  maxRetries?: number;
  /** Timeout for mailto operations in milliseconds (default: 5000) */
  timeout?: number;
}

/**
 * Props for EmailButton component
 */
export interface EmailButtonProps {
  /** Recipient email address */
  email: string;
  /** Email subject line */
  subject?: string;
  /** Email body content */
  body?: string;
  /** Carbon copy recipients */
  cc?: string;
  /** Blind carbon copy recipients */
  bcc?: string;
  /** Button content (text, JSX, etc.) */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show fallback UI on failure (default: true) */
  showFallbackOnFailure?: boolean;
  /** Callback fired on successful mailto operation */
  onSuccess?: () => void;
  /** Callback fired on failed mailto operation */
  onFailure?: (error: string) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** Custom debounce delay for this button */
  debounceDelay?: number;
}

/**
 * Props for FallbackUI component
 */
export interface FallbackUIProps {
  /** Email address to display */
  email: string;
  /** Email subject to display */
  subject?: string;
  /** Whether the fallback UI is visible */
  isVisible: boolean;
  /** Callback to close the fallback UI */
  onClose: () => void;
  /** Callback fired when email is copied */
  onCopy?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show copy instructions */
  showInstructions?: boolean;
}

/**
 * Props for NoScriptFallback component
 */
export interface NoScriptFallbackProps extends MailtoOptions {
  /** Button content */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Error types that can occur during mailto operations
 */
export type MailtoErrorType = 'network' | 'security' | 'client' | 'validation' | 'unknown';

/**
 * Methods available for opening mailto links
 */
export type MailtoMethod = 'location' | 'window' | 'element';

/**
 * Copy content types for analytics tracking
 */
export type CopyContentType = 'email' | 'formatted';

/**
 * Validation result for email options
 */
export interface EmailValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Array of validation error messages */
  errors: string[];
  /** Sanitized options if validation passed */
  sanitizedOptions?: MailtoOptions;
}

/**
 * Performance metrics for mailto operations
 */
export interface MailtoPerformanceMetrics {
  /** Time taken for the operation in milliseconds */
  duration: number;
  /** Method that was successful */
  successfulMethod?: MailtoMethod;
  /** Number of retry attempts */
  retryCount: number;
  /** Whether fallback was shown */
  fallbackShown: boolean;
}

/**
 * Browser capability detection results
 */
export interface BrowserCapabilities {
  /** Whether the browser supports the Clipboard API */
  hasClipboardAPI: boolean;
  /** Whether the browser supports window.open */
  hasWindowOpen: boolean;
  /** Whether the browser is in a secure context (HTTPS) */
  isSecureContext: boolean;
  /** Whether the browser supports programmatic link clicks */
  hasProgrammaticClick: boolean;
}

/**
 * Email validation options
 */
export interface EmailValidationOptions {
  /** Maximum length for subject line (default: 500) */
  maxSubjectLength?: number;
  /** Maximum length for email body (default: 2000) */
  maxBodyLength?: number;
  /** Whether to allow multiple recipients in CC/BCC */
  allowMultipleRecipients?: boolean;
  /** Custom email regex pattern */
  customEmailRegex?: RegExp;
}

/**
 * Clipboard operation result
 */
export interface ClipboardResult {
  /** Whether the copy operation was successful */
  success: boolean;
  /** Method used for copying ('clipboard' | 'execCommand') */
  method?: 'clipboard' | 'execCommand';
  /** Error message if copy failed */
  error?: string;
}

/**
 * Email formatting options
 */
export interface EmailFormatOptions {
  /** Whether to include BCC in formatted output */
  includeBcc?: boolean;
  /** Custom line separator (default: '\n') */
  lineSeparator?: string;
  /** Whether to include empty lines for readability */
  includeEmptyLines?: boolean;
}

/**
 * Utility type for making all properties of an interface optional
 */
export type PartialMailtoOptions = Partial<MailtoOptions>;

/**
 * Utility type for required email options (just email address)
 */
export type RequiredMailtoOptions = Pick<MailtoOptions, 'email'>;

/**
 * Union type for all possible mailto operation states
 */
export type MailtoOperationState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'retrying'
  | 'fallback';

/**
 * Event handler types for mailto operations
 */
export type MailtoEventHandler<T = void> = (event: T) => void | Promise<void>;

/**
 * Generic error handler type
 */
export type ErrorHandler = MailtoEventHandler<Error | string>;

/**
 * Success handler type
 */
export type SuccessHandler = MailtoEventHandler<MailtoResult>;
