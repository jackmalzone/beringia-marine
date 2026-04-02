/**
 * Image SEO Optimization Utilities
 *
 * This module provides utilities for optimizing images for SEO and accessibility,
 * including automatic alt text generation, responsive sizing, and schema markup.
 */

import { SITE_CONFIG, getSiteUrl } from '@/lib/config/site-config';

export interface ImageSEOData {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  keywords?: string[];
  context?: 'service' | 'founder' | 'gallery' | 'background' | 'logo' | 'testimonial';
  location?: string; // For local SEO
  width?: number;
  height?: number;
  priority?: boolean;
  lazy?: boolean;
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  lazy?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Service-specific keywords for alt text optimization
 */
const SERVICE_KEYWORDS = {
  'cold-plunge': [
    'premium service session',
    'guided studio experience',
    'client care',
    'Service One',
    'local studio',
    'professional services',
  ],
  'infrared-sauna': [
    'heated studio session',
    'ambient therapy room',
    'client comfort',
    'Service Two',
    'local studio',
    'professional services',
  ],
  'traditional-sauna': [
    'classic heat session',
    'studio ritual',
    'client experience',
    'Service Three',
    'local studio',
    'professional services',
  ],
  'red-light-therapy': [
    'protocol-led session',
    'documented visit',
    'client experience',
    'Service Four',
    'local studio',
    'professional services',
  ],
  'compression-boots': [
    'equipment session',
    'passive recovery visit',
    'client comfort',
    'Service Five',
    'local studio',
    'professional services',
  ],
  'percussion-massage': [
    'therapist-led session',
    'mobility visit',
    'client care',
    'Service Six',
    'local studio',
    'professional services',
  ],
};

/**
 * Location-specific keywords for local SEO (reserved for future use)
 */

/**
 * Generate SEO-optimized alt text based on image context and content
 */
export function generateOptimizedAltText(
  baseDescription: string,
  context?: ImageSEOData['context'],
  service?: keyof typeof SERVICE_KEYWORDS,
  includeLocation: boolean = true
): string {
  let altText = baseDescription;

  // Add service-specific keywords if applicable
  if (service && SERVICE_KEYWORDS[service]) {
    const serviceKeywords = SERVICE_KEYWORDS[service];
    // Add the primary service keyword if not already included
    const primaryKeyword = serviceKeywords[0];
    if (!altText.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      altText = `${altText} - ${primaryKeyword}`;
    }
  }

  // Add business name for local / brand context (template: SITE_CONFIG.name)
  const brandLower = SITE_CONFIG.name.toLowerCase();
  if (includeLocation && !altText.toLowerCase().includes(brandLower)) {
    altText = `${altText} at ${SITE_CONFIG.name}`;
  }

  // Context-specific optimizations
  switch (context) {
    case 'service':
      if (!altText.toLowerCase().includes('service')) {
        altText = `${altText} professional service`;
      }
      break;
    case 'founder':
      if (!altText.toLowerCase().includes(brandLower)) {
        altText = `${altText} at ${SITE_CONFIG.name}`;
      }
      break;
    case 'background':
      if (!altText.toLowerCase().includes('background')) {
        altText = `${altText} background image`;
      }
      break;
  }

  return altText;
}

/**
 * Generate responsive image sizes based on context
 */
export function generateResponsiveSizes(context: ImageSEOData['context']): string {
  switch (context) {
    case 'service':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'founder':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px';
    case 'gallery':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px';
    case 'background':
      return '100vw';
    case 'logo':
      return '(max-width: 768px) 200px, 300px';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
}

/**
 * Optimize image props for SEO and performance
 */
export function optimizeImageProps(imageData: ImageSEOData): OptimizedImageProps {
  const optimizedAlt = generateOptimizedAltText(
    imageData.alt,
    imageData.context,
    imageData.src.includes('coldplunge')
      ? 'cold-plunge'
      : imageData.src.includes('sauna-infrared')
        ? 'infrared-sauna'
        : imageData.src.includes('sauna-traditional')
          ? 'traditional-sauna'
          : imageData.src.includes('redlight')
            ? 'red-light-therapy'
            : imageData.src.includes('compression') || imageData.src.includes('cells-bloodcells')
              ? 'compression-boots'
              : imageData.src.includes('percussion')
                ? 'percussion-massage'
                : undefined
  );

  return {
    src: imageData.src,
    alt: optimizedAlt,
    title: imageData.title || optimizedAlt,
    width: imageData.width,
    height: imageData.height,
    priority: imageData.priority || false,
    lazy: imageData.lazy !== false, // Default to lazy loading
    sizes: generateResponsiveSizes(imageData.context),
    quality: 85, // Optimal balance between quality and file size
  };
}

/**
 * Generate image schema markup for SEO
 */
export function generateImageSchema(imageData: ImageSEOData): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@type': 'ImageObject',
    url: imageData.src,
    description: imageData.alt,
    name: imageData.title || imageData.alt,
  };

