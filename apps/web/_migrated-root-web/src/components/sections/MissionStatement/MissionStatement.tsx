'use client';

import { FC } from 'react';
import { motion } from '@/lib/motion';

import styles from './MissionStatement.module.css';

const MissionStatement: FC = () => {
  const missionStatement =
    "We're making elite recovery simple, social, and within reach. Fusing proven methods with a space designed to connect and evolve. Let's turn recovery into the new happy hour.";

  return (
    <section className={styles.mission}>
      {/* Ambient background elements */}
      <div className={styles.mission__ambient} />

      {/* Bottom transition to black sand */}
      <div className={styles.mission__bottomTransition} />

      <div className={styles.mission__container}>
        <motion.div
          className={styles.mission__content}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h2
            className={styles.mission__title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            Our Mission
          </motion.h2>

          <motion.p
            className={styles.mission__statement}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {missionStatement}
          </motion.p>

          <motion.div
            className={styles.mission__divider}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />

          <motion.div
            className={styles.mission__cta}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.p
              className={styles.mission__ctaText}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <em>Live Better — Together.</em>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionStatement;
