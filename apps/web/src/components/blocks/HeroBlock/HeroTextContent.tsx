'use client';

import { motion } from '@/lib/motion';
import { textRevealVariants, springConfigs } from '@/lib/utils/animations';
import styles from './HeroBlock.module.css';

interface HeroTextContentProps {
  headline: string;
  subheadline?: string;
}

/**
 * Client component wrapper for hero text content with animations
 * Content values are passed from server, but animations are client-side
 */
export default function HeroTextContent({ headline, subheadline }: HeroTextContentProps) {
  return (
    <motion.div
      className={styles.hero__textContainer}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
          },
        },
      }}
    >
      <motion.div
        className={styles.hero__location}
        variants={textRevealVariants}
        transition={{
          ...springConfigs.gentle,
          duration: 0.8,
        }}
      >
        SAN FRANCISCO
      </motion.div>

      <motion.div
            role="heading"
            aria-level={1}
        className={styles.hero__headline}
        variants={textRevealVariants}
        transition={{
          ...springConfigs.responsive,
          duration: 0.8,
        }}
      >
        {headline}
      </motion.div>

      {subheadline && (
        <motion.p
          className={styles.hero__subheadline}
          variants={textRevealVariants}
          transition={{
            ...springConfigs.responsive,
            duration: 0.8,
          }}
        >
          {subheadline}
        </motion.p>
      )}
    </motion.div>
  );
}
