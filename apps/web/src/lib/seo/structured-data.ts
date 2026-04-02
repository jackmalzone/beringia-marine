import { TEMPLATE_BUSINESS } from '../config/business-info';
import { SITE_CONFIG, absoluteUrl, getSiteUrl } from '../config/site-config';

// Structured Data (JSON-LD) for SEO
export interface LocalBusiness extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness';
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string;
    opens: string;
    closes: string;
  }>;
  sameAs: string[];
  image: string[];
  priceRange: string;
  areaServed: {
    '@type': 'City';
    name: string;
  };
}

export interface Service extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'LocalBusiness';
    name: string;
  };
  areaServed: {
    '@type': 'City';
    name: string;
  };
  serviceType: string;
  image?: string;
  category?: string;
  offers?: Offer[];
  duration?: string;
  benefits?: string[];
}

export interface Offer extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'Offer';
  name: string;
  description: string;
  price?: string;
  priceCurrency?: string;
  priceRange?: string;
  availability?: string;
  validFrom?: string;
  validThrough?: string;
  url?: string;
  category?: string;
}

export interface FAQPage extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// Template local business schema (values from centralized business config)
export const vitalIceBusiness: LocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: TEMPLATE_BUSINESS.name,
  description: TEMPLATE_BUSINESS.description,
  url: TEMPLATE_BUSINESS.website,
  ...(TEMPLATE_BUSINESS.phone && { telephone: TEMPLATE_BUSINESS.phone }),
  address: {
    '@type': 'PostalAddress',
    streetAddress: TEMPLATE_BUSINESS.address.street,
    addressLocality: TEMPLATE_BUSINESS.address.city,
    addressRegion: TEMPLATE_BUSINESS.address.state,
    postalCode: TEMPLATE_BUSINESS.address.zipCode,
    addressCountry: TEMPLATE_BUSINESS.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: TEMPLATE_BUSINESS.coordinates.latitude,
    longitude: TEMPLATE_BUSINESS.coordinates.longitude,
  },
  openingHoursSpecification: TEMPLATE_BUSINESS.hours
    .filter(hour => !hour.closed)
    .map(hour => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hour.day,
      opens: hour.open,
      closes: hour.close,
    })),
  sameAs: Object.values(TEMPLATE_BUSINESS.socialMedia).filter(
    (url): url is string => typeof url === 'string' && url.length > 0
  ),
  image: [absoluteUrl(SITE_CONFIG.defaultOgImagePath), absoluteUrl('/favicon.ico')],
  priceRange: TEMPLATE_BUSINESS.priceRange,
  areaServed: {
    '@type': 'City' as const,
    name: TEMPLATE_BUSINESS.areaServed[0] || 'Riverton',
  },
  // Enhanced business information from centralized config
  paymentAccepted: TEMPLATE_BUSINESS.paymentMethods,
  currenciesAccepted: 'USD',
  amenityFeature: TEMPLATE_BUSINESS.amenities.map(amenity => ({
    '@type': 'LocationFeatureSpecification',
    name: amenity,
    value: true,
  })),
};

// Service-page JSON-LD removed with /services routes (Beringia uses /solutions).
export const services: Record<string, Service> = {};

// Membership and package offers
export const membershipOffers: Offer[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Premium Service Business Basic Membership',
    description: 'Monthly membership with access to core services and preferred rates',
    priceRange: '$150-$200',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01',
    url: absoluteUrl('/contact'),
    category: 'Monthly Membership',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Premium Service Business Premium Membership',
    description: 'Expanded monthly access with priority booking and concierge scheduling',
    priceRange: '$250-$350',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01',
    url: absoluteUrl('/contact'),
    category: 'Premium Membership',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Multi-service package',
    description: 'Curated bundle combining Service One, Service Three, and Service Six visits',
    priceRange: '$100-$150',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl('/contact'),
    category: 'Service Package',
  },
];

// Additional schema interfaces
export interface Organization extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string;
  };
}

