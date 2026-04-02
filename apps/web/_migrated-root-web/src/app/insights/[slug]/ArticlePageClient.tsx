'use client';

import { ArticleData } from '@/types/insights';
import ArticleHero from '@/components/insights/ArticleHero/ArticleHero';
import ArticleContent from '@/components/insights/ArticleContent/ArticleContent';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import styles from './page.module.css';

interface ArticlePageClientProps {
  article: ArticleData;
}

export default function ArticlePageClient({ article }: ArticlePageClientProps) {
  return (
    <ErrorBoundary level="page" componentName="ArticlePageClient">
      <article className={styles.article}>
        {/* Article Hero */}
        <ArticleHero article={article} />

        {/* Article Content */}
        <ArticleContent article={article} />
      </article>
    </ErrorBoundary>
  );
}
