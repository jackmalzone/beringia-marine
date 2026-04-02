import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/config/site-config';

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/', '*.json'],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
