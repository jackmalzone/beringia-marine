/**
 * Compatibility layer - will be removed in a future cleanup.
 * Canonical source is @beringia/config.
 */

export {
  SITE_CONFIG,
  getSiteUrl,
  absoluteUrl,
  getTwitterCreator,
  getSiteVerificationPayload,
} from '@beringia/config';

import type { Metadata } from 'next';
import { getSiteVerificationPayload } from '@beringia/config';

export type SiteVerification = NonNullable<Metadata['verification']>;

export function buildMetadataVerification(): SiteVerification | undefined {
  return getSiteVerificationPayload() as SiteVerification | undefined;
}
