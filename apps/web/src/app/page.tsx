import Link from 'next/link';
import { Metadata } from 'next';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';
import {
  BERINGIA_HOME,
  BERINGIA_EXPERTISE_CARDS,
  BERINGIA_CONTRIBUTIONS,
} from '@/lib/content/beringia-static';
import FeaturedArtistSection from '@/components/artist/FeaturedArtistSection';
import styles from './page.module.css';

export const metadata: Metadata = mergeMetadata('home');
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <main className={styles.page}>
      <ServerSideSEO pageKey="home" />
      <div className={styles.oceanField}>
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={styles.container}>
            <p className={styles.eyebrow}>Integrated marine technology solutions</p>
            <h1 className={styles.heroTitle}>{BERINGIA_HOME.heroTitle}</h1>
            <p className={styles.heroSubtitle}>{BERINGIA_HOME.heroSubtitle}</p>
            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.primaryButton}>
                Get in Touch
              </Link>
              <Link href="/solutions" className={styles.secondaryButton}>
                Explore Solutions
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.containerNarrow}>
            <h2>{BERINGIA_HOME.missionHeading}</h2>
            <p>{BERINGIA_HOME.missionBody}</p>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.containerNarrow}>
            <h2>Solutions</h2>
            <p>{BERINGIA_HOME.solutionsTeaser}</p>
            <Link href="/solutions" className={styles.inlineLink}>
              View solutions overview
            </Link>
          </div>
        </section>

        <section className={styles.sectionMuted}>
          <div className={styles.container}>
            <h2>{BERINGIA_HOME.approachHeading}</h2>
            <p className={styles.sectionSubtitle}>{BERINGIA_HOME.approachSubtitle}</p>
            <div className={styles.grid}>
              {BERINGIA_EXPERTISE_CARDS.map((card) => (
                <article key={card.title} className={styles.card}>
                  <h3>{card.title}</h3>
                  <p className={styles.cardSubtitle}>{card.subtitle}</p>
                  <p>{card.description}</p>
                  <ul>
                    {card.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionDark}>
          <div className={styles.container}>
            <h2>{BERINGIA_HOME.contributionsHeading}</h2>
            <p>{BERINGIA_HOME.contributionsTeaser}</p>
            <div className={styles.timeline}>
              {BERINGIA_CONTRIBUTIONS.map((item) => (
                <article key={item.period} className={styles.timelineItem}>
                  <p className={styles.period}>{item.period}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FeaturedArtistSection className={styles.artistSection} />

        <section className={styles.cta}>
          <div className={styles.containerNarrow}>
            <h2>{BERINGIA_HOME.contactCtaHeading}</h2>
            <p>{BERINGIA_HOME.contactCtaBody}</p>
            <Link href={BERINGIA_HOME.contactCtaHref} className={styles.primaryButton}>
              {BERINGIA_HOME.contactCtaLabel}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
