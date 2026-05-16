import { client } from './client';
import type {
  SanityInsight,
  SanityPartner,
  SanitySiteSettings,
} from './types';

const groq = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');

const seoProjection = groq`
  seo {
    title, description, keywords, noIndex, canonicalUrl,
    ogImage { ..., asset->{ _id, url } }
  }
`;

const insightProjection = groq`
  _id, _type, _updatedAt,
  title,
  slug,
  category,
  contentType,
  excerpt,
  deck,
  author,
  coverImage { ..., asset->{ _id, url } },
  body,
  tags,
  readingTime,
  publishedAt,
  updatedAt,
  pdfUrl,
  featured,
  ${seoProjection}
`;

const partnerProjection = groq`
  _id, _type, _updatedAt,
  name,
  slug,
  tagline,
  headerImage { ..., asset->{ _id, url } },
  overview,
  sellingPoints {
    title,
    points[] {
      title, description, features,
      icon { ..., asset->{ _id, url } }
    }
  },
  useCases,
  valueProposition,
  documents,
  externalLinks,
  status,
  featured,
  ${seoProjection}
`;

export const queries = {
  insightBySlug: groq`*[_type == "insight" && slug.current == $slug][0] { ${insightProjection} }`,
  allInsights: groq`*[_type == "insight"] | order(publishedAt desc) { ${insightProjection} }`,
  allInsightSlugs: groq`*[_type == "insight"]{ "slug": slug.current, _updatedAt }`,
  partnerBySlug: groq`*[_type == "partner" && slug.current == $slug][0] { ${partnerProjection} }`,
  allPartners: groq`*[_type == "partner" && status == "active"] | order(orderRank asc, name asc) { ${partnerProjection} }`,
  allPartnerSlugs: groq`*[_type == "partner"]{ "slug": slug.current, _updatedAt }`,
  siteSettings: groq`*[_id == "siteSettings"][0]`,
};

async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params ?? {}, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[sanity] fetch error', { query: query.slice(0, 80), error });
    }
    return null;
  }
}

export async function getInsightBySlug(slug: string): Promise<SanityInsight | null> {
  return safeFetch<SanityInsight>(queries.insightBySlug, { slug });
}

export async function getAllInsights(): Promise<SanityInsight[]> {
  return (await safeFetch<SanityInsight[]>(queries.allInsights)) ?? [];
}

export async function getInsightSlugs(): Promise<Array<{ slug: string; _updatedAt: string }>> {
  return (await safeFetch<Array<{ slug: string; _updatedAt: string }>>(queries.allInsightSlugs)) ?? [];
}

export async function getPartnerBySlug(slug: string): Promise<SanityPartner | null> {
  return safeFetch<SanityPartner>(queries.partnerBySlug, { slug });
}

export async function getAllPartners(): Promise<SanityPartner[]> {
  return (await safeFetch<SanityPartner[]>(queries.allPartners)) ?? [];
}

export async function getPartnerSlugs(): Promise<Array<{ slug: string; _updatedAt: string }>> {
  return (await safeFetch<Array<{ slug: string; _updatedAt: string }>>(queries.allPartnerSlugs)) ?? [];
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return safeFetch<SanitySiteSettings>(queries.siteSettings);
}
