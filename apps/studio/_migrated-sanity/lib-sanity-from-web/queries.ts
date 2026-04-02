// GROQ query helper (simple string template until next-sanity is installed)
const groq = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
};
import { getContentWithCache, getContentNoStore } from './client';
import type { PageContent, ServiceData, GlobalSettings, SEOSettings, BusinessInfo } from './types';

// GROQ query fragments for reusability
const seoFragment = groq`
  seo {
    title,
    description,
    keywords,
    openGraph {
      title,
      description,
      image {
        asset-> {
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        }
      }
    },
    twitter {
      title,
      description,
      image {
        asset-> {
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        }
      }
    },
    noIndex,
    canonicalUrl
  }
`;

const imageFragment = groq`
  asset-> {
    _id,
    url,
    metadata {
      dimensions,
      lqip,
      hasAlpha,
      isOpaque
    }
  },
  hotspot,
  crop,
  alt
`;

const businessInfoFragment = groq`
  businessInfo {
    name,
    description,
    tagline,
    phone,
    email,
    address {
      street,
      city,
      state,
      zipCode,
      country
    },
    coordinates {
      latitude,
      longitude
    },
    hours[] {
      day,
      open,
      close,
      closed
    },
    socialMedia {
      instagram,
      facebook,
      linkedin
    }
  }
`;

const analyticsSettingsFragment = groq`
  analyticsSettings {
    googleAnalyticsId,
    googleTagManagerId,
    facebookPixelId
  }
`;

// Content block fragments
const heroBlockFragment = groq`
  _type == "hero" => {
    _type,
    _key,
    headline,
    subheadline,
    backgroundVideo,
    backgroundImage {
      ${imageFragment}
    },
    ctaButton {
      text,
      link,
      style
    }
  }
`;

const textSectionFragment = groq`
  _type == "textSection" => {
    _type,
    _key,
    title,
    content,
    alignment,
    backgroundColor
  }
`;

const serviceGridFragment = groq`
  _type == "serviceGrid" => {
    _type,
    _key,
    title,
    subtitle,
    services[]-> {
      _id,
      title,
      slug,
      subtitle,
      heroImage {
        ${imageFragment}
      },
      heroImageUrl,
      accentColor {
        hex
      },
      "themeColor": accentColor {
        hex
      },
      order
    }
  }
`;

const testimonialsFragment = groq`
  _type == "testimonials" => {
    _type,
    _key,
    title,
    testimonials[] {
      name,
      text,
      rating,
      image {
        ${imageFragment}
      }
    }
  }
`;

const newsletterFragment = groq`
  _type == "newsletter" => {
    _type,
    _key,
    title,
    subtitle,
    placeholder,
    buttonText,
    backgroundColor
  }
`;

// Main GROQ queries
export const queries = {
  // Global settings query
  globalSettings: groq`
    *[_type == "globalSettings"][0] {
      ${businessInfoFragment},
      ${analyticsSettingsFragment},
      ${seoFragment}
    }
  `,

  // Page queries
  pageBySlug: groq`
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      ${seoFragment},
      content[] {
        ${heroBlockFragment},
        ${textSectionFragment},
        ${serviceGridFragment},
        ${testimonialsFragment},
        ${newsletterFragment}
      }
    }
  `,

  allPages: groq`
    *[_type == "page"] {
      _id,
      title,
      slug,
      _updatedAt
    }
  `,

  // Service queries
  serviceBySlug: groq`
    *[_type == "service" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      subtitle,
      description,
      heroImage {
        ${imageFragment}
      },
      heroImageUrl,
      backgroundImage {
        ${imageFragment}
      },
      backgroundImageUrl,
      textureImage {
        ${imageFragment}
      },
      textureImageUrl,
      order,
      version,
      accentColor {
        hex
      },
      "themeColor": accentColor {
        hex
      },
      tagline,
      benefits[] {
        title,
        description
      },
      process[] {
        step,
        title,
        description
      },
      cta {
        title,
        text,
        link
      },
      ${seoFragment}
    }
  `,

  allServices: groq`
    *[_type == "service"] | order(order asc) {
      _id,
      title,
      slug,
      subtitle,
      heroImage {
        ${imageFragment}
      },
      accentColor {
        hex
      },
      "themeColor": accentColor {
        hex
      },
      order,
      _updatedAt
    }
  `,

  // Minimal queries for performance
  pageMetadata: groq`
    *[_type == "page" && slug.current == $slug][0] {
      title,
      ${seoFragment}
    }
  `,

  serviceMetadata: groq`
    *[_type == "service" && slug.current == $slug][0] {
      title,
      ${seoFragment}
    }
  `,

  // Sitemap queries
  allSlugs: groq`
    {
      "pages": *[_type == "page"]{ slug, _updatedAt },
      "services": *[_type == "service"]{ slug, _updatedAt }
    }
  `,
};

