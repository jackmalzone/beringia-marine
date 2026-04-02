'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleData, getCategoryColor, getAuthorName } from '@/types/insights';
import { motion, useInView } from '@/lib/motion';
import { useAccessibleMotion } from '@/lib/hooks/useAccessibleMotion';
import { reportError, ErrorCategory, ErrorSeverity } from '@/lib/utils/errorReporting';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: ArticleData;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const router = useRouter();
  const categoryColor = getCategoryColor(article.category);
  const authorName = getAuthorName(article.author);
  const [imageError, setImageError] = useState(false);
  const { shouldReduceMotion } = useAccessibleMotion();

  // Scroll reveal animation
  const cardRef = useRef<HTMLElement>(null);
  const isInView = useInView(cardRef, {
    once: true,
    margin: '0px 0px -100px 0px',
  });

  const handleClick = () => {
    router.push(`/insights/${article.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleImageError = () => {
    setImageError(true);
    reportError(new Error(`Failed to load image: ${article.coverImage}`), {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.LOW,
      component: 'ArticleCard',
      action: 'imageLoad',
      metadata: {
        articleId: article.id,
        articleSlug: article.slug,
        imageUrl: article.coverImage,
      },
    });
  };

  // Format publish date
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/insights/${article.slug}`} prefetch={true} style={{ textDecoration: 'none' }}>
      <motion.article
        ref={cardRef}
        className={styles.card}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Read article: ${article.title}`}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
        animate={
          shouldReduceMotion
            ? false
            : isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 30, scale: 0.95 }
        }
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                scale: 1.03,
                y: -8,
              }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : {
                scale: 0.98,
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.1,
              }
        }
      >
        {/* Cover Image with Category Badge */}
        <div className={styles.card__imageContainer}>
          {imageError ? (
            <div className={styles.card__imagePlaceholder} aria-label={article.title}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
            </div>
          ) : (
            <Image
              src={article.coverImage}
              alt={article.title}
              width={600}
              height={400}
              className={styles.card__image}
              loading="lazy"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg=="
            />
          )}
          <span className={styles.card__category} style={{ backgroundColor: categoryColor }}>
            {article.category}
          </span>
          {/* Gradient overlay on hover */}
          <div className={styles.card__imageOverlay} />
        </div>

        {/* Content */}
        <div className={styles.card__content}>
          <h2 className={styles.card__title}>{article.title}</h2>
          <p className={styles.card__subtitle}>{article.subtitle}</p>
          <p className={styles.card__abstract}>{article.abstract}</p>

          {/* Meta Information */}
          <div className={styles.card__meta}>
            <span className={styles.card__author}>{authorName}</span>
            <span className={styles.card__separator}>•</span>
            <span className={styles.card__date}>{formattedDate}</span>
          </div>

          {/* Tags (first 3) */}
          {article.tags.length > 0 && (
            <div className={styles.card__tags}>
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className={styles.card__tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
