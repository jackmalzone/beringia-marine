import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/', '*.json'],
    },
    sitemap: 'https://www.vitalicesf.com/sitemap.xml',
  };
}
