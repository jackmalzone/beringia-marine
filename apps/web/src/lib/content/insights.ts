import { absoluteUrl, SITE_CONFIG } from '@/lib/config/site-config';

export type InsightContentType = 'article' | 'white-paper' | 'hybrid';

export interface InsightSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface InsightSEO {
  title: string;
  description: string;
  ogImage?: string;
}

export interface InsightEntry {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  deck?: string;
  publishedAt: string;
  updatedAt?: string;
  displayDate: string;
  author?: string;
  coverImage: string;
  tags?: string[];
  readingTime?: number;
  featured?: boolean;
  contentType: InsightContentType;
  /** Used when verbatim HTML is not used (fallback sections). */
  sections: InsightSection[];
  pdfUrl?: string;
  seo: InsightSEO;
  notes?: string[];
}

export const INSIGHTS_LANDING = {
  title: 'Insights',
  subtitle:
    'Deep currents of thought, discovery, and engineering. Explore the minds and missions shaping the future of marine technology.',
  seo: {
    title: 'Marine Technology Insights | Beringia Marine',
    description:
      'Explore articles, case studies, white papers, and field notes on marine technology, autonomous underwater vehicles, and ocean exploration innovation.',
    ogImage: '/og-image.jpeg',
  },
} as const;

/**
 * Canonical insights registry. Listing copy matches migration/beringia/copy/insights/articles-index.json.
 * Full article bodies: migration verbatim HTML → apps/web/src/lib/content/insights/bodies/ (see insight-bodies.server.ts).
 *
 * **Media to host under `public/`:** see `insight-media.ts` (hero cover, inline figures, OG images).
 */
