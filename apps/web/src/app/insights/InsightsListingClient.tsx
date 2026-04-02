'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { InsightEntry } from '@/lib/content/insights';
import { getInsightPath } from '@/lib/content/insights';
import styles from './index.module.css';

type LandingCopy = {
  readonly title: string;
  readonly subtitle: string;
};

interface InsightsListingClientProps {
  entries: InsightEntry[];
  landing: LandingCopy;
}

export default function InsightsListingClient({ entries, landing }: InsightsListingClientProps) {
  const categories = useMemo(() => ['All', ...new Set(entries.map((entry) => entry.category))], [entries]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const featured = useMemo(() => entries.find((entry) => entry.featured), [entries]);
  const filteredEntries = useMemo(() => {
    const nonFeatured = entries.filter((entry) => entry.slug !== featured?.slug);
    if (selectedCategory === 'All') {
      return nonFeatured;
    }
    return nonFeatured.filter((entry) => entry.category === selectedCategory);
  }, [entries, featured?.slug, selectedCategory]);

  return (
    <>
      <section className={styles.hero} aria-labelledby="insights-landing-title">
        <div className={styles.heroInner}>
          <h1 id="insights-landing-title">{landing.title}</h1>
          <p className={styles.heroSubtitle}>{landing.subtitle}</p>
          <div
            className={styles.chips}
            role="tablist"
            aria-label="Filter articles by category"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={category === selectedCategory}
                className={category === selectedCategory ? styles.chipActive : styles.chip}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {featured ? (
        <section className={styles.featured} aria-label="Featured insight">
          <div className={styles.container}>
            <p className={styles.label}>Featured</p>
            <Link
              href={getInsightPath(featured.slug)}
              className={styles.featuredLink}
              aria-label={`Read article: ${featured.title}`}
            >
              <article className={styles.featuredCard}>
                <div className={styles.cardMedia}>
                  <Image
                    src={featured.coverImage}
                    alt=""
                    width={1200}
                    height={480}
                    className={styles.cardCover}
                    sizes="(max-width: 1200px) 100vw, 1120px"
                    priority
                  />
                  <span className={styles.cardCategoryBadge}>{featured.category}</span>
                </div>
                <div className={styles.featuredBody}>
                  <div className={styles.cardMetaRow}>
                    <span>{featured.displayDate}</span>
                    {featured.readingTime ? (
                      <>
                        <span className={styles.metaSep}>•</span>
                        <span>{featured.readingTime} min read</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  {featured.deck ? <p className={styles.cardDeck}>{featured.deck}</p> : null}
                  <p className={styles.cardExcerpt}>{featured.excerpt}</p>
                  {featured.author ? (
                    <p className={styles.cardAuthor}>{featured.author}</p>
                  ) : null}
                  {featured.tags && featured.tags.length > 0 ? (
                    <div className={styles.tagRow} aria-label="Article tags">
                      {featured.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            </Link>
          </div>
        </section>
      ) : null}

      <section className={styles.gridSection}>
        <div className={styles.container}>
          <div
            className={styles.grid}
            id="insights-articles-grid"
            role="tabpanel"
            aria-label={`Articles in ${selectedCategory} category`}
          >
            {filteredEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={getInsightPath(entry.slug)}
                className={styles.cardLink}
                aria-label={`Read article: ${entry.title}`}
              >
                <article className={styles.card}>
                  <div className={styles.cardMedia}>
                    <Image
                      src={entry.coverImage}
                      alt=""
                      width={800}
                      height={450}
                      className={styles.cardCover}
                      sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                    <span className={styles.cardCategoryBadge}>{entry.category}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{entry.title}</h3>
                    {entry.deck ? <p className={styles.cardDeck}>{entry.deck}</p> : null}
                    <p className={styles.cardExcerpt}>{entry.excerpt}</p>
                    <div className={styles.cardMetaRow}>
                      {entry.author ? (
                        <span className={styles.cardAuthorInline}>{entry.author}</span>
                      ) : null}
                      <span className={styles.cardDate}>{entry.displayDate}</span>
                    </div>
                    {entry.tags && entry.tags.length > 0 ? (
                      <div className={styles.tagRow} aria-label="Article tags">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Link>
            ))}
          </div>
          {filteredEntries.length === 0 ? (
            <p className={styles.emptyState} role="status">
              No insights found in this category.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
