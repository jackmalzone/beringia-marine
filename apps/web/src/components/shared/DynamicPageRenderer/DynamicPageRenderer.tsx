import { PageContent } from '@/lib/sanity/types';
import DynamicContentRenderer from '@/components/shared/DynamicContentRenderer/DynamicContentRenderer';
import PageSchema from '@/components/seo/PageSchema';
import styles from './DynamicPageRenderer.module.css';

interface DynamicPageRendererProps {
  page: PageContent;
}

export default function DynamicPageRenderer({ page }: DynamicPageRendererProps) {
  if (!page) {
    return (
      <div className={styles.error}>
        <h1>Page Not Found</h1>
        <p>The requested page could not be found.</p>
      </div>
    );
  }

  return (
    <>
      <PageSchema pageKey={page.slug.current} />
      <main className={styles.main} data-seo-main>
        {page.content && page.content.length > 0 ? (
          <DynamicContentRenderer content={page.content} />
        ) : (
          <div className={styles.noContent}>
            <h1>{page.title}</h1>
            <p>This page has no content blocks configured.</p>
          </div>
        )}
      </main>
    </>
  );
}
