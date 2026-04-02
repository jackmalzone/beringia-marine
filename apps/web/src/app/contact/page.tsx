import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@vital-ice/ui';
import { TEMPLATE_BUSINESS, BusinessInfoHelpers } from '@vital-ice/config';
import { absoluteUrl, SITE_CONFIG } from '@/lib/config/site-config';
import PageSchema from '@/components/seo/PageSchema';
import ServerSideSEO from '@/components/seo/ServerSideSEO';
import { BERINGIA_CONTACT } from '@/lib/content/beringia-static';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `Contact ${TEMPLATE_BUSINESS.name} | Sales engineering & consulting`,
  description: `Contact ${TEMPLATE_BUSINESS.name} in ${TEMPLATE_BUSINESS.address.city}, ${TEMPLATE_BUSINESS.address.state}. Reach our team for marine technology solutions, integrations, and general inquiries.`,
  keywords: [
    'contact beringia marine',
    'marine technology sales',
    'ocean robotics contact',
    'AUV consulting',
    'underwater systems',
    'San Luis Obispo marine technology',
  ],
  openGraph: {
    title: `Contact ${TEMPLATE_BUSINESS.name} | Sales engineering & consulting`,
    description: `Message ${TEMPLATE_BUSINESS.name} for project inquiries and partnerships. Based in ${TEMPLATE_BUSINESS.address.city}, ${TEMPLATE_BUSINESS.address.state}.`,
    type: 'website',
    locale: 'en_US',
    siteName: TEMPLATE_BUSINESS.name,
    url: `${TEMPLATE_BUSINESS.website}/contact`,
    images: [
      {
        url: absoluteUrl(SITE_CONFIG.defaultOgImagePath),
        width: 1200,
        height: 630,
        alt: `Contact ${TEMPLATE_BUSINESS.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact ${TEMPLATE_BUSINESS.name} | Sales engineering & consulting`,
    description: `Message ${TEMPLATE_BUSINESS.name} for marine technology inquiries and partnerships.`,
    images: [absoluteUrl(SITE_CONFIG.defaultOgImagePath)],
  },
  alternates: {
    canonical: '/contact',
  },
  other: {
    'geo.region': `US-${TEMPLATE_BUSINESS.address.state}`,
    'geo.placename': TEMPLATE_BUSINESS.address.city,
    'geo.position': `${TEMPLATE_BUSINESS.coordinates.latitude};${TEMPLATE_BUSINESS.coordinates.longitude}`,
    ICBM: `${TEMPLATE_BUSINESS.coordinates.latitude}, ${TEMPLATE_BUSINESS.coordinates.longitude}`,
  },
};

// Enable static generation with ISR for better SEO
export const revalidate = 3600; // Revalidate every hour

export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${TEMPLATE_BUSINESS.address.city}, ${TEMPLATE_BUSINESS.address.state}`
  )}`;

  return (
    <main className={styles.page}>
      <ServerSideSEO pageKey="contact" />
      <PageSchema pageKey="contact" />

      <section className={styles.hero} aria-labelledby="contact-heading">
        <div className={styles.containerNarrow}>
          <h1 id="contact-heading" className={styles.title}>
            {BERINGIA_CONTACT.heading}
          </h1>
          <p className={styles.lede}>{BERINGIA_CONTACT.intro}</p>
          <p className={styles.lede}>{BERINGIA_CONTACT.support}</p>
        </div>
      </section>

      <section className={styles.content} aria-label="Contact options">
        <div className={styles.container}>
          <article className={styles.directContact}>
            <h2 className={styles.sectionRuleTitle}>Direct Contact</h2>
            <dl className={styles.contactBlocks}>
              <div className={styles.contactBlock}>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${TEMPLATE_BUSINESS.email}`} className={styles.contactValue}>
                    {TEMPLATE_BUSINESS.email}
                  </a>
                </dd>
              </div>
              {TEMPLATE_BUSINESS.phone && (
                <div className={styles.contactBlock}>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${TEMPLATE_BUSINESS.phone}`} className={styles.contactValue}>
                      {BusinessInfoHelpers.getFormattedPhone()}
                    </a>
                  </dd>
                </div>
              )}
              <div className={styles.contactBlock}>
                <dt>Location</dt>
                <dd>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactValue}
                  >
                    {TEMPLATE_BUSINESS.address.city}, {TEMPLATE_BUSINESS.address.state}
                  </a>
                </dd>
              </div>
            </dl>

            <p className={styles.note}>
              Looking for legal terms first? <Link href="/terms">Read Terms & Conditions</Link>.
            </p>
          </article>

          <article className={styles.formSection}>
            <h2 className={styles.sectionRuleTitle}>Send a Message</h2>
            <p className={styles.formIntro}>
              We typically respond within one business day for product, integration, and partnership inquiries.
            </p>
            <ContactForm />
          </article>
        </div>
      </section>
    </main>
  );
}
