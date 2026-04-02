import { VITAL_ICE_BUSINESS } from '../config/business-info';

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

// Vital Ice business data - now using centralized configuration
export const vitalIceBusiness: LocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: VITAL_ICE_BUSINESS.name,
  description: VITAL_ICE_BUSINESS.description,
  url: VITAL_ICE_BUSINESS.website,
  ...(VITAL_ICE_BUSINESS.phone && { telephone: VITAL_ICE_BUSINESS.phone }),
  address: {
    '@type': 'PostalAddress',
    streetAddress: VITAL_ICE_BUSINESS.address.street,
    addressLocality: VITAL_ICE_BUSINESS.address.city,
    addressRegion: VITAL_ICE_BUSINESS.address.state,
    postalCode: VITAL_ICE_BUSINESS.address.zipCode,
    addressCountry: VITAL_ICE_BUSINESS.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: VITAL_ICE_BUSINESS.coordinates.latitude,
    longitude: VITAL_ICE_BUSINESS.coordinates.longitude,
  },
  openingHoursSpecification: VITAL_ICE_BUSINESS.hours.map(hour => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: hour.day,
    opens: hour.open,
    closes: hour.close,
  })),
  sameAs: Object.values(VITAL_ICE_BUSINESS.socialMedia).filter(Boolean),
  image: [
    'https://media.vitalicesf.com/seo/desktop-home.png',
    'https://media.vitalicesf.com/logo-dark.png',
  ],
  priceRange: VITAL_ICE_BUSINESS.priceRange,
  areaServed: {
    '@type': 'City' as const,
    name: VITAL_ICE_BUSINESS.areaServed[0] || 'San Francisco',
  },
  // Enhanced business information from centralized config
  paymentAccepted: VITAL_ICE_BUSINESS.paymentMethods,
  currenciesAccepted: 'USD',
  amenityFeature: VITAL_ICE_BUSINESS.amenities.map(amenity => ({
    '@type': 'LocationFeatureSpecification',
    name: amenity,
    value: true,
  })),
};

