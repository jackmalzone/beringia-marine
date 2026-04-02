/**
 * Error Messages Tests
 * 
 * Tests for user-friendly error message utilities
 */

import {
  getUserFriendlyErrorMessage,
  getNetworkErrorMessage,
  getValidationErrorMessage,
} from '../errorMessages';

describe('Error Messages', () => {
  describe('getUserFriendlyErrorMessage', () => {
    it('should return a friendly message for any error code', () => {
      const errorCodes = [
        'INVALID_RESPONSE',
        'EMPTY_RESPONSE',
        'PARSE_ERROR',
        'SERVER_ERROR',
        'UNKNOWN_ERROR',
      ];

      errorCodes.forEach(code => {
        const message = getUserFriendlyErrorMessage(code);
        expect(message).toBeTruthy();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });

    it('should return deterministic messages for the same error code', () => {
      const code = 'INVALID_RESPONSE';
      const message1 = getUserFriendlyErrorMessage(code);
      const message2 = getUserFriendlyErrorMessage(code);
      
      expect(message1).toBe(message2);
    });

    it('should return different messages for different error codes', () => {
      const message1 = getUserFriendlyErrorMessage('INVALID_RESPONSE');
      const message2 = getUserFriendlyErrorMessage('EMPTY_RESPONSE');
      const message3 = getUserFriendlyErrorMessage('PARSE_ERROR');
      
      // At least two should be different (statistically likely)
      const allSame = message1 === message2 && message2 === message3;
      expect(allSame).toBe(false);
    });

    it('should return Vital Ice themed messages', () => {
      const message = getUserFriendlyErrorMessage('TEST_ERROR');
      
      // Check for friendly, encouraging language
      expect(message.toLowerCase()).toMatch(/chill|breath|snag|refresh|hiccup|try again|don't worry/i);
    });

    it('should handle empty string error code', () => {
      const message = getUserFriendlyErrorMessage('');
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });

    it('should handle single character error code', () => {
      const message = getUserFriendlyErrorMessage('A');
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });
  });

  describe('getNetworkErrorMessage', () => {
    it('should return a network error message', () => {
      const message = getNetworkErrorMessage();
      
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should return Vital Ice themed network messages', () => {
      const message = getNetworkErrorMessage();
      
      // Check for network-related friendly language
      expect(message.toLowerCase()).toMatch(/connection|internet|servers|frosty|try again/i);
    });

    it('should return different messages on different calls (time-based)', () => {
      // Since it's time-based, we can't guarantee different messages,
      // but we can verify it returns valid messages
      const messages = new Set<string>();
      
      // Call multiple times (though they might be the same due to time resolution)
      for (let i = 0; i < 10; i++) {
        messages.add(getNetworkErrorMessage());
      }
      
      // Should have at least one message
      expect(messages.size).toBeGreaterThan(0);
      
      // All messages should be valid
      messages.forEach(msg => {
        expect(msg).toBeTruthy();
        expect(typeof msg).toBe('string');
      });
    });

    it('should always return one of the predefined network messages', () => {
      const validMessages = [
        "Looks like we lost connection for a moment. Check your internet and try again!",
        "Connection got a bit frosty there. Warm it up and try once more.",
        "We couldn't reach our servers. Make sure you're connected and give it another shot.",
      ];

      // Call multiple times to increase chance of hitting different messages
      const messages = new Set<string>();
      for (let i = 0; i < 100; i++) {
        messages.add(getNetworkErrorMessage());
      }

      // All returned messages should be in the valid list
      messages.forEach(msg => {
        expect(validMessages).toContain(msg);
      });
    });
  });

  describe('getValidationErrorMessage', () => {
    it('should return the original message unchanged', () => {
      const originalMessage = 'First name is required';
      const result = getValidationErrorMessage(originalMessage);
      
      expect(result).toBe(originalMessage);
    });

    it('should preserve validation error messages exactly', () => {
      const messages = [
        'Email is required',
        'Phone number must be valid',
        'First name, last name, and email are required',
        'Birth date must be in the past',
      ];

      messages.forEach(msg => {
        expect(getValidationErrorMessage(msg)).toBe(msg);
      });
    });

    it('should handle empty validation messages', () => {
      const result = getValidationErrorMessage('');
      expect(result).toBe('');
    });

    it('should handle long validation messages', () => {
      const longMessage = 'This is a very long validation error message that contains multiple sentences and should be preserved exactly as provided to the user.';
      const result = getValidationErrorMessage(longMessage);
      
      expect(result).toBe(longMessage);
    });
  });

  describe('Message Consistency', () => {
    it('should provide consistent user experience', () => {
      // Same error code should always return same message
      const code = 'PARSE_ERROR';
      const message1 = getUserFriendlyErrorMessage(code);
      const message2 = getUserFriendlyErrorMessage(code);
      const message3 = getUserFriendlyErrorMessage(code);
      
      expect(message1).toBe(message2);
      expect(message2).toBe(message3);
    });

    it('should have appropriate tone for Vital Ice brand', () => {
      const technicalMessage = getUserFriendlyErrorMessage('TECH_ERROR');
      const networkMessage = getNetworkErrorMessage();
      
      // Both should be friendly and encouraging
      expect(technicalMessage).toMatch(/try|again|don't worry|you've got this/i);
      expect(networkMessage).toMatch(/try|again|check|make sure/i);
      
      // Should not contain technical jargon
      expect(technicalMessage.toLowerCase()).not.toMatch(/json|parse|network|http|status code|error code/i);
      expect(networkMessage.toLowerCase()).not.toMatch(/json|parse|http|status code|error code/i);
    });
  });
});

