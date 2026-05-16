/**
 * Stub for the legacy Vital-Ice mock-article pipeline. The live insights routes
 * read directly from `@/lib/content/insights` (and Sanity once the seed runs);
 * this file only exists so orphan components (SearchBar, InsightsPageClient,
 * etc.) still compile until they are removed.
 */
import type { ArticleData, ArticleCategory } from '@/types/insights';
import { ARTICLE_CATEGORIES } from '@/types/insights';

export async function getAllArticles(): Promise<ArticleData[]> {
  return [];
}

export function getAllArticlesSync(): ArticleData[] {
  return [];
}

export async function getArticleBySlug(_slug: string): Promise<ArticleData | undefined> {
  return undefined;
}

export function getArticleBySlugSync(_slug: string): ArticleData | undefined {
  return undefined;
}

export async function getArticlesByCategory(_category: string): Promise<ArticleData[]> {
  return [];
}

export function getArticlesByCategorySync(_category: string): ArticleData[] {
  return [];
}

export async function getActiveCategories(): Promise<ArticleCategory[]> {
  return ARTICLE_CATEGORIES;
}

export function getActiveCategoriesSync(): ArticleCategory[] {
  return ARTICLE_CATEGORIES;
}

export async function searchArticles(_query: string): Promise<ArticleData[]> {
  return [];
}

export function searchArticlesSync(_query: string): ArticleData[] {
  return [];
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export const mockArticles: ArticleData[] = [];
