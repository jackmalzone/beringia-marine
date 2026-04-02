import { Metadata } from 'next';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import { mergeMetadata } from '@/lib/seo/metadata';
import ServerSideSEO from '@/components/seo/ServerSideSEO';
import { TEMPLATE_BUSINESS } from '@vital-ice/config';
import { BERINGIA_ABOUT } from '@/lib/content/beringia-static';
import styles from './page.module.css';

export const metadata: Metadata = mergeMetadata('about', {
  title: 'About Beringia Marine | Marine Technology Consulting & Solutions',
  description:
    "Learn about Beringia Marine's three decades of experience in marine technology, ocean engineering, and business development. Founded by Chris Malzone to bridge gaps in marine technology solutions.",
});
export const revalidate = 86400; // Revalidate every 24 hours

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <ServerSideSEO pageKey="about" />
      <div className={styles.oceanField}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1>{BERINGIA_ABOUT.heroTitle}</h1>
            <p>
              Founded to bridge technical and commercial gaps in ocean technology with practical, field-ready
              solutions.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.flipCard} aria-label="Field image and archival caption">
              <div className={styles.flipCardInner}>
                <div className={styles.flipFaceFront}>
                  <Image
                    src="/assets/beringia/penguin.jpeg"
                    alt={BERINGIA_ABOUT.penguinAlt}
                    width={640}
                    height={400}
                    className={styles.heroImage}
                  />
                </div>
                <div className={styles.flipFaceBack}>
                  <p className={styles.caption}>{BERINGIA_ABOUT.imageCaption}</p>
                  <p className={styles.assetNote}>
                    Field reference image sourced from deployed media migration set.
                  </p>
                </div>
              </div>
              <p className={styles.flipHint}>Hover to reveal field note</p>
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.containerNarrow}>
            <h2 className={styles.underlinedTitle}>{BERINGIA_ABOUT.bridgingHeading}</h2>
            {BERINGIA_ABOUT.bridgingParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.containerNarrow}>
            <h2 className={styles.underlinedTitle}>{BERINGIA_ABOUT.leadershipHeading}</h2>
            <p className={styles.lead}>{BERINGIA_ABOUT.leadershipName}</p>
            {BERINGIA_ABOUT.leadershipParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className={styles.linkedinBlock}>
              <a
                href={TEMPLATE_BUSINESS.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedinButton}
                aria-label="Beringia Marine on LinkedIn"
              >
                <FaLinkedin className={styles.linkedinIcon} aria-hidden />
                <span className={styles.linkedinLabel}>Beringia Marine</span>
              </a>
            </p>
          </div>
        </section>

        <section className={styles.socialRow}>
          <div className={styles.containerNarrow}>
            <p className={styles.socialLead}>Follow Beringia:</p>
            <p className={styles.linkedinBlock}>
              <a
                href={TEMPLATE_BUSINESS.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedinButton}
                aria-label="Beringia Marine on LinkedIn"
              >
                <FaLinkedin className={styles.linkedinIcon} aria-hidden />
                <span className={styles.linkedinLabel}>Beringia Marine</span>
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
