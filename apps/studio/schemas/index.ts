import { seoSettings } from './objects/seoSettings';
import { insight } from './documents/insight';
import { partner } from './documents/partner';
import { teamMember } from './documents/teamMember';
import { siteSettings } from './documents/siteSettings';

export const schemaTypes = [
  // Reusable objects
  seoSettings,
  // Documents
  siteSettings,
  insight,
  partner,
  teamMember,
];