export interface Review extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'Review';
  itemReviewed: {
    '@type': 'LocalBusiness';
    name: string;
  };
  author: {
    '@type': 'Person';
    name: string;
  };
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
  };
  reviewBody: string;
  datePublished: string;
}

export interface BreadcrumbList extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// FAQ structured data - Enhanced with more comprehensive content
export const faqData: FAQPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Service One?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Service One is our flagship client experience—a structured appointment with specialist guidance, clear pacing, and time built in for questions. It is designed to set expectations and deliver a repeatable, high-quality visit.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a typical appointment last?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most services range from 45 to 60 minutes including preparation and wrap-up. Your confirmation email lists the exact duration for the offering you selected. Arrive a few minutes early to check in calmly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Service Two different from Service Three?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Service Two emphasizes depth, education, and a highly tailored pace, while Service Three focuses on classic hospitality rhythms—punctual starts, polished suites, and consistent service standards. Both are led by trained staff.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to book in advance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we recommend booking in advance to secure your preferred time. You can book online through our website or contact the front desk directly. Same-day visits may be available depending on capacity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I bring to my session?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide essentials for comfort in the studio. Wear or bring clothing you can move in easily, and anything personal you need for afterward. A water bottle is welcome; our team will remind you of any service-specific items before you arrive.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are your services appropriate for everyone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many clients enjoy our offerings without issue. If you have medical questions or conditions that could affect participation, consult your healthcare provider before booking and inform our staff during intake.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do Service Four and Service Five complement each other?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Service Four focuses on precision protocols and documentation, while Service Five pairs calibrated equipment with guided adjustments. Clients often alternate them within a monthly plan—your specialist can suggest a sequence.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often should I schedule visits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Frequency depends on your goals and schedule. Many clients begin with one or two visits per week, then adjust based on results and availability. Membership clients receive a recommended cadence during onboarding.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I expect from Service Six?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Service Six is therapist-led: we listen first, agree on focus areas, deliver intentional technique, and recap next steps. Expect a calm suite, clear communication, and optional home-care suggestions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer memberships?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Memberships bundle visits, unlock preferred booking windows, and include seasonal perks. Contact us for current tiers, corporate options, and any introductory offers.',
      },
    },
  ],
};

// Organization schema data - now using centralized configuration
export const vitalIceOrganization: Organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: TEMPLATE_BUSINESS.name,
  description: TEMPLATE_BUSINESS.description,
  url: TEMPLATE_BUSINESS.website,
  logo: absoluteUrl(SITE_CONFIG.defaultOgImagePath),
  sameAs: Object.values(TEMPLATE_BUSINESS.socialMedia).filter(
    (url): url is string => typeof url === 'string' && url.length > 0
  ),
  ...(TEMPLATE_BUSINESS.phone && {
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: TEMPLATE_BUSINESS.phone,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  }),
};

// Sample reviews for the business
export const businessReviews: Review[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: TEMPLATE_BUSINESS.name,
    },
    author: {
      '@type': 'Person',
      name: 'Template Reviewer One',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    reviewBody:
      '[Template placeholder] Example review copy for LocalBusiness schema demonstrations only.',
    datePublished: '2024-01-15',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: TEMPLATE_BUSINESS.name,
    },
    author: {
      '@type': 'Person',
      name: 'Template Reviewer Two',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    reviewBody:
      '[Template placeholder] Example review copy for LocalBusiness schema demonstrations only.',
    datePublished: '2024-01-20',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: TEMPLATE_BUSINESS.name,
    },
    author: {
      '@type': 'Person',
      name: 'Template Reviewer Three',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    reviewBody:
      '[Template placeholder] Example review copy for LocalBusiness schema demonstrations only.',
    datePublished: '2024-01-25',
  },
];

// Breadcrumb schemas for different pages
export const breadcrumbSchemas: Record<string, BreadcrumbList> = {
  home: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl(),
      },
    ],
  },
  solutions: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Solutions',
        item: absoluteUrl('/solutions'),
      },
    ],
  },
  about: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: absoluteUrl('/about'),
      },
    ],
  },
  contact: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: absoluteUrl('/contact'),
      },
    ],
  },
  terms: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Terms & Conditions',
        item: absoluteUrl('/terms'),
      },
    ],
  },
  insights: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: absoluteUrl('/insights'),
      },
    ],
  },
};

