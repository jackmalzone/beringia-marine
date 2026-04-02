/**
 * Business Information Configuration Tests
 *
 * These tests validate that the business information is properly configured
 * and that validation functions work correctly.
 */

import { VITAL_ICE_BUSINESS, validateBusinessInfo, BusinessInfoHelpers } from '../business-info';

describe('Business Information Configuration', () => {
  describe('VITAL_ICE_BUSINESS', () => {
    it('should have all required fields', () => {
      expect(VITAL_ICE_BUSINESS.name).toBeDefined();
      expect(VITAL_ICE_BUSINESS.phone).toBeDefined();
      expect(VITAL_ICE_BUSINESS.email).toBeDefined();
      expect(VITAL_ICE_BUSINESS.address.street).toBeDefined();
      expect(VITAL_ICE_BUSINESS.address.city).toBeDefined();
      expect(VITAL_ICE_BUSINESS.address.state).toBeDefined();
      expect(VITAL_ICE_BUSINESS.address.zipCode).toBeDefined();
    });

    it('should have valid email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(VITAL_ICE_BUSINESS.email)).toBe(true);
    });

    it('should have valid phone format', () => {
      // Should start with +1 for US numbers
      expect(VITAL_ICE_BUSINESS.phone).toMatch(/^\+1-\d{3}-\d{3}-\d{4}$/);
    });

    it('should have coordinates within San Francisco area', () => {
      // San Francisco approximate bounds
      const sfLatMin = 37.7;
      const sfLatMax = 37.8;
      const sfLngMin = -122.5;
      const sfLngMax = -122.3;

      expect(VITAL_ICE_BUSINESS.coordinates.latitude).toBeGreaterThan(sfLatMin);
      expect(VITAL_ICE_BUSINESS.coordinates.latitude).toBeLessThan(sfLatMax);
      expect(VITAL_ICE_BUSINESS.coordinates.longitude).toBeGreaterThan(sfLngMin);
      expect(VITAL_ICE_BUSINESS.coordinates.longitude).toBeLessThan(sfLngMax);
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
      const actualDays = VITAL_ICE_BUSINESS.hours.map(h => h.day);

      expectedDays.forEach(day => {
        expect(actualDays).toContain(day);
      });
    });

    it('should have at least 6 services', () => {
      expect(VITAL_ICE_BUSINESS.services.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('validateBusinessInfo', () => {
    it('should detect placeholder phone number', () => {
      const validation = validateBusinessInfo(VITAL_ICE_BUSINESS);

      if (VITAL_ICE_BUSINESS.phone.includes('555-0123')) {
        expect(validation.placeholderFields).toContain('phone (contains placeholder number)');
        expect(validation.isValid).toBe(false);
      }
    });

    it('should detect placeholder address', () => {
      const validation = validateBusinessInfo(VITAL_ICE_BUSINESS);

      if (VITAL_ICE_BUSINESS.address.street === '2400 Chestnut St') {
        expect(validation.placeholderFields).toContain('address.street (placeholder address)');
        expect(validation.isValid).toBe(false);
      }
    });

    it('should detect placeholder coordinates', () => {
      const validation = validateBusinessInfo(VITAL_ICE_BUSINESS);

      if (VITAL_ICE_BUSINESS.coordinates.latitude === 37.7999) {
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
        expect(fullAddress).toContain(VITAL_ICE_BUSINESS.address.street);
        expect(fullAddress).toContain(VITAL_ICE_BUSINESS.address.city);
        expect(fullAddress).toContain(VITAL_ICE_BUSINESS.address.state);
        expect(fullAddress).toContain(VITAL_ICE_BUSINESS.address.zipCode);
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

        expect(nap.name).toBe(VITAL_ICE_BUSINESS.name);
        expect(nap.phone).toBe(VITAL_ICE_BUSINESS.phone);
        expect(nap.address).toContain(VITAL_ICE_BUSINESS.address.street);
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

      const validation = validateBusinessInfo(VITAL_ICE_BUSINESS);
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
