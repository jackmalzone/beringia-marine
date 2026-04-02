import { client } from '@/sanity/lib/client';

/* All query functions below guard on client/env availability and return
   safe fallback values when Sanity is not configured. */

/**
 * GROQ query for fetching all published articles
 * Handles optional fields safely
 */
const ALL_ARTICLES_QUERY = `
  *[_type == "article" && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )] | order(publishDate desc) {
    _id,
    title,
    subtitle,
    abstract,
    content,
    "category": category->name,
    "author": coalesce(author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    }, author),
    publishDate,
    publishAt,
    status,
    "coverImage": coverImage.asset->url,
    "heroImage": heroImage.asset->url,
    "heroImageSplit": heroImageSplit {
      "left": left.asset->url,
      "right": right.asset->url
    },
    tags,
    "slug": slug.current,
    pdfUrl,
    readingTime,
    "seo": seo {
      title,
      description,
      "ogImage": openGraph.image.asset->url,
      keywords,
      "twitterImage": twitter.image.asset->url
    }
  }
`;

/**
 * GROQ query for fetching a single article by slug
 */
const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )][0] {
    _id,
    title,
    subtitle,
    abstract,
    content,
    "category": category->name,
    "author": coalesce(author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    }, author),
    publishDate,
    publishAt,
    status,
    "coverImage": coverImage.asset->url,
    "heroImage": heroImage.asset->url,
    "heroImageSplit": heroImageSplit {
      "left": left.asset->url,
      "right": right.asset->url
    },
    tags,
    "slug": slug.current,
    pdfUrl,
    readingTime,
    "seo": seo {
      title,
      description,
      "ogImage": openGraph.image.asset->url,
      keywords,
      "twitterImage": twitter.image.asset->url
    }
  }
`;

/**
 * GROQ query for fetching articles by category
 */
const ARTICLES_BY_CATEGORY_QUERY = `
  *[_type == "article" && category->name == $category && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )] | order(publishDate desc) {
    _id,
    title,
    subtitle,
    abstract,
    content,
    "category": category->name,
    "author": coalesce(author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    }, author),
    publishDate,
    publishAt,
    status,
    "coverImage": coverImage.asset->url,
    "heroImage": heroImage.asset->url,
    "heroImageSplit": heroImageSplit {
      "left": left.asset->url,
      "right": right.asset->url
    },
    tags,
    "slug": slug.current,
    pdfUrl,
    readingTime,
    "seo": seo {
      title,
      description,
      "ogImage": openGraph.image.asset->url,
      keywords,
      "twitterImage": twitter.image.asset->url
    }
  }
`;

/**
 * GROQ query for searching articles
 */
const SEARCH_ARTICLES_QUERY = `
  *[_type == "article" && (
    title match $query || 
    abstract match $query || 
    $query in tags
  ) && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )] | order(publishDate desc) {
    _id,
    title,
    subtitle,
    abstract,
    "category": category->name,
    "author": coalesce(author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    }, author),
    publishDate,
    "coverImage": coverImage.asset->url,
    tags,
    "slug": slug.current
  }
`;

/**
 * Fetch all published articles from Sanity
 * @returns Array of articles and a flag indicating if data came from Sanity
 */
export async function fetchAllArticles(): Promise<{ articles: any[]; fromSanity: boolean }> {
  // Validate environment variables
  if (!client || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Sanity environment variables not set, articles will use fallback data');
    }
    return { articles: [], fromSanity: false };
  }

  try {
    const articles = await client.fetch(ALL_ARTICLES_QUERY, {}, {
      next: { revalidate: 0 },
    });
    return { articles: articles || [], fromSanity: true };
  } catch (error: any) {
    // Only log detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching articles from Sanity:', error?.message || error);
      if (error instanceof Error && error.stack) {
        console.error('Stack:', error.stack);
      }
    }
    return { articles: [], fromSanity: false };
  }
}

/**
 * Fetch a single article by slug from Sanity
 * @returns Article and a flag indicating if data came from Sanity
 */
export async function fetchArticleBySlug(slug: string): Promise<{ article: any | null; fromSanity: boolean }> {
  if (!client || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return { article: null, fromSanity: false };
  }

  try {
    const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug }, {
      next: { revalidate: 0 },
    });
    return { article: article || null, fromSanity: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching article from Sanity:', error instanceof Error ? error.message : error);
    }
    return { article: null, fromSanity: false };
  }
}

/**
 * Fetch articles by category from Sanity
 * @returns Array of articles and a flag indicating if data came from Sanity
 */
export async function fetchArticlesByCategory(category: string): Promise<{ articles: any[]; fromSanity: boolean }> {
  if (!client || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return { articles: [], fromSanity: false };
  }

  try {
    const articles = await client.fetch(ARTICLES_BY_CATEGORY_QUERY, { category }, {
      next: { revalidate: 0 },
    });
    return { articles: articles || [], fromSanity: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching articles by category from Sanity:', error instanceof Error ? error.message : error);
    }
    return { articles: [], fromSanity: false };
  }
}

/**
 * Search articles from Sanity
 * @returns Array of articles and a flag indicating if data came from Sanity
 */
export async function searchArticles(query: string): Promise<{ articles: any[]; fromSanity: boolean }> {
  if (!client || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return { articles: [], fromSanity: false };
  }

  try {
    const articles = await client.fetch(SEARCH_ARTICLES_QUERY, { query: `*${query}*` }, {
      next: { revalidate: 0 },
    });
    return { articles: articles || [], fromSanity: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error searching articles from Sanity:', error instanceof Error ? error.message : error);
    }
    return { articles: [], fromSanity: false };
  }
}
