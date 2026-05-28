/**
 * Sanity-first content resolvers with static fallback.
 *
 * - Detail-route helpers attempt the live Sanity dataset first.
 * - If Sanity returns null (missing doc, unconfigured client, or fetch error),
 *   we fall back to the verbatim static content under `@/lib/content/`.
 *
 * Callers receive a unified shape (matches the existing static entries plus
 * a resolved `bodyHtml` for insights) so route components don't have to
 * branch on the data source.
 */
import { getInsightBodyHtml } from '@/lib/content/insights/insight-bodies.server';
import {
  getInsightBySlug as getStaticInsightBySlug,
  INSIGHTS as STATIC_INSIGHTS,
  type InsightEntry,
} from '@/lib/content/insights';
import {
  getPartnerBySlug as getStaticPartnerBySlug,
  solutionSummariesFrom,
  type PartnerJson,
} from '@/lib/content/partner-content';
import { SOLUTIONS as STATIC_SOLUTIONS } from '@/lib/content/solutions';
import type { Solution } from '@/lib/content/solution-types';

import { getInsightBySlug, getAllInsights, getPartnerBySlug, getAllPartners } from './queries';
import { adaptInsight, adaptInsightSummary, adaptPartner } from './adapters';

export type ResolvedInsight = InsightEntry & { bodyHtml: string };

export async function resolveInsightBySlug(slug: string): Promise<ResolvedInsight | null> {
  const fromSanity = await getInsightBySlug(slug);
  if (fromSanity) {
    return adaptInsight(fromSanity);
  }
  const fromStatic = getStaticInsightBySlug(slug);
  if (!fromStatic) return null;
  return {
    ...fromStatic,
    bodyHtml: getInsightBodyHtml(slug) || '',
  };
}

export async function resolvePartnerBySlug(slug: string): Promise<PartnerJson | null> {
  const fromSanity = await getPartnerBySlug(slug);
  if (fromSanity) {
    return adaptPartner(fromSanity);
  }
  return getStaticPartnerBySlug(slug) ?? null;
}

/** All insights as summary entries — Sanity first, static registry fallback. */
export async function resolveAllInsights(): Promise<InsightEntry[]> {
  const fromSanity = await getAllInsights();
  if (fromSanity.length > 0) {
    return fromSanity.map(adaptInsightSummary);
  }
  return STATIC_INSIGHTS;
}

/** All solutions (partner summaries) — Sanity first, static registry fallback. */
export async function resolveAllSolutions(): Promise<Solution[]> {
  const fromSanity = await getAllPartners();
  if (fromSanity.length > 0) {
    return solutionSummariesFrom(fromSanity.map(adaptPartner));
  }
  return STATIC_SOLUTIONS;
}
