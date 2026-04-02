import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Base Sanity document interface
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// SEO Settings interface
export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: SanityImageSource;
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: SanityImageSource;
  };
  noIndex?: boolean;
  canonicalUrl?: string;
}

// Business Information interface
export interface BusinessInfo {
  name: string;
  description: string;
  tagline: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  hours: Array<{
    day: string;
    open: string;
    close: string;
    closed?: boolean;
  }>;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface AnalyticsSettings {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
}

// Global Settings document
export interface GlobalSettings extends SanityDocument {
  businessInfo: BusinessInfo;
  seoDefaults: SEOSettings;
  analyticsSettings?: AnalyticsSettings;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

// Service document interface
export interface ServiceData extends SanityDocument {
  title: string;
  slug: { current: string };
  order: number;
  version: string;
  subtitle: string;
  description: string;
  heroImage?: SanityImageSource;
  heroImageUrl?: string;
  backgroundImage?: SanityImageSource;
  backgroundImageUrl?: string;
  textureImage?: SanityImageSource;
  textureImageUrl?: string;
  themeColor: SanityColor;
  tagline: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  process: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  cta: {
    title: string;
    text: string;
    link?: string;
  };
  seo: SEOSettings;
}

// Page document interface
export interface PageContent extends SanityDocument {
  title: string;
  slug: { current: string };
  seo: SEOSettings;
  content: Array<ContentBlock>;
}

// Alias for backward compatibility
export type PageData = PageContent;

// Content block types
export type ContentBlock =
  | HeroBlock
  | TextSectionBlock
  | ServiceGridBlock
  | TestimonialsBlock
  | NewsletterBlock;

export interface HeroBlock {
  _type: 'hero';
  _key: string;
  headline: string;
  subheadline: string;
  backgroundVideo?: string;
  backgroundImage?: SanityImageSource;
  ctaButton?: {
    text: string;
    link: string;
    style?: string;
  };
}

export interface TextSectionBlock {
  _type: 'textSection';
  _key: string;
  title: string;
  content: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

export interface ServiceGridBlock {
  _type: 'serviceGrid';
  _key: string;
  title: string;
  subtitle?: string;
  services: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    subtitle: string;
    heroImage: SanityImageSource;
    themeColor: SanityColor;
    order: number;
  }>;
}

export interface TestimonialsBlock {
  _type: 'testimonials';
  _key: string;
  title: string;
  testimonials: Array<{
    name: string;
    text: string;
    rating?: number;
    image?: SanityImageSource;
  }>;
}

export interface NewsletterBlock {
  _type: 'newsletter';
  _key: string;
  title: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  backgroundColor?: string;
}

// Enhanced image type with metadata
export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    lqip?: string;
    hasAlpha?: boolean;
    isOpaque?: boolean;
  };
}

export interface SanityImageWithMetadata {
  asset: SanityImageAsset;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
}

// Color type for theme colors
export interface SanityColor {
  hex: string;
  alpha?: number;
  hsl?: {
    h: number;
    s: number;
    l: number;
    a?: number;
  };
  hsv?: {
    h: number;
    s: number;
    v: number;
    a?: number;
  };
  rgb?: {
    r: number;
    g: number;
    b: number;
    a?: number;
  };
}

// Query result types for specific use cases
export interface PageMetadata {
  title: string;
  seo: SEOSettings;
}

export interface ServiceMetadata {
  title: string;
  seo: SEOSettings;
}

export interface SitemapData {
  pages: Array<{
    slug: { current: string };
    _updatedAt: string;
  }>;
  services: Array<{
    slug: { current: string };
    _updatedAt: string;
  }>;
}

// Content validation types
export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  tags?: string[];
}