// Service definitions with enhanced schema markup
export const services: Record<string, Service> = {
  'cold-plunge': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Cold Plunge Therapy',
    description:
      '40-50°F immersion therapy for reduced inflammation, mental acuity, and enhanced recovery. Experience the ancient practice of cold water immersion in our state-of-the-art cold plunge pools.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    serviceType: 'Cold Therapy',
    category: 'Wellness & Recovery',
    image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
    duration: 'PT5M', // 5 minutes in ISO 8601 format
    benefits: [
      'Reduced inflammation',
      'Enhanced mental clarity',
      'Improved recovery',
      'Vagus nerve activation',
      'Stress resilience',
    ],
    offers: [
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Single Cold Plunge Session',
        description: 'Individual cold plunge therapy session (2-5 minutes)',
        priceRange: '$25-$35',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Single Session',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Cold Plunge Package',
        description: '5-session cold plunge therapy package with discounted rate',
        priceRange: '$100-$150',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Package Deal',
      },
    ],
  },
  'infrared-sauna': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Infrared Sauna Therapy',
    description:
      '120-150°F deep tissue heating for detoxification, pain relief, and stress reduction. Our full-spectrum infrared saunas penetrate deeper than traditional saunas for maximum therapeutic benefit.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    serviceType: 'Heat Therapy',
    category: 'Wellness & Recovery',
    image: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
    duration: 'PT30M', // 30 minutes in ISO 8601 format
    benefits: [
      'Deep tissue detoxification',
      'Pain relief',
      'Stress reduction',
      'Improved circulation',
      'Cellular regeneration',
    ],
    offers: [
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Single Infrared Sauna Session',
        description: 'Individual infrared sauna session (30-40 minutes)',
        priceRange: '$35-$45',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Single Session',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Infrared Sauna Membership',
        description: 'Monthly unlimited infrared sauna access',
        priceRange: '$150-$200',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Membership',
      },
    ],
  },
  'traditional-sauna': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Traditional Sauna Therapy',
    description:
      '160-200°F heat therapy for cardiovascular health, muscle recovery, and immune support. Experience the authentic Finnish sauna tradition with dry heat and aromatic steam.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    serviceType: 'Heat Therapy',
    category: 'Wellness & Recovery',
    image: 'https://media.vitalicesf.com/sauna-traditional.jpg',
    duration: 'PT20M', // 20 minutes in ISO 8601 format
    benefits: [
      'Cardiovascular health',
      'Muscle recovery',
      'Immune system support',
      'Stress relief',
      'Improved circulation',
    ],
    offers: [
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Single Traditional Sauna Session',
        description: 'Individual traditional sauna session (15-20 minutes)',
        priceRange: '$30-$40',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Single Session',
      },
    ],
  },
  'red-light-therapy': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Red Light Therapy',
    description:
      'Low-level red and near-infrared light therapy for cellular regeneration, skin health, and anti-aging benefits. Photobiomodulation therapy using specific wavelengths to stimulate cellular repair.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    serviceType: 'Light Therapy',
    category: 'Wellness & Beauty',
    image: 'https://media.vitalicesf.com/redlight_jellyfish.jpg',
    duration: 'PT15M', // 15 minutes in ISO 8601 format
    benefits: [
      'Cellular regeneration',
      'Improved skin health',
      'Anti-aging effects',
      'Reduced inflammation',
      'Enhanced healing',
    ],
    offers: [
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Single Red Light Therapy Session',
        description: 'Individual red light therapy session (10-20 minutes)',
        priceRange: '$25-$35',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Single Session',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Red Light Therapy Package',
        description: '10-session red light therapy package for optimal results',
        priceRange: '$200-$300',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Package Deal',
      },
    ],
  },
  'compression-boots': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Compression Boot Therapy',
    description:
      'Sequential compression therapy for improved circulation, muscle recovery, and lymphatic drainage. Advanced pneumatic compression technology for enhanced recovery.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    serviceType: 'Compression Therapy',
    category: 'Recovery & Performance',
    image: 'https://media.vitalicesf.com/cells-bloodcells.jpg',
    duration: 'PT25M', // 25 minutes in ISO 8601 format
    benefits: [
      'Improved circulation',
      'Faster muscle recovery',
      'Lymphatic drainage',
      'Reduced swelling',
      'Enhanced performance',
    ],
    offers: [
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Single Compression Boot Session',
        description: 'Individual compression boot therapy session (20-30 minutes)',
        priceRange: '$30-$40',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Single Session',
      },
    ],
  },
  'percussion-massage': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Percussion Massage Therapy',
    description:
      'Deep tissue percussion therapy for muscle recovery, pain relief, and improved mobility. Professional-grade percussion devices for targeted muscle treatment.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    serviceType: 'Massage Therapy',
    category: 'Recovery & Performance',
    image: 'https://media.vitalicesf.com/percussion_bicep.jpg',
    duration: 'PT20M', // 20 minutes in ISO 8601 format
    benefits: [
      'Deep tissue relief',
      'Pain reduction',
      'Improved mobility',
      'Muscle recovery',
      'Tension release',
    ],
    offers: [
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'Single Percussion Massage Session',
        description: 'Individual percussion massage therapy session (15-30 minutes)',
        priceRange: '$40-$60',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.vitalicesf.com/book',
        category: 'Single Session',
      },
    ],
  },
};

