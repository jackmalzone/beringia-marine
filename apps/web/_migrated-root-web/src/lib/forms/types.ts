/**
 * Form Types and Interfaces
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface WaitlistFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interestAreas?: string[];
}

export interface MembershipInquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipTier?: string;
  additionalInfo?: string;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}
