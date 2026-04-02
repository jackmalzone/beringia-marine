/**
 * BusinessContact Component
 *
 * Reusable component for displaying consistent business contact information
 * across all pages. Uses centralized business configuration.
 */

import React from 'react';
import { VITAL_ICE_BUSINESS, BusinessInfoHelpers } from '@/lib/config/business-info';
import styles from './BusinessContact.module.css';

interface BusinessContactProps {
  variant?: 'default' | 'compact' | 'inline';
  showPhone?: boolean;
  showEmail?: boolean;
  showAddress?: boolean;
  showHours?: boolean;
  className?: string;
}

const BusinessContact: React.FC<BusinessContactProps> = ({
  variant = 'default',
  showPhone = true,
  showEmail = true,
  showAddress = true,
  showHours = false,
  className = '',
}) => {
  const containerClass = `${styles.businessContact} ${styles[`businessContact--${variant}`]} ${className}`;

  return (
    <div className={containerClass}>
      {showPhone && VITAL_ICE_BUSINESS.phone && (
        <div className={styles.contactItem}>
          <a
            href={`tel:${VITAL_ICE_BUSINESS.phone}`}
            className={styles.contactLink}
            aria-label={`Call ${VITAL_ICE_BUSINESS.name}`}
          >
            {BusinessInfoHelpers.getFormattedPhone()}
          </a>
        </div>
      )}

      {showEmail && (
        <div className={styles.contactItem}>
          <a
            href={`mailto:${VITAL_ICE_BUSINESS.email}`}
            className={styles.contactLink}
            aria-label={`Email ${VITAL_ICE_BUSINESS.name}`}
          >
            {VITAL_ICE_BUSINESS.email}
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
                {VITAL_ICE_BUSINESS.address.street}
                <br />
                {VITAL_ICE_BUSINESS.address.city}, {VITAL_ICE_BUSINESS.address.state}{' '}
                {VITAL_ICE_BUSINESS.address.zipCode}
              </>
            )}
          </address>
        </div>
      )}

      {showHours && (
        <div className={styles.contactItem}>
          <div className={styles.hours}>
            <h4 className={styles.hoursTitle}>Hours</h4>
            {VITAL_ICE_BUSINESS.hours.map(hour => (
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
