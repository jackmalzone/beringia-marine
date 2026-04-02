/**
 * Insights Loading State
 *
 * Route-level loading UI displayed during page transitions and initial load.
 * Uses skeleton loaders to match the expected content layout.
 */

import ArticleCardSkeleton from '@/components/insights/ArticleCardSkeleton/ArticleCardSkeleton';
import styles from './loading.module.css';

export default function InsightsLoading() {
  return (
    <div className={styles.loading}>
      {/* Hero Skeleton */}
      <div className={styles.loading__hero}>
        <div className={styles.loading__title} />
        <div className={styles.loading__subtitle} />
        <div className={styles.loading__filters}>
          <div className={styles.loading__filter} />
          <div className={styles.loading__filter} />
          <div className={styles.loading__filter} />
          <div className={styles.loading__filter} />
          <div className={styles.loading__filter} />
        </div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className={styles.loading__grid}>
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
      </div>
    </div>
  );
}
