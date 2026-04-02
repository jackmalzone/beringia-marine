/**
 * Public media checklist for insights — keep in sync with
 * `migration/beringia/copy/insights/articles-index.json` and
 * `migration/beringia/copy/insights/articles/ARTICLES_FORMAT_AND_STORAGE.md`.
 *
 * - **heroCover** — large image at top of `/insights/:slug` (same as listing `coverImage`).
 * - **embeddedInBody** — referenced inside verbatim HTML bodies under `insights/bodies/`.
 * - **ogImage** — social / metadata (may differ from hero).
 */
export const INSIGHT_ARTICLE_MEDIA = {
  'anchorbot-helical-anchors-alaska-mariculture': {
    heroCover: '/assets/anchor-bot/mariculture-seaweed-alaska.png',
    ogImage: '/desktop-anchorbot-helical-anchors-alaska-mariculture.png',
    embeddedInBody: [
      '/assets/anchor-bot/2025-Mariculture-Report/figure-1.png',
      '/assets/anchor-bot/2025-Mariculture-Report/figure-2.png',
      '/assets/anchor-bot/2025-Mariculture-Report/figure-3a.png',
      '/assets/anchor-bot/2025-Mariculture-Report/Figure-3b.png',
      '/assets/anchor-bot/2025-Mariculture-Report/figure-4.png',
    ],
  },
  'evaluating-hydrus-microauv-benthic-survey': {
    heroCover: '/hydrus-subsurface.jpeg',
    ogImage: '/desktop-evaluating-hydrus-micro-auv-benthic-survey.png',
    /** Detail HTML has no inline figures; body is text-only. */
    embeddedInBody: [] as const,
  },
} as const;

export type InsightArticleSlug = keyof typeof INSIGHT_ARTICLE_MEDIA;
