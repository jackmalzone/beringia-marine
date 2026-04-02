import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

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

export interface GlobalSettings extends Partial<SanityDocument> {
  businessInfo: BusinessInfo;
  seoDefaults?: SEOSettings;
  analyticsSettings?: AnalyticsSettings;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface SanityColor {
  hex: string;
}

export interface ServiceData extends Partial<SanityDocument> {
  title: string;
  slug: { current: string };
  order?: number;
  version?: string;
  subtitle?: string;
  description: string;
  heroImage?: SanityImageSource;
  heroImageUrl?: string;
  backgroundImage?: SanityImageSource;
  backgroundImageUrl?: string;
  textureImage?: SanityImageSource;
  textureImageUrl?: string;
  themeColor?: SanityColor;
  tagline?: string;
  benefits?: Array<{
    title: string;
    description: string;
  }>;
  process?: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  cta?: {
    title: string;
    text: string;
    link?: string;
  };
  seo?: SEOSettings;
}

export interface HeroBlock {
  _type: 'hero';
  _key: string;
  headline?: string;
  subheadline?: string;
  backgroundVideo?: string;
  backgroundImage?: SanityImageSource;
  ctaButton?: {
    text?: string;
    link?: string;
    style?: string;
  };
}

export interface TextSectionBlock {
  _type: 'textSection';
  _key: string;
  title?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

export interface ServiceGridBlock {
  _type: 'serviceGrid';
  _key: string;
  title?: string;
  subtitle?: string;
  services?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    subtitle?: string;
    heroImage?: SanityImageSource;
    themeColor?: SanityColor;
    order?: number;
  }>;
}

export interface TestimonialsBlock {
  _type: 'testimonials';
  _key: string;
  title?: string;
  testimonials?: Array<{
    name?: string;
    text?: string;
    rating?: number;
    image?: SanityImageSource;
  }>;
}

export interface NewsletterBlock {
  _type: 'newsletter';
  _key: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  backgroundColor?: string;
}

export type ContentBlock =
  | HeroBlock
  | TextSectionBlock
  | ServiceGridBlock
  | TestimonialsBlock
  | NewsletterBlock;

export interface PageContent extends Partial<SanityDocument> {
  title: string;
  slug: { current: string };
  seo?: SEOSettings;
  content: ContentBlock[];
}
