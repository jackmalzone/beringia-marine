import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { mergeMetadata } from '@/lib/seo/metadata';
import {
  generateBlogSchema,
  generateStructuredData,
  breadcrumbSchemas,
} from '@/lib/seo/structured-data';

// Dynamic import for client component with loading state
const InsightsPageClient = dynamic(() => import('./InsightsPageClient'), {
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>Loading insights...</div>
    </div>
  ),
  ssr: true,
});

export const metadata: Metadata = mergeMetadata('insights');
export const revalidate = 3600; // Revalidate every hour (ISR)

export default function InsightsPage() {
  // Generate structured data for SEO
  const blogSchema = generateBlogSchema();
  const breadcrumbSchema = breadcrumbSchemas.insights;

  return (
    <>
      {/* JSON-LD structured data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(blogSchema),
        }}
      />
      {/* JSON-LD structured data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(breadcrumbSchema),
        }}
      />
      <InsightsPageClient />
    </>
  );
}
