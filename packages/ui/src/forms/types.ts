/**
 * Form Types and Interfaces
 */

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}

// Re-export types from validation schemas
export type { ContactFormData, NewsletterFormData } from './validation';
