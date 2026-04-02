/**
 * Shell navigation, footer, credits, and legal references (Beringia / template).
 * Phase 3: replace Solutions placeholders with client registry-driven links.
 */

export const CONTACT_DATA_QUALITY_NOTE = [
  'Staged migration noted a legacy mismatch: Contact page tel href vs visible number,',
  'and footer mailto vs visible email. Canonical values in this package use',
  'primaryEmail info@beringia-marine.com and tel:+18053161417 — confirm with stakeholders.',
].join(' ');

/** Primary header / mobile nav. */
export const SHELL_PRIMARY_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Crawler nav lists: all discoverable routes for SSR link blocks (no /book for Beringia shell). */
export const SHELL_CRAWLER_NAV_LINKS = [
  ...SHELL_PRIMARY_NAV,
  { label: 'Terms & Conditions', href: '/terms' },
] as const;

export const SHELL_CTA = {
  label: 'Get in Touch',
  href: '/contact',
} as const;

export const SHELL_FLOATING_PROMO = {
  /** Rolling header promo — Beringia replaces “Founding Memberships” booking CTA. */
  eyebrow: 'Marine technology',
  headline: 'Sales engineering & consulting',
  buttonLabel: 'Get in Touch →',
  href: '/contact',
} as const;

export const SHELL_FOOTER = {
  aboutTitle: 'About Beringia',
  aboutBody:
    'Providing experience and passion necessary for increasing our knowledge of the oceans.',
  aboutLink: { label: 'Learn more →', href: '/about' as const },
  /** Phase 4: solution detail links are injected from app-level registry. */
  solutionsLinks: [{ label: 'Solutions overview', href: '/solutions' as const }],
  quickLinks: [
    { label: 'Home', href: '/' as const },
    { label: 'About Us', href: '/about' as const },
    { label: 'Contact', href: '/contact' as const },
    { label: 'Terms & Conditions', href: '/terms' as const },
  ],
  /** Use with `copyrightTemplate.replace('{year}', String(year))` */
  copyrightTemplate: '© {year} Beringia Marine Technologies. All rights reserved.',
  legalLinks: [
    { label: 'Contact', href: '/contact' as const },
    { label: 'Terms & Conditions', href: '/terms' as const },
  ],
} as const;

export const SHELL_CREDITS = {
  featuredArtist: {
    name: 'Rebecca Rutstein',
    url: 'https://www.rebeccarutstein.com',
  },
  websiteBy: {
    name: 'Jack Malzone',
    linkedin: 'https://linkedin.com/in/jackmalzone',
  },
} as const;

export const SHELL_LEGAL = {
  termsPageTitle: 'Terms & Conditions',
  termsVersion: 'Ver 240913_1',
  termsEffectiveDateDisplay: '14 September 2024',
  governingLaw: 'State of California, USA',
} as const;
