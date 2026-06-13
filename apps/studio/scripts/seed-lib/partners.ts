import { sanity } from './client';
import { uploadImageAsset, imageRef } from './assets';
import { withRetry } from './retry';
import {
  resolveAssetUrl,
  type PartnerJson,
} from '../../../web/src/lib/content/partner-content';
import advancedNavigation from '../../../web/src/lib/content/partners/advanced-navigation.json';
import anchorBot from '../../../web/src/lib/content/partners/anchor-bot.json';
import missionRobotics from '../../../web/src/lib/content/partners/mission-robotics.json';
import independentRobotics from '../../../web/src/lib/content/partners/independent-robotics.json';

const PARTNERS: PartnerJson[] = [
  advancedNavigation,
  anchorBot,
  missionRobotics,
  independentRobotics,
] as unknown as PartnerJson[];

/** Loose view of the partner JSON — captures optional fields that only some partners have. */
type LoosePartner = {
  logo?: string;
  logoTreatment?: string;
  modelId?: string;
  clientPageInteractiveCopy?: { title?: string; description?: string };
  demo?: { title?: string; description?: string; videoUrl?: string };
  gallery?: Array<{
    id?: string;
    type?: string;
    alt?: string;
    bundledAsset?: string;
    modelId?: string;
  }>;
  mediaLinks?: {
    website?: string;
    email?: string;
    linkedin?: string;
    youtube?: string;
    sketchfab?: string;
  };
  sellingPoints?: {
    title?: string;
    points?: Array<{
      id?: string;
      title: string;
      description?: string;
      features?: string[];
      icon?: string;
      link?: string;
      documentation?: { specs?: string; manual?: string; benthicSurvey?: string };
    }>;
  };
};

function tagline(partner: PartnerJson): string {
  return (
    partner.seo?.description?.split('.').slice(0, 1).join('.').trim() ||
    partner.overview?.description?.slice(0, 200) ||
    partner.name
  );
}

async function uploadOptionalImage(raw: string | undefined | null) {
  const url = resolveAssetUrl(raw ?? null);
  if (!url) return null;
  return uploadImageAsset(url);
}

type Documentation = { specs?: string; manual?: string; benthicSurvey?: string };

function cleanDocumentation(doc: Documentation | undefined): Documentation | undefined {
  if (!doc) return undefined;
  const out: Documentation = {};
  if (doc.specs) out.specs = doc.specs;
  if (doc.manual) out.manual = doc.manual;
  if (doc.benthicSurvey) out.benthicSurvey = doc.benthicSurvey;
  return Object.keys(out).length ? out : undefined;
}

export async function buildPartnerDocument(partner: PartnerJson) {
  const loose = partner as unknown as LoosePartner;

  const header = await uploadImageAsset(resolveAssetUrl(partner.headerImage as string));
  const logo = await uploadOptionalImage(loose.logo);

  const sellingPointsPoints = await Promise.all(
    (loose.sellingPoints?.points || []).map(async (p) => {
      const icon = await uploadOptionalImage(p.icon);
      const documentation = cleanDocumentation(p.documentation);
      return {
        _key: p.id || p.title,
        _type: 'sellingPoint' as const,
        title: p.title,
        description: p.description,
        features: p.features || [],
        ...(icon ? { icon: imageRef(icon._id, p.title) } : {}),
        ...(p.link ? { link: p.link } : {}),
        ...(documentation ? { documentation } : {}),
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

  // Gallery: upload image items, pass through sketchfab items.
  const gallery = (
    await Promise.all(
      (loose.gallery || []).map(async (item, idx) => {
        if (item.type === 'sketchfab' && item.modelId) {
          return {
            _key: item.id || `model-${idx}`,
            _type: 'gallerySketchfab' as const,
            modelId: item.modelId,
            alt: item.alt || '',
          };
        }
        const asset = await uploadOptionalImage(item.bundledAsset);
        if (!asset) return null;
        return {
          _key: item.id || `image-${idx}`,
          _type: 'galleryImage' as const,
          image: imageRef(asset._id, item.alt || ''),
        };
      })
    )
  ).filter((x): x is NonNullable<typeof x> => x !== null);

  const demoVideoUrl = loose.demo?.videoUrl ? resolveAssetUrl(loose.demo.videoUrl) : null;

  return {
    _id: `partner.${partner.slug}`,
    _type: 'partner' as const,
    name: partner.name,
    slug: { _type: 'slug' as const, current: partner.slug },
    tagline: tagline(partner),
    ...(header ? { headerImage: imageRef(header._id, partner.name) } : {}),
    ...(logo ? { logo: imageRef(logo._id, `${partner.name} logo`) } : {}),
    ...(loose.logoTreatment ? { logoTreatment: loose.logoTreatment } : {}),
    overview: partner.overview
      ? {
          title: partner.overview.title || partner.name,
          description: partner.overview.description || '',
        }
      : undefined,
    sellingPoints: loose.sellingPoints
      ? {
          title: loose.sellingPoints.title || 'Core Technology',
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
    ...(loose.mediaLinks
      ? {
          mediaLinks: {
            ...(loose.mediaLinks.website ? { website: loose.mediaLinks.website } : {}),
            ...(loose.mediaLinks.email ? { email: loose.mediaLinks.email } : {}),
            ...(loose.mediaLinks.linkedin ? { linkedin: loose.mediaLinks.linkedin } : {}),
            ...(loose.mediaLinks.youtube ? { youtube: loose.mediaLinks.youtube } : {}),
            ...(loose.mediaLinks.sketchfab ? { sketchfab: loose.mediaLinks.sketchfab } : {}),
          },
        }
      : {}),
    ...(loose.modelId ? { sketchfabModelId: loose.modelId } : {}),
    ...(loose.clientPageInteractiveCopy
      ? {
          interactiveCopy: {
            title: loose.clientPageInteractiveCopy.title,
            description: loose.clientPageInteractiveCopy.description,
          },
        }
      : {}),
    ...(loose.demo
      ? {
          demo: {
            title: loose.demo.title,
            description: loose.demo.description,
            ...(demoVideoUrl ? { videoUrl: demoVideoUrl } : {}),
          },
        }
      : {}),
    ...(gallery.length ? { gallery } : {}),
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
      const galleryCount = Array.isArray(doc.gallery) ? doc.gallery.length : 0;
      if (opts.dryRun) {
        console.log(`  · ${doc._id}  (gallery: ${galleryCount})  — dry run, not written`);
      } else {
        await withRetry(() => sanity.createOrReplace(doc), doc._id);
        console.log(`  · ${doc._id}  ✓  (gallery: ${galleryCount})`);
      }
      count++;
    } catch (error) {
      console.error(`  · ${partner.slug}  ✗`, error);
    }
  }
  return count;
}
