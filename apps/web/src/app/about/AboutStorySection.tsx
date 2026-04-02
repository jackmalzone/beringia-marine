'use client';

import { motion } from '@/lib/motion';
import styles from './page.module.css';

export default function AboutStorySection() {
  return (
    <motion.div
      className={styles.story}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className={styles.story__container}>
        <motion.div
          className={styles.story__content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.story__title}>Our Story</h2>
          <div className={styles.story__textContainer}>
            <p className={styles.story__text}>
              Behind the name, we&apos;re three operators who wanted a studio that felt as polished
              as a flagship—without losing neighborhood warmth. When the market felt either too
              casual or too clinical, we sketched Premium Service Business: a template-friendly model for
              premium services with transparent pacing and a calm environment.
            </p>
            <p className={styles.story__text}>
              What began as a working session among friends became a full build-out. We care about
              the details clients never have to think about—sound, lighting, wayfinding, and the
              language your team uses when things get busy.
            </p>
            <p className={styles.story__text}>
              We built this for professionals who schedule carefully, neighbors who want consistency,
              and anyone who appreciates a quiet moment of competence in a loud world. Whether you
              are booking your first visit or your fiftieth, we are glad you are here.
            </p>
            <p className={styles.story__quote}>
              Excellence is not a single gesture—it is a habit we rehearse together.
            </p>
            <p className={styles.story__signature}>— The Editorial Team</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
