/**
 * Verbatim article HTML from migration/beringia/copy/insights/articles/verbatim/
 * Files live under ./bodies/ (synced copies). Server-only: import only from Server Components.
 */
import { existsSync, readFileSync } from 'fs';
import path from 'path';

/** Slug -> filename under bodies/ */
const BODY_FILES: Record<string, string> = {
  'anchorbot-helical-anchors-alaska-mariculture':
    'anchorbot-helical-anchors-alaska-mariculture.content.html',
  'evaluating-hydrus-microauv-benthic-survey':
    'evaluating-hydrus-microauv-benthic-survey.content.detail.html',
};

function resolveBodyPath(file: string): string | null {
  const candidates = [
    path.join(process.cwd(), 'src/lib/content/insights/bodies', file),
    path.join(process.cwd(), 'apps/web/src/lib/content/insights/bodies', file),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

export function getInsightBodyHtml(slug: string): string | null {
  const file = BODY_FILES[slug];
  if (!file) return null;
  const resolved = resolveBodyPath(file);
  if (!resolved) return null;
  try {
    return readFileSync(resolved, 'utf-8');
  } catch {
    return null;
  }
}
