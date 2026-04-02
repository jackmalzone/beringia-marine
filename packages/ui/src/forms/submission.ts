/**
 * Form Submission Utilities
 */

import type { ApiResponse, LeadSubmissionResponse } from './apiTypes';
import { EMAIL_SUBMIT_STUB_ID } from './apiTypes';
import type { ContactFormData, NewsletterFormData } from './types';
import {
  getUserFriendlyErrorMessage,
  getNetworkErrorMessage,
  getValidationErrorMessage,
} from './errorMessages';

const WEB3FORMS_SUBMIT_URL = 'https://api.web3forms.com/submit';

function getWeb3FormsPublicKey(): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  return process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
}

/**
 * Web3Forms sits behind Cloudflare; server-side fetch from /api/contact often gets 403 HTML
 * instead of JSON. Their access key is intended for browser submission — restrict domains in the
 * Web3Forms dashboard (include localhost for dev if needed).
 */
async function submitContactViaWeb3Forms(
  data: ContactFormData
): Promise<ApiResponse<LeadSubmissionResponse>> {
  const accessKey = getWeb3FormsPublicKey();
  if (!accessKey) {
    throw new Error('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set');
  }

  const name = `${data.firstName} ${data.lastName}`.trim();
  const payload = {
    access_key: accessKey,
    subject: `Website contact: ${name}`,
    name,
    email: data.email,
    phone: data.phone || '',
    message: data.message?.trim() || '—',
  };

  const response = await fetch(WEB3FORMS_SUBMIT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let parsed: { success?: boolean; message?: string };
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    return {
      success: false,
      error: {
        code: 'INVALID_RESPONSE',
        message: getUserFriendlyErrorMessage('INVALID_RESPONSE'),
      },
    };
  }

  if (parsed.success === true) {
    return {
      success: true,
      data: {
        clientId: EMAIL_SUBMIT_STUB_ID,
        uniqueId: EMAIL_SUBMIT_STUB_ID,
        message: 'Submitted',
      },
    };
  }

  return {
    success: false,
    error: {
      code: 'EMAIL_ERROR',
      message:
        typeof parsed.message === 'string'
          ? parsed.message
          : getUserFriendlyErrorMessage('EMAIL_ERROR'),
    },
  };
}

function shouldUseWeb3FormsDirect(): boolean {
  const key = getWeb3FormsPublicKey();
  if (!key) return false;
  /* Tests must keep using mocked /api/contact */
  if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID) return false;
  return typeof window !== 'undefined';
}

/**
 * Submit contact form
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<ApiResponse<LeadSubmissionResponse>> {
  if (shouldUseWeb3FormsDirect()) {
    try {
      return await submitContactViaWeb3Forms(data);
    } catch {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: getNetworkErrorMessage(),
        },
      };
    }
  }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: getUserFriendlyErrorMessage('INVALID_RESPONSE'),
        },
      };
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: {
          code: 'EMPTY_RESPONSE',
          message: getUserFriendlyErrorMessage('EMPTY_RESPONSE'),
        },
      };
    }

    try {
      const parsed = JSON.parse(text);

      if (!parsed.success && parsed.error) {
        if (parsed.error.code === 'VALIDATION_ERROR') {
          parsed.error.message = getValidationErrorMessage(parsed.error.message);
        } else if (parsed.error.code !== 'VALIDATION_ERROR') {
          parsed.error.message = getUserFriendlyErrorMessage(parsed.error.code);
        }
      }

      return parsed;
    } catch {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: getUserFriendlyErrorMessage('PARSE_ERROR'),
        },
      };
    }
  } catch {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: getNetworkErrorMessage(),
      },
    };
  }
}

/**
 * Submit newsletter form
 */
export async function submitNewsletterForm(
  data: NewsletterFormData
): Promise<ApiResponse<LeadSubmissionResponse>> {
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: getUserFriendlyErrorMessage('INVALID_RESPONSE'),
        },
      };
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: {
          code: 'EMPTY_RESPONSE',
          message: getUserFriendlyErrorMessage('EMPTY_RESPONSE'),
        },
      };
    }

    try {
      const parsed = JSON.parse(text);

      if (!parsed.success && parsed.error) {
        if (parsed.error.code === 'VALIDATION_ERROR') {
          parsed.error.message = getValidationErrorMessage(parsed.error.message);
        } else if (parsed.error.code !== 'VALIDATION_ERROR') {
          parsed.error.message = getUserFriendlyErrorMessage(parsed.error.code);
        }
      }

      return parsed;
    } catch {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: getUserFriendlyErrorMessage('PARSE_ERROR'),
        },
      };
    }
  } catch {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: getNetworkErrorMessage(),
      },
    };
  }
}
