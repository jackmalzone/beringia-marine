// Base objects
import { seoSettings } from './objects/seoSettings';
import { businessInfo } from './objects/businessInfo';
import { socialMedia } from './objects/socialMedia';
import { benefit } from './objects/benefit';
import { processStep } from './objects/processStep';
import { ctaButton } from './objects/ctaButton';
import { themeColor } from './objects/themeColor';

// Content blocks
import { hero } from './objects/contentBlocks/hero';
import { textSection } from './objects/contentBlocks/textSection';
import { serviceGrid } from './objects/contentBlocks/serviceGrid';
import { testimonials } from './objects/contentBlocks/testimonials';
import { newsletter } from './objects/contentBlocks/newsletter';

// Document types
import { globalSettings } from './documents/globalSettings';
import { page } from './documents/page';
import { service } from './documents/service';
import { article } from './documents/article';

export const schemaTypes = [
  // Base objects
  seoSettings,
  businessInfo,
  socialMedia,
  benefit,
  processStep,
  ctaButton,
  themeColor,
  // Content blocks
  hero,
  textSection,
  serviceGrid,
  testimonials,
  newsletter,
  // Document types
  globalSettings,
  page,
  service,
  article,
];
