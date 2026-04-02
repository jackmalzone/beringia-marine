import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const AboutPageClient = dynamic(() => import('./AboutPageClient'), {
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

// Export metadata for the about page
export const metadata: Metadata = mergeMetadata('about');

// Enable ISR for better performance (longer revalidation for static content)
export const revalidate = 86400; // Revalidate every 24 hours

const AboutPage = () => {
  return (
    <>
      <ServerSideSEO pageKey="about" />
      <AboutPageClient />
    </>
  );
};

export default AboutPage;
