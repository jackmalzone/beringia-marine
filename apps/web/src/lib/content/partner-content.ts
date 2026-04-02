/**
 * Company-approved solution partner copy (verbatim JSON under ./partners/).
 * Asset strings like "bundled: src/assets/..." resolve to /assets/... public paths.
 */

import missionRobotics from './partners/mission-robotics.json';
import anchorBot from './partners/anchor-bot.json';
import advancedNavigation from './partners/advanced-navigation.json';
import type { Solution, SolutionDocument, SolutionMedia } from './solution-types';

export type PartnerJson = typeof missionRobotics | typeof anchorBot | typeof advancedNavigation;

const PARTNERS: PartnerJson[] = [advancedNavigation, anchorBot, missionRobotics];

/** Map legacy /images/clients → /assets/clients when present in verbatim */
function normalizePublicPath(path: string): string {
  if (path.startsWith('/images/clients/')) {
    return path.replace('/images/clients/', '/assets/clients/');
  }
  return path;
}

/**
 * Resolve verbatim asset references to URL paths served from /public.
 */
export function resolveAssetUrl(raw: string | undefined | null): string | null {
  if (raw == null || raw === '') return null;
  const s = String(raw).trim();
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  if (s.startsWith('/')) return normalizePublicPath(s);
  const bundled = s.match(/^bundled:\s*(.+)$/i);
  if (bundled) {
    const rest = bundled[1].trim();
    const fromSrc = rest.match(/^src\/assets\/(.+)$/i);
    if (fromSrc) return `/assets/${fromSrc[1]}`;
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return normalizePublicPath(s.startsWith('/') ? s : `/${s}`);
}

export function getPartnerBySlug(slug: string): PartnerJson | undefined {
  return PARTNERS.find((p) => p.slug === slug);
}

export function getPartnerOgImage(partner: PartnerJson): string {
  const og = partner.seo?.ogImage;
  if (typeof og === 'string' && og.includes('bundled')) {
    const fromOg = resolveAssetUrl(og);
    if (fromOg) return fromOg;
    const header = resolveAssetUrl(partner.headerImage as string);
    if (header) return header;
  }
  if (typeof og === 'string' && og.length > 0 && !og.includes('bundled')) {
    return normalizePublicPath(og);
  }
  const header = resolveAssetUrl(partner.headerImage as string);
  return header || '/assets/beringia/logo-solid.svg';
}

/** Summaries for /solutions index — aligns with Solution shape */
export function getSolutionSummariesFromPartners(): Solution[] {
  return PARTNERS.map(partnerToSolutionSummary);
}

function partnerToSolutionSummary(partner: PartnerJson): Solution {
  const header = resolveAssetUrl(partner.headerImage as string) || '/assets/beringia/logo-solid.svg';
  const images: SolutionMedia['images'] = [{ src: header, alt: partner.overview?.title || partner.name }];

  const applications =
    'useCases' in partner && partner.useCases?.cases?.length
      ? partner.useCases.cases.map((c) => c.title)
      : [];

  const tagline =
    partner.seo?.description?.split('.').slice(0, 1).join('.').trim() ||
    partner.overview?.description?.slice(0, 120) ||
    partner.name;

  return {
    name: partner.name,
    slug: partner.slug,
    tagline,
    shortDescription: partner.overview?.description || '',
    fullDescription: partner.overview?.description || '',
    capabilities: [],
    valueProposition: [],
    applications,
    deploymentContexts: [],
    strategicAdvantages: [],
    commercializationSupport: [],
    media: { images },
    mediaPlan: {
      imageStatus: 'ready',
      videoStatus: 'none',
      sketchfabStatus: 'none',
      documentationStatus: 'linked',
    },
    externalLinks: [],
    seo: {
      title: partner.seo?.title || `${partner.name} | Beringia Marine`,
      description: partner.seo?.description || '',
      ogImage: getPartnerOgImage(partner),
    },
  };
}

export type SellingPointDoc = {
  specs?: string;
  manual?: string;
  benthicSurvey?: string;
};

export function sellingPointDocLinks(doc: SellingPointDoc | undefined): SolutionDocument[] {
  if (!doc) return [];
  const out: SolutionDocument[] = [];
  if (doc.specs) {
    const href = resolveAssetUrl(doc.specs) || doc.specs;
    out.push({ label: 'Datasheet / specs', href });
  }
  if (doc.manual) {
    out.push({ label: 'Manual / docs', href: doc.manual });
  }
  if (doc.benthicSurvey) {
    out.push({ label: 'Evaluation / reference', href: doc.benthicSurvey });
  }
  return out;
}
