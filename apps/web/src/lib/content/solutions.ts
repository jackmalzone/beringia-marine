import { absoluteUrl, SITE_CONFIG } from '@/lib/config/site-config';
import {
  getPartnerBySlug,
  getPartnerOgImage,
  getSolutionSummariesFromPartners,
} from './partner-content';
import type { Solution } from './solution-types';

export type {
  Solution,
  SolutionDocument,
  SolutionExternalLink,
  SolutionMedia,
  SolutionMediaPlan,
  SolutionSEO,
} from './solution-types';

/** Index cards + legacy helpers — built from verbatim partner JSON */
export const SOLUTIONS: Solution[] = getSolutionSummariesFromPartners();

export const SOLUTION_BY_SLUG: Record<string, Solution> = Object.fromEntries(
  SOLUTIONS.map((solution) => [solution.slug, solution])
);

export function getSolutionBySlug(slug: string): Solution | undefined {
  return SOLUTION_BY_SLUG[slug];
}

export function getSolutionOgImage(solution: Solution): string {
  const partner = getPartnerBySlug(solution.slug);
  if (partner) {
    const path = getPartnerOgImage(partner);
    return absoluteUrl(path);
  }
  const path = solution.seo.ogImage || SITE_CONFIG.defaultOgImagePath;
  return absoluteUrl(path);
}
