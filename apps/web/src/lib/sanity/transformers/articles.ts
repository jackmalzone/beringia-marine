import { toHTML } from '@portabletext/to-html';
import type { ArticleData, Author, ArticleCategory } from '@/types/insights';
import { urlFor } from '@/sanity/lib/image';
import type { PortableTextBlock } from '@portabletext/types';
import { sanitizeCmsHtml } from '@/lib/utils/sanitizeHtml';

/** Escape HTML special characters for safe output */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanity article data structure (raw from API)
 */
interface SanityArticle {
  _id: string;
  title: string;
  subtitle?: string;
  abstract?: string;
  content: PortableTextBlock[];
  category?: string;
  author?: {
    name: string;
    bio?: string;
    role?: string;
    avatar?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  } | string;
  publishDate: string;
  publishAt?: string;
  status: 'draft' | 'published' | 'scheduled';
  coverImage?: string;
  heroImage?: string;
  heroImageSplit?: {
    left?: string;
    right?: string;
  };
  tags?: string[];
  slug?: string;
  pdfUrl?: string;
  readingTime?: number;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    keywords?: string[];
    twitterImage?: string;
  };
}

/**
 * Convert Portable Text to HTML
 */
function convertPortableTextToHtml(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return '';
  }

  try {
    return toHTML(blocks as any, {
      components: {
        types: {
          image: ({ value }: { value: any }) => {
            if (!value?.asset) return '';
            const imageUrl = urlFor(value).url();
            const alt = value.alt || '';
            const caption = value.caption ? `<figcaption>${value.caption}</figcaption>` : '';
            return `<figure><img src="${imageUrl}" alt="${alt}" />${caption}</figure>`;
          },
          tableBlock: ({ value }: { value: any }) => {
            const rows = value?.rows;
            if (!rows || !Array.isArray(rows) || rows.length === 0) return '';
            const useHeader = value?.useFirstRowAsHeader !== false;
            const caption = value?.caption ? `<caption>${escapeHtml(value.caption)}</caption>` : '';
            const headerRow =
              useHeader && rows[0]?.cells?.length
                ? `<thead><tr>${rows[0].cells.map((c: string) => `<th>${escapeHtml(String(c ?? ''))}</th>`).join('')}</tr></thead>`
                : '';
            const bodyRows = useHeader ? rows.slice(1) : rows;
            const bodyHtml =
              bodyRows.length > 0
                ? `<tbody>${bodyRows
                    .map(
                      (row: { cells?: string[] }) =>
                        `<tr>${(row.cells ?? []).map((c: string) => `<td>${escapeHtml(String(c ?? ''))}</td>`).join('')}</tr>`
                    )
                    .join('')}</tbody>`
                : '';
            return `<figure>${caption}<table>${headerRow}${bodyHtml}</table></figure>`;
          },
        },
        marks: {
          link: ({ value, children }: { value: any; children: any }) => {
            const href = value?.href || '#';
            const target = value?.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${href}"${target}>${children}</a>`;
          },
        },
      },
    });
  } catch (error) {
    console.error('Error converting Portable Text to HTML:', error);
    return '';
  }
}

function containsUnsafeHtmlSignature(html: string): boolean {
  return /<script\b|javascript:/i.test(html);
}

/**
 * Transform Sanity article to ArticleData format
 */
export function transformArticle(sanityArticle: SanityArticle): ArticleData {
  // Handle author - can be object or string
  let author: string | Author;
  if (typeof sanityArticle.author === 'string') {
    author = sanityArticle.author;
  } else if (sanityArticle.author && typeof sanityArticle.author === 'object') {
    author = {
      name: sanityArticle.author.name || 'Editorial Team',
      bio: sanityArticle.author.bio,
      role: sanityArticle.author.role,
      avatar: sanityArticle.author.avatar,
      social: sanityArticle.author.social,
    };
  } else {
    author = 'Editorial Team';
  }

  // Convert Portable Text content to HTML
  const htmlContent = sanitizeCmsHtml(convertPortableTextToHtml(sanityArticle.content));
  if (process.env.NODE_ENV === 'development' && containsUnsafeHtmlSignature(htmlContent)) {
    console.warn(
      `Sanitized article HTML still contains unsafe signature for article ${sanityArticle.slug || sanityArticle._id}`
    );
  }

  // Handle category - ensure it's a valid ArticleCategory
  const category = (sanityArticle.category as ArticleCategory) || 'Wellness Article';

  // Build ArticleData object
  const article: ArticleData = {
    id: sanityArticle._id,
    title: sanityArticle.title,
    subtitle: sanityArticle.subtitle || '',
    abstract: sanityArticle.abstract || '',
    content: htmlContent,
    category,
    author,
    publishDate: sanityArticle.publishDate || new Date().toISOString().split('T')[0],
    publishAt: sanityArticle.publishAt,
    status: sanityArticle.status || 'published',
    coverImage: sanityArticle.coverImage || '',
    heroImage: sanityArticle.heroImage,
    heroImageSplit: sanityArticle.heroImageSplit?.left && sanityArticle.heroImageSplit?.right
      ? {
          left: sanityArticle.heroImageSplit.left,
          right: sanityArticle.heroImageSplit.right,
        }
      : undefined,
    tags: sanityArticle.tags || [],
    slug: sanityArticle.slug || '',
    pdfUrl: sanityArticle.pdfUrl,
    readingTime: sanityArticle.readingTime,
    seo: sanityArticle.seo
      ? {
          title: sanityArticle.seo.title,
          description: sanityArticle.seo.description,
          ogImage: sanityArticle.seo.ogImage || undefined,
          keywords: sanityArticle.seo.keywords || undefined,
        }
      : undefined,
  };

  return article;
}

/**
 * Transform array of Sanity articles to ArticleData array
 */
export function transformArticles(sanityArticles: SanityArticle[]): ArticleData[] {
  return sanityArticles.map(transformArticle);
}
