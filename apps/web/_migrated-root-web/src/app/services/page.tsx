import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const ServicesPageClient = dynamic(() => import('./ServicesPageClient'), {
  ssr: true,
});

// Export metadata for the services page
export const metadata: Metadata = mergeMetadata('services');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

const ServicesPage = () => {
  return (
    <>
      <ServerSideSEO pageKey="services" />
      <ServicesPageClient />
    </>
  );
};

export default ServicesPage;
