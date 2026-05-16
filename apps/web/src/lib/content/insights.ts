/**
 * Helpers + re-exports. Pure data lives in `./insights-data.ts` so it can be
 * imported by tools that don't have access to apps/web's `@/` aliases (e.g. the
 * Sanity migration seed script under apps/studio).
 */
import { absoluteUrl, SITE_CONFIG } from '@/lib/config/site-config';

export type {
  InsightContentType,
  InsightSection,
  InsightSEO,
  InsightEntry,
} from './insights-data';

export {
  INSIGHTS,
  INSIGHTS_LANDING,
  INSIGHT_BY_SLUG,
} from './insights-data';

import {
  INSIGHT_BY_SLUG,
  type InsightEntry,
} from './insights-data';

export function getInsightBySlug(slug: string): InsightEntry | undefined {
  return INSIGHT_BY_SLUG[slug];
}

export function getInsightPath(slug: string): string {
  return `/insights/${slug}`;
}

export function getInsightOgImage(entry: InsightEntry): string {
  const path = entry.seo.ogImage || entry.coverImage || SITE_CONFIG.defaultOgImagePath;
  return absoluteUrl(path);
}

export { INSIGHT_ARTICLE_MEDIA, type InsightArticleSlug } from './insight-media';
