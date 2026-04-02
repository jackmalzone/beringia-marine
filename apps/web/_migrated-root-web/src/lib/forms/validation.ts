/**
 * Form Validation Utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (US format)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

/**
 * Validate required field
 */
export function validateRequired(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0;
}

/**
 * Validate contact form data
 */
export function validateContactForm(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.firstName)) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!validateRequired(data.lastName)) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!validateRequired(data.email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate waitlist form data
 */
export function validateWaitlistForm(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): ValidationResult {
  return validateContactForm(data); // Same validation as contact form
}

/**
 * Validate membership inquiry form data
 */
export function validateMembershipInquiryForm(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): ValidationResult {
  return validateContactForm(data); // Same validation as contact form
}
