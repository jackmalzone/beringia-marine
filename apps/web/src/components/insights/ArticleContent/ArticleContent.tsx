import { ArticleData } from '@/types/insights';
import styles from './ArticleContent.module.css';
import ArticlePdfButton from './ArticlePdfButton';

interface ArticleContentProps {
  article: ArticleData;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className={styles.content}>
      <div className={styles.content__container}>
        {/* Article HTML Content - Server-rendered for SEO */}
        <div
          className={styles.content__body}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Bottom PDF Download Button - Client component for interactivity */}
        {article.pdfUrl && (
          <div className={styles.content__footer}>
            <ArticlePdfButton pdfUrl={article.pdfUrl} title={article.title} />
          </div>
        )}
      </div>
    </article>
  );
}