export const INSIGHTS: InsightEntry[] = [
  {
    title:
      'AnchorBot TEAMER Helical Anchors Install & Pull Strength Test Report',
    slug: 'anchorbot-teamer-pull-strength-report',
    category: 'Field Report',
    excerpt:
      'Offshore field trials near Sequim, Washington (December 2025) demonstrate AnchorBot helical installation and characterize pull resistance using normalized installation torque and pull-test data at Bay and Channel sites. Progressive mobilization, sequential pulls, sustained-load dwell, and cross-site behavior are summarized for TEAMER-relevant marine conditions.',
    deck:
      'TEAMER facility trials: normalized torque and pull analysis, sequential and sustained loading, Bay vs Channel — AnchorBot LLC & Beringia Marine',
    publishedAt: '2026-04-06',
    updatedAt: '2026-04-06',
    displayDate: 'April 6, 2026',
    author: 'Chris Malzone, Principal Consultant / Beringia Marine, Inc',
    coverImage: '/assets/insights/anchorbot-teamer-pull-strength-report/hero-coastal-panorama.png',
    tags: [
      'AnchorBot',
      'TEAMER',
      'Helical anchors',
      'Pull testing',
      'Sequim',
      'Marine mooring',
      'Field operations',
      'PNNL',
    ],
    readingTime: 35,
    featured: true,
    contentType: 'article',
    sections: [],
    seo: {
      title:
        'AnchorBot TEAMER Helical Anchors Install & Pull Strength Test Report | Beringia Marine',
      description:
        'Field operations report: AnchorBot and Beringia Marine helical anchor install and pull tests at TEAMER Sequim sites, with normalized torque and pull figures and cross-site interpretation.',
      ogImage: '/assets/insights/anchorbot-teamer-pull-strength-report/hero-coastal-panorama.png',
    },
  },
  {
    title:
      'From Fragmented Integration to Operational Reliability: A Unified Marine Vehicle Operating Architecture',
    slug: 'unified-marine-vehicle-operating-architecture',
    category: 'White Paper',
    excerpt:
      'Marine robotics has advanced at the component level, yet integration complexity—not hardware—is the primary constraint on commercial deployment. This paper presents Mission Robotics’ NadirOS and Mission Dock: an integrated vehicle operating system and a fault-observable, domain-isolated electrical and communications backbone built on open standards.',
    deck: 'Mission Dock, NadirOS, NavX, DDS, and why operational reliability beats acquisition cost for marine platforms',
    publishedAt: '2026-04-01',
    updatedAt: '2026-04-01',
    displayDate: 'April 1, 2026',
    author: 'Chris Malzone, Beringia Marine Inc / Mission Robotics Inc.',
    coverImage: '/assets/insights/unified-marine-architecture/hero-sunken-ship-116m.png',
    tags: [
      'Marine robotics',
      'ROV architecture',
      'NadirOS',
      'Mission Robotics',
      'Mission Dock',
      'DDS',
      'Operational reliability',
      'Vehicle operating systems',
    ],
    readingTime: 28,
    featured: true,
    contentType: 'white-paper',
    sections: [],
    seo: {
      title:
        'Unified Marine Vehicle Operating Architecture | NadirOS & Mission Dock | Beringia Marine',
      description:
        'From fragmented stacks to operational reliability: NadirOS, Mission Dock, NavX, DDS-based messaging, and fault-isolated subsea integration—by Chris Malzone (Beringia Marine / Mission Robotics).',
      ogImage: '/assets/insights/unified-marine-architecture/hero-sunken-ship-116m.png',
    },
  },
  {
    title: 'Justification Report: Deploying AnchorBot™ Helical Anchors for Alaska Mariculture',
    slug: 'anchorbot-helical-anchors-alaska-mariculture',
    category: 'White Paper',
    excerpt:
      "Alaska's kelp farming sector is at an inflection point. Farms are scaling from pilot plots to commercial-scale operations, but their ability to optimize growth area is limited by anchoring methods. AnchorBot™ presents a new solution: a remotely operated vehicle designed to install helical anchors that can unlock two to four times more usable acreage within existing leases.",
    deck: "How helical anchoring technology can unlock 2-4x more usable acreage and transform Alaska's kelp farming economics",
    publishedAt: '2025-10-08',
    updatedAt: '2025-10-08',
    displayDate: 'October 8, 2025',
    author: 'Chris Malzone, Principal Consultant, Beringia Marine Inc',
    coverImage: '/assets/anchor-bot/mariculture-seaweed-alaska.png',
    tags: [
      'AnchorBot',
      'Helical Anchors',
      'Alaska',
      'Mariculture',
      'Kelp Farming',
      'ROV',
      'Aquaculture',
    ],
    readingTime: 9,
    featured: true,
    contentType: 'white-paper',
    sections: [],
    pdfUrl:
      'https://pub-264ce0c4c88b4573839aee612dbbfd27.r2.dev/2025-AnchorBot-Alaska-Aquaculture-Report.docx%20-%20Google%20Docs.pdf',
    seo: {
      title: 'Deploying AnchorBot™ Helical Anchors for Alaska Mariculture | Beringia Marine',
      description:
        "How helical anchoring technology can unlock 2-4x more usable acreage and transform Alaska's kelp farming economics. A comprehensive justification report on AnchorBot deployment.",
      ogImage: '/desktop-anchorbot-helical-anchors-alaska-mariculture.png',
    },
  },
  {
    title:
      'Evaluating Hydrus MicroAUV for Benthic Survey: Performance Evolution, Feedback Integration, and Expected Capabilities',
    slug: 'evaluating-hydrus-microauv-benthic-survey',
    category: 'White Paper',
    excerpt:
      'This paper documents the development, field validation, and operational performance of the Hydrus 300m rated microAUV, a compact, user-friendly autonomous underwater vehicle developed by Advanced Navigation for benthic habitat mapping and ecological monitoring.',
    deck: 'A comprehensive evaluation of the Hydrus 300m rated microAUV through NOAA-coordinated trials and field validation',
    publishedAt: '2025-05-28',
    updatedAt: '2025-05-28',
    displayDate: 'May 28, 2025',
    author: 'Chris Malzone, Beringia Marine Inc',
    coverImage: '/hydrus-subsurface.jpeg',
    tags: ['Hydrus', 'AUV', 'Benthic Survey', 'NOAA', 'Coral Reef', 'Photogrammetry'],
    readingTime: 10,
    contentType: 'hybrid',
    sections: [],
    pdfUrl: 'https://pub-264ce0c4c88b4573839aee612dbbfd27.r2.dev/250819-Hydrus_Evaluation_Final.pdf',
    seo: {
      title: 'Evaluating Hydrus MicroAUV for Benthic Survey | Beringia Marine',
      description:
        'Comprehensive evaluation of the Hydrus 300m rated microAUV through NOAA-coordinated trials and field validation for benthic habitat mapping and ecological monitoring.',
      ogImage: '/desktop-evaluating-hydrus-micro-auv-benthic-survey.png',
    },
  },
];

export const INSIGHT_BY_SLUG: Record<string, InsightEntry> = Object.fromEntries(
  INSIGHTS.map((entry) => [entry.slug, entry])
);

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
