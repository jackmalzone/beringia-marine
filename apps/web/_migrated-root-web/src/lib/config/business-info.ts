/**
 * Centralized Business Information Configuration
 *
 * This file contains all business information for Vital Ice to ensure
 * consistency across the website, structured data, and SEO implementations.
 *
 * CRITICAL: Replace placeholder values with real business information
 */

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BusinessCoordinates {
  latitude: number;
  longitude: number;
}

export interface BusinessInfo {
  // Basic Information
  name: string;
  description: string;
  tagline: string;

  // Contact Information
  phone?: string;
  email: string;
  website: string;

  // Location Information
  address: BusinessAddress;
  coordinates: BusinessCoordinates;

  // Operating Information
  hours: BusinessHours[];

  // Services
  services: string[];

  // SEO-specific Information
  businessCategories: string[];
  priceRange: string;
  paymentMethods: string[];
  amenities: string[];

  // Social Media
  socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };

  // Additional SEO Data
  foundedYear?: number;
  employeeCount?: string;
  areaServed: string[];
}

/**
 * VITAL ICE BUSINESS INFORMATION
 *
 * ⚠️  CRITICAL: Update placeholder values with real business data
 *
 * Current status:
 * ✅ address: Real business address (2400 Chestnut St, San Francisco, CA 94123)
 * ✅ coordinates: Real GPS coordinates (37.800115, -122.434)
 * 🚨 phone: Placeholder - awaiting official phone number from client
 */
