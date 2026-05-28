'use client';

import Image from 'next/image';
import styles from './OverviewSection.module.css';

export interface OverviewSectionProps {
  title: string;
  description: string;
  headerImage: string;
  logo?: string | null;
  /** Render the logo as a white silhouette (for dark/coloured logos on the dark header). */
  logoWhite?: boolean;
  website?: string | null;
}

export function OverviewSection({ title, description, headerImage, logo, logoWhite, website }: OverviewSectionProps) {
  const logoClass = logoWhite ? `${styles.logo} ${styles.logoWhite}` : styles.logo;
  return (
    <div className={styles.wrapper}>
      <section className={styles.header} style={{ backgroundImage: `url(${headerImage})` }}>
        <div className={styles.content}>
          {logo ? (
            <div className={styles.logoWrap}>
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoLink}
                >
                  <Image
                    src={logo}
                    alt={`${title} logo`}
                    width={400}
                    height={120}
                    className={logoClass}
                    unoptimized={logo.endsWith('.webp')}
                  />
                </a>
              ) : (
                <Image
                  src={logo}
                  alt={`${title} logo`}
                  width={400}
                  height={120}
                  className={logoClass}
                  unoptimized={logo.endsWith('.webp')}
                />
              )}
            </div>
          ) : (
            <h1 className={styles.title}>{title}</h1>
          )}
          <p className={styles.description}>{description}</p>
        </div>
      </section>
    </div>
  );
}