  if (imageData.width && imageData.height) {
    schema.width = imageData.width;
    schema.height = imageData.height;
  }

  if (imageData.caption) {
    schema.caption = imageData.caption;
  }

  if (imageData.keywords && imageData.keywords.length > 0) {
    schema.keywords = imageData.keywords.join(', ');
  }

  // Add organization context for business images
  if (imageData.context === 'service' || imageData.context === 'founder') {
    schema.author = {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: getSiteUrl(),
    };
  }

  return schema;
}

/**
 * Validate image accessibility compliance
 */
export function validateImageAccessibility(imageProps: OptimizedImageProps): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check alt text
  if (!imageProps.alt || imageProps.alt.trim().length === 0) {
    issues.push('Missing alt text');
  } else if (imageProps.alt.length < 10) {
    recommendations.push('Alt text should be more descriptive (minimum 10 characters)');
  } else if (imageProps.alt.length > 125) {
    recommendations.push('Alt text should be concise (maximum 125 characters recommended)');
  }

  // Check for generic alt text
  const genericTerms = ['image', 'photo', 'picture', 'graphic'];
  if (genericTerms.some(term => imageProps.alt.toLowerCase().includes(term))) {
    recommendations.push('Avoid generic terms like "image" or "photo" in alt text');
  }

  // Check for descriptive service keywords (template-neutral)
  const hasServiceKeywords = [
    'service',
    'studio',
    'client',
    'session',
    'professional',
    'treatment',
  ].some(keyword => imageProps.alt.toLowerCase().includes(keyword));

  if (!hasServiceKeywords) {
    recommendations.push('Consider adding relevant service or studio keywords to alt text');
  }

  // Check for location keywords (for local SEO)
  const hasLocationKeywords = ['riverton', 'northline', 'main street', 'downtown'].some(location =>
    imageProps.alt.toLowerCase().includes(location)
  );

  if (!hasLocationKeywords) {
    recommendations.push('Consider adding location context for local SEO');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Batch optimize multiple images
 */
export function batchOptimizeImages(images: ImageSEOData[]): OptimizedImageProps[] {
  return images.map(imageData => optimizeImageProps(imageData));
}

/**
 * Generate comprehensive image audit report
 */
export function generateImageAuditReport(images: ImageSEOData[]): {
  totalImages: number;
  optimizedImages: number;
  issuesFound: number;
  recommendations: string[];
  summary: string;
} {
  const optimizedImages = images.map(img => optimizeImageProps(img));
  const validationResults = optimizedImages.map(img => validateImageAccessibility(img));

  const totalIssues = validationResults.reduce((sum, result) => sum + result.issues.length, 0);
  const allRecommendations = validationResults.flatMap(result => result.recommendations);
  const uniqueRecommendations = [...new Set(allRecommendations)];

  return {
    totalImages: images.length,
    optimizedImages: validationResults.filter(result => result.isValid).length,
    issuesFound: totalIssues,
    recommendations: uniqueRecommendations,
    summary: `Audited ${images.length} images. Found ${totalIssues} issues. ${uniqueRecommendations.length} optimization recommendations available.`,
  };
}

/**
 * Predefined optimized image configurations for common use cases
 */
export const OPTIMIZED_IMAGE_CONFIGS = {
  serviceHero: {
    context: 'service' as const,
    priority: true,
    lazy: false,
    quality: 90,
  },
  serviceBackground: {
    context: 'background' as const,
    priority: false,
    lazy: true,
    quality: 80,
  },
  founderPhoto: {
    context: 'founder' as const,
    priority: false,
    lazy: true,
    quality: 85,
    width: 300,
    height: 400,
  },
  galleryImage: {
    context: 'gallery' as const,
    priority: false,
    lazy: true,
    quality: 80,
  },
  logo: {
    context: 'logo' as const,
    priority: true,
    lazy: false,
    quality: 95,
  },
};
