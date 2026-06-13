import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface SanityImageWithAlt {
  asset?: { _ref?: string; _id?: string; url?: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  _type?: 'image';
}

export interface SanitySeo {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: SanityImageWithAlt;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export type InsightCategory =
  | 'Article'
  | 'White Paper'
  | 'Case Study'
  | 'Field Report'
  | 'Research Summary';

export type InsightContentType = 'article' | 'white-paper' | 'hybrid';

export interface SanityInsight {
  _id: string;
  _type: 'insight';
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  category: InsightCategory;
  contentType: InsightContentType;
  excerpt: string;
  deck?: string;
  author?: string;
  authorRef?: {
    name?: string;
    role?: string;
    photo?: SanityImageWithAlt;
  };
  coverImage: SanityImageWithAlt;
  body: PortableTextBlock[];
  tags?: string[];
  readingTime?: number;
  publishedAt: string;
  updatedAt?: string;
  pdfUrl?: string;
  featured?: boolean;
  seo?: SanitySeo;
}

export interface SanityPartnerSellingPoint {
  title: string;
  description?: string;
  features?: string[];
  icon?: SanityImageSource;
  link?: string;
  documentation?: { specs?: string; manual?: string; benthicSurvey?: string };
}

export interface SanityPartnerUseCase {
  title: string;
  description?: string;
  keyPoints?: string[];
}

export type SanityGalleryItem =
  | { _key: string; _type: 'galleryImage'; image: SanityImageWithAlt }
  | { _key: string; _type: 'gallerySketchfab'; modelId: string; alt?: string };

export interface SanityPartner {
  _id: string;
  _type: 'partner';
  _updatedAt?: string;
  name: string;
  slug: { current: string };
  tagline?: string;
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  headerImage?: SanityImageWithAlt;
  logo?: SanityImageWithAlt;
  logoTreatment?: 'default' | 'white';
  overview?: { title?: string; description?: string };
  sellingPoints?: { title?: string; points?: SanityPartnerSellingPoint[] };
  useCases?: { title?: string; description?: string; cases?: SanityPartnerUseCase[] };
  valueProposition?: {
    title?: string;
    description?: string;
    highlights?: string[];
  };
  mediaLinks?: {
    website?: string;
    email?: string;
    linkedin?: string;
    youtube?: string;
    sketchfab?: string;
  };
  sketchfabModelId?: string;
  interactiveCopy?: { title?: string; description?: string };
  demo?: { title?: string; description?: string; videoUrl?: string };
  gallery?: SanityGalleryItem[];
  documents?: Array<{ label: string; href: string }>;
  externalLinks?: Array<{ label: string; href: string }>;
  status?: 'active' | 'draft' | 'archived';
  featured?: boolean;
  seo?: SanitySeo;
}

export interface SanitySiteSettings {
  _id: string;
  _type: 'siteSettings';
  businessInfo?: {
    name?: string;
    legalName?: string;
    tagline?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
  };
  seoDefaults?: SanitySeo;
  analytics?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
  };
}
