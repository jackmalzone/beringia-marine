'use client';

import { motion } from '@/lib/motion';
import styles from './ServiceGridBlock.module.css';

interface ServiceGridHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Client component wrapper for service grid header with animations
 */
export default function ServiceGridHeader({ title, subtitle }: ServiceGridHeaderProps) {
  return (
    <motion.div
      className={styles.serviceGrid__header}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.serviceGrid__title}>{title}</h2>
      {subtitle && <p className={styles.serviceGrid__subtitle}>{subtitle}</p>}
    </motion.div>
  );
}
