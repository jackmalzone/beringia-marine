import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getArticleBySlug, getAllArticles } from '@/lib/data/insights';
import { mergeMetadata } from '@/lib/seo/metadata';
import {
  generateArticleSchema,
  generateArticleBreadcrumb,
  generateStructuredData,
} from '@/lib/seo/structured-data';

// Dynamic import for client component
const ArticlePageClient = dynamic(() => import('./ArticlePageClient'), {
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>Loading article...</div>
    </div>
  ),
  ssr: true,
});

export const revalidate = 3600; // Revalidate every hour (ISR)

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map(article => ({
    slug: article.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return mergeMetadata('insights');
  }

  return mergeMetadata('insights', {
    title: article.seo?.title || `${article.title} | Vital Ice Insights`,
    description: article.seo?.description || article.abstract,
    keywords: article.tags,
    openGraph: {
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.abstract,
      type: 'article',
      publishedTime: article.publishDate,
      authors: [typeof article.author === 'string' ? article.author : article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.seo?.ogImage || article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.abstract,
      images: [article.seo?.ogImage || article.coverImage],
    },
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Generate structured data for SEO
  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateArticleBreadcrumb(article.title, article.slug);

  return (
    <>
      {/* JSON-LD structured data for Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(articleSchema),
        }}
      />
      {/* JSON-LD structured data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(breadcrumbSchema),
        }}
      />
      <ArticlePageClient article={article} />
    </>
  );
}
