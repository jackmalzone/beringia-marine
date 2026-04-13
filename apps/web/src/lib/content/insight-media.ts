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
  'unified-marine-vehicle-operating-architecture': {
    heroCover: '/assets/insights/unified-marine-architecture/hero-sunken-ship-116m.png',
    ogImage: '/assets/insights/unified-marine-architecture/hero-sunken-ship-116m.png',
    embeddedInBody: [
      '/assets/insights/unified-marine-architecture/figure-1-mission-dock.png',
      '/assets/insights/unified-marine-architecture/figure-2-navx.png',
    ],
  },
  'anchorbot-teamer-pull-strength-report': {
    heroCover: '/assets/insights/anchorbot-teamer-pull-strength-report/hero-coastal-panorama.png',
    ogImage: '/assets/insights/anchorbot-teamer-pull-strength-report/hero-coastal-panorama.png',
    embeddedInBody: [
      '/assets/insights/anchorbot-teamer-pull-strength-report/beringia-anchorbot-logos.png',
      '/assets/insights/anchorbot-teamer-pull-strength-report/figure-1-normalized-torque-pull-site1.png',
      '/assets/insights/anchorbot-teamer-pull-strength-report/figure-2-sequential-pulls-site1.png',
      '/assets/insights/anchorbot-teamer-pull-strength-report/figure-3-single-pull-anchor4.png',
      '/assets/insights/anchorbot-teamer-pull-strength-report/figure-4-sustained-dwell-anchor7.png',
      '/assets/insights/anchorbot-teamer-pull-strength-report/figure-5-geometry-6inch-site1.png',
      '/assets/insights/anchorbot-teamer-pull-strength-report/figure-6-channel-site2-sequential.png',
      '/assets/insights/anchorbot-teamer-pull-strength-report/figure-7-bay-vs-channel.png',
    ],
  },
} as const;

export type InsightArticleSlug = keyof typeof INSIGHT_ARTICLE_MEDIA;
