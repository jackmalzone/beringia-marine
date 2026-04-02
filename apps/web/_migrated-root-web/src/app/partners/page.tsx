import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';

// Dynamic import with SSR enabled for better SEO
const PartnersPageClient = dynamic(() => import('./PartnersPageClient'), {
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

// Export metadata for the partners page
export const metadata: Metadata = mergeMetadata('partners');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

const PartnersPage = () => {
  return <PartnersPageClient />;
};

export default PartnersPage;
