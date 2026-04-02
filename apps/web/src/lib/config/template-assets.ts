/**
 * Template-safe default asset paths (under `public/`).
 * Updated with deployed Beringia media imported from migration folders.
 */

const RASTER_POOL = [
  '/assets/beringia/seascape-wallpaper.jpg',
  '/assets/beringia/galapagos-seascape.jpg',
  '/assets/beringia/galapagos-seascape2.jpg',
  '/assets/beringia/penguin.jpeg',
  '/assets/clients/advanced-navigation/header.jpg',
  '/assets/clients/anchor-bot/header.jpg',
  '/assets/clients/mission-robotics/header.jpeg',
  '/desktop-insights.png',
  '/hydrus-subsurface.jpeg',
  '/og-image.jpeg',
] as const;

const VECTOR_POOL = [
  '/assets/beringia/logo-solid.svg',
  '/assets/beringia/logo-white.svg',
  '/assets/sketchfab-logo.svg',
  '/assets/sketchfab-logo-text.svg',
  '/assets/linkedin-icon.svg',
] as const;

function pick<T extends readonly string[]>(pool: T, index: number): T[number] {
  return pool[index % pool.length]!;
}

/** Hero / about background video (local CC0 loop; same file reused for rotation). */
export const TEMPLATE_HERO_VIDEO = {
  mp4: '/media/template/ambient-loop.mp4',
  webm: '/media/template/ambient-loop.webm',
  /** Static frame if video fails */
  poster: '/assets/beringia/seascape-wallpaper.jpg',
} as const;

export function templateRaster(seed: number): string {
  return pick(RASTER_POOL, seed);
}

export function templateVector(seed: number): string {
  return pick(VECTOR_POOL, seed);
}

/** CSS-friendly repeating backgrounds (no external URLs). */
export const TEMPLATE_TEXTURE_GRADIENT =
  'linear-gradient(145deg, #0f1115 0%, #1a1d24 45%, #12151c 100%)';
