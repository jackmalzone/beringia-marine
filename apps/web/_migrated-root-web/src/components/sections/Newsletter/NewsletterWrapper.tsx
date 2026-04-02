'use client';

import { FC } from 'react';
import { motion } from '@/lib/motion';
import Newsletter from './Newsletter';
import styles from './NewsletterWrapper.module.css';

const NewsletterWrapper: FC = () => {
  return (
    <section className={styles.wrapper}>
      {/* Enhanced Underwater Ambient Background */}
      <div className={styles.ambient} />

      {/* Multiple Gradient Layers for Depth */}
      <div className={styles.gradientTop} />
      <div className={styles.gradientBottom} />
      <div className={styles.gradientCenter} />

      {/* Enhanced Blue Particles */}
      <div className={styles.particles}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Floating Bubbles */}
      <div className={styles.bubbles}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.bubble}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Glow Effects */}
      <div className={styles.glowEffect1} />
      <div className={styles.glowEffect2} />
      <div className={styles.glowEffect3} />

      {/* Newsletter Section */}
      <div className={styles.newsletterSection}>
        <Newsletter />
      </div>

      {/* Let's Connect Section */}
      <div className={styles.connectSection}>
        <motion.div
          className={styles.connectContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h2
            className={styles.connectTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Let&apos;s Connect
          </motion.h2>

          <motion.p
            className={styles.connectText}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            We&apos;re here to support your journey.
          </motion.p>

          <motion.div
            className={styles.connectButtons}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a
              href="/book"
              className={styles.connectButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span className={styles.connectButtonText}>Book Your Session</span>
              <span className={styles.connectButtonIcon}>→</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterWrapper;
