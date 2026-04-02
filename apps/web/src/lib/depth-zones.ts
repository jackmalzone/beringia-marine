/**
 * Homepage scroll-depth zones (section-tagged, IntersectionObserver-driven).
 * Plain names; tune visuals in `globals.css` under `html[data-home-depth="…"]`.
 */

export const DEPTH_ZONES = [
  'epipelagic',
  'mesopelagic',
  'bathypelagic',
  'abyssal',
  'hadal',
] as const;

export type DepthZone = (typeof DEPTH_ZONES)[number];

export const DEFAULT_DEPTH_ZONE: DepthZone = 'epipelagic';

export function isDepthZone(value: string | undefined): value is DepthZone {
  return value !== undefined && (DEPTH_ZONES as readonly string[]).includes(value);
}
