import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const ColdPlungePageClient = dynamic(() => import('./ColdPlungePageClient'), {
  ssr: true,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'var(--font-body)',
      }}
    >
      Loading...
    </div>
  ),
});

// Export metadata for the cold plunge service page
export const metadata: Metadata = mergeMetadata('cold-plunge');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

const ColdPlungePage = () => {
  return (
    <>
      <ServerSideSEO pageKey="cold-plunge" />
      <ColdPlungePageClient />
    </>
  );
};

export default ColdPlungePage;
