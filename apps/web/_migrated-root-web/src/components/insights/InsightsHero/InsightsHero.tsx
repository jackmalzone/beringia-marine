'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from '@/lib/motion';
import { useAccessibleMotion } from '@/lib/hooks/useAccessibleMotion';
import styles from './InsightsHero.module.css';

interface InsightsHeroProps {
  children?: React.ReactNode;
}

export default function InsightsHero({ children }: InsightsHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { shouldReduceMotion } = useAccessibleMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax effects - disabled when reduced motion is preferred
  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -50]);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Content */}
      <motion.div className={styles.hero__content} style={{ y: contentY }}>
        <motion.h1
          className={styles.hero__title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.01 }
              : {
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  delay: 0.1,
                }
          }
        >
          Industry Insights
        </motion.h1>
        <motion.p
          className={styles.hero__subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.01 }
              : {
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  delay: 0.2,
                }
          }
        >
          Expert perspectives from the recovery & wellness space
        </motion.p>
        {children}
      </motion.div>
    </section>
  );
}
