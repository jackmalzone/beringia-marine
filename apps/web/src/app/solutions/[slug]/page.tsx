import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { mergeMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/config/site-config';
import { getPartnerBySlug, getPartnerOgImage } from '@/lib/content/partner-content';
import { SOLUTIONS } from '@/lib/content/solutions';
import { SolutionPartnerClient } from '@/components/solutions/partner/SolutionPartnerClient';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SOLUTIONS.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) {
    return mergeMetadata('solutions', {
      title: 'Solution Not Found | Beringia Marine',
      description: 'The requested solution page could not be found.',
    });
  }

  const title = partner.seo?.title || `${partner.name} | Beringia Marine`;
  const description = partner.seo?.description || partner.overview?.description || '';
  const og = absoluteUrl(getPartnerOgImage(partner));

  return mergeMetadata('solutions', {
    title,
    description,
    alternates: {
      canonical: `/solutions/${partner.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: partner.name }],
    },
    twitter: {
      title,
      description,
      images: [og],
    },
  });
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.oceanField}>
        <SolutionPartnerClient partner={partner} />
      </div>
    </main>
  );
}
