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
  type InsightEntry,
} from '@/lib/content/insights';
import {
  getPartnerBySlug as getStaticPartnerBySlug,
  type PartnerJson,
} from '@/lib/content/partner-content';

import { getInsightBySlug, getPartnerBySlug } from './queries';
import { adaptInsight, adaptPartner } from './adapters';

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
