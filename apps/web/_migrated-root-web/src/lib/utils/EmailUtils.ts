/**
 * Email utility functions for validation and formatting
 * Separated for better tree-shaking and code splitting
 */

/**
 * Validates email address format using a comprehensive regex
 * @param email - Email address to validate
 * @returns True if email format is valid
 */
export function validateEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // More comprehensive email validation regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
}

/**
 * Sanitizes email parameters to prevent injection attacks
 * @param value - Value to sanitize
 * @returns Sanitized value
 */
export function sanitizeEmailParam(value: string): string {
  if (!value) return '';

  // Remove potentially dangerous characters
  return value
    .replace(/[\r\n]/g, '') // Remove line breaks
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Validates and sanitizes mailto options
 * @param options - Raw mailto options
 * @returns Validated and sanitized options
 */
export function validateAndSanitizeMailtoOptions(options: {
  email: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}): {
  email: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
} {
  const sanitized = {
    email: sanitizeEmailParam(options.email),
    subject: options.subject ? sanitizeEmailParam(options.subject) : undefined,
    body: options.body ? sanitizeEmailParam(options.body) : undefined,
    cc: options.cc ? sanitizeEmailParam(options.cc) : undefined,
    bcc: options.bcc ? sanitizeEmailParam(options.bcc) : undefined,
  };

  // Validate email format
  if (!validateEmailFormat(sanitized.email)) {
    throw new Error('Invalid email address format');
  }

  // Validate CC emails if provided
  if (sanitized.cc) {
    const ccEmails = sanitized.cc.split(',').map(e => e.trim());
    for (const ccEmail of ccEmails) {
      if (!validateEmailFormat(ccEmail)) {
        throw new Error(`Invalid CC email address: ${ccEmail}`);
      }
    }
  }

  // Validate BCC emails if provided
  if (sanitized.bcc) {
    const bccEmails = sanitized.bcc.split(',').map(e => e.trim());
    for (const bccEmail of bccEmails) {
      if (!validateEmailFormat(bccEmail)) {
        throw new Error(`Invalid BCC email address: ${bccEmail}`);
      }
    }
  }

  return sanitized;
}

/**
 * Formats email content for display or copying
 * @param options - Email options
 * @returns Formatted email string
 */
export function formatEmailContent(options: {
  email: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}): string {
  const lines: string[] = [];

  lines.push(`To: ${options.email}`);

  if (options.cc) {
    lines.push(`CC: ${options.cc}`);
  }

  if (options.bcc) {
    lines.push(`BCC: ${options.bcc}`);
  }

  if (options.subject) {
    lines.push(`Subject: ${options.subject}`);
  }

  if (options.body) {
    lines.push('', 'Message:', options.body);
  }

  return lines.join('\n');
}

/**
 * Builds URL-encoded mailto parameters
 * @param options - Email options
 * @returns URL parameter string
 */
export function buildMailtoParams(options: {
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}): string {
  const params: string[] = [];

  if (options.subject) {
    params.push(`subject=${encodeURIComponent(options.subject)}`);
  }

  if (options.body) {
    params.push(`body=${encodeURIComponent(options.body)}`);
  }

  if (options.cc) {
    params.push(`cc=${encodeURIComponent(options.cc)}`);
  }

  if (options.bcc) {
    params.push(`bcc=${encodeURIComponent(options.bcc)}`);
  }

  return params.length > 0 ? `?${params.join('&')}` : '';
}
