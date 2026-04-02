'use client';

import React, { useEffect } from 'react';
import { motion } from '@/lib/motion';
import PageSchema from '@/components/seo/PageSchema';
import { ContactForm } from '@vital-ice/ui';

import { TEMPLATE_BUSINESS, BusinessInfoHelpers } from '@vital-ice/config';
import { seoTracker } from '@/lib/analytics/seo-tracking';
import { seoPerformanceMonitor } from '@/lib/analytics/seo-performance-monitor';
import {
  trackMetaPixelContact,
  trackMetaPixelFindLocation,
  trackMetaPixelLead,
} from '@/lib/utils/metaPixel';

import styles from './page.module.css';

const ContactPageClient: React.FC = () => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BusinessInfoHelpers.getFullAddress())}`;
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BusinessInfoHelpers.getFullAddress())}`;

  useEffect(() => {
    seoTracker.trackOrganicLanding();
    seoPerformanceMonitor.forceHealthCheck();

    const engagementTimer = setTimeout(() => {
      seoTracker.trackPageEngagement('30_second_engagement');
    }, 30000);

    const handleFormSubmit = (event: Event) => {
      const form = (event.target as HTMLElement)?.closest('form');
      if (form?.querySelector('[data-contact-form="true"]') || form?.getAttribute('data-contact-form')) {
        trackMetaPixelLead('Contact Form');
      }
    };

    document.addEventListener('submit', handleFormSubmit, true);

    return () => {
      clearTimeout(engagementTimer);
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, []);

  return (
    <>
      <PageSchema pageKey="contact" />

      <div className={styles.contactPage}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.heroTitle}>Contact Us</h2>
              <p className={styles.heroSubtitle}>
                Tell us about your marine technology goals—whether you are validating a product,
                integrating systems, or scaling in the field—and we will help you chart the path
                forward.
              </p>
            </motion.div>
          </div>
        </section>

        <div className={styles.container}>
          <div className={styles.contactGrid}>
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
                      href={`mailto:${TEMPLATE_BUSINESS.email}`}
                      className={styles.contactLink}
                      onClick={() => trackMetaPixelContact('email')}
                    >
                      {TEMPLATE_BUSINESS.email}
                    </a>
                    <p className={styles.contactNote}>We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                {TEMPLATE_BUSINESS.phone && (
                  <div className={styles.contactMethod}>
                    <div className={styles.contactIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <div className={styles.contactDetails}>
                      <h3 className={styles.contactTitle}>Call</h3>
                      <a
                        href={`tel:${TEMPLATE_BUSINESS.phone}`}
                        className={styles.contactLink}
                        onClick={() => trackMetaPixelContact('phone')}
                      >
                        {BusinessInfoHelpers.getFormattedPhone()}
                      </a>
                    </div>
                  </div>
                )}

                {TEMPLATE_BUSINESS.phoneText && (
                  <div className={styles.contactMethod}>
                    <div className={styles.contactIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                      </svg>
                    </div>
                    <div className={styles.contactDetails}>
                      <h3 className={styles.contactTitle}>Text</h3>
                      <a
                        href={`sms:${TEMPLATE_BUSINESS.phoneText}`}
                        className={styles.contactLink}
                        onClick={() => trackMetaPixelContact('sms')}
                      >
                        {BusinessInfoHelpers.getFormattedTextPhone()}
                      </a>
                    </div>
                  </div>
                )}

                <div className={styles.contactMethod}>
                  <div className={styles.contactIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className={styles.contactDetails}>
                    <h3 className={styles.contactTitle}>Visit Us</h3>
                    <address className={styles.address}>
                      {TEMPLATE_BUSINESS.address.street}
                      <br />
                      {TEMPLATE_BUSINESS.address.city}, {TEMPLATE_BUSINESS.address.state}{' '}
                      {TEMPLATE_BUSINESS.address.zipCode}
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
                <p className={styles.hoursNote}>By appointment; response times may vary on U.S. holidays.</p>
              </div>
            </motion.section>

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
                Share a short overview of your program, timeline, and how we can help. We read every
                message and will follow up by email. You can also explore{' '}
                <a href="/solutions" className={styles.serviceLink}>
                  solutions
                </a>{' '}
                or{' '}
                <a href="/insights" className={styles.serviceLink}>
                  insights
                </a>
                .
              </p>

              <div className={styles.contactFormWrapper} data-contact-form="true">
                <ContactForm
                  onSuccess={() => {
                    trackMetaPixelContact('Contact Form');
                    trackMetaPixelLead('Contact Form');
                  }}
                />
              </div>
            </motion.section>
          </div>

          <motion.section
            className={styles.mapSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Find Us</h2>
            <div className={styles.mapInfo}>
              <p className={styles.mapDescription}>
                {TEMPLATE_BUSINESS.name} is listed at {TEMPLATE_BUSINESS.address.street} in{' '}
                {TEMPLATE_BUSINESS.address.city}. Use Google Maps for directions and satellite view.
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
