/**
 * ArticleCardSkeleton Component
 *
 * Displays a skeleton loading state that matches the ArticleCard layout.
 * Used during initial load on the insights listing page.
 */

'use client';

import styles from './ArticleCardSkeleton.module.css';

export default function ArticleCardSkeleton() {
  return (
    <div className={styles.skeleton} aria-label="Loading article">
      {/* Cover Image Skeleton */}
      <div className={styles.skeleton__imageContainer}>
        <div className={styles.skeleton__image} />
        <div className={styles.skeleton__category} />
      </div>

      {/* Content Skeleton */}
      <div className={styles.skeleton__content}>
        {/* Title */}
        <div className={styles.skeleton__title} />

        {/* Subtitle */}
        <div className={styles.skeleton__subtitle} />

        {/* Abstract - 3 lines */}
        <div className={styles.skeleton__abstract}>
          <div className={styles.skeleton__line} />
          <div className={styles.skeleton__line} />
          <div className={`${styles.skeleton__line} ${styles['skeleton__line--short']}`} />
        </div>

        {/* Meta */}
        <div className={styles.skeleton__meta}>
          <div className={styles.skeleton__author} />
          <div className={styles.skeleton__date} />
        </div>

        {/* Tags */}
        <div className={styles.skeleton__tags}>
          <div className={styles.skeleton__tag} />
          <div className={styles.skeleton__tag} />
          <div className={styles.skeleton__tag} />
        </div>
      </div>
    </div>
  );
}
