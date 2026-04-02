'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import type { ExpertiseCard } from '@/lib/content/beringia-static';
import ScrollReveal from './ScrollReveal';
import styles from './ExpertiseAccordion.module.css';

export default function ExpertiseAccordion({
  cards,
  heading,
  subtitle,
}: {
  cards: ExpertiseCard[];
  heading: string;
  subtitle: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className={styles.root}>
      <ScrollReveal className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </ScrollReveal>

      <div className={styles.list}>
        {cards.map((card, i) => {
          const open = openIndex === i;
          const panelId = `${baseId}-exp-${i}`;

          return (
            <ScrollReveal key={card.title} delay={i * 80} as="article">
              <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span className={styles.step}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.triggerText}>
                    <h3 className={styles.title}>{card.title}</h3>
                    <p className={styles.triggerSub}>{card.subtitle}</p>
                  </div>
                  <svg
                    className={`${styles.icon} ${open ? styles.iconOpen : ''}`}
                    width="20"
                    height="20"
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
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-hidden={!open}
                  className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
                >
                  <div className={styles.panelInner}>
                    <p className={styles.description}>{card.description}</p>
                    {card.cta && (
                      <Link
                        href={card.ctaHref ?? '/contact'}
                        className={styles.cardCta}
                      >
                        {card.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
