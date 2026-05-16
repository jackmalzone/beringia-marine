import { Metadata } from 'next';
import {
  SITE_CONFIG,
  absoluteUrl,
  buildMetadataVerification,
  getSiteUrl,
  getTwitterCreator,
} from '@/lib/config/site-config';

export function getBaseMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const name = SITE_CONFIG.name;
  const ogUrl = absoluteUrl(SITE_CONFIG.defaultOgImagePath);
  const verification = buildMetadataVerification();
  const twitterCreator = getTwitterCreator();
  const defaultTitle = SITE_CONFIG.defaultSeoTitle;
  const ogDesc = SITE_CONFIG.openGraphFallbackDescription;
  const keywordList = SITE_CONFIG.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean);
  return {
    title: {
      default: defaultTitle,
      template: `%s | ${name}`,
    },
    description: SITE_CONFIG.description,
    keywords: keywordList,
    authors: [{ name }],
    creator: name,
    publisher: name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: name,
      title: defaultTitle,
      description: ogDesc,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `${name} — default share image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: ogDesc,
      images: [ogUrl],
      ...(twitterCreator ? { creator: twitterCreator } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(verification ? { verification } : {}),
  };
}

let _pageMetadata: Record<string, Metadata> | null = null;

export function getPageMetadata(): Record<string, Metadata> {
  if (_pageMetadata) return _pageMetadata;
  const n = SITE_CONFIG.name;
  const og = (alt: string) =>
    [
      {
        url: absoluteUrl(SITE_CONFIG.defaultOgImagePath),
        width: 1200,
        height: 630,
        alt,
      },
    ] as const;
  const tw = () => [absoluteUrl(SITE_CONFIG.defaultOgImagePath)] as const;

  _pageMetadata = {
  home: {
    title: SITE_CONFIG.defaultSeoTitle,
    description: SITE_CONFIG.description,
    openGraph: {
      title: SITE_CONFIG.defaultSeoTitle,
      description: SITE_CONFIG.openGraphFallbackDescription,
      images: og(`${n} — marine technology solutions`),
    },
    twitter: {
      title: SITE_CONFIG.defaultSeoTitle,
      description: SITE_CONFIG.openGraphFallbackDescription,
      images: tw(),
    },
  },
  about: {
    title: `About ${n} | Our story & mission`,
    description:
      `Learn how ${n} was founded, what guides our standards, and how we invest in people, process, and place to serve clients with consistency.`,
    alternates: {
      canonical: '/about',
    },
    openGraph: {
      title: `About ${n} | Our story & mission`,
      description:
        `Learn how ${n} was founded, what guides our standards, and how we invest in people, process, and place to serve clients with consistency.`,
      images: og(`About ${n} — story and mission`),
    },
    twitter: {
      title: `About ${n} | Our story & mission`,
      description:
        `Learn how ${n} was founded, what guides our standards, and how we invest in people, process, and place to serve clients with consistency.`,
      images: tw(),
    },
  },
  solutions: {
    title: 'Solutions | Marine technology programs',
    description:
      `Explore solution programs from ${n} spanning navigation, anchor automation, and marine robotics control systems.`,
    alternates: {
      canonical: '/solutions',
    },
    openGraph: {
      title: 'Solutions | Marine technology programs',
      description:
        `Explore solution programs from ${n} spanning navigation, anchor automation, and marine robotics control systems.`,
      images: og(`${n} solutions`),
    },
    twitter: {
      title: 'Solutions | Marine technology programs',
      description:
        `Explore solution programs from ${n} spanning navigation, anchor automation, and marine robotics control systems.`,
      images: tw(),
    },
  },
  contact: {
    title: `Contact ${n}`,
    description: `Reach ${n} for sales engineering, marine robotics programs, and partnership inquiries.`,
    alternates: {
      canonical: '/contact',
    },
    openGraph: {
      title: `Contact ${n}`,
      description: `Reach ${n} for sales engineering, marine robotics programs, and partnership inquiries.`,
      images: og(`${n} — contact`),
    },
    twitter: {
      title: `Contact ${n}`,
      description: `Reach ${n} for sales engineering, marine robotics programs, and partnership inquiries.`,
      images: tw(),
    },
  },

  insights: {
    title: 'Insights | Ideas, guides & client stories',
    description:
      `Articles, guides, research notes, and community spotlights from ${n}—practical perspective for clients who appreciate depth and discretion.`,
    alternates: {
      canonical: '/insights',
    },
    keywords: [
      'industry insights',
      'client guides',
      'service education',
      'studio journal',
      'best practices',
      'client stories',
      'professional tips',
      'behind the scenes',
    ],
    openGraph: {
      title: 'Insights | Ideas, guides & client stories',
      description:
        `Articles, guides, research notes, and community spotlights from ${n}—practical perspective for clients who appreciate depth and discretion.`,
      type: 'website',
      images: og(`${n} insights`),
    },
    twitter: {
      title: 'Insights | Ideas, guides & client stories',
      description:
        `Articles, guides, research notes, and community spotlights from ${n}—practical perspective for clients who appreciate depth and discretion.`,
      images: tw(),
    },
  },
  terms: {
    title: 'Terms & Conditions',
    description: `Terms and conditions for ${n}. Governing law: California, USA. Full legal text is provided on this page.`,
    alternates: {
      canonical: '/terms',
    },
    openGraph: {
      title: `Terms & Conditions | ${n}`,
      description: `Terms, effective date, and governing law for ${n}.`,
      images: og(`${n} — terms and conditions`),
    },
    twitter: {
      title: `Terms & Conditions | ${n}`,
      description: `Terms and policies for ${n}.`,
      images: tw(),
    },
  },
  };
  return _pageMetadata;
}

// Helper function to merge metadata
export function mergeMetadata(pageKey: string, customMetadata?: Partial<Metadata>): Metadata {
  const base = getBaseMetadata();
  const pageMeta = getPageMetadata()[pageKey] || {};
  return {
    ...base,
    ...pageMeta,
    ...customMetadata,
    // Merge alternates to ensure canonical URLs are preserved (page-specific overrides base)
    alternates: {
      ...base.alternates,
      ...(pageMeta.alternates || {}),
      ...(customMetadata?.alternates || {}),
    },
    openGraph: {
      ...base.openGraph,
      ...pageMeta.openGraph,
      ...customMetadata?.openGraph,
    },
    twitter: {
      ...base.twitter,
      ...pageMeta.twitter,
      ...customMetadata?.twitter,
    },
  };
}

