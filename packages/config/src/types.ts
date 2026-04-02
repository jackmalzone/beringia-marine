/**
 * Shared TypeScript Types
 * Types used across multiple packages
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
  /** Legal entity name for copyright and policies when different from marketing name */
  legalName?: string;
  description: string;
  tagline: string;

  // Contact Information
  phone?: string;
  phoneText?: string;
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
