import { client } from '@/sanity/lib/client';
import type { GlobalSettings, PageContent, SEOSettings, ServiceData } from '@/lib/sanity/types';

const groq = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  strings.reduce((result, current, idx) => result + current + (values[idx] ?? ''), '');

export const queries = {
  globalSettings: groq`
    *[_type == "globalSettings"][0] {
      businessInfo,
      analyticsSettings,
      seoDefaults
    }
  `,
  pageBySlug: groq`
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      seo,
      content
    }
  `,
  allPages: groq`
    *[_type == "page"] | order(_updatedAt desc) {
      _id,
      title,
      slug,
      _updatedAt
    }
  `,
  serviceBySlug: groq`
    *[_type == "service" && slug.current == $slug][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      subtitle,
      description,
      heroImage,
      heroImageUrl,
      backgroundImage,
      backgroundImageUrl,
      textureImage,
      textureImageUrl,
      order,
      version,
      "themeColor": accentColor,
      tagline,
      benefits,
      process,
      cta,
      seo
    }
  `,
  allServices: groq`
    *[_type == "service"] | order(order asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      subtitle,
      description,
      heroImage,
      heroImageUrl,
      "themeColor": accentColor,
      order,
      seo
    }
  `,
  pageMetadata: groq`
    *[_type == "page" && slug.current == $slug][0] {
      title,
      seo
    }
  `,
  serviceMetadata: groq`
    *[_type == "service" && slug.current == $slug][0] {
      title,
      seo
    }
  `,
  allSlugs: groq`
    {
      "pages": *[_type == "page"]{ slug, _updatedAt },
      "services": *[_type == "service"]{ slug, _updatedAt }
    }
  `,
};

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    return await client.fetch<GlobalSettings | null>(queries.globalSettings);
  } catch (error) {
    console.error('Failed to fetch global settings:', error);
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  try {
    return await client.fetch<PageContent | null>(queries.pageBySlug, { slug });
  } catch (error) {
    console.error(`Failed to fetch page content for slug "${slug}":`, error);
    return null;
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
  try {
    return await client.fetch<ServiceData | null>(queries.serviceBySlug, { slug });
  } catch (error) {
    console.error(`Failed to fetch service content for slug "${slug}":`, error);
    return null;
  }
}

export async function getAllServices(): Promise<ServiceData[]> {
  try {
    return await client.fetch<ServiceData[]>(queries.allServices);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

export async function getAllPages(): Promise<
  Array<{ _id: string; title: string; slug: { current: string }; _updatedAt: string }>
> {
  try {
    return await client.fetch(queries.allPages);
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return [];
  }
}

export async function getPageMetadata(slug: string): Promise<{ title: string; seo: SEOSettings } | null> {
  try {
    return await client.fetch(queries.pageMetadata, { slug });
  } catch (error) {
    console.error(`Failed to fetch page metadata for slug "${slug}":`, error);
    return null;
  }
}

export async function getServiceMetadata(slug: string): Promise<{ title: string; seo: SEOSettings } | null> {
  try {
    return await client.fetch(queries.serviceMetadata, { slug });
  } catch (error) {
    console.error(`Failed to fetch service metadata for slug "${slug}":`, error);
    return null;
  }
}

export async function getAllSlugs(): Promise<{
  pages: Array<{ slug: { current: string }; _updatedAt: string }>;
  services: Array<{ slug: { current: string }; _updatedAt: string }>;
}> {
  try {
    return await client.fetch(queries.allSlugs);
  } catch (error) {
    console.error('Failed to fetch slugs for sitemap:', error);
    return { pages: [], services: [] };
  }
}

export function validatePageContent(content: unknown): content is PageContent {
  return Boolean(
    content &&
      typeof content === 'object' &&
      'title' in content &&
      'slug' in content &&
      Array.isArray((content as PageContent).content)
  );
}

export function validateServiceData(service: unknown): service is ServiceData {
  return Boolean(
    service &&
      typeof service === 'object' &&
      'title' in service &&
      'slug' in service &&
      'description' in service
  );
}

export function validateGlobalSettings(settings: unknown): settings is GlobalSettings {
  return Boolean(settings && typeof settings === 'object' && 'businessInfo' in settings);
}

export function getCacheKey(query: string, params: Record<string, unknown> = {}): string {
  return `sanity:${query}:${JSON.stringify(params)}`;
}

export async function checkContentFreshness(
  type: 'page' | 'service',
  slug: string
): Promise<{ lastModified: string | null; isFresh: boolean }> {
  try {
    const query = groq`*[_type == "${type}" && slug.current == $slug][0]._updatedAt`;
    const lastModified = await client.fetch<string | null>(query, { slug });
    if (!lastModified) return { lastModified: null, isFresh: false };
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return { lastModified, isFresh: new Date(lastModified) > oneHourAgo };
  } catch (error) {
    console.error(`Failed to check content freshness for ${type}:${slug}`, error);
    return { lastModified: null, isFresh: false };
  }
}
