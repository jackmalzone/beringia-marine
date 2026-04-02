'use client';

import { ReactNode } from 'react';
import { motion } from '@/lib/motion';
import styles from './NewsletterBlock.module.css';

interface NewsletterBlockWrapperProps {
  children: ReactNode;
  backgroundColor?: string;
}

/**
 * Client component wrapper that adds Framer Motion animations
 * Wraps server-rendered content to add animations without affecting SEO
 */
export default function NewsletterBlockWrapper({
  children,
  backgroundColor,
}: NewsletterBlockWrapperProps) {
  return (
    <motion.section
      id="newsletter"
      className={styles.newsletter}
      style={backgroundColor ? { backgroundColor } : undefined}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}
