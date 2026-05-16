import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { dataset, projectId } from '../env';

const builder = projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: SanityImageSource): ReturnType<NonNullable<typeof builder>['image']> | null {
  if (!builder) return null;
  return builder.image(source);
}

export function urlForString(source: SanityImageSource, params?: { width?: number; height?: number; quality?: number }): string | null {
  const u = urlFor(source);
  if (!u) return null;
  let b = u;
  if (params?.width) b = b.width(params.width);
  if (params?.height) b = b.height(params.height);
  if (params?.quality) b = b.quality(params.quality);
  return b.auto('format').url();
}
