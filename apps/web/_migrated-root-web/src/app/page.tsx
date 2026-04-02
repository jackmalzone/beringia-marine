import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const HomePage = dynamic(() => import('@/components/pages/HomePage/HomePage'), {
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

export const metadata: Metadata = mergeMetadata('home');

// Enable ISR for better performance and SEO
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <>
      <ServerSideSEO pageKey="home" />
      <HomePage />
    </>
  );
}
