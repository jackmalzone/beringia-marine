/**
 * Migration seed script — imports the static Beringia Marine content under
 * apps/web/src/lib/content/ into the Sanity dataset.
 *
 *   pnpm --filter @beringia/studio seed:dry   # preview without writing
 *   pnpm --filter @beringia/studio seed       # write to dataset
 *
 * Idempotent: insights use `insight.<slug>` IDs and partners use `partner.<slug>`,
 * so re-running replaces existing documents rather than creating duplicates.
 * Sanity dedups image asset uploads by content hash server-side.
 */
import './seed-lib/env';

import { seedInsights } from './seed-lib/insights';
import { seedPartners } from './seed-lib/partners';
import { seedSiteSettings } from './seed-lib/site-settings';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) {
    console.log('— DRY RUN — no writes will be performed.\n');
  }

  await seedSiteSettings({ dryRun });
  const insightsCount = await seedInsights({ dryRun });
  const partnersCount = await seedPartners({ dryRun });

  console.log(
    `\nDone. ${insightsCount} insight${insightsCount === 1 ? '' : 's'} and ${partnersCount} partner${
      partnersCount === 1 ? '' : 's'
    } ${dryRun ? 'would be' : ''} seeded.`
  );
}

main().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});