// Membership and package offers
export const membershipOffers: Offer[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Vital Ice Basic Membership',
    description: 'Monthly membership with access to all services and discounted rates',
    priceRange: '$150-$200',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01',
    url: 'https://www.vitalicesf.com/book',
    category: 'Monthly Membership',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Vital Ice Premium Membership',
    description: 'Unlimited monthly access to all services with priority booking',
    priceRange: '$250-$350',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01',
    url: 'https://www.vitalicesf.com/book',
    category: 'Premium Membership',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Recovery Package',
    description: 'Comprehensive recovery package combining cold plunge, sauna, and massage',
    priceRange: '$100-$150',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://www.vitalicesf.com/book',
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
      name: 'What is cold plunge therapy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cold plunge therapy involves immersing your body in cold water (40-50°F) for 2-5 minutes to activate the vagus nerve, reduce inflammation, and enhance mental clarity. This ancient practice has been used for centuries to improve recovery and overall wellness.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long should I stay in the cold plunge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We recommend 2-5 minutes for cold plunge therapy. Start with shorter durations (30 seconds to 1 minute) and gradually increase as your body adapts. Listen to your body and never push beyond your comfort level.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the benefits of infrared sauna?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Infrared sauna therapy provides deep tissue heating at 120-150°F, offering detoxification, pain relief, stress reduction, and improved circulation. Unlike traditional saunas, infrared penetrates deeper into tissues for more effective results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to book in advance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we recommend booking in advance to ensure availability. You can book online through our website or call us directly. Walk-ins are welcome but subject to availability.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I bring to my session?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide towels and robes. You may want to bring a swimsuit for cold plunge therapy and comfortable clothing for other services. We also recommend bringing water to stay hydrated.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is cold plunge therapy safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cold plunge therapy is generally safe for healthy individuals. However, if you have cardiovascular conditions, are pregnant, or have other health concerns, please consult with your healthcare provider before trying cold therapy.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between infrared and traditional sauna?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Infrared saunas use light to heat your body directly, while traditional saunas heat the air around you. Infrared provides deeper tissue penetration at lower temperatures, making it more comfortable and effective for many people.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often should I use these services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Frequency depends on your goals and tolerance. We recommend starting with 1-2 sessions per week and gradually increasing. Many clients benefit from 2-3 sessions weekly for optimal results.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is red light therapy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Red light therapy uses low-level red and near-infrared light to stimulate cellular regeneration, improve skin health, reduce inflammation, and promote healing. It's a non-invasive treatment with no downtime.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer memberships?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer various membership options to suit different needs and budgets. Our memberships provide access to all services with discounted rates and priority booking. Contact us for current membership details.',
      },
    },
  ],
};

