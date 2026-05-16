/**
 * Injects crawler-only SSR HTML at the start of body so plain fetch tools can
 * parse semantic content from the initial response. Uses pathname from header.
 * Full body expansion is scoped to /insights/[slug].
 */

import { headers } from 'next/headers';
import { getSSRContent } from '@/components/seo/ServerSideSEO';
import { getPageKeyFromPathname, buildSSRHtmlBlock } from '@/lib/seo/ssr-html';
import { getInsightBySlug } from '@/lib/content/insights';
import { getInsightBodyHtml } from '@/lib/content/insights/insight-bodies.server';

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

export default async function SSRBodyBlock() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const normalized = pathname.replace(/\/$/, '') || '/';

  const insightsMatch = normalized.match(/^\/insights\/([^/]+)$/);
  if (insightsMatch) {
    const slug = insightsMatch[1];
    try {
      // Static Beringia insights (content/insights registry + verbatim HTML) — avoid Sanity/mock path
      const staticEntry = getInsightBySlug(slug);
      if (staticEntry) {
        const bodyHtml = getInsightBodyHtml(slug)?.trim();
        if (bodyHtml) {
          const html = buildCrawlerBodyHtml(staticEntry.title, bodyHtml);
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
