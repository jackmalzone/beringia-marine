import Link from 'next/link';
import { Metadata } from 'next';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';
import { BERINGIA_HOME, BERINGIA_EXPERTISE_CARDS } from '@/lib/content/beringia-static';
import FeaturedArtistSection from '@/components/artist/FeaturedArtistSection';
import ContributionsTimeline from '@/components/home/ContributionsTimeline';
import DepthBackground from '@/components/DepthBackground/DepthBackground';
import HomepageDepthObserver from '@/components/home/HomepageDepthObserver';
import ExpertiseAccordion from '@/components/home/ExpertiseAccordion';
import ScrollReveal from '@/components/home/ScrollReveal';
import { SOLUTIONS } from '@/lib/content/solutions';
import styles from './page.module.css';

export const metadata: Metadata = mergeMetadata('home');
export const revalidate = 3600;

export default function Home() {
  return (
    <main className={styles.page} data-home-page>
      <DepthBackground />
      <ServerSideSEO pageKey="home" />
      <div className={styles.oceanField}>
        <HomepageDepthObserver />

        {/* ── Hero ── */}
        <section className={styles.hero} data-depth="epipelagic">
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

        {/* ── Mission Statement ── */}
        <section className={styles.mission} data-depth="mesopelagic">
          <div className={styles.containerNarrow}>
            <ScrollReveal className={styles.missionInner}>
              <span className={styles.missionAccent} aria-hidden="true" />
              <h2 className={styles.missionHeading}>{BERINGIA_HOME.missionHeading}</h2>
              <p className={styles.missionBody}>{BERINGIA_HOME.missionBody}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Solutions ── */}
        <section className={styles.solutionsFull} data-depth="mesopelagic">
          <div className={styles.container}>
            <ScrollReveal className={styles.solutionsHeader}>
              <h2 className={styles.solutionsHeading}>Solutions</h2>
              <p className={styles.solutionsTeaser}>{BERINGIA_HOME.solutionsTeaser}</p>
            </ScrollReveal>

            <div className={styles.solutionsGrid}>
              {SOLUTIONS.map((sol, i) => (
                <ScrollReveal key={sol.slug} delay={i * 100}>
                  <Link href={`/solutions/${sol.slug}`} className={styles.solutionCard}>
                    <span className={styles.solutionIndex}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={styles.solutionName}>{sol.name}</h3>
                    <p className={styles.solutionTagline}>{sol.tagline}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className={styles.solutionsFooter}>
              <Link href="/solutions" className={styles.inlineLink}>
                View solutions overview
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Expertise ── */}
        <section className={styles.sectionMuted} data-depth="bathypelagic">
          <ExpertiseAccordion
            cards={BERINGIA_EXPERTISE_CARDS}
            heading={BERINGIA_HOME.approachHeading}
            subtitle={BERINGIA_HOME.approachSubtitle}
          />
        </section>

        {/* ── Notable Contributions ── */}
        <section
          className={styles.contributionsWrap}
          aria-labelledby="home-contributions-heading"
          data-depth="abyssal"
        >
          <div className={styles.container}>
            <div className={styles.contributionsGlow}>
              <ContributionsTimeline
                heading={BERINGIA_HOME.contributionsHeading}
                teaser={BERINGIA_HOME.contributionsTeaser}
              />
            </div>
          </div>
        </section>

        {/* ── Featured Artist ── */}
        <FeaturedArtistSection className={styles.artistSection} depthZone="abyssal" />

        {/* ── Final CTA ── */}
        <section className={styles.ctaSection} data-depth="hadal">
          <div className={styles.containerNarrow}>
            <ScrollReveal className={styles.ctaInner}>
              <span className={styles.ctaDivider} aria-hidden="true" />
              <span className={styles.ctaEyebrow}>Work With Beringia</span>
              <h2 className={styles.ctaHeading}>{BERINGIA_HOME.contactCtaHeading}</h2>
              <p className={styles.ctaBody}>{BERINGIA_HOME.contactCtaBody}</p>
              <Link href={BERINGIA_HOME.contactCtaHref} className={styles.ctaButton}>
                {BERINGIA_HOME.contactCtaLabel}
                <svg
                  className={styles.ctaArrow}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </main>
  );
}
