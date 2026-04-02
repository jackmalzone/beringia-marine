'use client';

import React, { useEffect } from 'react';
import { motion } from '@/lib/motion';
import PageSchema from '@/components/seo/PageSchema';
import { ContactForm } from '@/components/forms/ContactForm';
import Logo from '@/components/ui/Logo/Logo';

import { MapboxMap } from '@/components/ui/MapboxMap';
import { VITAL_ICE_BUSINESS, BusinessInfoHelpers } from '@/lib/config/business-info';
import { seoTracker } from '@/lib/analytics/seo-tracking';
import { seoPerformanceMonitor } from '@/lib/analytics/seo-performance-monitor';
import {
  trackMetaPixelContact,
  trackMetaPixelFindLocation,
  trackMetaPixelLead,
} from '@/lib/utils/metaPixel';

import styles from './page.module.css';

const ContactPageClient: React.FC = () => {
  // Google Maps URLs for directions and external map links
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BusinessInfoHelpers.getFullAddress())}`;
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BusinessInfoHelpers.getFullAddress())}`;

  // Initialize SEO tracking and performance monitoring
  useEffect(() => {
    // Track organic landing if user came from search
    seoTracker.trackOrganicLanding();

    // Initialize performance monitoring
    seoPerformanceMonitor.forceHealthCheck();

    // Track page engagement after 30 seconds
    const engagementTimer = setTimeout(() => {
      seoTracker.trackPageEngagement('30_second_engagement');
    }, 30000);

    // Suppress MindBody widget errors globally
    const originalError = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      // Suppress specific MindBody errors
      if (
        (typeof message === 'string' && message.includes('Cannot read properties of null')) ||
        (typeof source === 'string' && source.includes('healcode.js')) ||
        (typeof source === 'string' && source.includes('mindbody'))
      ) {
        return true; // Suppress the error
      }

      // Call original error handler for other errors
      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }
      return false;
    };

    // Set up listener for contact form submission (Lead event)
    const handleFormSubmission = (event: Event) => {
      // Listen for form submissions in the widget
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.closest('[data-type="prospects"]') ||
          target.closest('healcode-widget[data-type="prospects"]') ||
          target.closest('.hc-widget'))
      ) {
        trackMetaPixelLead('Contact Form');
      }
    };

    // Listen for form submissions
    document.addEventListener('submit', handleFormSubmission);

    // Also listen for success messages from Mindbody widget
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            // Check for success messages or confirmation
            if (
              element.textContent?.toLowerCase().includes('thank you') ||
              element.textContent?.toLowerCase().includes('success') ||
              element.textContent?.toLowerCase().includes('submitted') ||
              element.classList.contains('success') ||
              element.classList.contains('hc-success')
            ) {
              trackMetaPixelLead('Contact Form');
            }
          }
        });
      });
    });

    // Observe widget container for changes
    const widgetContainer = document.querySelector('[class*="mindbodyWidget"]');
    if (widgetContainer) {
      observer.observe(widgetContainer, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(engagementTimer);
      window.onerror = originalError;
      document.removeEventListener('submit', handleFormSubmission);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <PageSchema pageKey="contact" />

      <div className={styles.contactPage}>
        {/* Hero Section - Contrast Therapy Banner */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Logo className={styles.heroLogo} width={200} height={100} priority />
              <h1 className={styles.heroTitle}>Contact Us</h1>
              <p className={styles.heroSubtitle}>
                Ready to start your wellness journey? Get in touch with us to learn more about our
                services, book a session, or ask any questions you might have.
              </p>
            </motion.div>
          </div>
        </section>

        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Contact Information */}
            <motion.section
              className={styles.contactInfo}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Connect With Us</h2>
                <div className={styles.sectionAccent}></div>
              </div>

              {/* Quick Contact */}
              <div className={styles.quickContact}>
                <div className={styles.contactMethod}>
                  <div className={styles.contactIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div className={styles.contactDetails}>
                    <h3 className={styles.contactTitle}>Email</h3>
                    <a
                      href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                      className={styles.contactLink}
                      onClick={() => trackMetaPixelContact('email')}
                    >
                      {VITAL_ICE_BUSINESS.email}
                    </a>
                    <p className={styles.contactNote}>We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.contactIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className={styles.contactDetails}>
                    <h3 className={styles.contactTitle}>Visit Us</h3>
                    <address className={styles.address}>
                      {VITAL_ICE_BUSINESS.address.street}
                      <br />
                      {VITAL_ICE_BUSINESS.address.city}, {VITAL_ICE_BUSINESS.address.state}{' '}
                      {VITAL_ICE_BUSINESS.address.zipCode}
                    </address>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionsLink}
                      onClick={() => trackMetaPixelFindLocation()}
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className={styles.businessHours}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Business Hours</h3>
                  <div className={styles.sectionAccent}></div>
                </div>
                <div className={styles.hoursList}>
                  {BusinessInfoHelpers.getGroupedHours().map((hours, index) => (
                    <div key={index} className={styles.hoursItem}>
                      <span className={styles.hoursDay}>{hours.label}</span>
                      <span className={styles.hoursTime}>{hours.time}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.hoursNote}>Coming Soon 2026</p>
              </div>
            </motion.section>

            {/* Contact Form */}
            <motion.section
              className={styles.contactForm}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Get in Touch</h2>
                <div className={styles.sectionAccent}></div>
              </div>
              <p className={styles.formDescription}>
                Ready to start your wellness journey? Fill out the form below and we&apos;ll get
                back to you soon. Learn more about our{' '}
                <a href="/services/cold-plunge" className={styles.serviceLink}>
                  cold plunge therapy
                </a>
                ,{' '}
                <a href="/services/infrared-sauna" className={styles.serviceLink}>
                  infrared sauna
                </a>
                , and{' '}
                <a href="/services/red-light-therapy" className={styles.serviceLink}>
                  red light therapy
                </a>{' '}
                services.
              </p>

              {/* Contact Form - Custom Mindbody API Integration */}
              <div className={styles.contactFormWrapper}>
                <ContactForm />
              </div>
            </motion.section>
          </div>

          {/* Interactive Map Section */}
          <motion.section
            className={styles.mapSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Find Us</h2>
            <div className={styles.mapContainer}>
              <MapboxMap />
            </div>
            <div className={styles.mapInfo}>
              <p className={styles.mapDescription}>
                Located in the heart of San Francisco&apos;s Marina District,{' '}
                {VITAL_ICE_BUSINESS.name} is easily accessible by car, public transportation, or on
                foot. Street parking is available, and we&apos;re just a short walk from Chestnut
                Street&apos;s shops and restaurants. Explore our{' '}
                <a href="/services" className={styles.serviceLink}>
                  wellness services
                </a>{' '}
                or{' '}
                <a href="/experience" className={styles.serviceLink}>
                  choose your experience
                </a>{' '}
                to get started.
              </p>
              <div className={styles.mapActions}>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsButton}
                  onClick={() => trackMetaPixelFindLocation()}
                >
                  Get Directions
                </a>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewMapButton}
                  onClick={() => trackMetaPixelFindLocation()}
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default ContactPageClient;