// VideoObject schema interface for SEO
export interface VideoObject extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string | string[];
  uploadDate: string;
  contentUrl: string;
  embedUrl?: string;
  duration?: string;
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

// Article schema interface
export interface Article extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string;
  articleSection?: string;
  wordCount?: number;
}

// Blog schema interface
export interface Blog extends Record<string, unknown> {
  '@context': 'https://schema.org';
  '@type': 'Blog';
  name: string;
  description: string;
  url: string;
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  blogPost?: Article[];
}

/**
 * Generate Article schema for individual blog posts
 * @param article - Article data object
 * @returns Article schema object
 */
export function generateArticleSchema(article: {
  title: string;
  abstract: string;
  coverImage: string;
  publishDate: string;
  author: string | { name: string; bio?: string; avatar?: string };
  slug: string;
  tags: string[];
  category: string;
  content: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}): Article {
  // Extract author name
  const authorName = typeof article.author === 'string' ? article.author : article.author.name;

  // Calculate word count from content
  const textContent = article.content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.abstract,
    image: article.seo?.ogImage || article.coverImage,
    datePublished: article.publishDate,
    dateModified: article.publishDate, // Can be updated if we track modifications
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: TEMPLATE_BUSINESS.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(SITE_CONFIG.defaultOgImagePath),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${absoluteUrl(`/insights/${article.slug}`)}`,
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
    wordCount,
  };
}

/**
 * Generate breadcrumb schema for article pages
 * @param articleTitle - Title of the article
 * @param articleSlug - Slug of the article
 * @returns BreadcrumbList schema object
 */
export function generateArticleBreadcrumb(
  articleTitle: string,
  articleSlug: string
): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: absoluteUrl('/insights'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: articleTitle,
        item: absoluteUrl(`/insights/${articleSlug}`),
      },
    ],
  };
}

/**
 * Generate Blog schema for insights listing page
 * @returns Blog schema object
 */
export function generateBlogSchema(): Blog {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${TEMPLATE_BUSINESS.name} Insights`,
    description:
      'Articles, guides, research notes, and client spotlights from our studio—practical perspective for people who value clarity, discretion, and craft.',
    url: absoluteUrl('/insights'),
    publisher: {
      '@type': 'Organization',
      name: TEMPLATE_BUSINESS.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(SITE_CONFIG.defaultOgImagePath),
      },
    },
  };
}

/**
 * Generate VideoObject schema for hero background videos
 * @param video - Video data object
 * @returns VideoObject schema
 */
