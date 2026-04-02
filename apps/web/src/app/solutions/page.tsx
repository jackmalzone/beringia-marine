import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ServerSideSEO from '@/components/seo/ServerSideSEO';
import DepthBackground from '@/components/DepthBackground/DepthBackground';
import { mergeMetadata } from '@/lib/seo/metadata';
import { SOLUTIONS } from '@/lib/content/solutions';
import styles from './page.module.css';

export const metadata: Metadata = mergeMetadata('solutions', {
  title: 'Solutions | Beringia Marine Technology Programs',
  description:
    'Explore Beringia solution programs across navigation, anchor installation automation, and marine robotics control systems.',
});

export default function SolutionsPage() {
  return (
    <main className={styles.page}>
      <DepthBackground />
      <ServerSideSEO pageKey="solutions" />
      <div className={styles.oceanField}>
        <section className={styles.hero} aria-labelledby="solutions-hero-heading">
          <div className={styles.container}>
            <p className={styles.eyebrow}>Marine technology programs</p>
            <h1 id="solutions-hero-heading">Solutions</h1>
            <p className={styles.heroLead}>
              Field-ready programs that move from validation through deployment with clear scope, measurable
              outcomes, and engineering discipline.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.introSection}`} aria-labelledby="solutions-intro-heading">
          <div className={styles.containerNarrow}>
            <h2 id="solutions-intro-heading" className={styles.underlinedTitle}>
              Built for real operating environments
            </h2>
            <p>
              Each program packages hardware, software, and integration patterns so teams can adopt capability
              without reinventing the stack. Explore the programs below for capability fit, applications, and
              detail pages with partner-approved documentation.
            </p>
          </div>
        </section>

        <section className={styles.sectionAlt} aria-labelledby="solutions-programs-heading">
          <div className={styles.container}>
            <p className={styles.sectionLabel}>Programs</p>
            <h2 id="solutions-programs-heading" className={styles.gridTitle}>
              Overview
            </h2>
            <div className={styles.grid}>
              {SOLUTIONS.map((solution) => (
                <article key={solution.slug} className={styles.card}>
                  <Link href={`/solutions/${solution.slug}`} className={styles.cardMediaLink} tabIndex={-1}>
                    <div className={styles.cardMedia}>
                      <Image
                        src={solution.media.images[0]?.src || '/assets/beringia/logo-solid.svg'}
                        alt={solution.media.images[0]?.alt || `${solution.name} visual`}
                        width={720}
                        height={420}
                        className={styles.cardImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                  <div className={styles.cardBody}>
                    <p className={styles.cardTagline}>{solution.tagline}</p>
                    <h3 className={styles.cardName}>
                      <Link href={`/solutions/${solution.slug}`} className={styles.cardTitleLink}>
                        {solution.name}
                      </Link>
                    </h3>
                    <p className={styles.cardDescription}>{solution.shortDescription}</p>
                    <p className={styles.cardMeta}>
                      <span className={styles.cardMetaLabel}>Applications</span>
                      <span className={styles.cardMetaValue}>{solution.applications.slice(0, 2).join(' · ')}</span>
                    </p>
                    <Link href={`/solutions/${solution.slug}`} className={styles.cardCta}>
                      View program
                      <span className={styles.cardCtaArrow} aria-hidden>
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaBand} aria-labelledby="solutions-cta-heading">
          <div className={styles.containerNarrow}>
            <h2 id="solutions-cta-heading" className={styles.ctaTitle}>
              Discuss your use case
            </h2>
            <p className={styles.ctaCopy}>
              Tell us about your vessel class, sensors, and timeline—we will map where these programs fit and
              what a phased path looks like.
            </p>
            <Link href="/contact" className={styles.primaryButton}>
              Get in touch
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
