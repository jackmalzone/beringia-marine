/**
 * Type definitions for Insights blog system
 */

/**
 * Article category types
 */
export type ArticleCategory =
  | 'Wellness Article'
  | 'Recovery Guide'
  | 'Research Summary'
  | 'Community Story';

/**
 * All available article categories
 */
export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Wellness Article',
  'Recovery Guide',
  'Research Summary',
  'Community Story',
];

/**
 * Article status for content management
 */
export type ArticleStatus = 'draft' | 'published' | 'scheduled';

/**
 * Author information
 */
export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  role?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

/**
 * Category metadata for visual styling and filtering
 */
export interface CategoryMetadata {
  name: ArticleCategory;
  icon: string;
  color: string;
  description: string;
}

/**
 * Category metadata mapping with icons, colors, and descriptions
 */
export const CATEGORY_METADATA: Record<ArticleCategory, CategoryMetadata> = {
  'Wellness Article': {
    name: 'Wellness Article',
    icon: 'heart',
    color: '#00b7b5',
    description: 'General wellness insights and lifestyle tips',
  },
  'Recovery Guide': {
    name: 'Recovery Guide',
    icon: 'refresh',
    color: '#2ECC71',
    description: 'Step-by-step recovery protocols and techniques',
  },
  'Research Summary': {
    name: 'Research Summary',
    icon: 'microscope',
    color: '#8B5CF6',
    description: 'Science-backed research and studies',
  },
  'Community Story': {
    name: 'Community Story',
    icon: 'users',
    color: '#F39C12',
    description: 'Member experiences and testimonials',
  },
};

/**
 * SEO metadata for articles
 */
export interface ArticleSEO {
  title?: string;
  description?: string;
  ogImage?: string;
  keywords?: string[];
}

/**
 * Main article data structure
 */
export interface ArticleData {
  /** Unique identifier */
  id: string;

  /** Article title */
  title: string;

  /** Brief subtitle */
  subtitle: string;

  /** Short description (2-3 sentences) */
  abstract: string;

  /** Full HTML content */
  content: string;

  /** Article category */
  category: ArticleCategory;

  /** Author name or full author object */
  author: string | Author;

  /** Publish date in ISO format (YYYY-MM-DD) */
  publishDate: string;

  /** Optional scheduled publish date for future publishing */
  publishAt?: string;

  /** Content status */
  status: ArticleStatus;

  /** Path to cover image */
  coverImage: string;

  /** Optional path to hero background image */
  heroImage?: string;

  /** Optional split hero images (left and right) */
  heroImageSplit?: {
    left: string;
    right: string;
  };

  /** Array of topic tags */
  tags: string[];

  /** URL-friendly identifier */
  slug: string;

  /** Optional PDF download link */
  pdfUrl?: string;

  /** Estimated reading time in minutes */
  readingTime?: number;

  /** Custom SEO metadata */
  seo?: ArticleSEO;
}

/**
 * Type guard to check if author is an Author object
 */
export function isAuthorObject(author: string | Author): author is Author {
  return typeof author === 'object' && author !== null && 'name' in author;
}

/**
 * Get author name from string or Author object
 */
export function getAuthorName(author: string | Author): string {
  return isAuthorObject(author) ? author.name : author;
}

/**
 * Get category color from metadata
 */
export function getCategoryColor(category: ArticleCategory): string {
  return CATEGORY_METADATA[category].color;
}

/**
 * Get category icon from metadata
 */
export function getCategoryIcon(category: ArticleCategory): string {
  return CATEGORY_METADATA[category].icon;
}

/**
 * Get category description from metadata
 */
export function getCategoryDescription(category: ArticleCategory): string {
  return CATEGORY_METADATA[category].description;
}
