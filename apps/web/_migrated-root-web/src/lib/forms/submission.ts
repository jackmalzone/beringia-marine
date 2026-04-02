/**
 * Form Submission Utilities
 */

import type { ApiResponse, LeadSubmissionResponse } from '@/lib/mindbody/types';
import type { ContactFormData, WaitlistFormData, MembershipInquiryFormData } from './types';

/**
 * Submit contact form
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<ApiResponse<LeadSubmissionResponse>> {
  try {
    const response = await fetch('/api/mindbody/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Failed to submit form',
      },
    };
  }
}

/**
 * Submit waitlist form
 */
export async function submitWaitlistForm(
  data: WaitlistFormData
): Promise<ApiResponse<LeadSubmissionResponse>> {
  try {
    const response = await fetch('/api/mindbody/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Failed to submit form',
      },
    };
  }
}

/**
 * Submit membership inquiry form
 */
export async function submitMembershipInquiryForm(
  data: MembershipInquiryFormData
): Promise<ApiResponse<LeadSubmissionResponse>> {
  try {
    const response = await fetch('/api/mindbody/membership-inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Failed to submit form',
      },
    };
  }
}