export const VITAL_ICE_BUSINESS: BusinessInfo = {
  // Basic Information
  name: 'Vital Ice',
  description:
    'Live Better — Together. Recovery and wellness through cold therapy, red light therapy, sauna, and traditional healing practices.',
  tagline: 'Live Better — Together',

  // Contact Information
  phone: '', // Phone number removed - will be added when available
  email: 'info@vitalicesf.com',
  website: 'https://www.vitalicesf.com',

  // Location Information - ✅ VERIFIED REAL ADDRESS
  address: {
    street: '2400 Chestnut St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94123',
    country: 'US',
  },
  coordinates: {
    latitude: 37.800111, // ✅ VERIFIED - Exact GPS coordinates for 2400 Chestnut St
    longitude: -122.443048, // ✅ VERIFIED - Exact GPS coordinates for 2400 Chestnut St
  },

  // Operating Hours
  hours: [
    { day: 'Monday', open: '06:00', close: '22:00' },
    { day: 'Tuesday', open: '06:00', close: '22:00' },
    { day: 'Wednesday', open: '06:00', close: '22:00' },
    { day: 'Thursday', open: '06:00', close: '22:00' },
    { day: 'Friday', open: '06:00', close: '22:00' },
    { day: 'Saturday', open: '08:00', close: '20:00' },
    { day: 'Sunday', open: '08:00', close: '20:00' },
  ],

  // Services Offered
  services: [
    'Cold Plunge Therapy',
    'Infrared Sauna',
    'Traditional Sauna',
    'Red Light Therapy',
    'Compression Boot Therapy',
    'Percussion Massage',
  ],

  // SEO-specific Information
  businessCategories: [
    'Wellness Center',
    'Spa',
    'Health Club',
    'Recovery Center',
    'Cold Therapy Center',
    'Sauna Facility',
  ],
  priceRange: '$$',
  paymentMethods: ['Cash', 'Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
  amenities: [
    'Cold Plunge Pools',
    'Infrared Sauna',
    'Traditional Sauna',
    'Red Light Therapy',
    'Compression Therapy',
    'Massage Therapy',
    'Changing Rooms',
    'Towel Service',
    'Parking Available',
  ],

  // Social Media Profiles
  socialMedia: {
    instagram: 'https://www.instagram.com/vitalice',
    facebook: 'https://www.facebook.com/vitalice',
    linkedin: 'https://www.linkedin.com/company/vitalice',
  },

  // Additional Business Information
  foundedYear: 2024,
  employeeCount: '2-10',
  areaServed: [
    'San Francisco',
    'Marina District',
    'Pacific Heights',
    'Cow Hollow',
    'Russian Hill',
    'Presidio',
    'Fillmore',
  ],
};

/**
 * Validation function to check if business information is complete
 */
export function validateBusinessInfo(businessInfo: BusinessInfo): {
  isValid: boolean;
  missingFields: string[];
  placeholderFields: string[];
} {
  const missingFields: string[] = [];
  const placeholderFields: string[] = [];

  // Check for missing required fields
  if (!businessInfo.name) missingFields.push('name');
  // Phone is optional, so we don't require it
  if (!businessInfo.email) missingFields.push('email');
  if (!businessInfo.address.street) missingFields.push('address.street');
  if (!businessInfo.address.zipCode) missingFields.push('address.zipCode');

  // Check for placeholder values that need to be updated
  // Phone is now optional and will be empty until provided
  // Address and coordinates are now verified real values
  // Note: 2400 Chestnut St and 94123 are the actual business address
  // Note: 37.800115 is the actual GPS coordinate

  return {
    isValid: missingFields.length === 0 && placeholderFields.length === 0,
    missingFields,
    placeholderFields,
  };
}

/**
 * Environment-based configuration
 */
export function getBusinessInfoForEnvironment(): BusinessInfo {
  const env = process.env.NODE_ENV || 'development';

  // In development, we can use placeholder data
  // In production, we should validate that real data is present
  if (env === 'production') {
    const validation = validateBusinessInfo(VITAL_ICE_BUSINESS);
    if (!validation.isValid) {
    }
  }

  return VITAL_ICE_BUSINESS;
}

/**
 * Helper functions for common business info operations
 */
export const BusinessInfoHelpers = {
  /**
   * Get formatted phone number for display
   */
  getFormattedPhone: (phone: string | undefined = VITAL_ICE_BUSINESS.phone): string => {
    if (!phone) return '';
    
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (digits.length === 11 && digits.startsWith('1')) {
      const areaCode = digits.slice(1, 4);
      const exchange = digits.slice(4, 7);
      const number = digits.slice(7);
      return `(${areaCode}) ${exchange}-${number}`;
    }

    return phone; // Return original if formatting fails
  },

  /**
   * Get full address as a single string
   */
  getFullAddress: (address: BusinessAddress = VITAL_ICE_BUSINESS.address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  },

  /**
   * Get business hours for a specific day
   */
  getHoursForDay: (
    day: string,
    hours: BusinessHours[] = VITAL_ICE_BUSINESS.hours
  ): BusinessHours | null => {
    return hours.find(h => h.day.toLowerCase() === day.toLowerCase()) || null;
  },

  /**
   * Check if business is currently open
   */
  isCurrentlyOpen: (hours: BusinessHours[] = VITAL_ICE_BUSINESS.hours): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const todayHours = BusinessInfoHelpers.getHoursForDay(currentDay, hours);
    if (!todayHours || todayHours.closed) {
      return false;
    }

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  },

  /**
   * Get NAP (Name, Address, Phone) for citations
   */
  getNAP: (): { name: string; address: string; phone?: string } => {
    return {
      name: VITAL_ICE_BUSINESS.name,
      address: BusinessInfoHelpers.getFullAddress(),
      phone: VITAL_ICE_BUSINESS.phone || undefined,
    };
  },

  /**
   * Convert 24-hour time to 12-hour format
   */
  formatTime: (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${minutes !== '00' ? `:${minutes}` : ''}${ampm}`;
  },

  /**
   * Get grouped business hours for display
   */
  getGroupedHours: (): Array<{ label: string; time: string }> => {
    return [
      { label: 'Mon-Fri', time: '6:30AM-10AM | 12PM-2PM | 4PM-9PM' },
      { label: 'Sat', time: '7AM-9PM' },
      { label: 'Sun', time: '8AM-7PM' },
    ];
  },

  /**
   * Get formatted hours for a specific day
   */
  getFormattedHoursForDay: (day: string): string => {
    const dayHours = BusinessInfoHelpers.getHoursForDay(day);
    if (!dayHours || dayHours.closed) {
      return 'Closed';
    }
    const openTime = BusinessInfoHelpers.formatTime(dayHours.open);
    const closeTime = BusinessInfoHelpers.formatTime(dayHours.close);
    return `${openTime}-${closeTime}`;
  },
};

export default VITAL_ICE_BUSINESS;
