/**
 * Business Information Configuration Tests
 *
 * These tests validate that the business information is properly configured
 * and that validation functions work correctly.
 */

import { TEMPLATE_BUSINESS, validateBusinessInfo, BusinessInfoHelpers } from '../business-info';

describe('Business Information Configuration', () => {
  describe('TEMPLATE_BUSINESS', () => {
    it('should have all required fields', () => {
      expect(TEMPLATE_BUSINESS.name).toBeDefined();
      expect(TEMPLATE_BUSINESS.phone).toBeDefined();
      expect(TEMPLATE_BUSINESS.email).toBeDefined();
      expect(TEMPLATE_BUSINESS.address.street).toBeDefined();
      expect(TEMPLATE_BUSINESS.address.city).toBeDefined();
      expect(TEMPLATE_BUSINESS.address.state).toBeDefined();
      expect(TEMPLATE_BUSINESS.address.zipCode).toBeDefined();
    });

    it('should have valid email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(TEMPLATE_BUSINESS.email)).toBe(true);
    });

    it('should have valid phone format', () => {
      expect(TEMPLATE_BUSINESS.phone).toMatch(/^\+1\d{10,}$/);
    });

    it('should have placeholder coordinates within continental US', () => {
      expect(TEMPLATE_BUSINESS.coordinates.latitude).toBeGreaterThan(24);
      expect(TEMPLATE_BUSINESS.coordinates.latitude).toBeLessThan(50);
      expect(TEMPLATE_BUSINESS.coordinates.longitude).toBeGreaterThan(-125);
      expect(TEMPLATE_BUSINESS.coordinates.longitude).toBeLessThan(-65);
    });

    it('should have business hours for all days', () => {
      const expectedDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      const actualDays = TEMPLATE_BUSINESS.hours.map(h => h.day);

      expectedDays.forEach(day => {
        expect(actualDays).toContain(day);
      });
    });

    it('should have at least 6 services', () => {
      expect(TEMPLATE_BUSINESS.services.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('validateBusinessInfo', () => {
    it('should detect placeholder phone number', () => {
      const validation = validateBusinessInfo(TEMPLATE_BUSINESS);

      if (TEMPLATE_BUSINESS.phone.includes('555-0123')) {
        expect(validation.placeholderFields).toContain('phone (contains placeholder number)');
        expect(validation.isValid).toBe(false);
      }
    });

    it('should detect placeholder address', () => {
      const validation = validateBusinessInfo(TEMPLATE_BUSINESS);

      if (TEMPLATE_BUSINESS.address.street === '2400 Chestnut St') {
        expect(validation.placeholderFields).toContain('address.street (placeholder address)');
        expect(validation.isValid).toBe(false);
      }
    });

    it('should detect placeholder coordinates', () => {
      const validation = validateBusinessInfo(TEMPLATE_BUSINESS);

      if (TEMPLATE_BUSINESS.coordinates.latitude === 37.7999) {
        expect(validation.placeholderFields).toContain('coordinates (placeholder coordinates)');
        expect(validation.isValid).toBe(false);
      }
    });
  });

  describe('BusinessInfoHelpers', () => {
    describe('getFormattedPhone', () => {
      it('should format US phone number correctly', () => {
        const formatted = BusinessInfoHelpers.getFormattedPhone('+1-415-123-4567');
        expect(formatted).toBe('(415) 123-4567');
      });

      it('should return original if formatting fails', () => {
        const invalidPhone = 'invalid-phone';
        const formatted = BusinessInfoHelpers.getFormattedPhone(invalidPhone);
        expect(formatted).toBe(invalidPhone);
      });
    });

    describe('getFullAddress', () => {
      it('should return complete address string', () => {
        const fullAddress = BusinessInfoHelpers.getFullAddress();
        expect(fullAddress).toContain(TEMPLATE_BUSINESS.address.street);
        expect(fullAddress).toContain(TEMPLATE_BUSINESS.address.city);
        expect(fullAddress).toContain(TEMPLATE_BUSINESS.address.state);
        expect(fullAddress).toContain(TEMPLATE_BUSINESS.address.zipCode);
      });
    });

    describe('getHoursForDay', () => {
      it('should return hours for valid day', () => {
        const mondayHours = BusinessInfoHelpers.getHoursForDay('Monday');
        expect(mondayHours).toBeDefined();
        expect(mondayHours?.day).toBe('Monday');
      });

      it('should return null for invalid day', () => {
        const invalidHours = BusinessInfoHelpers.getHoursForDay('InvalidDay');
        expect(invalidHours).toBeNull();
      });

      it('should be case insensitive', () => {
        const mondayHours = BusinessInfoHelpers.getHoursForDay('monday');
        expect(mondayHours).toBeDefined();
        expect(mondayHours?.day).toBe('Monday');
      });
    });

    describe('getNAP', () => {
      it('should return consistent NAP information', () => {
        const nap = BusinessInfoHelpers.getNAP();

        expect(nap.name).toBe(TEMPLATE_BUSINESS.name);
        expect(nap.phone).toBe(TEMPLATE_BUSINESS.phone);
        expect(nap.address).toContain(TEMPLATE_BUSINESS.address.street);
      });
    });
  });

  describe('Production Readiness', () => {
    it('should warn about placeholder data in production', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // This should trigger validation warnings if placeholders exist
      require('../business-info').getBusinessInfoForEnvironment();

      // Restore environment
      process.env.NODE_ENV = originalEnv;

      const validation = validateBusinessInfo(TEMPLATE_BUSINESS);
      if (!validation.isValid) {
        expect(consoleSpy).toHaveBeenCalledWith(
          '⚠️ Business information validation failed:',
          expect.objectContaining({
            missingFields: validation.missingFields,
            placeholderFields: validation.placeholderFields,
          })
        );
      }

      consoleSpy.mockRestore();
    });
  });
});
