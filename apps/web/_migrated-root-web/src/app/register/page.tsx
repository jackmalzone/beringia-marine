import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const RegisterPageClient = dynamic(() => import('./RegisterPageClient'), {
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
      Loading registration...
    </div>
  ),
});

// Export metadata for the register page
export const metadata: Metadata = mergeMetadata('register');

// Enable ISR for better performance
export const revalidate = 3600; // Revalidate every hour

const RegisterPage = () => {
  return (
    <>
      <ServerSideSEO pageKey="register" />
      <RegisterPageClient />
    </>
  );
};

export default RegisterPage;
