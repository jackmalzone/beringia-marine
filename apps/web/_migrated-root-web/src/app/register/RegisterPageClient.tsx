'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { motion } from '@/lib/motion';
import { VITAL_ICE_BUSINESS } from '@/lib/config/business-info';
import {
  trackMetaPixelContact,
  trackMetaPixelInitiateCheckout,
} from '@/lib/utils/metaPixel';
import styles from './page.module.css';

const RegisterPageClient: FC = () => {
  // Track InitiateCheckout when page loads
  React.useEffect(() => {
    trackMetaPixelInitiateCheckout('New Member Registration');
  }, []);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>New Member Registration</h1>
        <p className={styles.subtitle}>
          Create your Vital Ice account to book sessions, manage your membership, and access our
          recovery services. Please complete the form below and review our liability waiver.
        </p>
      </motion.div>

      {/* Registration Form Section */}
      <motion.section
        className={styles.registrationSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className={styles.registrationContainer}>
          <h2 className={styles.sectionTitle}>Registration Information</h2>
          <p className={styles.sectionDescription}>
            Fill out the form below to create your account with Mindbody.
          </p>
          <div className={styles.mailtoFallback}>
            <p className={styles.mailtoText}>
              <strong>Registration forms are currently undergoing maintenance and temporarily unavailable.</strong>
              <br />
              Please{' '}
              <a href="mailto:info@vitalicesf.com" className={styles.mailtoLink}>
                email us directly at info@vitalicesf.com
              </a>{' '}
              to register for an account.
            </p>
          </div>
        </div>
      </motion.section>


      {/* Contact Section */}
      <motion.section
        className={styles.contactSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className={styles.contactContainer}>
          <h3 className={styles.contactTitle}>Need Help?</h3>
          <p className={styles.contactText}>
            If you have questions about registration or our policies, please{' '}
            <Link href="/contact" className={styles.contactLink}>
              contact us
            </Link>
            . View our{' '}
            <Link href="/client-policy" className={styles.contactLink}>
              policies and terms
            </Link>
            .
          </p>
          <p className={styles.contactInfo}>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${VITAL_ICE_BUSINESS.email}`} className={styles.contactLink}>
              {VITAL_ICE_BUSINESS.email}
            </a>
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default RegisterPageClient;
