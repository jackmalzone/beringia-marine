'use client';

import { ArticleData } from '@/types/insights';
import ArticleHero from '@/components/insights/ArticleHero/ArticleHero';
import ArticleContent from '@/components/insights/ArticleContent/ArticleContent';
import { PageErrorBoundary } from '@/components/providers/PageErrorBoundary';
import styles from './page.module.css';

interface ArticlePageClientProps {
  article: ArticleData;
}

export default function ArticlePageClient({ article }: ArticlePageClientProps) {
  return (
    <PageErrorBoundary pageName="ArticlePageClient">
      <article className={styles.article}>
        {/* Article Hero */}
        <ArticleHero article={article} />

        {/* Article Content */}
        <ArticleContent article={article} />
      </article>
    </PageErrorBoundary>
  );
}
