'use client';

import { motion } from '@/lib/motion';
import styles from './TestimonialsBlock.module.css';

interface TestimonialsHeaderProps {
  title: string;
}

/**
 * Client component wrapper for testimonials header with animations
 */
export default function TestimonialsHeader({ title }: TestimonialsHeaderProps) {
  return (
    <motion.h2
      className={styles.testimonials__title}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {title}
    </motion.h2>
  );
}