export function generateVideoSchema(video: {
  src: string;
  poster?: string;
  type: 'cold' | 'hot';
  name?: string;
}): VideoObject {
  const videoName =
    video.name || `${video.type === 'cold' ? 'Cool-tone' : 'Warm-tone'} ambient background video`;
  const videoDescription = `Ambient background footage highlighting the ${video.type === 'cold' ? 'cool' : 'warm'} visual palette of ${TEMPLATE_BUSINESS.name}.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videoName,
    description: videoDescription,
    thumbnailUrl: video.poster || absoluteUrl(SITE_CONFIG.defaultOgImagePath),
    uploadDate: new Date().toISOString().split('T')[0], // Use current date as placeholder
    contentUrl: video.src,
    publisher: {
      '@type': 'Organization',
      name: TEMPLATE_BUSINESS.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(SITE_CONFIG.defaultOgImagePath),
      },
    },
  };
}

// Helper function to generate structured data script
export function generateStructuredData(
  data: Record<string, unknown> | Record<string, unknown>[]
): string {
  return JSON.stringify(data);
}

// Hero video objects for JSON-LD — add entries when you host neutral VideoObject URLs.
const HERO_VIDEOS: Array<{
  src: string;
  poster: string;
  type: 'cold' | 'hot';
  name: string;
}> = [];

// Helper function to get combined schema data for a page
export function getPageSchema(pageKey: string): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [vitalIceBusiness, vitalIceOrganization];

  // Add breadcrumbs for all pages
  if (breadcrumbSchemas[pageKey]) {
    schemas.push(breadcrumbSchemas[pageKey]);
  }

  // Add service schema for service pages
  if (services[pageKey]) {
    schemas.push(services[pageKey]);
  }

  // Add contact-specific schema for contact page
  if (pageKey === 'contact') {
    // Enhanced LocalBusiness schema with contact-specific details
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: `Contact ${TEMPLATE_BUSINESS.name}`,
      description: `Get in touch with ${TEMPLATE_BUSINESS.name} for appointments, service questions, and membership information. Our team replies during studio hours.`,
      url: `${TEMPLATE_BUSINESS.website}/contact`,
      mainEntity: {
        '@type': 'LocalBusiness',
        name: TEMPLATE_BUSINESS.name,
        ...(TEMPLATE_BUSINESS.phone && { telephone: TEMPLATE_BUSINESS.phone }),
        email: TEMPLATE_BUSINESS.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: TEMPLATE_BUSINESS.address.street,
          addressLocality: TEMPLATE_BUSINESS.address.city,
          addressRegion: TEMPLATE_BUSINESS.address.state,
          postalCode: TEMPLATE_BUSINESS.address.zipCode,
          addressCountry: TEMPLATE_BUSINESS.address.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: TEMPLATE_BUSINESS.coordinates.latitude,
          longitude: TEMPLATE_BUSINESS.coordinates.longitude,
        },
        openingHoursSpecification: TEMPLATE_BUSINESS.hours
          .filter(hour => !hour.closed)
          .map(hour => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hour.day,
            opens: hour.open,
            closes: hour.close,
          })),
        contactPoint: [
          ...(TEMPLATE_BUSINESS.phone
            ? [
                {
                  '@type': 'ContactPoint',
                  telephone: TEMPLATE_BUSINESS.phone,
                  contactType: 'customer service',
                  areaServed: TEMPLATE_BUSINESS.address.city,
                  availableLanguage: 'English',
                  contactOption: 'TollFree',
                },
              ]
            : []),
          {
            '@type': 'ContactPoint',
            email: TEMPLATE_BUSINESS.email,
            contactType: 'customer service',
            areaServed: TEMPLATE_BUSINESS.address.city,
            availableLanguage: 'English',
          },
        ],
      },
    });

    // Add Place schema for location details
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${TEMPLATE_BUSINESS.name} Location`,
      description: `Visit ${TEMPLATE_BUSINESS.name} in ${TEMPLATE_BUSINESS.address.city} for premium in-studio services, private suites, and a hospitality-led client experience.`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: TEMPLATE_BUSINESS.address.street,
        addressLocality: TEMPLATE_BUSINESS.address.city,
        addressRegion: TEMPLATE_BUSINESS.address.state,
        postalCode: TEMPLATE_BUSINESS.address.zipCode,
        addressCountry: TEMPLATE_BUSINESS.address.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: TEMPLATE_BUSINESS.coordinates.latitude,
        longitude: TEMPLATE_BUSINESS.coordinates.longitude,
      },
      containedInPlace: {
        '@type': 'City',
        name: TEMPLATE_BUSINESS.address.city,
        containedInPlace: {
          '@type': 'State',
          name: TEMPLATE_BUSINESS.address.state,
        },
      },
      amenityFeature: TEMPLATE_BUSINESS.amenities.map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
        value: true,
      })),
    });
  }

  // Add video schemas for home page
  if (pageKey === 'home') {
    // Add VideoObject schemas for hero background videos
    HERO_VIDEOS.forEach(video => {
      schemas.push(generateVideoSchema(video));
    });
  }

  // Add reviews for main pages
  if (['home', 'about', 'contact'].includes(pageKey)) {
    schemas.push(...businessReviews);
  }

  // Add WebSite schema for all pages
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: TEMPLATE_BUSINESS.name,
    url: getSiteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getSiteUrl()}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });

  return schemas;
}
