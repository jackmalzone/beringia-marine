'use client';

import { useCallback } from 'react';
import { motion } from '@/lib/motion';
import { HeroBlockType } from '@/lib/sanity/types';
import { buttonVariants, springConfigs } from '@/lib/utils/animations';
import styles from './HeroBlock.module.css';

interface HeroCTAProps {
  ctaButton: HeroBlockType['ctaButton'];
}

/**
 * Client component for hero CTA button (requires interactivity)
 */
export default function HeroCTA({ ctaButton }: HeroCTAProps) {
  const handleCTAClick = useCallback(() => {
    if (ctaButton?.link) {
      if (ctaButton.link.startsWith('#')) {
        // Internal anchor link
        const element = document.getElementById(ctaButton.link.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      } else if (ctaButton.link.startsWith('/')) {
        // Internal page link
        window.location.href = ctaButton.link;
      } else {
        // External link
        window.open(ctaButton.link, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Default behavior - scroll to newsletter
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ctaButton]);

  if (!ctaButton) return null;

  return (
    <motion.button
      className={styles.hero__button}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      transition={{
        ...springConfigs.responsive,
        duration: 0.6,
      }}
      onClick={handleCTAClick}
    >
      <motion.span
        className={styles.hero__buttonText}
        whileHover={{ scale: 1.02 }}
        transition={springConfigs.quick}
      >
        {ctaButton.text}
      </motion.span>
    </motion.button>
  );
}
