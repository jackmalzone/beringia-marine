/**
 * Server-side rendered footer links
 * These links are visible to search engine crawlers in the HTML source
 */
import Link from 'next/link';
import { SHELL_FOOTER } from '@vital-ice/config';
import { SOLUTIONS } from '@/lib/content/solutions';

const FOOTER_LINKS = [
  ...SHELL_FOOTER.quickLinks,
  ...SHELL_FOOTER.legalLinks,
  { label: 'Solutions overview', href: '/solutions' },
  ...SOLUTIONS.map((solution) => ({ label: solution.name, href: `/solutions/${solution.slug}` })),
  { label: 'Insights', href: '/insights' },
];

const UNIQUE_FOOTER_LINKS = FOOTER_LINKS.filter(
  (link, index, links) =>
    links.findIndex((candidate) => candidate.href === link.href && candidate.label === link.label) === index
);

export default function FooterLinks() {
  return (
    <nav aria-label="Footer navigation" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="false">
      <ul>
        {UNIQUE_FOOTER_LINKS.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