// Organization schema data - now using centralized configuration
export const vitalIceOrganization: Organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: VITAL_ICE_BUSINESS.name,
  description: VITAL_ICE_BUSINESS.description,
  url: VITAL_ICE_BUSINESS.website,
  logo: 'https://media.vitalicesf.com/logo-dark.png',
  sameAs: Object.values(VITAL_ICE_BUSINESS.socialMedia).filter(Boolean),
  ...(VITAL_ICE_BUSINESS.phone && {
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: VITAL_ICE_BUSINESS.phone,
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
      name: 'Vital Ice',
    },
    author: {
      '@type': 'Person',
      name: 'Sarah Johnson',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    reviewBody:
      'Amazing experience! The cold plunge therapy has completely transformed my recovery routine. The staff is knowledgeable and the facility is immaculate. Highly recommend!',
    datePublished: '2024-01-15',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    author: {
      '@type': 'Person',
      name: 'Michael Chen',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    reviewBody:
      'The infrared sauna sessions have been incredible for my stress relief and muscle recovery. The atmosphere is so relaxing and the benefits are noticeable immediately.',
    datePublished: '2024-01-20',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: 'Vital Ice',
    },
    author: {
      '@type': 'Person',
      name: 'Emma Rodriguez',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    reviewBody:
      'Red light therapy has done wonders for my skin and overall wellness. The staff is professional and the results speak for themselves. This place is a game-changer!',
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
        item: 'https://www.vitalicesf.com',
      },
    ],
  },
  services: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.vitalicesf.com/services',
      },
    ],
  },
  'cold-plunge': {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.vitalicesf.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Cold Plunge Therapy',
        item: 'https://www.vitalicesf.com/services/cold-plunge',
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
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://www.vitalicesf.com/about',
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
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: 'https://www.vitalicesf.com/contact',
      },
    ],
  },
  'infrared-sauna': {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.vitalicesf.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Infrared Sauna Therapy',
        item: 'https://www.vitalicesf.com/services/infrared-sauna',
      },
    ],
  },
  'traditional-sauna': {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.vitalicesf.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Traditional Sauna Therapy',
        item: 'https://www.vitalicesf.com/services/traditional-sauna',
      },
    ],
  },
  'red-light-therapy': {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.vitalicesf.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Red Light Therapy',
        item: 'https://www.vitalicesf.com/services/red-light-therapy',
      },
    ],
  },
  'compression-boots': {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.vitalicesf.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Compression Boot Therapy',
        item: 'https://www.vitalicesf.com/services/compression-boots',
      },
    ],
  },
  'percussion-massage': {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.vitalicesf.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Percussion Massage Therapy',
        item: 'https://www.vitalicesf.com/services/percussion-massage',
      },
    ],
  },
  experience: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Choose Your Experience',
        item: 'https://www.vitalicesf.com/experience',
      },
    ],
  },
  book: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Book Now',
        item: 'https://www.vitalicesf.com/book',
      },
    ],
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: 'https://www.vitalicesf.com/faq',
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
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: 'https://www.vitalicesf.com/insights',
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
      name: VITAL_ICE_BUSINESS.name,
      logo: {
        '@type': 'ImageObject',
        url: 'https://media.vitalicesf.com/logo-dark.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.vitalicesf.com/insights/${article.slug}`,
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
        item: 'https://www.vitalicesf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: 'https://www.vitalicesf.com/insights',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: articleTitle,
        item: `https://www.vitalicesf.com/insights/${articleSlug}`,
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
    name: 'Vital Ice Insights',
    description:
      'Wellness articles, recovery guides, research summaries, and community stories from Vital Ice. Learn about cold therapy, sauna benefits, and holistic wellness practices.',
    url: 'https://www.vitalicesf.com/insights',
    publisher: {
      '@type': 'Organization',
      name: VITAL_ICE_BUSINESS.name,
      logo: {
        '@type': 'ImageObject',
        url: 'https://media.vitalicesf.com/logo-dark.png',
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
  const videoName = video.name || `${video.type === 'cold' ? 'Cold' : 'Hot'} Ambient Background Video`;
  const videoDescription = `Background video showcasing ${video.type === 'cold' ? 'cold plunge' : 'sauna'} therapy ambiance at Vital Ice wellness center in San Francisco.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videoName,
    description: videoDescription,
    thumbnailUrl: video.poster || 'https://media.vitalicesf.com/logo-dark.png',
    uploadDate: new Date().toISOString().split('T')[0], // Use current date as placeholder
    contentUrl: video.src,
    publisher: {
      '@type': 'Organization',
      name: VITAL_ICE_BUSINESS.name,
      logo: {
        '@type': 'ImageObject',
        url: 'https://media.vitalicesf.com/logo-dark.png',
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

// Hero video data for structured data (matches Hero.tsx VIDEOS array)
const HERO_VIDEOS = [
  {
    src: 'https://media.vitalicesf.com/cold-ambient-1.mp4',
    poster: 'https://media.vitalicesf.com/cold-ambient-1-poster.jpg',
    type: 'cold' as const,
    name: 'Cold Plunge Ambient Video 1',
  },
  {
    src: 'https://media.vitalicesf.com/hot-ambient-1.mp4',
    poster: 'https://media.vitalicesf.com/hot-ambient-1-poster.jpg',
    type: 'hot' as const,
    name: 'Sauna Ambient Video 1',
  },
  {
    src: 'https://media.vitalicesf.com/cold-ambient-2.mp4',
    poster: 'https://media.vitalicesf.com/cold-ambient-2-poster.jpg',
    type: 'cold' as const,
    name: 'Cold Plunge Ambient Video 2',
  },
  {
    src: 'https://media.vitalicesf.com/hot-ambient-2.mp4',
    poster: 'https://media.vitalicesf.com/hot-ambient-2-poster.jpg',
    type: 'hot' as const,
    name: 'Sauna Ambient Video 2',
  },
  {
    src: 'https://media.vitalicesf.com/cold-ambient-3.mp4',
    poster: 'https://media.vitalicesf.com/cold-ambient-3-poster.jpg',
    type: 'cold' as const,
    name: 'Cold Plunge Ambient Video 3',
  },
  {
    src: 'https://media.vitalicesf.com/hot-ambient-3.mp4',
    poster: 'https://media.vitalicesf.com/hot-ambient-3-poster.jpg',
    type: 'hot' as const,
    name: 'Sauna Ambient Video 3',
  },
  {
    src: 'https://media.vitalicesf.com/cold-ambient-4.mp4',
    poster: 'https://media.vitalicesf.com/cold-ambient-4-poster.jpg',
    type: 'cold' as const,
    name: 'Cold Plunge Ambient Video 4',
  },
  {
    src: 'https://media.vitalicesf.com/hot-ambient-4.mp4',
    poster: 'https://media.vitalicesf.com/hot-ambient-4-poster.jpg',
    type: 'hot' as const,
    name: 'Sauna Ambient Video 4',
  },
];

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

  // Add FAQ schema for FAQ page
  if (pageKey === 'faq') {
    schemas.push(faqData);
  }

  // Add contact-specific schema for contact page
  if (pageKey === 'contact') {
    // Enhanced LocalBusiness schema with contact-specific details
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: `Contact ${VITAL_ICE_BUSINESS.name}`,
      description: `Get in touch with ${VITAL_ICE_BUSINESS.name} for wellness services in San Francisco. Contact us for cold plunge therapy, sauna sessions, and recovery treatments.`,
      url: `${VITAL_ICE_BUSINESS.website}/contact`,
      mainEntity: {
        '@type': 'LocalBusiness',
        name: VITAL_ICE_BUSINESS.name,
        ...(VITAL_ICE_BUSINESS.phone && { telephone: VITAL_ICE_BUSINESS.phone }),
        email: VITAL_ICE_BUSINESS.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: VITAL_ICE_BUSINESS.address.street,
          addressLocality: VITAL_ICE_BUSINESS.address.city,
          addressRegion: VITAL_ICE_BUSINESS.address.state,
          postalCode: VITAL_ICE_BUSINESS.address.zipCode,
          addressCountry: VITAL_ICE_BUSINESS.address.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: VITAL_ICE_BUSINESS.coordinates.latitude,
          longitude: VITAL_ICE_BUSINESS.coordinates.longitude,
        },
        openingHoursSpecification: VITAL_ICE_BUSINESS.hours.map(hour => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: hour.day,
          opens: hour.open,
          closes: hour.close,
        })),
        contactPoint: [
          ...(VITAL_ICE_BUSINESS.phone
            ? [
                {
                  '@type': 'ContactPoint',
                  telephone: VITAL_ICE_BUSINESS.phone,
                  contactType: 'customer service',
                  areaServed: 'San Francisco',
                  availableLanguage: 'English',
                  contactOption: 'TollFree',
                },
              ]
            : []),
          {
            '@type': 'ContactPoint',
            email: VITAL_ICE_BUSINESS.email,
            contactType: 'customer service',
            areaServed: 'San Francisco',
            availableLanguage: 'English',
          },
        ],
      },
    });

    // Add Place schema for location details
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${VITAL_ICE_BUSINESS.name} Location`,
      description: `Visit ${VITAL_ICE_BUSINESS.name} in San Francisco's Marina District for premium wellness services including cold plunge therapy, infrared sauna, and recovery treatments.`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: VITAL_ICE_BUSINESS.address.street,
        addressLocality: VITAL_ICE_BUSINESS.address.city,
        addressRegion: VITAL_ICE_BUSINESS.address.state,
        postalCode: VITAL_ICE_BUSINESS.address.zipCode,
        addressCountry: VITAL_ICE_BUSINESS.address.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: VITAL_ICE_BUSINESS.coordinates.latitude,
        longitude: VITAL_ICE_BUSINESS.coordinates.longitude,
      },
      containedInPlace: {
        '@type': 'City',
        name: 'San Francisco',
        containedInPlace: {
          '@type': 'State',
          name: 'California',
        },
      },
      amenityFeature: VITAL_ICE_BUSINESS.amenities.map(amenity => ({
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
  if (['home', 'services', 'about', 'contact'].includes(pageKey)) {
    schemas.push(...businessReviews);
  }

  // Add WebSite schema for all pages
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vital Ice',
    url: 'https://www.vitalicesf.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.vitalicesf.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  });

  return schemas;
}
