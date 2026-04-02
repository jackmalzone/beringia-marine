import { Metadata } from 'next';
import { PageContent, ServiceData, SEOSettings } from './types';
import { buildImageUrl } from './image';
import { SITE_CONFIG, getSiteUrl } from '@/lib/config/site-config';

/**
 * Generate Next.js metadata from Sanity content
 */
export function generateSanityMetadata(
  content: PageContent | ServiceData,
  fallbackTitle?: string,
  fallbackDescription?: string
): Metadata {
  const seo = content.seo;
  const title = seo?.title || content.title || fallbackTitle || SITE_CONFIG.name;
  const description =
    seo?.description ||
    fallbackDescription ||
    SITE_CONFIG.description;

  const metadata: Metadata = {
    title,
    description,
  };

  // Keywords
  if (seo?.keywords && seo.keywords.length > 0) {
    metadata.keywords = seo.keywords;
  }

  // Canonical URL
  if (seo?.canonicalUrl) {
    metadata.alternates = {
      canonical: seo.canonicalUrl,
    };
  }

  // No index
  if (seo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  // Open Graph
  if (seo?.openGraph) {
    metadata.openGraph = {
      title: seo.openGraph.title || title,
      description: seo.openGraph.description || description,
      type: 'website',
      siteName: SITE_CONFIG.name,
    };

    if (seo.openGraph.image) {
      const ogImageUrl = buildImageUrl(seo.openGraph.image, {
        width: 1200,
        height: 630,
        quality: 90,
        format: 'jpg',
        fit: 'crop',
      });

      if (ogImageUrl) {
        metadata.openGraph.images = [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: seo.openGraph.title || title,
          },
        ];
      }
    }
  }

  // Twitter
  if (seo?.twitter) {
    metadata.twitter = {
      card: 'summary_large_image',
      title: seo.twitter.title || title,
      description: seo.twitter.description || description,
    };

    if (seo.twitter.image) {
      const twitterImageUrl = buildImageUrl(seo.twitter.image, {
        width: 1200,
        height: 630,
        quality: 90,
        format: 'jpg',
        fit: 'crop',
      });

      if (twitterImageUrl) {
        metadata.twitter.images = [twitterImageUrl];
      }
    }
  }

  return metadata;
}

/**
 * Generate metadata for legacy Sanity "service" documents.
 * Public detail URLs for Beringia live under /solutions/{slug} when the slug matches the app registry; otherwise fall back to contact.
 */
const MIN_META_DESCRIPTION_LENGTH = 50;
const MAX_META_DESCRIPTION_LENGTH = 160;

export function generateServiceMetadata(service: ServiceData): Metadata {
  const rawFallback = `${service.subtitle}. ${service.description.substring(0, 150)}...`;
  const fallbackDescription =
    rawFallback.length > MAX_META_DESCRIPTION_LENGTH
      ? rawFallback.slice(0, 157) + '...'
      : rawFallback;
  const metadata = generateSanityMetadata(service, service.title, fallbackDescription);
  let description =
    typeof metadata.description === 'string' &&
    metadata.description.length < MIN_META_DESCRIPTION_LENGTH
      ? fallbackDescription
      : metadata.description;
  if (typeof description === 'string' && description.length > MAX_META_DESCRIPTION_LENGTH) {
    description = description.slice(0, 157) + '...';
  }
  return {
    ...metadata,
    description,
    alternates: {
      ...metadata.alternates,
      canonical: '/contact',
    },
    openGraph: metadata.openGraph
      ? { ...metadata.openGraph, description: typeof description === 'string' ? description : metadata.openGraph.description }
      : undefined,
    twitter: metadata.twitter
      ? { ...metadata.twitter, description: typeof description === 'string' ? description : metadata.twitter.description }
      : undefined,
  };
}

/**
 * Generate metadata for regular pages
 */
export function generatePageMetadata(page: PageContent): Metadata {
  return generateSanityMetadata(page, page.title);
}

/**
 * Extract SEO data for structured data generation
 */
export function extractSEOData(content: PageContent | ServiceData): {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
} {
  const seo = content.seo;

  return {
    title: seo?.title || content.title,
    description: seo?.description || '',
    keywords: seo?.keywords || [],
    canonicalUrl: seo?.canonicalUrl,
  };
}

/**
 * Validate SEO settings
 */
export function validateSEOSettings(seo: SEOSettings): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Title validation
  if (!seo.title) {
    errors.push('SEO title is required');
  } else {
    if (seo.title.length > 60) {
      warnings.push(`SEO title is ${seo.title.length} characters (recommended: ≤60)`);
    }
    if (seo.title.length < 30) {
      warnings.push(`SEO title is ${seo.title.length} characters (recommended: ≥30)`);
    }
  }

  // Description validation
  if (!seo.description) {
    errors.push('SEO description is required');
  } else {
    if (seo.description.length > 160) {
      warnings.push(`SEO description is ${seo.description.length} characters (recommended: ≤160)`);
    }
    if (seo.description.length < 120) {
      warnings.push(`SEO description is ${seo.description.length} characters (recommended: ≥120)`);
    }
  }

  // Keywords validation
  if (seo.keywords && seo.keywords.length > 10) {
    warnings.push(`${seo.keywords.length} keywords specified (recommended: ≤10)`);
  }

  // Open Graph validation
  if (seo.openGraph) {
    if (!seo.openGraph.title) {
      warnings.push('Open Graph title not specified (will use SEO title)');
    }
    if (!seo.openGraph.description) {
      warnings.push('Open Graph description not specified (will use SEO description)');
    }
    if (!seo.openGraph.image) {
      warnings.push('Open Graph image not specified');
    }
  } else {
    warnings.push('Open Graph settings not configured');
  }

  // Twitter validation
  if (seo.twitter) {
    if (!seo.twitter.title) {
      warnings.push('Twitter title not specified (will use SEO title)');
    }
    if (!seo.twitter.description) {
      warnings.push('Twitter description not specified (will use SEO description)');
    }
    if (!seo.twitter.image) {
      warnings.push('Twitter image not specified');
    }
  } else {
    warnings.push('Twitter Card settings not configured');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Generate SEO preview data for Sanity Studio
 */
export function generateSEOPreview(
  seo: SEOSettings,
  fallbackTitle?: string
): {
  google: {
    title: string;
    description: string;
    url: string;
  };
  facebook: {
    title: string;
    description: string;
    image?: string;
  };
  twitter: {
    title: string;
    description: string;
    image?: string;
  };
} {
  const title = seo.title || fallbackTitle || 'Untitled Page';
  const description = seo.description || 'No description provided';
  const baseUrl = getSiteUrl();

  return {
    google: {
      title: title.length > 60 ? `${title.substring(0, 57)}...` : title,
      description: description.length > 160 ? `${description.substring(0, 157)}...` : description,
      url: baseUrl,
    },
    facebook: {
      title: seo.openGraph?.title || title,
      description: seo.openGraph?.description || description,
      image: seo.openGraph?.image
        ? buildImageUrl(seo.openGraph.image, {
            width: 1200,
            height: 630,
            quality: 85,
            format: 'jpg',
          })
        : undefined,
    },
    twitter: {
      title: seo.twitter?.title || title,
      description: seo.twitter?.description || description,
      image: seo.twitter?.image
        ? buildImageUrl(seo.twitter.image, {
            width: 1200,
            height: 630,
            quality: 85,
            format: 'jpg',
          })
        : undefined,
    },
  };
}
