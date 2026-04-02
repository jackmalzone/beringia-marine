'use client';

import { useId, useState } from 'react';
import { BERINGIA_CONTRIBUTIONS } from '@/lib/content/beringia-static';
import styles from './ContributionsTimeline.module.css';

function formatPipeContent(text: string): string | string[] {
  if (!text.includes('|')) return text;
  return text.split('|').map((s) => s.trim());
}

function ContributionTitles({ title }: { title: string }) {
  const parsed = formatPipeContent(title);
  if (typeof parsed === 'string') {
    return (
      <div className={styles.titleBlock}>
        <h3 className={styles.titleSingle}>{parsed}</h3>
      </div>
    );
  }
  return (
    <div className={styles.titleStack}>
      {parsed.map((line, i) => (
        <div key={i} className={styles.titleLine}>
          <span className={styles.titleNum}>{i + 1}</span>
          <h3>{line}</h3>
        </div>
      ))}
    </div>
  );
}

function ContributionBody({ description }: { description: string }) {
  const parsed = formatPipeContent(description);
  if (typeof parsed === 'string') {
    return <p className={styles.description}>{parsed}</p>;
  }
  return (
    <div className={styles.contentStack}>
      {parsed.map((para, i) => (
        <div key={i} className={styles.contentRow}>
          <span className={styles.contentNum}>{i + 1}</span>
          <p>{para}</p>
        </div>
      ))}
    </div>
  );
}

export default function ContributionsTimeline({
  heading,
  teaser,
  headingId = 'home-contributions-heading',
  className,
}: {
  heading: string;
  teaser: string;
  /** Stable id for the section landmark `aria-labelledby` on the homepage. */
  headingId?: string;
  className?: string;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className={className ? `${styles.section} ${className}` : styles.section}>
      <div className={styles.inner}>
        <h2 id={headingId}>{heading}</h2>
        <p className={styles.intro}>{teaser}</p>

        <div className={styles.track}>
          {BERINGIA_CONTRIBUTIONS.map((item, index) => {
            const expanded = expandedIndex === index;
            const panelId = `${baseId}-panel-${index}`;

            return (
              <button
                key={item.period}
                type="button"
                className={`${styles.item} ${expanded ? styles.itemExpanded : ''}`}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setExpandedIndex(expanded ? null : index)}
              >
                <div className={styles.periodRow}>
                  <p className={styles.period}>{item.period}</p>
                  <svg
                    className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <ContributionTitles title={item.title} />

                <div
                  id={panelId}
                  role="region"
                  aria-label="Contribution details"
                  aria-hidden={!expanded}
                  className={`${styles.panel} ${expanded ? styles.panelOpen : ''}`}
                >
                  <div className={styles.panelInner}>
                    <ContributionBody description={item.description} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
