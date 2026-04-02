'use client';

import Link from 'next/link';
import { ArticleData, getCategoryColor } from '@/types/insights';
import { calculateReadingTime } from '@/lib/data/insights';
import AuthorCard from '@/components/insights/AuthorCard/AuthorCard';
import styles from './ArticleHero.module.css';

interface ArticleHeroProps {
  article: ArticleData;
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  const categoryColor = getCategoryColor(article.category);
  const readingTime = article.readingTime || calculateReadingTime(article.content);

  // Format publish date
  const publishDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePdfDownload = () => {
    if (article.pdfUrl) {
      window.open(article.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Determine background style
  const getBackgroundStyle = () => {
    // Don't apply heroImage background if heroImageSplit exists
    if (article.heroImage && !article.heroImageSplit) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${article.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return undefined;
  };

  return (
    <section className={styles.hero} style={getBackgroundStyle()}>
      {/* Split background images */}
      {article.heroImageSplit && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              backgroundImage: `url(${article.heroImageSplit.left})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              backgroundImage: `url(${article.heroImageSplit.right})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))',
              zIndex: 1,
            }}
          />
        </>
      )}
      {/* Content */}
      <div className={styles.hero__content}>
        {/* Back Link */}
        <Link href="/insights" className={styles.hero__backLink}>
          <svg
            className={styles.hero__backIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Insights
        </Link>

        {/* Meta Information */}
        <div className={styles.hero__meta}>
          <span className={styles.hero__category} style={{ backgroundColor: categoryColor }}>
            {article.category}
          </span>
          <span className={styles.hero__date}>{publishDate}</span>
          <span className={styles.hero__readingTime}>{readingTime} min read</span>
        </div>

        {/* Title and Subtitle */}
        <h1 className={styles.hero__title}>{article.title}</h1>
        <p className={styles.hero__subtitle}>{article.subtitle}</p>

        {/* Author Information */}
        <AuthorCard author={article.author} className={styles.hero__authorCard} />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className={styles.hero__tags}>
            {article.tags.map(tag => (
              <span key={tag} className={styles.hero__tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* PDF Download Button */}
        {article.pdfUrl && (
          <button
            onClick={handlePdfDownload}
            className={styles.hero__pdfButton}
            aria-label={`Download ${article.title} as PDF`}
          >
            <svg
              className={styles.hero__pdfIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 12.5L6.25 8.75L7.5 7.5L9.375 9.375V2.5H10.625V9.375L12.5 7.5L13.75 8.75L10 12.5Z"
                fill="currentColor"
              />
              <path
                d="M3.75 17.5C3.41848 17.5 3.10054 17.3683 2.86612 17.1339C2.6317 16.8995 2.5 16.5815 2.5 16.25V13.75H3.75V16.25H16.25V13.75H17.5V16.25C17.5 16.5815 17.3683 16.8995 17.1339 17.1339C16.8995 17.3683 16.5815 17.5 16.25 17.5H3.75Z"
                fill="currentColor"
              />
            </svg>
            Download PDF
          </button>
        )}
      </div>
    </section>
  );
}
