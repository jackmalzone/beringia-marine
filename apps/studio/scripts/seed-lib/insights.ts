import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { sanity } from './client';
import { uploadImageAsset, imageRef } from './assets';
import { htmlToPortableText } from './html-to-pt';
import type { InsightEntry } from '../../../web/src/lib/content/insights-data';
import { INSIGHTS } from '../../../web/src/lib/content/insights-data';

const REPO_ROOT = resolve(__dirname, '..', '..', '..', '..');

const BODY_FILES: Record<string, string> = {
  'anchorbot-helical-anchors-alaska-mariculture':
    'apps/web/src/lib/content/insights/bodies/anchorbot-helical-anchors-alaska-mariculture.content.html',
  'evaluating-hydrus-microauv-benthic-survey':
    'apps/web/src/lib/content/insights/bodies/evaluating-hydrus-microauv-benthic-survey.content.detail.html',
  'unified-marine-vehicle-operating-architecture':
    'apps/web/src/lib/content/insights/bodies/unified-marine-vehicle-operating-architecture.content.html',
  'anchorbot-teamer-pull-strength-report':
    'apps/web/src/lib/content/insights/bodies/anchorbot-teamer-pull-strength-report.content.html',
};

const CATEGORY_MAP: Record<string, string> = {
  Article: 'Article',
  'White Paper': 'White Paper',
  'Case Study': 'Case Study',
  'Field Report': 'Field Report',
  'Research Summary': 'Research Summary',
};

function readBody(slug: string): string | null {
  const rel = BODY_FILES[slug];
  if (!rel) return null;
  const abs = resolve(REPO_ROOT, rel);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, 'utf-8');
}

export async function buildInsightDocument(entry: InsightEntry) {
  const cover = await uploadImageAsset(entry.coverImage);
  if (!cover) {
    throw new Error(`[insights] could not resolve coverImage for ${entry.slug}: ${entry.coverImage}`);
  }

  const html = readBody(entry.slug);
  const body = html ? await htmlToPortableText(html) : [];
  if (body.length === 0) {
    console.warn(`[insights] ${entry.slug} has no HTML body; created with empty body.`);
  }

  return {
    _id: `insight.${entry.slug}`,
    _type: 'insight' as const,
    title: entry.title,
    slug: { _type: 'slug' as const, current: entry.slug },
    category: CATEGORY_MAP[entry.category] || 'Article',
    contentType: entry.contentType,
    excerpt: entry.excerpt,
    deck: entry.deck,
    author: entry.author,
    coverImage: imageRef(cover._id, entry.title),
    body,
    tags: entry.tags || [],
    readingTime: entry.readingTime,
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt || entry.publishedAt,
    pdfUrl: entry.pdfUrl,
    featured: !!entry.featured,
    seo: {
      _type: 'seoSettings' as const,
      title: entry.seo.title,
      description: entry.seo.description,
      ...(entry.tags?.length ? { keywords: entry.tags } : {}),
    },
  };
}

export async function seedInsights(opts: { dryRun: boolean }): Promise<number> {
  console.log(`[insights] seeding ${INSIGHTS.length} entries…`);
  let count = 0;
  for (const entry of INSIGHTS) {
    try {
      const doc = await buildInsightDocument(entry);
      if (opts.dryRun) {
        console.log(`  · ${doc._id}  (body blocks: ${doc.body.length})  — dry run, not written`);
      } else {
        await sanity.createOrReplace(doc);
        console.log(`  · ${doc._id}  ✓`);
      }
      count++;
    } catch (error) {
      console.error(`  · ${entry.slug}  ✗`, error);
    }
  }
  return count;
}
