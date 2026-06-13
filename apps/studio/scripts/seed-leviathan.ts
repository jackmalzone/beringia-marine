/**
 * Targeted seed for the Leviathan Autonomy partner.
 *
 *   pnpm --filter @beringia/studio exec tsx scripts/seed-leviathan.ts --dry-run
 *   pnpm --filter @beringia/studio exec tsx scripts/seed-leviathan.ts
 *
 * Writes ONLY the `partner.leviathan-autonomy` document so we don't re-upload the
 * other partners' image assets. Reuses buildPartnerDocument so the field mapping
 * stays identical to the canonical `seed` path. Idempotent (createOrReplace).
 */
import './seed-lib/env';

import { sanity } from './seed-lib/client';
import { withRetry } from './seed-lib/retry';
import { buildPartnerDocument } from './seed-lib/partners';
import type { PartnerJson } from '../../web/src/lib/content/partner-content';
import leviathan from '../../web/src/lib/content/partners/leviathan-autonomy.json';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) console.log('— DRY RUN — no writes will be performed.\n');

  const doc = await buildPartnerDocument(leviathan as unknown as PartnerJson);

  if (dryRun) {
    console.log(JSON.stringify(doc, null, 2));
    console.log(`\nWould write ${doc._id} (status: ${doc.status}).`);
    return;
  }

  await withRetry(() => sanity.createOrReplace(doc), doc._id);
  console.log(`✓ wrote ${doc._id}  (slug: ${doc.slug.current})`);
}

main().catch((err) => {
  console.error('\nseed-leviathan failed:', err);
  process.exit(1);
});
