/**
 * ServerSideSEO - Critical SEO elements that must be in server-side rendered HTML
 * This ensures search engines and crawlers can see them in the raw HTML
 * Uses screen-reader-only positioning to be visible to crawlers but not to users
 */

import { SITE_CONFIG } from '@/lib/config/site-config';

const BRAND = SITE_CONFIG.name;

export type ServerSideSEOKey =
  | 'home'
  | 'solutions'
  | 'about'
  | 'contact'
  | 'terms'
  | 'insights';

interface ServerSideSEOProps {
  pageKey: ServerSideSEOKey;
}

const SEO_CONTENT: Record<
  ServerSideSEOKey,
  {
    h1: string;
    h2: string[];
    links: { href: string; text: string }[];
    content: string;
  }
> = {
  home: {
    h1: `${BRAND} — Integrated marine technology solutions`,
    h2: ['Sales engineering & consulting', 'Marine robotics & AUVs', 'Research, defense & exploration'],
    links: [
      { href: '/solutions', text: 'Solutions' },
      { href: '/about', text: 'About' },
      { href: '/insights', text: 'Insights' },
      { href: '/contact', text: 'Contact' },
      { href: '/terms', text: 'Terms & Conditions' },
    ],
    content:
      `${BRAND} connects innovative marine technology manufacturers with end users across research, defense, and ocean exploration. Detailed program pages live under Solutions and Insights.`,
  },
  solutions: {
    h1: 'Solutions - Beringia marine technology programs',
    h2: ['Navigation systems', 'Anchor automation', 'Marine robotics control'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/about', text: `About ${BRAND}` },
      { href: '/contact', text: 'Contact' },
      { href: '/terms', text: 'Terms & Conditions' },
      { href: '/solutions/advanced-navigation', text: 'Advanced Navigation' },
      { href: '/solutions/anchor-bot', text: 'Anchor Bot Marine' },
      { href: '/solutions/mission-robotics', text: 'Mission Robotics' },
    ],
    content:
      'Beringia solution programs align marine technology teams with validated pathways from concept through deployment, including navigation systems, robotic anchor installation, and vehicle control platforms.',
  },
  about: {
    h1: `About ${BRAND}`,
    h2: ['Bridging Solutions', 'Leadership'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/solutions', text: 'Solutions' },
      { href: '/contact', text: 'Contact' },
      { href: '/terms', text: 'Terms & Conditions' },
    ],
    content:
      `${BRAND} was founded after three decades in marine technology, addressing gaps in early design and solution viability through market research, engineering, business development, and partnerships across the marine industry. Principal Chris Malzone brings offshore technology leadership, subsea and autonomous systems expertise, and degrees in Geology and Oceanography.`,
  },
  contact: {
    h1: `Contact ${BRAND}`,
    h2: ['Project inquiries', 'Partnership conversations', 'Direct contact details'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/solutions', text: 'Solutions' },
      { href: '/about', text: `About ${BRAND}` },
      { href: '/terms', text: 'Terms & Conditions' },
    ],
    content:
      'Whether you have a project in mind, need expert insights, or want to learn more about Beringia Marine, use the contact form or direct email and phone details from centralized business configuration.',
  },
  terms: {
    h1: 'Terms & Conditions',
    h2: ['Commercial terms', 'Liability & warranties', 'Governing law'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/contact', text: 'Contact' },
      { href: '/about', text: `About ${BRAND}` },
    ],
    content:
      'Terms and conditions for Beringia Marine Technologies, including pricing, payment, delivery, confidentiality, liability, and force majeure clauses under California law.',
  },
  insights: {
    h1: `Insights - ${BRAND}`,
    h2: ['Articles & guides', 'Research notes', 'Industry perspective'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/solutions', text: 'Solutions' },
      { href: '/about', text: `About ${BRAND}` },
      { href: '/contact', text: 'Contact' },
    ],
    content:
      'Long-form articles and guides that reinforce technical credibility and keep the site fresh for search engines. Editorial content complements static solution pages.',
  },
};

/** Used by layout to inject crawler-visible SSR HTML; returns only h1 + content paragraph. */
export function getSSRContent(
  pageKey: ServerSideSEOKey
): { h1: string; content: string } | null {
  const c = SEO_CONTENT[pageKey];
  return c ? { h1: c.h1, content: c.content } : null;
}

export default function ServerSideSEO({ pageKey }: ServerSideSEOProps) {
  const content = SEO_CONTENT[pageKey];

  if (!content) {
    return null;
  }

  return (
    <div className="sr-only" aria-hidden="true">
      {content.h2.map((heading: string, index: number) => (
        <h2 key={index}>{heading}</h2>
      ))}

      <nav aria-label="Main navigation">
        {content.links.map((link: { href: string; text: string }) => (
          <a key={`${link.href}-${link.text}`} href={link.href}>
            {link.text}
          </a>
        ))}
      </nav>

      <p>{content.content}</p>
    </div>
  );
}
