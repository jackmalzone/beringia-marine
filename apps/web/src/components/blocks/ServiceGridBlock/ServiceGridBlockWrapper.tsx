'use client';

import { ReactNode } from 'react';
import { motion } from '@/lib/motion';
import styles from './ServiceGridBlock.module.css';

interface ServiceGridBlockWrapperProps {
  children: ReactNode;
}

/**
 * Client component wrapper that adds Framer Motion animations
 * Wraps server-rendered content to add animations without affecting SEO
 */
export default function ServiceGridBlockWrapper({ children }: ServiceGridBlockWrapperProps) {
  return (
    <motion.section
      className={styles.serviceGrid}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.section>
  );
}
