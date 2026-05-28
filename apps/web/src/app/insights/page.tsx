import type { Metadata } from 'next';
import ServerSideSEO from '@/components/seo/ServerSideSEO';
import { mergeMetadata } from '@/lib/seo/metadata';
import { generateStructuredData } from '@/lib/seo/structured-data';
import { INSIGHTS_LANDING } from '@/lib/content/insights';
import { resolveAllInsights } from '@/sanity/lib/content-resolvers';
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

export default async function InsightsPage() {
  const insights = await resolveAllInsights();
  const collectionSchema = buildInsightsCollectionSchema(insights);

  return (
    <main className={styles.page}>
      <ServerSideSEO pageKey="insights" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateStructuredData(collectionSchema) }}
      />

      <div className={styles.insightsField}>
        <InsightsListingClient entries={insights} landing={INSIGHTS_LANDING} />
      </div>
    </main>
  );
}
