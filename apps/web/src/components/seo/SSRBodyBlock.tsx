/**
 * Injects crawler-only SSR HTML at the start of body so plain fetch tools can
 * parse semantic content from the initial response. Uses pathname from header.
 * Full body expansion is scoped to /insights/[slug].
 */

import { headers } from 'next/headers';
import { getSSRContent } from '@/components/seo/ServerSideSEO';
import { getPageKeyFromPathname, buildSSRHtmlBlock } from '@/lib/seo/ssr-html';
import { getArticleBySlug } from '@/lib/data/insights';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCrawlerBodyHtml(h1: string, bodyHtml: string): string {
  const hiddenStyle =
    'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
  return `<article class="sr-only" style="${hiddenStyle}" data-seo-block="crawler"><h1>${escapeHtml(h1)}</h1>${bodyHtml}</article>`;
}

function textParagraph(value: string | null | undefined): string {
  if (!value) return '';
  const normalized = value.trim();
  if (!normalized) return '';
  return `<p>${escapeHtml(normalized)}</p>`;
}

export default async function SSRBodyBlock() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const normalized = pathname.replace(/\/$/, '') || '/';

  const insightsMatch = normalized.match(/^\/insights\/([^/]+)$/);
  if (insightsMatch) {
    try {
      const article = await getArticleBySlug(insightsMatch[1]);
      if (article) {
        const bodyHtml = article.content?.trim() || textParagraph(article.abstract);
        if (bodyHtml) {
          const html = buildCrawlerBodyHtml(article.title, bodyHtml);
          return (
            <div
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
      }
    } catch {
      // Fall through to generic SSR block.
    }
  }

  const pageKey = getPageKeyFromPathname(pathname);
  if (!pageKey) return null;
  const content = getSSRContent(pageKey);
  if (!content) return null;
  const html = buildSSRHtmlBlock(content);
  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
      aria-hidden="true"
    />
  );
}