// Content fetching functions with validation and fallbacks
export async function getGlobalSettings(preview = false): Promise<GlobalSettings | null> {
  try {
    return await getContentWithCache<GlobalSettings>(
      queries.globalSettings,
      {},
      {
        preview,
        validateResult: (result): result is GlobalSettings => {
          return result && typeof result === 'object' && 'businessInfo' in result;
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch global settings:', error);
    return null;
  }
}

export async function getPageBySlug(slug: string, preview = false): Promise<PageContent | null> {
  try {
    return await getContentWithCache<PageContent>(
      queries.pageBySlug,
      { slug },
      {
        preview,
        validateResult: (result): result is PageContent => {
          return result && typeof result === 'object' && 'title' in result && 'slug' in result;
        },
      }
    );
  } catch (error) {
    console.error(`Failed to fetch page content for slug "${slug}":`, error);
    return null;
  }
}

export async function getServiceBySlug(slug: string, preview = false): Promise<ServiceData | null> {
  try {
    return await getContentNoStore<ServiceData>(
      queries.serviceBySlug,
      { slug },
      {
        preview,
        validateResult: (result): result is ServiceData => {
          return result && typeof result === 'object' && 'title' in result && 'slug' in result;
        },
      }
    );
  } catch (error) {
    console.error(`Failed to fetch service content for slug "${slug}":`, error);
    return null;
  }
}

export async function getAllServices(preview = false): Promise<ServiceData[]> {
  try {
    const services = await getContentNoStore<ServiceData[]>(
      queries.allServices,
      {},
      {
        preview,
        validateResult: (result): result is ServiceData[] => {
          return Array.isArray(result);
        },
        fallback: [],
      }
    );
    return services;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

export async function getAllPages(
  preview = false
): Promise<Array<{ _id: string; title: string; slug: { current: string }; _updatedAt: string }>> {
  try {
    const pages = await getContentWithCache<
      Array<{ _id: string; title: string; slug: { current: string }; _updatedAt: string }>
    >(
      queries.allPages,
      {},
      {
        preview,
        validateResult: (
          result
        ): result is Array<{
          _id: string;
          title: string;
          slug: { current: string };
          _updatedAt: string;
        }> => {
          return Array.isArray(result);
        },
        fallback: [],
      }
    );
    return pages;
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return [];
  }
}

// Metadata-only fetching for performance
export async function getPageMetadata(
  slug: string,
  preview = false
): Promise<{ title: string; seo: SEOSettings } | null> {
  try {
    return await getContentWithCache<{ title: string; seo: SEOSettings }>(
      queries.pageMetadata,
      { slug },
      { preview }
    );
  } catch (error) {
    console.error(`Failed to fetch page metadata for slug "${slug}":`, error);
    return null;
  }
}

export async function getServiceMetadata(
  slug: string,
  preview = false
): Promise<{ title: string; seo: SEOSettings } | null> {
  try {
    return await getContentWithCache<{ title: string; seo: SEOSettings }>(
      queries.serviceMetadata,
      { slug },
      { preview }
    );
  } catch (error) {
    console.error(`Failed to fetch service metadata for slug "${slug}":`, error);
    return null;
  }
}

// Sitemap generation
export async function getAllSlugs(): Promise<{
  pages: Array<{ slug: { current: string }; _updatedAt: string }>;
  services: Array<{ slug: { current: string }; _updatedAt: string }>;
}> {
  try {
    return await getContentWithCache<{
      pages: Array<{ slug: { current: string }; _updatedAt: string }>;
      services: Array<{ slug: { current: string }; _updatedAt: string }>;
    }>(
      queries.allSlugs,
      {},
      {
        fallback: { pages: [], services: [] },
      }
    );
  } catch (error) {
    console.error('Failed to fetch slugs for sitemap:', error);
    return { pages: [], services: [] };
  }
}

// Content validation helpers
export function validatePageContent(content: unknown): content is PageContent {
  return (
    content &&
    typeof content === 'object' &&
    'title' in content &&
    'slug' in content &&
    Array.isArray((content as any).content)
  );
}

export function validateServiceData(service: unknown): service is ServiceData {
  return (
    service &&
    typeof service === 'object' &&
    'title' in service &&
    'slug' in service &&
    'description' in service
  );
}

export function validateGlobalSettings(settings: unknown): settings is GlobalSettings {
  return settings && typeof settings === 'object' && 'businessInfo' in settings;
}

// Cache invalidation helpers
export function getCacheKey(query: string, params: Record<string, unknown> = {}): string {
  return `sanity:${query}:${JSON.stringify(params)}`;
}

// Content freshness check
export async function checkContentFreshness(
  type: 'page' | 'service',
  slug: string
): Promise<{ lastModified: string | null; isFresh: boolean }> {
  try {
    const query = groq`*[_type == "${type}" && slug.current == $slug][0]._updatedAt`;
    const lastModified = await getContentWithCache<string>(query, { slug }, { raw: true });

    if (!lastModified) {
      return { lastModified: null, isFresh: false };
    }

    // Consider content fresh if updated within last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const isFresh = new Date(lastModified) > oneHourAgo;

    return { lastModified, isFresh };
  } catch (error) {
    console.error(`Failed to check content freshness for ${type}:${slug}`, error);
    return { lastModified: null, isFresh: false };
  }
}
