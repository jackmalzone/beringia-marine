/**
 * Compatibility layer - will be removed in a future cleanup.
 * Canonical source is @vital-ice/config.
 */

export {
  SITE_CONFIG,
  getSiteUrl,
  absoluteUrl,
  getTwitterCreator,
  getSiteVerificationPayload,
} from '@vital-ice/config';

import type { Metadata } from 'next';
import { getSiteVerificationPayload } from '@vital-ice/config';

export type SiteVerification = NonNullable<Metadata['verification']>;

export function buildMetadataVerification(): SiteVerification | undefined {
  return getSiteVerificationPayload() as SiteVerification | undefined;
}
