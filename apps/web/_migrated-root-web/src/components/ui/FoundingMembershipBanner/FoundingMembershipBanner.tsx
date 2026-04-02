'use client';

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import Link from 'next/link';
import styles from './FoundingMembershipBanner.module.css';

// Simple X icon component
const XIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const FoundingMembershipBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // For testing - show immediately without localStorage check
    setIsVisible(true);

    // Uncomment below for production with dismissal logic
    /*
    const dismissed = localStorage.getItem('founding-membership-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
    */
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('founding-membership-banner-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.bannerOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.banner}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className={styles.content}>
              <div className={styles.text}>
                <span className={styles.highlight}>New:</span> Founding Memberships Available
              </div>
              <Link href="/book" className={styles.ctaButton}>
                Learn More
              </Link>
            </div>
            <button
              onClick={handleDismiss}
              className={styles.closeButton}
              aria-label="Close banner"
            >
              <XIcon />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FoundingMembershipBanner;
