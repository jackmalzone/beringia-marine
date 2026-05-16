import { sanity } from './client';

export async function seedSiteSettings(opts: { dryRun: boolean }): Promise<void> {
  const existing = await sanity.fetch('*[_id == "siteSettings"][0]');
  if (existing) {
    console.log('[siteSettings] already exists — leaving as-is');
    return;
  }

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings' as const,
    businessInfo: {
      name: 'Beringia Marine',
      legalName: 'Beringia Marine, Inc.',
      tagline: 'Marine technology consulting for ocean systems and robotics.',
      email: 'info@beringia-marine.com',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/company/beringia-marine',
    },
  };

  if (opts.dryRun) {
    console.log(`[siteSettings] would create ${doc._id} — dry run, not written`);
    return;
  }
  await sanity.create(doc);
  console.log(`[siteSettings] created ${doc._id}  ✓`);
}
