import { seoSettings } from './objects/seoSettings';
import { insight } from './documents/insight';
import { partner } from './documents/partner';
import { siteSettings } from './documents/siteSettings';

export const schemaTypes = [
  // Reusable objects
  seoSettings,
  // Documents
  siteSettings,
  insight,
  partner,
];
