import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mergeMetadata } from '@/lib/seo/metadata';
import { generateStructuredData } from '@/lib/seo/structured-data';
import { buildInsightArticleSchema } from '@/lib/seo/insights-structured-data';
import { getInsightOgImage, getInsightPath, INSIGHTS } from '@/lib/content/insights';
import { resolveInsightBySlug } from '@/sanity/lib/content-resolvers';
import styles from './detail.module.css';

// Generate metadata for SEO
export function generateStaticParams() {
  return INSIGHTS.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const insight = await resolveInsightBySlug(slug);

  if (!insight) {
    return mergeMetadata('insights');
  }

  return mergeMetadata('insights', {
    title: insight.seo.title,
    description: insight.seo.description,
    keywords: insight.tags,
    alternates: {
      canonical: getInsightPath(slug),
    },
    openGraph: {
      title: insight.seo.title,
      description: insight.seo.description,
      type: 'article',
      url: getInsightPath(slug),
      publishedTime: insight.publishedAt,
      modifiedTime: insight.updatedAt || insight.publishedAt,
      ...(insight.author ? { authors: [insight.author] } : {}),
      tags: insight.tags,
      images: [
        {
          url: getInsightOgImage(insight),
          width: 1200,
          height: 630,
          alt: insight.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: insight.seo.title,
      description: insight.seo.description,
      images: [getInsightOgImage(insight)],
    },
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = await resolveInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  const bodyHtml = insight.bodyHtml || null;
  const articleSchema = buildInsightArticleSchema(insight);

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(articleSchema),
        }}
      />

      <header className={styles.articleHeader}>
        <div className={styles.heroCover}>
          <Image
            src={insight.coverImage}
            alt=""
            fill
            className={styles.heroCoverImage}
            sizes="100vw"
            priority
          />
          <div className={styles.heroCoverScrim} aria-hidden />
          <span className={styles.heroCoverBadge}>{insight.category}</span>

          <div className={styles.heroText}>
            <div className={styles.containerNarrow}>
              <p className={styles.meta}>
                {insight.category} • {insight.contentType} • {insight.displayDate}
                {insight.readingTime ? ` • ${insight.readingTime} min read` : ''}
              </p>
              <h1>{insight.title}</h1>
              {insight.deck ? <p className={styles.deck}>{insight.deck}</p> : null}
              <p className={styles.leadAbstract}>{insight.excerpt}</p>
              {insight.author ? <p className={styles.author}>By {insight.author}</p> : null}
              {insight.tags && insight.tags.length > 0 ? (
                <ul className={styles.tagList} aria-label="Topics">
                  {insight.tags.map((tag) => (
                    <li key={tag} className={styles.tagPill}>
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
              {insight.pdfUrl ? (
                <p className={styles.heroPdf}>
                  <a
                    href={insight.pdfUrl}
                    className={styles.heroPdfLink}
                    {...(insight.pdfUrl.startsWith('/')
                      ? { download: '' }
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    Download full report (PDF)
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.containerNarrow}>
          {bodyHtml ? (
            <div
              className={styles.bodyHtml}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            insight.sections.map((section) => (
              <article key={section.heading} className={styles.section}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))
          )}

          {insight.pdfUrl ? (
            <article className={styles.downloadCard}>
              <h3>Download full report</h3>
              <p>Get the complete PDF for offline reading, sharing, or archival.</p>
              <a
                href={insight.pdfUrl}
                className={styles.downloadLink}
                {...(insight.pdfUrl.startsWith('/')
                  ? { download: '' }
                  : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                Download full report (PDF)
              </a>
            </article>
          ) : null}

        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.containerNarrow}>
          <h2>Discuss This Insight</h2>
          <p>
            If this topic maps to an active program, Beringia can help translate insight into technical and
            commercial execution.
          </p>
          <Link href="/contact" className={styles.ctaLink}>
            Contact Beringia
          </Link>
        </div>
      </section>
    </main>
  );
}
