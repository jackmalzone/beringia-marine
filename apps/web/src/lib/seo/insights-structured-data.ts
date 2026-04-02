import { absoluteUrl, SITE_CONFIG } from '@/lib/config/site-config';
import type { InsightEntry } from '@/lib/content/insights';

export function buildInsightsCollectionSchema(entries: InsightEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Insights',
    description: 'Beringia Marine insights, white papers, and technical thought pieces.',
    url: absoluteUrl('/insights'),
    about: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: absoluteUrl('/'),
    },
    hasPart: entries.map((entry) => ({
      '@type': 'Article',
      headline: entry.title,
      url: absoluteUrl(`/insights/${entry.slug}`),
      datePublished: entry.publishedAt,
      ...(entry.author ? { author: { '@type': 'Person', name: entry.author } } : {}),
    })),
  };
}

export function buildInsightArticleSchema(entry: InsightEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.seo.description,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt || entry.publishedAt,
    url: absoluteUrl(`/insights/${entry.slug}`),
    image: [absoluteUrl(entry.seo.ogImage || entry.coverImage || SITE_CONFIG.defaultOgImagePath)],
    articleSection: entry.category,
    ...(entry.readingTime ? { timeRequired: `PT${entry.readingTime}M` } : {}),
    keywords: entry.tags || [],
    author: entry.author
      ? {
          '@type': 'Person',
          name: entry.author,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(SITE_CONFIG.logoPath),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/insights/${entry.slug}`),
    },
  };
}
