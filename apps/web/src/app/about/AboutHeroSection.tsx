'use client';

import { motion } from '@/lib/motion';
import { SITE_CONFIG } from '@/lib/config/site-config';
import { TEMPLATE_HERO_VIDEO } from '@/lib/config/template-assets';
import styles from './page.module.css';

export default function AboutHeroSection() {
  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className={styles.hero__videoContainer}>
        <video autoPlay muted loop playsInline className={styles.hero__video} poster={TEMPLATE_HERO_VIDEO.poster}>
          <source src={TEMPLATE_HERO_VIDEO.mp4} type="video/mp4" />
          <source src={TEMPLATE_HERO_VIDEO.webm} type="video/webm" />
        </video>
        <div className={styles.hero__videoOverlay} />
      </div>

      <div className={styles.hero__content}>
        <motion.div
            role="heading"
            aria-level={1}
          className={styles.hero__title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          About {SITE_CONFIG.name}
        </motion.div>
        <motion.p
          className={styles.hero__subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Premium services, modern facility, professional team
        </motion.p>
      </div>
    </motion.section>
  );
}
