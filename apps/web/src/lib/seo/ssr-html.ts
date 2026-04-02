/**
 * SSR HTML block for crawlers: pathname → pageKey, and raw HTML string.
 * Used by layout to inject literal <h1> + content into the first response chunk.
 */

export type SSRPageKey =
  | 'home'
  | 'solutions'
  | 'about'
  | 'contact'
  | 'terms'
  | 'insights';

export interface SSRContent {
  h1: string;
  content: string;
}

const PATH_TO_PAGE_KEY: Record<string, SSRPageKey> = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contact',
  '/solutions': 'solutions',
  '/terms': 'terms',
  '/insights': 'insights',
};

/**
 * Get pageKey for a pathname. /insights and /insights/[slug] return 'insights' so crawler sees one H1 + content.
 */
export function getPageKeyFromPathname(pathname: string): SSRPageKey | null {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (PATH_TO_PAGE_KEY[normalized] != null) return PATH_TO_PAGE_KEY[normalized];
  if (normalized.startsWith('/insights')) return 'insights';
  if (normalized.startsWith('/solutions/')) return 'solutions';
  return null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Build the crawler-visible SSR block as a single HTML string (literal <h1> and <p>).
 */
export function buildSSRHtmlBlock(content: SSRContent): string {
  const h1 = escapeHtml(content.h1);
  const p = escapeHtml(content.content);
  return `<div class="sr-only" aria-hidden="true"><h1>${h1}</h1><p>${p}</p></div>`;
}
