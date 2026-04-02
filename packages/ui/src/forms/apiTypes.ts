/**
 * Shared API response shapes for lead/newsletter submissions (email-backed routes).
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Compatibility shape for callers that expected a CRM id after submit. */
export interface LeadSubmissionResponse {
  clientId: string;
  uniqueId: string;
  message?: string;
}

export const EMAIL_SUBMIT_STUB_ID = 'email-submission';
