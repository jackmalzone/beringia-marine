/**
 * BusinessContact Component
 *
 * Reusable component for displaying consistent business contact information
 * across all pages. Uses centralized business configuration.
 */

import React from 'react';
import { TEMPLATE_BUSINESS, BusinessInfoHelpers } from '@vital-ice/config';
import styles from './BusinessContact.module.css';

interface BusinessContactProps {
  variant?: 'default' | 'compact' | 'inline';
  showPhone?: boolean;
  showTextPhone?: boolean;
  showEmail?: boolean;
  showAddress?: boolean;
  showHours?: boolean;
  className?: string;
}

const BusinessContact: React.FC<BusinessContactProps> = ({
  variant = 'default',
  showPhone = true,
  showTextPhone = false,
  showEmail = true,
  showAddress = true,
  showHours = false,
  className = '',
}) => {
  const containerClass = `${styles.businessContact} ${styles[`businessContact--${variant}`]} ${className}`;

  return (
    <div className={containerClass}>
      {showPhone && TEMPLATE_BUSINESS.phone && (
        <div className={styles.contactItem}>
          <a
            href={`tel:${TEMPLATE_BUSINESS.phone}`}
            className={styles.contactLink}
            aria-label={`Call ${TEMPLATE_BUSINESS.name}`}
          >
            {BusinessInfoHelpers.getFormattedPhone()}
          </a>
        </div>
      )}

      {showTextPhone && TEMPLATE_BUSINESS.phoneText && (
        <div className={styles.contactItem}>
          <a
            href={`sms:${TEMPLATE_BUSINESS.phoneText}`}
            className={styles.contactLink}
            aria-label={`Text ${TEMPLATE_BUSINESS.name}`}
          >
            {BusinessInfoHelpers.getFormattedTextPhone()} (Text)
          </a>
        </div>
      )}

      {showEmail && (
        <div className={styles.contactItem}>
          <a
            href={`mailto:${TEMPLATE_BUSINESS.email}`}
            className={styles.contactLink}
            aria-label={`Email ${TEMPLATE_BUSINESS.name}`}
          >
            {TEMPLATE_BUSINESS.email}
          </a>
        </div>
      )}

      {showAddress && (
        <div className={styles.contactItem}>
          <address className={styles.address}>
            {variant === 'inline' ? (
              BusinessInfoHelpers.getFullAddress()
            ) : (
              <>
                {TEMPLATE_BUSINESS.address.street}
                <br />
                {TEMPLATE_BUSINESS.address.city}, {TEMPLATE_BUSINESS.address.state}{' '}
                {TEMPLATE_BUSINESS.address.zipCode}
              </>
            )}
          </address>
        </div>
      )}

      {showHours && (
        <div className={styles.contactItem}>
          <div className={styles.hours}>
            <h4 className={styles.hoursTitle}>Hours</h4>
            {TEMPLATE_BUSINESS.hours.map(hour => (
              <div key={hour.day} className={styles.hoursDay}>
                <span className={styles.hoursLabel}>{hour.day}:</span>
                <span className={styles.hoursTime}>
                  {hour.closed ? 'Closed' : `${hour.open} - ${hour.close}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessContact;
