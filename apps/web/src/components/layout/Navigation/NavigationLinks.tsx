/**
 * Server-side rendered navigation links
 * These links are visible to search engine crawlers in the HTML source
 */
import Link from 'next/link';
import { SHELL_CRAWLER_NAV_LINKS, SHELL_CTA } from '@vital-ice/config';
import { SOLUTIONS } from '@/lib/content/solutions';

const NAV_LINKS = [
  ...SHELL_CRAWLER_NAV_LINKS,
  ...SOLUTIONS.map((solution) => ({ label: solution.name, href: `/solutions/${solution.slug}` })),
  SHELL_CTA,
];

export default function NavigationLinks() {
  return (
    <nav aria-label="Main navigation" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="false">
      <ul>
        {NAV_LINKS.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
