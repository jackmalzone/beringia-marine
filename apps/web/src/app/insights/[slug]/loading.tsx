/**
 * Article Page Loading State
 *
 * Route-level loading UI for individual article pages.
 * Displays skeleton matching the article layout.
 */

import styles from './loading.module.css';

export default function ArticleLoading() {
  return (
    <div className={styles.loading}>
      {/* Hero Skeleton */}
      <div className={styles.loading__hero}>
        <div className={styles.loading__backLink} />
        <div className={styles.loading__category} />
        <div className={styles.loading__date} />
        <div className={styles.loading__title} />
        <div className={styles.loading__subtitle} />
        <div className={styles.loading__meta}>
          <div className={styles.loading__author} />
          <div className={styles.loading__readTime} />
        </div>
        <div className={styles.loading__tags}>
          <div className={styles.loading__tag} />
          <div className={styles.loading__tag} />
          <div className={styles.loading__tag} />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className={styles.loading__content}>
        <div className={styles.loading__paragraph} />
        <div className={styles.loading__paragraph} />
        <div className={styles.loading__heading} />
        <div className={styles.loading__paragraph} />
        <div className={styles.loading__paragraph} />
        <div className={styles.loading__heading} />
        <div className={styles.loading__paragraph} />
      </div>
    </div>
  );
}
