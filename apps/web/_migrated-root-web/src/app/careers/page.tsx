import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';

// Dynamic import with SSR enabled for better SEO
const CareersPageClient = dynamic(() => import('./CareersPageClient'), {
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

// Export metadata for the careers page
export const metadata: Metadata = mergeMetadata('careers');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

const CareersPage = () => {
  return <CareersPageClient />;
};

export default CareersPage;
