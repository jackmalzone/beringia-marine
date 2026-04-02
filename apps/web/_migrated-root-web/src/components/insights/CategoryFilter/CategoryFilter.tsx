'use client';

import { ArticleCategory } from '@/types/insights';
import { motion } from '@/lib/motion';
import { useAccessibleMotion } from '@/lib/hooks/useAccessibleMotion';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  categories: ('All' | ArticleCategory)[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * CategoryFilter component for filtering insights articles by category
 * Implements WCAG 2.1 AA accessibility standards with keyboard navigation and ARIA attributes
 */
export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { shouldReduceMotion } = useAccessibleMotion();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, category: string) => {
    // Support Enter and Space keys for activation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategoryChange(category);
    }
  };

  return (
    <motion.div
      className={styles.filter}
      role="tablist"
      aria-label="Article categories"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : {
              type: 'spring',
              stiffness: 150,
              damping: 30,
              delay: 0.3,
            }
      }
    >
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category;

        return (
          <motion.button
            key={category}
            className={`${styles.filter__button} ${
              isSelected ? styles['filter__button--active'] : ''
            }`}
            onClick={() => onCategoryChange(category)}
            onKeyDown={e => handleKeyDown(e, category)}
            role="tab"
            aria-selected={isSelected}
            aria-controls="insights-articles-grid"
            tabIndex={0}
            type="button"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? false : { opacity: 1, scale: 1 }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.05,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.95,
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : {
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: 0.4 + index * 0.05,
                  }
            }
          >
            {category}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
