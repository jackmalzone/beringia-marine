'use client';

import { motion } from '@/lib/motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function AboutMissionSection() {
  return (
    <motion.div
      className={styles.mission}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className={styles.mission__container}>
        <motion.div
          className={styles.mission__text}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Challenge your limits.{' '}
          <Link href="/contact" className={styles.mission__ritualLink}>
            Join The Ritual.
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
