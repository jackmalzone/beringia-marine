import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR enabled for better SEO
const BookPageClient = dynamic(() => import('./BookPageClient'), {
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
      Loading booking...
    </div>
  ),
});

// Export metadata for the book page
export const metadata: Metadata = mergeMetadata('book');

// Enable ISR for better performance
export const revalidate = 3600; // Revalidate every hour

const BookPage = () => {
  return (
    <>
      <ServerSideSEO pageKey="book" />
      <BookPageClient />
    </>
  );
};

export default BookPage;
