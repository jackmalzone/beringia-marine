'use client';

import { ReactNode } from 'react';
import { motion } from '@/lib/motion';
import styles from './TextSectionBlock.module.css';

interface TextSectionBlockWrapperProps {
  children: ReactNode;
  backgroundColor?: string;
}

/**
 * Client component wrapper that adds Framer Motion animations
 * Wraps server-rendered content to add animations without affecting SEO
 */
export default function TextSectionBlockWrapper({
  children,
  backgroundColor,
}: TextSectionBlockWrapperProps) {
  return (
    <motion.section
      className={styles.textSection}
      style={backgroundColor ? { backgroundColor } : undefined}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}
