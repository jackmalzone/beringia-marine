import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';

// Dynamic import with SSR enabled for better SEO
const ClientPolicyPageClient = dynamic(() => import('./ClientPolicyPageClient'), {
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

// Export metadata for the client-policy page
export const metadata: Metadata = mergeMetadata('client-policy');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

const ClientPolicyPage = () => {
  return <ClientPolicyPageClient />;
};

export default ClientPolicyPage;
