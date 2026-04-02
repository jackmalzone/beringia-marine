'use client';

import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { usePathname } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { FaBug } from 'react-icons/fa';
import { useNavigation } from '@/lib/store/AppStore';
import { useGTMComponent } from '@/hooks/useGTM';
import { trackMetaPixelInitiateCheckout } from '@/lib/utils/metaPixel';
import styles from './RollingBookButton.module.css';

const RollingBookButton: FC = () => {
  const { isRollingButtonNearFooter, setRollingButtonNearFooter } = useNavigation();
  const { trackComponentClick, trackComponentEvent } = useGTMComponent('RollingBookButton');
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);

  // Check if we're on the book page
  const isOnBookPage = pathname === '/book';

  // Check localStorage and show expanded state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('founding-membership-banner-dismissed');
      if (dismissed === 'permanent') {
        setIsPermanentlyDismissed(true);
      } else if (!isOnBookPage) {
        // Only show expanded state if NOT on book page
        // Show immediately for better visibility
        setIsExpanded(true);
      }
    }
  }, [isOnBookPage]);

  useEffect(() => {
    let ticking = false;
    let rafId: number;
    let footerElement: Element | null = null;

    // Cache footer element to avoid repeated DOM queries
    const getFooterElement = () => {
      if (!footerElement) {
        footerElement = document.querySelector('footer');
      }
      return footerElement;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const footer = getFooterElement();
          if (footer) {
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const padding = 16; // 1rem padding
            const buffer = 20; // Extra space above footer
            const minButtonHeight = 140; // min-height from CSS

            // Button is at bottom: 0 with padding, so its top is at windowHeight - buttonHeight - padding
            // Use min-height as approximation for button height
            const buttonTop = windowHeight - minButtonHeight - padding;
            const footerTop = footerRect.top;

            // Check if button would overlap with footer (with buffer)
            const shouldBeAboveFooter = buttonTop - buffer < footerTop;
            setRollingButtonNearFooter(shouldBeAboveFooter);

            // Set CSS custom property for precise positioning
            if (shouldBeAboveFooter) {
              document.documentElement.style.setProperty('--footer-top', `${footerRect.top}px`);
            } else {
              document.documentElement.style.removeProperty('--footer-top');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      // Reset footer cache on resize
      footerElement = null;
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll(); // Check on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.documentElement.style.removeProperty('--footer-top');
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [setRollingButtonNearFooter]);

  const handleBookClick = () => {
    // Track booking attempt in GTM
    trackComponentClick('book_button');
    trackComponentEvent('booking_attempt', 'rolling_button');

    // Track InitiateCheckout event for Meta Pixel
    trackMetaPixelInitiateCheckout('Booking');

    // Navigate to booking page
    window.location.href = '/book';
  };

  const handleCollapse = () => {
    setIsExpanded(false);
  };

  const handlePermanentDismiss = () => {
    // Track banner dismissal
    trackComponentEvent('banner_dismissed', 'permanent');

    setIsExpanded(false);
    setIsPermanentlyDismissed(true);
    localStorage.setItem('founding-membership-banner-dismissed', 'permanent');
  };

  const handleFeedbackClick = () => {
    // Get the feedback instance and open the form
    const feedback = Sentry.getFeedback();
    feedback?.createForm().then(form => {
      form.appendToDom();
      form.open();
    });
  };

  return (
    <motion.div
      className={`${styles.rollingBookContainer} ${isRollingButtonNearFooter ? styles.aboveFooter : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Feedback Button */}
      <motion.button
        className={`${styles.rollingBookButton} ${styles.feedbackButton}`}
        onClick={handleFeedbackClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        aria-label="Report an issue"
      >
        <FaBug className={styles.buttonIcon} />
      </motion.button>

      {/* Book Button - Expandable */}
      <AnimatePresence mode="wait">
        {isExpanded && !isPermanentlyDismissed && !isOnBookPage ? (
          <motion.div
            key="expanded"
            className={`${styles.rollingBookButton} ${styles.expandedButton}`}
            initial={{ width: 'auto', opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 'auto', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className={styles.expandedContent}>
              <div className={styles.expandedText}>
                <span className={styles.newLabel}>New:</span>
                <span className={styles.foundingText}>Founding Memberships</span>
              </div>
              <motion.button
                className={styles.expandedBookButton}
                onClick={handleBookClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More →
              </motion.button>
            </div>
            <div className={styles.expandedControls}>
              <button
                className={styles.collapseButton}
                onClick={handleCollapse}
                title="Collapse to Book button"
              >
                −
              </button>
              <button
                className={styles.dismissButton}
                onClick={handlePermanentDismiss}
                title="Don't show again"
              >
                ×
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            className={styles.rollingBookButton}
            onClick={handleBookClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-label="Book your session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className={styles.buttonText}>Book</span>
            <span className={styles.buttonIcon}>→</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RollingBookButton;
