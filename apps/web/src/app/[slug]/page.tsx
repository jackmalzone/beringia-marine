import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPages } from '@/lib/sanity/queries';
import { generateSanityMetadata } from '@/lib/sanity/seo';
import DynamicPageRenderer from '@/components/shared/DynamicPageRenderer/DynamicPageRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Normalize and validate slug
 * Decodes URL-encoded characters and validates the slug is valid
 */
function normalizeSlug(slug: string): string | null {
  if (!slug) return null;
  
  // Decode URL-encoded characters (e.g., %2F becomes /)
  let decoded: string;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // If decoding fails, use original
    decoded = slug;
  }
  
  // Filter out invalid slugs
  if (decoded === '/' || decoded === '' || decoded.startsWith('/')) {
    return null;
  }
  
  // Filter out slugs with invalid characters for Sanity
  if (decoded.includes('%') || decoded.includes('?')) {
    return null;
  }

  // Filter out static asset / browser-generated requests
  if (/\.(js|json|css|ico|png|jpg|svg|map|txt|xml|woff2?)$/i.test(decoded)) {
    return null;
  }
  
  return decoded;
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug: rawSlug } = await params;
    const slug = normalizeSlug(rawSlug);
    
    if (!slug) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }
    
    const page = await getPageBySlug(slug);
    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }
    const metadata = generateSanityMetadata(page);
    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        canonical: `/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the page.',
    };
  }
}

// Enable ISR
export const revalidate = 3600; // Revalidate every hour

export default async function DynamicPage({ params }: PageProps) {
  try {
    const { slug: rawSlug } = await params;
    const slug = normalizeSlug(rawSlug);
    
    if (!slug) {
      notFound();
    }
    
    const page = await getPageBySlug(slug);

    if (!page) {
      notFound();
    }

    return <DynamicPageRenderer page={page} />;
  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
}
