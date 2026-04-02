import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const PercussionMassagePageClient = dynamic(() => import('./PercussionMassagePageClient'), {
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

// Export metadata for the percussion massage service page
export const metadata: Metadata = mergeMetadata('percussion-massage');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

const PercussionMassagePage = () => {
  return (
    <>
      <ServerSideSEO pageKey="percussion-massage" />
      <PercussionMassagePageClient />
    </>
  );
};

export default PercussionMassagePage;
