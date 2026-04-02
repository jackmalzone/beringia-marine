/**
 * ArticleCardSkeleton Example
 *
 * Visual example demonstrating the skeleton loader in a grid layout.
 * This file is for documentation and testing purposes.
 */

import ArticleCardSkeleton from './ArticleCardSkeleton';
import styles from './ArticleCardSkeleton.example.module.css';

export default function ArticleCardSkeletonExample() {
  return (
    <div className={styles.example}>
      <h2 className={styles.example__title}>ArticleCardSkeleton Example</h2>
      <p className={styles.example__description}>
        This demonstrates the skeleton loader used during article loading.
      </p>

      {/* Grid Layout */}
      <div className={styles.example__grid}>
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
      </div>

      {/* Single Card */}
      <div className={styles.example__single}>
        <h3 className={styles.example__subtitle}>Single Skeleton</h3>
        <div style={{ maxWidth: '400px' }}>
          <ArticleCardSkeleton />
        </div>
      </div>
    </div>
  );
}
