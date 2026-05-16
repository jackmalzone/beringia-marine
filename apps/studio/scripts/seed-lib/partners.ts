import { sanity } from './client';
import { uploadImageAsset, imageRef } from './assets';
import {
  resolveAssetUrl,
  type PartnerJson,
} from '../../../web/src/lib/content/partner-content';
import advancedNavigation from '../../../web/src/lib/content/partners/advanced-navigation.json';
import anchorBot from '../../../web/src/lib/content/partners/anchor-bot.json';
import missionRobotics from '../../../web/src/lib/content/partners/mission-robotics.json';

const PARTNERS: PartnerJson[] = [advancedNavigation, anchorBot, missionRobotics] as PartnerJson[];

function tagline(partner: PartnerJson): string {
  return (
    partner.seo?.description?.split('.').slice(0, 1).join('.').trim() ||
    partner.overview?.description?.slice(0, 200) ||
    partner.name
  );
}

async function uploadOptionalIcon(raw: string | undefined | null) {
  const url = resolveAssetUrl(raw ?? null);
  if (!url) return null;
  return uploadImageAsset(url);
}

export async function buildPartnerDocument(partner: PartnerJson) {
  const header = await uploadImageAsset(resolveAssetUrl(partner.headerImage as string));

  const sellingPointsPoints = await Promise.all(
    (partner.sellingPoints?.points || []).map(async (p) => {
      const icon = await uploadOptionalIcon(p.icon as string | undefined);
      return {
        _key: p.id || p.title,
        _type: 'sellingPoint' as const,
        title: p.title,
        description: p.description,
        features: p.features || [],
        ...(icon ? { icon: imageRef(icon._id, p.title) } : {}),
      };
    })
  );

  const useCases = (partner.useCases?.cases || []).map((c) => ({
    _key: c.id || c.title,
    _type: 'useCase' as const,
    title: c.title,
    description: c.description,
    keyPoints: c.keyPoints || [],
  }));

  return {
    _id: `partner.${partner.slug}`,
    _type: 'partner' as const,
    name: partner.name,
    slug: { _type: 'slug' as const, current: partner.slug },
    tagline: tagline(partner),
    ...(header ? { headerImage: imageRef(header._id, partner.name) } : {}),
    overview: partner.overview
      ? {
          title: partner.overview.title || partner.name,
          description: partner.overview.description || '',
        }
      : undefined,
    sellingPoints: partner.sellingPoints
      ? {
          title: partner.sellingPoints.title || 'Core Technology',
          points: sellingPointsPoints,
        }
      : undefined,
    useCases: partner.useCases
      ? {
          title: partner.useCases.title || 'Applications',
          description: partner.useCases.description || '',
          cases: useCases,
        }
      : undefined,
    valueProposition: partner.valueProposition
      ? {
          title: partner.valueProposition.title || 'Value',
          description: partner.valueProposition.description || '',
          highlights: partner.valueProposition.highlights || [],
        }
      : undefined,
    status: 'active' as const,
    featured: false,
    seo: {
      _type: 'seoSettings' as const,
      title: partner.seo?.title,
      description: partner.seo?.description,
    },
  };
}

export async function seedPartners(opts: { dryRun: boolean }): Promise<number> {
  console.log(`[partners] seeding ${PARTNERS.length} entries…`);
  let count = 0;
  for (const partner of PARTNERS) {
    try {
      const doc = await buildPartnerDocument(partner);
      if (opts.dryRun) {
        console.log(`  · ${doc._id}  — dry run, not written`);
      } else {
        await sanity.createOrReplace(doc);
        console.log(`  · ${doc._id}  ✓`);
      }
      count++;
    } catch (error) {
      console.error(`  · ${partner.slug}  ✗`, error);
    }
  }
  return count;
}

