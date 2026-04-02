'use client';

import Image from 'next/image';
import { useState } from 'react';
import { resolveAssetUrl } from '@/lib/content/partner-content';
import styles from './SellingPointsSection.module.css';

type Doc = {
  specs?: string;
  manual?: string;
  benthicSurvey?: string;
};

export type SellingPoint = {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon?: string;
  link?: string;
  documentation?: Doc;
};

export function SellingPointsSection({ title, points }: { title: string; points: SellingPoint[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const openSpecs = (specs: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resolved = resolveAssetUrl(specs) || specs;
    window.open(resolved, '_blank', 'noopener,noreferrer');
  };

  const openBenthic = (url: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resolved = resolveAssetUrl(url) || url;
    window.open(resolved, '_blank', 'noopener,noreferrer');
  };

  const renderIcon = (icon?: string) => {
    if (!icon) return null;
    if (icon.startsWith('react-icons:')) return null;
    const src = resolveAssetUrl(icon) || icon;
    if (!src.startsWith('/') && !src.startsWith('http')) return null;
    return (
      <Image src={src} alt="" width={48} height={48} className={styles.icon} unoptimized={src.endsWith('.webp')} />
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.grid}>
          {points.map((point) => (
            <div
              key={point.id}
              className={`${styles.card} ${expanded === point.id ? styles.cardExpanded : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => setExpanded(expanded === point.id ? null : point.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpanded(expanded === point.id ? null : point.id);
                }
              }}
            >
              <div className={styles.header}>
                {renderIcon(point.icon)}
                <h3
                  className={`${styles.itemTitle} ${point.link ? styles.itemTitleClickable : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (point.link) window.open(point.link, '_blank', 'noopener,noreferrer');
                  }}
                >
                  {point.title}
                </h3>
              </div>
              <p className={styles.text}>{point.description}</p>
              <ul className={`${styles.list} ${expanded === point.id ? styles.listExpanded : ''}`}>
                {point.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {point.documentation ? (
                <div className={styles.docs} onClick={(e) => e.stopPropagation()}>
                  {point.documentation.specs ? (
                    <button
                      type="button"
                      className={styles.docBtn}
                      onClick={(e) => openSpecs(point.documentation!.specs!, e)}
                    >
                      Specs
                    </button>
                  ) : null}
                  {point.documentation.manual ? (
                    <>
                      {point.documentation.specs ? <span className={styles.docSep}>|</span> : null}
                      <a
                        href={point.documentation.manual}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.docLink}
                      >
                        Manual
                      </a>
                    </>
                  ) : null}
                  {point.documentation.benthicSurvey ? (
                    <>
                      <span className={styles.docSep}>|</span>
                      <button
                        type="button"
                        className={styles.docBtn}
                        onClick={(e) =>
                          openBenthic(
                            point.documentation!.benthicSurvey!,
                            `${point.title} — evaluation`,
                            e
                          )
                        }
                      >
                        Evaluation
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
