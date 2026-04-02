/**
 * Server-rendered article links for crawler discovery
 * Renders links in HTML for SEO - styled to be unobtrusive
 */

import Link from 'next/link';
import type { ArticleData } from '@/types/insights';

interface InsightsArticlesListProps {
  articles: ArticleData[];
}

export default function InsightsArticlesList({ articles }: InsightsArticlesListProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Insights articles"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    >
      {articles.map((article) => (
        <Link key={article.id} href={`/insights/${article.slug}`}>
          {article.title}
        </Link>
      ))}
    </nav>
  );
}
