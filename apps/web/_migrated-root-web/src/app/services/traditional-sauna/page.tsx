import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const TraditionalSaunaPageClient = dynamic(() => import('./TraditionalSaunaPageClient'), {
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

// Export metadata for the traditional sauna service page
export const metadata: Metadata = mergeMetadata('traditional-sauna');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

const TraditionalSaunaPage = () => {
  return (
    <>
      <ServerSideSEO pageKey="traditional-sauna" />
      <TraditionalSaunaPageClient />
    </>
  );
};

export default TraditionalSaunaPage;
