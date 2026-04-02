/**
 * Visible server-rendered navigation links for crawler discovery
 * This component renders navigation links in the visible page flow
 * Styled to be unobtrusive but accessible to crawlers
 */
import Link from 'next/link';
import { SHELL_CRAWLER_NAV_LINKS, SHELL_CTA } from '@vital-ice/config';
import { SOLUTIONS } from '@/lib/content/solutions';

const NAV_LINKS = [
  ...SHELL_CRAWLER_NAV_LINKS,
  ...SOLUTIONS.map((solution) => ({ label: solution.name, href: `/solutions/${solution.slug}` })),
  SHELL_CTA,
];

export default function VisibleNavigation() {
  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    >
      {NAV_LINKS.map((link) => (
        <Link key={`${link.href}-${link.label}`} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
