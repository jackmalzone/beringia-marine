import type { Metadata } from 'next';
import ServerSideSEO from '@/components/seo/ServerSideSEO';
import { mergeMetadata } from '@/lib/seo/metadata';
import { generateStructuredData } from '@/lib/seo/structured-data';
import { INSIGHTS, INSIGHTS_LANDING } from '@/lib/content/insights';
import { buildInsightsCollectionSchema } from '@/lib/seo/insights-structured-data';
import InsightsListingClient from './InsightsListingClient';
import styles from './index.module.css';

export const metadata: Metadata = mergeMetadata('insights', {
  title: INSIGHTS_LANDING.seo.title,
  description: INSIGHTS_LANDING.seo.description,
  openGraph: {
    title: INSIGHTS_LANDING.seo.title,
    description: INSIGHTS_LANDING.seo.description,
  },
  twitter: {
    title: INSIGHTS_LANDING.seo.title,
    description: INSIGHTS_LANDING.seo.description,
  },
});

export default function InsightsPage() {
  const collectionSchema = buildInsightsCollectionSchema(INSIGHTS);

  return (
    <main className={styles.page}>
      <ServerSideSEO pageKey="insights" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateStructuredData(collectionSchema) }}
      />

      <div className={styles.insightsField}>
        <InsightsListingClient entries={INSIGHTS} landing={INSIGHTS_LANDING} />
      </div>
    </main>
  );
}
