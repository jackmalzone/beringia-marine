import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/config/site-config';
import { SOLUTIONS } from '@/lib/content/solutions';
import { INSIGHTS } from '@/lib/content/insights';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = INSIGHTS.map((entry) => ({
    url: `${baseUrl}/insights/${entry.slug}`,
    lastModified: new Date(entry.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const solutionPages: MetadataRoute.Sitemap = SOLUTIONS.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...solutionPages, ...articlePages];
}
