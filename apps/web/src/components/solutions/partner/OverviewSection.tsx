'use client';

import Image from 'next/image';
import styles from './OverviewSection.module.css';

export interface OverviewSectionProps {
  title: string;
  description: string;
  headerImage: string;
  logo?: string | null;
  website?: string | null;
}

export function OverviewSection({ title, description, headerImage, logo, website }: OverviewSectionProps) {
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
                    className={styles.logo}
                    unoptimized={logo.endsWith('.webp')}
                  />
                </a>
              ) : (
                <Image
                  src={logo}
                  alt={`${title} logo`}
                  width={400}
                  height={120}
                  className={styles.logo}
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
