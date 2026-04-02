'use client';

import { useState, useEffect } from 'react';
import { ArticleData, ARTICLE_CATEGORIES } from '@/types/insights';
import { getAllArticles, getArticlesByCategory } from '@/lib/data/insights';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { reportNetworkError } from '@/lib/utils/errorReporting';
import { motion, AnimatePresence } from '@/lib/motion';
import { useAccessibleMotion } from '@/lib/hooks/useAccessibleMotion';
import { pageTransitionVariants } from '@/lib/utils/animations';
import {
  measureWebVitals,
  measureHydrationTime,
  reportMetric,
  preloadCriticalImages,
} from '@/lib/performance/insights-performance';
import InsightsHero from '@/components/insights/InsightsHero/InsightsHero';
import CategoryFilter from '@/components/insights/CategoryFilter/CategoryFilter';
import SearchBar from '@/components/insights/SearchBar/SearchBar';
import ArticleCard from '@/components/insights/ArticleCard/ArticleCard';
import ArticleCardSkeleton from '@/components/insights/ArticleCardSkeleton/ArticleCardSkeleton';
import styles from './page.module.css';

export default function InsightsPageClient() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [, setSearchQuery] = useState('');
  const { shouldReduceMotion, transition } = useAccessibleMotion();

  // Measure hydration time
  useEffect(() => {
    const endHydration = measureHydrationTime('InsightsPageClient');
    endHydration();

    // Measure Web Vitals
    measureWebVitals(reportMetric);
  }, []);

  useEffect(() => {
    // Skip fetching if search is active
    if (isSearchActive) {
      return;
    }

    // Fetch articles with error handling
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const data =
          selectedCategory === 'All' ? getAllArticles() : getArticlesByCategory(selectedCategory);
        setArticles(data);

        // Preload first 3 article cover images for better LCP
        if (data.length > 0) {
          const criticalImages = data.slice(0, 3).map(article => article.coverImage);
          preloadCriticalImages(criticalImages);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load articles');
        setError(error);
        reportNetworkError(error, '/insights', 0, {
          component: 'InsightsPageClient',
          action: 'fetchArticles',
          metadata: { selectedCategory },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory, isSearchActive]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Trigger re-fetch by updating state
    setSelectedCategory(prev => prev);
  };

  const handleSearchResults = (results: ArticleData[], query: string) => {
    setIsSearchActive(true);
    setSearchQuery(query);
    setArticles(results);
    setIsLoading(false);
  };

  const handleSearchClear = () => {
    setIsSearchActive(false);
    setSearchQuery('');
    // Trigger re-fetch of category articles
    setIsLoading(true);
  };

  const handleCategoryChange = (category: string) => {
    // Clear search when changing categories
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchQuery('');
    }
    setSelectedCategory(category);
  };

  return (
    <ErrorBoundary level="page" componentName="InsightsPageClient">
      <motion.div
        className={styles.insights}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion ? undefined : pageTransitionVariants}
        transition={transition}
      >
        {/* Neon Arc Background - Shared across all sections */}
        <div className={styles.insights__arcBackground}>
          <svg
            className={styles.insights__arc}
            viewBox="-200 -300 3400 1500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Main arc gradient - pink to blue */}
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0080" />
                <stop offset="25%" stopColor="#ff3366" />
                <stop offset="50%" stopColor="#7928ca" />
                <stop offset="75%" stopColor="#0070f3" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>

              {/* Glow filters - multiple blur levels */}
              <filter id="glow1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                </feMerge>
              </filter>

              <filter id="glow2" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="20" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                </feMerge>
              </filter>

              <filter id="glow3" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="40" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                </feMerge>
              </filter>

              <filter id="glow4" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="70" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                </feMerge>
              </filter>

              {/* Fade mask for edges */}
              <linearGradient id="fadeMask" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="black" stopOpacity="0" />
                <stop offset="8%" stopColor="white" stopOpacity="1" />
                <stop offset="92%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="black" stopOpacity="0" />
              </linearGradient>
              <mask id="arcFadeMask">
                <rect x="-200" y="-300" width="3400" height="1500" fill="url(#fadeMask)" />
              </mask>
            </defs>

            {/* Blurred duplicate arcs - same path, layered behind main arc */}
            {/* Layer 4: Ultra-wide diffusion */}
            <path
              d="M -150 1100 A 1800 1800 0 0 1 3150 1100"
              stroke="url(#arcGradient)"
              strokeWidth="40"
              fill="none"
              filter="url(#glow4)"
              mask="url(#arcFadeMask)"
              opacity="0.15"
            />

            {/* Layer 3: Wide diffusion */}
            <path
              d="M -150 1100 A 1800 1800 0 0 1 3150 1100"
              stroke="url(#arcGradient)"
              strokeWidth="25"
              fill="none"
              filter="url(#glow3)"
              mask="url(#arcFadeMask)"
              opacity="0.25"
            />

            {/* Layer 2: Medium glow */}
            <path
              d="M -150 1100 A 1800 1800 0 0 1 3150 1100"
              stroke="url(#arcGradient)"
              strokeWidth="12"
              fill="none"
              filter="url(#glow2)"
              mask="url(#arcFadeMask)"
              opacity="0.4"
            />

            {/* Layer 1: Close glow */}
            <path
              d="M -150 1100 A 1800 1800 0 0 1 3150 1100"
              stroke="url(#arcGradient)"
              strokeWidth="6"
              fill="none"
              filter="url(#glow1)"
              mask="url(#arcFadeMask)"
              opacity="0.6"
            />

            {/* Main crisp arc - no blur */}
            <path
              d="M -150 1100 A 1800 1800 0 0 1 3150 1100"
              stroke="url(#arcGradient)"
              strokeWidth="2.5"
              fill="none"
              mask="url(#arcFadeMask)"
              className={styles.insights__arcPath}
            />
          </svg>
        </div>

        {/* Full Screen Hero Section */}
        <InsightsHero />

        {/* Articles Grid Section with Filters */}
        <motion.section
          className={styles.insights__grid}
          id="insights-articles-grid"
          variants={
            shouldReduceMotion
              ? undefined
              : {
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2,
                    },
                  },
                }
          }
        >
          {/* Logo at top of grid */}
          <div className={styles.insights__gridLogo}>
            <img
              src="https://media.vitalicesf.com/logo-dark.png"
              alt="Vital Ice logo"
              width={300}
              height={150}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
          </div>

          {/* Filters and Search Bar */}
          <div className={styles.insights__filters}>
            <CategoryFilter
              categories={['All', ...ARTICLE_CATEGORIES]}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            <SearchBar onSearchResults={handleSearchResults} onSearchClear={handleSearchClear} />
          </div>

          {/* Articles Container */}
          <div className={styles.insights__articles}>
            {error ? (
              <div className={styles.insights__error}>
                <div className={styles.insights__errorContent}>
                  <svg
                    className={styles.insights__errorIcon}
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                      fill="currentColor"
                    />
                  </svg>
                  <h3 className={styles.insights__errorTitle}>Unable to load articles</h3>
                  <p className={styles.insights__errorMessage}>
                    We&apos;re having trouble loading the content. Please try again.
                  </p>
                  <button onClick={handleRetry} className={styles.insights__retryButton}>
                    Try Again
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <>
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
              </>
            ) : articles.length === 0 ? (
              <div className={styles.insights__empty}>
                <p>No articles found in this category.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.section>
      </motion.div>
    </ErrorBoundary>
  );
}
