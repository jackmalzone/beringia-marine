/**
 * Adapt Sanity documents into the existing static-content shapes consumed by
 * Beringia routes. Routes don't need to know whether content came from Sanity
 * or the verbatim TS/JSON registries — the adapter unifies the two paths.
 */
import { toHTML, type PortableTextHtmlComponents } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';

import type { InsightEntry } from '@/lib/content/insights';
import type { PartnerJson } from '@/lib/content/partner-content';
import { urlForString } from './image';
import type {
  SanityImageWithAlt,
  SanityInsight,
  SanityPartner,
} from './types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveImageUrl(image: SanityImageWithAlt | undefined, width?: number): string | null {
  if (!image?.asset) return null;
  if (image.asset.url) return image.asset.url;
  return urlForString(image, width ? { width, quality: 85 } : undefined);
}

const portableTextComponents: Partial<PortableTextHtmlComponents> = {
  types: {
    figure: ({ value }) => {
      const src = resolveImageUrl(value?.image, 1200);
      if (!src) return '';
      const alt = escapeHtml(value?.image?.alt || '');
      const caption = value?.caption
        ? `<p class="article__figure-caption">${escapeHtml(value.caption)}</p>`
        : '';
      return `<div class="article__figure"><img src="${src}" alt="${alt}" loading="lazy" />${caption}</div>`;
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = escapeHtml(value?.href || '#');
      const target = value?.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${target}>${children}</a>`;
    },
  },
};

export function portableTextToHtml(body: PortableTextBlock[] | undefined): string {
  if (!body || body.length === 0) return '';
  return toHTML(body, { components: portableTextComponents });
}

/** Adapt a SanityInsight into the InsightEntry shape used by the existing /insights routes. */
export function adaptInsight(insight: SanityInsight): InsightEntry & { bodyHtml: string } {
  const coverUrl = resolveImageUrl(insight.coverImage, 1600) || '';
  const ogUrl = resolveImageUrl(insight.seo?.ogImage, 1200) || coverUrl;

  const publishedAt = insight.publishedAt;
  const displayDate = formatDisplayDate(publishedAt);

  return {
    title: insight.title,
    slug: insight.slug.current,
    category: insight.category,
    excerpt: insight.excerpt,
    deck: insight.deck,
    publishedAt,
    updatedAt: insight.updatedAt,
    displayDate,
    author: insight.author,
    coverImage: coverUrl,
    tags: insight.tags || [],
    readingTime: insight.readingTime,
    featured: !!insight.featured,
    contentType: insight.contentType,
    sections: [],
    pdfUrl: insight.pdfUrl,
    seo: {
      title: insight.seo?.title || `${insight.title} | Beringia Marine`,
      description: insight.seo?.description || insight.excerpt,
      ogImage: ogUrl,
    },
    bodyHtml: portableTextToHtml(insight.body),
  };
}

/** Adapt a SanityPartner into the PartnerJson shape used by the existing /solutions routes. */
export function adaptPartner(partner: SanityPartner): PartnerJson {
  const headerImageUrl = resolveImageUrl(partner.headerImage, 1600) || '';
  const ogUrl = resolveImageUrl(partner.seo?.ogImage, 1200) || headerImageUrl;

  return {
    sourceFile: `sanity:${partner._id}`,
    id: partner.slug.current,
    name: partner.name,
    slug: partner.slug.current,
    seo: {
      title: partner.seo?.title || `${partner.name} | Beringia Marine`,
      description: partner.seo?.description || partner.tagline || partner.overview?.description || '',
      ogImage: ogUrl,
    },
    overview: {
      title: partner.overview?.title || partner.name,
      description: partner.overview?.description || '',
    },
    sellingPoints: partner.sellingPoints
      ? {
          title: partner.sellingPoints.title || 'Core Technology',
          points: (partner.sellingPoints.points || []).map((p, idx) => ({
            id: slugify(p.title) || `point-${idx}`,
            title: p.title,
            description: p.description || '',
            features: p.features || [],
            icon: resolveImageUrl(p.icon as SanityImageWithAlt | undefined, 400) || '',
          })),
        }
      : undefined,
    useCases: partner.useCases
      ? {
          title: partner.useCases.title || 'Applications',
          description: partner.useCases.description || '',
          cases: (partner.useCases.cases || []).map((c, idx) => ({
            id: slugify(c.title) || `case-${idx}`,
            title: c.title,
            description: c.description || '',
            keyPoints: c.keyPoints || [],
          })),
        }
      : undefined,
    valueProposition: partner.valueProposition
      ? {
          title: partner.valueProposition.title || 'Value',
          description: partner.valueProposition.description || '',
          highlights: partner.valueProposition.highlights || [],
        }
      : undefined,
    headerImage: headerImageUrl,
    documentation: partner.documents,
    externalLinks: partner.externalLinks,
  } as PartnerJson;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function formatDisplayDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}
