import { Metadata } from 'next';

// Base metadata configuration
export const baseMetadata: Metadata = {
  title: {
    default: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
    template: '%s | Vital Ice',
  },
  description:
    "San Francisco's premier wellness center. Cold plunge therapy, infrared sauna, red light therapy & recovery services in the Marina District. Book your session.",
  keywords: [
    'cold therapy',
    'cold plunge',
    'infrared sauna',
    'traditional sauna',
    'recovery',
    'wellness',
    'San Francisco',
    'red light therapy',
    'compression therapy',
    'percussion massage',
  ],
  authors: [{ name: 'Vital Ice' }],
  creator: 'Vital Ice',
  publisher: 'Vital Ice',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.vitalicesf.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vitalicesf.com',
    siteName: 'Vital Ice',
    title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
    description:
      "San Francisco's premier wellness center offering cold plunge therapy, red light therapy, and sauna sessions. Experience transformative recovery and wellness.",
    images: [
      {
        url: 'https://media.vitalicesf.com/seo/desktop-home.png',
        width: 1200,
        height: 630,
        alt: 'Vital Ice - Recovery and wellness through cold therapy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
    description:
      "San Francisco's premier wellness center offering cold plunge therapy, red light therapy, and sauna sessions. Experience transformative recovery and wellness.",
    images: ['https://media.vitalicesf.com/seo/desktop-home.png'],
    creator: '@vitalice',
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
  verification: {
    google: 'qjdR8QIwsHjJVUxPM87Lq5JmCC1APtOSHqcIy0qw1nA',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

// Page-specific metadata configurations
export const pageMetadata: Record<string, Metadata> = {
  home: {
    title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
    description:
      'Cold plunge therapy, infrared sauna & red light therapy in San Francisco Marina District. Premium recovery & wellness center. Book your session today.',
    openGraph: {
      title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
      description:
        'Experience transformative recovery and wellness through cold therapy, red light therapy, sauna, and traditional healing practices. Located in San Francisco.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-home.png',
          width: 1200,
          height: 630,
          alt: 'Vital Ice - Recovery and wellness through cold therapy',
        },
      ],
    },
    twitter: {
      title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
      description:
        'Experience transformative recovery and wellness through cold therapy, red light therapy, sauna, and traditional healing practices. Located in San Francisco.',
      images: ['https://media.vitalicesf.com/seo/desktop-home.png'],
    },
  },
  about: {
    title: 'About Vital Ice | Our Story & Mission',
    description:
      "Learn about Vital Ice, San Francisco's premier wellness center. Discover our mission, founders, and commitment to ancient healing practices.",
    alternates: {
      canonical: '/about',
    },
    openGraph: {
      title: 'About Vital Ice | Our Story & Mission',
      description:
        "Learn about Vital Ice, San Francisco's premier wellness center. Discover our mission, founders, and commitment to ancient healing practices.",
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-about.png',
          width: 1200,
          height: 630,
          alt: 'About Vital Ice - Our story and mission',
        },
      ],
    },
    twitter: {
      title: 'About Vital Ice | Our Story & Mission',
      description:
        "Learn about Vital Ice, San Francisco's premier wellness center. Discover our mission, founders, and commitment to ancient healing practices.",
      images: ['https://media.vitalicesf.com/seo/desktop-about.png'],
    },
  },
  services: {
    title: 'Wellness Services | Cold Therapy, Sauna & Recovery',
    description:
      'Cold plunge therapy, infrared sauna & red light therapy in San Francisco. Compression boots, percussion massage & traditional sauna. Book your session.',
    alternates: {
      canonical: '/services',
    },
    openGraph: {
      title: 'Wellness Services | Cold Therapy, Sauna & Recovery',
      description:
        'Cold plunge therapy, infrared sauna & red light therapy in San Francisco. Compression boots, percussion massage & traditional sauna. Book your session.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-services.png',
          width: 1200,
          height: 630,
          alt: 'Vital Ice wellness services',
        },
      ],
    },
    twitter: {
      title: 'Wellness Services | Cold Therapy, Sauna & Recovery',
      description:
        'Cold plunge therapy, infrared sauna & red light therapy in San Francisco. Compression boots, percussion massage & traditional sauna. Book your session.',
      images: ['https://media.vitalicesf.com/seo/desktop-services.png'],
    },
  },

  'cold-plunge': {
    title: 'Cold Plunge Therapy | Vital Ice San Francisco',
    description:
      'Cold plunge therapy at Vital Ice San Francisco. 40-50°F immersion for reduced inflammation, mental clarity, and faster recovery.',
    alternates: {
      canonical: '/services/cold-plunge',
    },
    openGraph: {
      title: 'Cold Plunge Therapy | Vital Ice San Francisco',
      description:
        'Cold plunge therapy at Vital Ice San Francisco. 40-50°F immersion for reduced inflammation, mental clarity, and faster recovery.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-cold-plunge.png',
          width: 1200,
          height: 630,
          alt: 'Cold plunge therapy at Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'Cold Plunge Therapy | Vital Ice San Francisco',
      description:
        'Cold plunge therapy at Vital Ice San Francisco. 40-50°F immersion for reduced inflammation, mental clarity, and faster recovery.',
      images: ['https://media.vitalicesf.com/seo/desktop-cold-plunge.png'],
    },
  },
  'infrared-sauna': {
    title: 'Infrared Sauna | Vital Ice San Francisco',
    description:
      'Experience infrared sauna therapy at Vital Ice. 120-150°F deep tissue heating for detoxification, pain relief, and stress reduction.',
    alternates: {
      canonical: '/services/infrared-sauna',
    },
    openGraph: {
      title: 'Infrared Sauna | Vital Ice San Francisco',
      description:
        'Experience infrared sauna therapy at Vital Ice. 120-150°F deep tissue heating for detoxification, pain relief, and stress reduction.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-infrared-sauna.png',
          width: 1200,
          height: 630,
          alt: 'Infrared sauna therapy at Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'Infrared Sauna | Vital Ice San Francisco',
      description:
        'Experience infrared sauna therapy at Vital Ice. 120-150°F deep tissue heating for detoxification, pain relief, and stress reduction.',
      images: ['https://media.vitalicesf.com/seo/desktop-infrared-sauna.png'],
    },
  },
  'traditional-sauna': {
    title: 'Traditional Sauna | Vital Ice San Francisco',
    description:
      'Experience traditional sauna therapy at Vital Ice. 160-200°F heat therapy for cardiovascular health, muscle recovery, and immune support.',
    alternates: {
      canonical: '/services/traditional-sauna',
    },
    openGraph: {
      title: 'Traditional Sauna | Vital Ice San Francisco',
      description:
        'Experience traditional sauna therapy at Vital Ice. 160-200°F heat therapy for cardiovascular health, muscle recovery, and immune support.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-traditional-sauna.png',
          width: 1200,
          height: 630,
          alt: 'Traditional sauna therapy at Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'Traditional Sauna | Vital Ice San Francisco',
      description:
        'Experience traditional sauna therapy at Vital Ice. 160-200°F heat therapy for cardiovascular health, muscle recovery, and immune support.',
      images: ['https://media.vitalicesf.com/seo/desktop-traditional-sauna.png'],
    },
  },
  'red-light-therapy': {
    title: 'Red Light Therapy | Vital Ice San Francisco',
    description:
      'Red light therapy at Vital Ice. Low-level light therapy for cellular regeneration, skin health, and anti-aging benefits in San Francisco.',
    alternates: {
      canonical: '/services/red-light-therapy',
    },
    openGraph: {
      title: 'Red Light Therapy | Vital Ice San Francisco',
      description:
        'Red light therapy at Vital Ice. Low-level light therapy for cellular regeneration, skin health, and anti-aging benefits in San Francisco.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-red-light-therapy.png',
          width: 1200,
          height: 630,
          alt: 'Red light therapy at Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'Red Light Therapy | Vital Ice San Francisco',
      description:
        'Red light therapy at Vital Ice. Low-level light therapy for cellular regeneration, skin health, and anti-aging benefits in San Francisco.',
      images: ['https://media.vitalicesf.com/seo/desktop-red-light-therapy.png'],
    },
  },
  'compression-boots': {
    title: 'Compression Boots | Vital Ice San Francisco',
    description:
      'Experience compression boot therapy at Vital Ice. Sequential compression therapy for improved circulation, muscle recovery, and lymphatic drainage.',
    alternates: {
      canonical: '/services/compression-boots',
    },
    openGraph: {
      title: 'Compression Boots | Vital Ice San Francisco',
      description:
        'Experience compression boot therapy at Vital Ice. Sequential compression therapy for improved circulation, muscle recovery, and lymphatic drainage.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-compression-boots.png',
          width: 1200,
          height: 630,
          alt: 'Compression boot therapy at Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'Compression Boots | Vital Ice San Francisco',
      description:
        'Experience compression boot therapy at Vital Ice. Sequential compression therapy for improved circulation, muscle recovery, and lymphatic drainage.',
      images: ['https://media.vitalicesf.com/seo/desktop-compression-boots.png'],
    },
  },
  'percussion-massage': {
    title: 'Percussion Massage | Vital Ice San Francisco',
    description:
      'Experience percussion massage therapy at Vital Ice. Deep tissue percussion therapy for muscle recovery, pain relief, and improved mobility.',
    alternates: {
      canonical: '/services/percussion-massage',
    },
    openGraph: {
      title: 'Percussion Massage | Vital Ice San Francisco',
      description:
        'Experience percussion massage therapy at Vital Ice. Deep tissue percussion therapy for muscle recovery, pain relief, and improved mobility.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-percussion-massage.png',
          width: 1200,
          height: 630,
          alt: 'Percussion massage therapy at Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'Percussion Massage | Vital Ice San Francisco',
      description:
        'Experience percussion massage therapy at Vital Ice. Deep tissue percussion therapy for muscle recovery, pain relief, and improved mobility.',
      images: ['https://media.vitalicesf.com/seo/desktop-percussion-massage.png'],
    },
  },
  book: {
    title: 'Book Now | Vital Ice Recovery Sessions',
    description:
      'Book your recovery session at Vital Ice. Schedule cold therapy, sauna sessions, red light therapy, compression boots, and percussion massage online.',
    alternates: {
      canonical: '/book',
    },
    openGraph: {
      title: 'Book Now | Vital Ice Recovery Sessions',
      description:
        'Book your recovery session at Vital Ice. Schedule cold therapy, sauna sessions, red light therapy, compression boots, and percussion massage online.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-book.png',
          width: 1200,
          height: 630,
          alt: 'Book your recovery session at Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'Book Now | Vital Ice Recovery Sessions',
      description:
        'Book your recovery session at Vital Ice. Schedule cold therapy, sauna sessions, red light therapy, compression boots, and percussion massage online.',
      images: ['https://media.vitalicesf.com/seo/desktop-book.png'],
    },
  },
  register: {
    title: 'New Member Registration | Vital Ice',
    description:
      'Register for your Vital Ice account. Complete your registration, review liability waiver, and join our recovery community in San Francisco.',
    alternates: {
      canonical: '/register',
    },
    openGraph: {
      title: 'New Member Registration | Vital Ice',
      description:
        'Register for your Vital Ice account. Complete your registration, review liability waiver, and join our recovery community in San Francisco.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-book.png',
          width: 1200,
          height: 630,
          alt: 'Register for Vital Ice membership',
        },
      ],
    },
    twitter: {
      title: 'New Member Registration | Vital Ice',
      description:
        'Register for your Vital Ice account. Complete your registration, review liability waiver, and join our recovery community in San Francisco.',
      images: ['https://media.vitalicesf.com/seo/desktop-book.png'],
    },
  },
  faq: {
    title: 'FAQ | Frequently Asked Questions | Vital Ice',
    description:
      'Frequently asked questions about Vital Ice services, cold therapy, sauna sessions, booking, and wellness practices in San Francisco.',
    alternates: {
      canonical: '/faq',
    },
    openGraph: {
      title: 'FAQ | Frequently Asked Questions | Vital Ice',
      description:
        'Frequently asked questions about Vital Ice services, cold therapy, sauna sessions, booking, and wellness practices in San Francisco.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-faq.png',
          width: 1200,
          height: 630,
          alt: 'FAQ - Frequently asked questions about Vital Ice',
        },
      ],
    },
    twitter: {
      title: 'FAQ | Frequently Asked Questions | Vital Ice',
      description:
        'Frequently asked questions about Vital Ice services, cold therapy, sauna sessions, booking, and wellness practices in San Francisco.',
      images: ['https://media.vitalicesf.com/seo/desktop-faq.png'],
    },
  },
  partners: {
    title: 'Partners | Vital Ice Collaborations',
    description:
      'Discover Vital Ice partnerships and collaborations. Working with leading wellness brands and professionals to enhance your recovery experience.',
    openGraph: {
      title: 'Partners | Vital Ice Collaborations',
      description:
        'Discover Vital Ice partnerships and collaborations. Working with leading wellness brands and professionals to enhance your recovery experience.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-partners.png',
          width: 1200,
          height: 630,
          alt: 'Vital Ice partners and collaborations',
        },
      ],
    },
    twitter: {
      title: 'Partners | Vital Ice Collaborations',
      description:
        'Discover Vital Ice partnerships and collaborations. Working with leading wellness brands and professionals to enhance your recovery experience.',
      images: ['https://media.vitalicesf.com/seo/desktop-partners.png'],
    },
  },
  experience: {
    title: 'Experience Vital Ice | Wellness Center San Francisco',
    description:
      'Experience Vital Ice wellness center in San Francisco. Explore our facility, services, and recovery options including cold therapy and sauna.',
    alternates: {
      canonical: '/experience',
    },
    openGraph: {
      title: 'Experience Vital Ice | Wellness Center San Francisco',
      description:
        'Experience Vital Ice wellness center in San Francisco. Explore our facility, services, and recovery options including cold therapy and sauna.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-experience.png',
          width: 1200,
          height: 630,
          alt: 'Choose your Vital Ice experience',
        },
      ],
    },
    twitter: {
      title: 'Experience Vital Ice | Wellness Center San Francisco',
      description:
        'Experience Vital Ice wellness center in San Francisco. Explore our facility, services, and recovery options including cold therapy and sauna.',
      images: ['https://media.vitalicesf.com/seo/desktop-experience.png'],
    },
  },
  careers: {
    title: 'Careers | Join Our Team | Vital Ice',
    description:
      'Join the Vital Ice team and help us build the future of recovery and wellness. View current job openings and career opportunities in San Francisco.',
    openGraph: {
      title: 'Careers | Join Our Team | Vital Ice',
      description:
        'Join the Vital Ice team and help us build the future of recovery and wellness. View current job openings and career opportunities in San Francisco.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-careers.png',
          width: 1200,
          height: 630,
          alt: 'Vital Ice careers and job opportunities',
        },
      ],
    },
    twitter: {
      title: 'Careers | Join Our Team | Vital Ice',
      description:
        'Join the Vital Ice team and help us build the future of recovery and wellness. View current job openings and career opportunities in San Francisco.',
      images: ['https://media.vitalicesf.com/seo/desktop-careers.png'],
    },
  },
  'client-policy': {
    title: 'Client Policy | Vital Ice Terms & Conditions',
    description:
      'Review Vital Ice client policies, terms and conditions, liability waivers, and facility rules. Ensure a safe and enjoyable wellness experience.',
    openGraph: {
      title: 'Client Policy | Vital Ice Terms & Conditions',
      description:
        'Review Vital Ice client policies, terms and conditions, liability waivers, and facility rules. Ensure a safe and enjoyable wellness experience.',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-client-policy.png',
          width: 1200,
          height: 630,
          alt: 'Vital Ice client policies and terms',
        },
      ],
    },
    twitter: {
      title: 'Client Policy | Vital Ice Terms & Conditions',
      description:
        'Review Vital Ice client policies, terms and conditions, liability waivers, and facility rules. Ensure a safe and enjoyable wellness experience.',
      images: ['https://media.vitalicesf.com/seo/desktop-client-policy.png'],
    },
  },
  insights: {
    title: 'Wellness Insights & Recovery Research | Vital Ice',
    description:
      'Explore wellness articles, recovery guides, research summaries, and community stories from Vital Ice. Learn about cold therapy, sauna benefits, and holistic wellness practices.',
    keywords: [
      'wellness articles',
      'recovery research',
      'cold therapy benefits',
      'sauna research',
      'wellness guides',
      'recovery tips',
      'health insights',
      'wellness community',
    ],
    openGraph: {
      title: 'Wellness Insights & Recovery Research | Vital Ice',
      description:
        'Explore wellness articles, recovery guides, research summaries, and community stories from Vital Ice. Learn about cold therapy, sauna benefits, and holistic wellness practices.',
      type: 'website',
      images: [
        {
          url: 'https://media.vitalicesf.com/seo/desktop-insights.png',
          width: 1200,
          height: 630,
          alt: 'Vital Ice Insights - Wellness and recovery content',
        },
      ],
    },
    twitter: {
      title: 'Wellness Insights & Recovery Research | Vital Ice',
      description:
        'Explore wellness articles, recovery guides, research summaries, and community stories from Vital Ice.',
      images: ['https://media.vitalicesf.com/seo/desktop-insights.png'],
    },
  },
};

// Helper function to merge metadata
export function mergeMetadata(pageKey: string, customMetadata?: Partial<Metadata>): Metadata {
  const pageMeta = pageMetadata[pageKey] || {};
  return {
    ...baseMetadata,
    ...pageMeta,
    ...customMetadata,
    // Merge alternates to ensure canonical URLs are preserved (page-specific overrides base)
    alternates: {
      ...baseMetadata.alternates,
      ...(pageMeta.alternates || {}),
      ...(customMetadata?.alternates || {}),
    },
    openGraph: {
      ...baseMetadata.openGraph,
      ...pageMeta.openGraph,
      ...customMetadata?.openGraph,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...pageMeta.twitter,
      ...customMetadata?.twitter,
    },
  };
}
