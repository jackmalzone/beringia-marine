/**
 * Form Submission Tests
 */

import { submitContactForm, submitNewsletterForm } from '../submission';
import type { ContactFormData, NewsletterFormData } from '../types';

global.fetch = jest.fn();

describe('Form Submission Functions', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('submitContactForm', () => {
    const mockFormData: ContactFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '415-123-4567',
      message: 'Test message',
    };

    it('should successfully submit contact form', async () => {
      const mockResponse = {
        success: true,
        data: {
          clientId: '123',
          uniqueId: 'abc-123',
          message: 'Contact form submitted successfully',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      });

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('should handle network errors with friendly message', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(result.error?.message).toMatch(/connection|internet|servers|frosty|try again|check|make sure|connected/i);
    });

    it('should handle empty response with friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue(''),
      });

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EMPTY_RESPONSE');
      expect(result.error?.message).toMatch(/chill moment|deep breath|snag|refresh|hiccup|try again/i);
    });

    it('should handle invalid JSON response with friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue('invalid json{'),
      });

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PARSE_ERROR');
      expect(result.error?.message).toMatch(/chill moment|deep breath|snag|refresh|hiccup|try again/i);
    });

    it('should handle non-JSON response with friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('text/html'),
        },
        text: jest.fn().mockResolvedValue('<html>Error</html>'),
      });

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_RESPONSE');
      expect(result.error?.message).toMatch(/chill moment|deep breath|snag|refresh|hiccup|try again/i);
    });

    it('should preserve validation error messages', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'First name, last name, and email are required',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue(JSON.stringify(mockErrorResponse)),
      });

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toBe('First name, last name, and email are required');
    });

    it('should use friendly message for server errors', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Internal server error',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue(JSON.stringify(mockErrorResponse)),
      });

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('SERVER_ERROR');
      expect(result.error?.message).toMatch(/chill moment|deep breath|snag|refresh|hiccup|try again/i);
    });
  });

  describe('submitNewsletterForm', () => {
    const mockFormData: NewsletterFormData = {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com',
      phone: '415-333-4444',
      sendScheduleEmails: true,
      sendScheduleTexts: true,
      sendPromotionalEmails: true,
      sendPromotionalTexts: true,
    };

    it('should successfully submit newsletter form', async () => {
      const mockResponse = {
        success: true,
        data: {
          clientId: '202',
          uniqueId: 'mno-202',
          message: 'Newsletter subscription successful',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      });

      const result = await submitNewsletterForm(mockFormData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await submitNewsletterForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NETWORK_ERROR');
    });

    it('should handle empty response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue('   '),
      });

      const result = await submitNewsletterForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EMPTY_RESPONSE');
    });
  });

  describe('Error Message Handling', () => {
    const mockFormData: ContactFormData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };

    it('should use friendly messages for all technical errors', async () => {
      const errorCodes = ['INVALID_RESPONSE', 'EMPTY_RESPONSE', 'PARSE_ERROR'];

      for (const code of errorCodes) {
        (global.fetch as jest.Mock).mockClear();

        if (code === 'INVALID_RESPONSE') {
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            headers: {
              get: jest.fn().mockReturnValue('text/html'),
            },
            text: jest.fn().mockResolvedValue('<html>Error</html>'),
          });
        } else if (code === 'EMPTY_RESPONSE') {
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            headers: {
              get: jest.fn().mockReturnValue('application/json'),
            },
            text: jest.fn().mockResolvedValue(''),
          });
        } else if (code === 'PARSE_ERROR') {
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            headers: {
              get: jest.fn().mockReturnValue('application/json'),
            },
            text: jest.fn().mockResolvedValue('{invalid'),
          });
        }

        const result = await submitContactForm(mockFormData);

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(code);
        expect(result.error?.message).toMatch(/chill moment|deep breath|snag|hiccup|try again/i);
      }
    });

    it('should preserve validation error messages', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email is required',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        text: jest.fn().mockResolvedValue(JSON.stringify(mockErrorResponse)),
      });

      const result = await submitContactForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toBe('Email is required');
    });
  });

  describe('Network Error Variations', () => {
    const mockFormData: ContactFormData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };

    it('should handle different network error types', async () => {
      const networkErrors = [
        new Error('Network request failed'),
        new Error('Failed to fetch'),
        new TypeError('NetworkError when attempting to fetch resource'),
      ];

      for (const error of networkErrors) {
        (global.fetch as jest.Mock).mockClear();
        (global.fetch as jest.Mock).mockRejectedValueOnce(error);

        const result = await submitContactForm(mockFormData);

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe('NETWORK_ERROR');
        expect(result.error?.message).toMatch(/connection|internet|servers|frosty|try again|check|make sure/i);
      }
    });
  });
});
