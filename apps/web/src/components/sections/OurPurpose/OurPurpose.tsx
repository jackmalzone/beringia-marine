'use client';
import { motion } from '@/lib/motion';
import styles from './OurPurpose.module.css';

export default function OurPurpose() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className={styles.accentLine} />
          <h2 className={styles.heading}>Our Purpose</h2>
          <p className={styles.text}>
            We&apos;re here to redefine what it means to take care of yourself. Through our cold
            plunge and sauna experiences, we aim to empower you to prioritize recovery and self-care
            as integral parts of your wellness journey. This is more than a business—it&apos;s a
            movement to make recovery as celebrated as the workout itself.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
