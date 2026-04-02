/**
 * App-wide Constants
 * Business information and other constants
 */

import type { BusinessInfo } from './types';
import { SITE_CONFIG, getSiteUrl } from './site';

/**
 * Template default business information — Beringia Marine (staged migration defaults).
 * Canonical identity object for downstream consumers.
 */
export const TEMPLATE_BUSINESS: BusinessInfo = {
  name: SITE_CONFIG.name,
  legalName: SITE_CONFIG.legalName,
  description: SITE_CONFIG.description,
  tagline: 'Sales Engineering & Consulting',

  phone: SITE_CONFIG.contactPhone,
  phoneText: undefined,
  email: SITE_CONFIG.contactEmail,
  website: getSiteUrl(),

  address: {
    street: 'San Luis Obispo area',
    city: 'San Luis Obispo',
    state: 'CA',
    zipCode: '93401',
    country: 'US',
  },
  coordinates: {
    latitude: 35.2828,
    longitude: -120.6596,
  },

  hours: [
    { day: 'Monday', open: '09:00', close: '17:00' },
    { day: 'Tuesday', open: '09:00', close: '17:00' },
    { day: 'Wednesday', open: '09:00', close: '17:00' },
    { day: 'Thursday', open: '09:00', close: '17:00' },
    { day: 'Friday', open: '09:00', close: '17:00' },
    { day: 'Saturday', open: '09:00', close: '17:00' },
    { day: 'Sunday', open: '09:00', close: '17:00' },
  ],

  services: [
    'Autonomous underwater vehicles',
    'Marine robotics',
    'Underwater systems integration',
    'Ocean exploration technology',
    'Defense & research marine solutions',
    'Ocean monitoring systems',
  ],

  businessCategories: [
    'Marine Technology',
    'Sales Engineering',
    'Oceanographic Equipment',
    'Underwater Robotics',
  ],
  priceRange: '$$',
  paymentMethods: ['Wire Transfer', 'Credit Card', 'ACH'],
  amenities: [
    'Technical consultation',
    'Systems integration support',
    'Manufacturer liaison',
    'Field engineering coordination',
  ],

  socialMedia: {
    linkedin: SITE_CONFIG.social.linkedin,
    instagram: SITE_CONFIG.social.instagram || undefined,
    facebook: SITE_CONFIG.social.facebook || undefined,
  },

  foundedYear: undefined,
  employeeCount: '2-10',
  areaServed: ['San Luis Obispo', 'California', 'United States', 'Global'],
};

/**
 * Helper functions for common business info operations
 */
/** @deprecated Legacy alias. Prefer TEMPLATE_BUSINESS. */
export const VITAL_ICE_BUSINESS: BusinessInfo = TEMPLATE_BUSINESS;

export const BusinessInfoHelpers = {
  /**
   * Get formatted phone number for display
   */
  getFormattedPhone: (phone: string | undefined = TEMPLATE_BUSINESS.phone): string => {
    if (!phone) return '';

    const digits = phone.replace(/\D/g, '');

    if (digits.length === 11 && digits.startsWith('1')) {
      const areaCode = digits.slice(1, 4);
      const exchange = digits.slice(4, 7);
      const number = digits.slice(7);
      return `(${areaCode}) ${exchange}-${number}`;
    }

    return phone;
  },

  /**
   * Get full address as a single string
   */
  getFullAddress: (address = TEMPLATE_BUSINESS.address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  },

  /**
   * Get business hours for a specific day
   */
  getHoursForDay: (day: string, hours = TEMPLATE_BUSINESS.hours) => {
    return hours.find(h => h.day.toLowerCase() === day.toLowerCase()) || null;
  },

  /**
   * Check if business is currently open
   */
  isCurrentlyOpen: (hours = TEMPLATE_BUSINESS.hours): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = BusinessInfoHelpers.getHoursForDay(currentDay, hours);
    if (!todayHours || todayHours.closed) {
      return false;
    }

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  },

  /**
   * Get NAP (Name, Address, Phone) for citations
   */
  getNAP: () => {
    return {
      name: TEMPLATE_BUSINESS.name,
      address: BusinessInfoHelpers.getFullAddress(),
      phone: TEMPLATE_BUSINESS.phone || undefined,
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
  getGroupedHours: () => {
    return [{ label: 'Mon–Fri', time: '9:00 AM–5:00 PM (by appointment)' }];
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

  /**
   * Get formatted text phone number for display
   */
  getFormattedTextPhone: (phoneText: string | undefined = TEMPLATE_BUSINESS.phoneText): string => {
    if (!phoneText) return '';

    // Remove all non-digits
    const digits = phoneText.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (digits.length === 11 && digits.startsWith('1')) {
      const areaCode = digits.slice(1, 4);
      const exchange = digits.slice(4, 7);
      const number = digits.slice(7);
      return `(${areaCode}) ${exchange}-${number}`;
    }

    return phoneText; // Return original if formatting fails
  },
};
