'use client';

import React, { useState } from 'react';
import { submitWaitlistForm } from '@/lib/forms/submission';
import { validateWaitlistForm } from '@/lib/forms/validation';
import type { WaitlistFormData, FormSubmissionState } from '@/lib/forms/types';
import styles from './WaitlistForm.module.css';

const INTEREST_AREAS = [
  'Cold Plunge',
  'Infrared Sauna',
  'Traditional Sauna',
  'Red Light Therapy',
  'Compression Boots',
  'Percussion Massage',
];

export const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interestAreas: [],
  });

  const [state, setState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleInterestToggle = (area: string) => {
    setFormData(prev => {
      const current = prev.interestAreas || [];
      const updated = current.includes(area)
        ? current.filter(a => a !== area)
        : [...current, area];
      return { ...prev, interestAreas: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateWaitlistForm(formData);
    if (!validation.isValid) {
      const errors: Record<string, string> = {};
      validation.errors.forEach(error => {
        errors[error.field] = error.message;
      });
      setFieldErrors(errors);
      setState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'Please correct the errors below',
      });
      return;
    }

    setState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
    });
    setFieldErrors({});

    try {
      const response = await submitWaitlistForm(formData);

      if (response.success) {
        setState({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
        });

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          interestAreas: [],
        });
      } else {
        setState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          errorMessage: response.error?.message || 'Failed to join waitlist. Please try again.',
        });
      }
    } catch (error) {
      setState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  if (state.isSuccess) {
    return (
      <div className={styles.successMessage}>
        <h3>You&apos;re on the list!</h3>
        <p>We&apos;ll be in touch soon with updates.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.formLabel}>
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`${styles.formInput} ${fieldErrors.firstName ? styles.inputError : ''}`}
            required
            aria-invalid={!!fieldErrors.firstName}
          />
          {fieldErrors.firstName && (
            <span className={styles.errorText} role="alert">
              {fieldErrors.firstName}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.formLabel}>
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`${styles.formInput} ${fieldErrors.lastName ? styles.inputError : ''}`}
            required
            aria-invalid={!!fieldErrors.lastName}
          />
          {fieldErrors.lastName && (
            <span className={styles.errorText} role="alert">
              {fieldErrors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.formInput} ${fieldErrors.email ? styles.inputError : ''}`}
            required
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <span className={styles.errorText} role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.formLabel}>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${styles.formInput} ${fieldErrors.phone ? styles.inputError : ''}`}
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldErrors.phone && (
            <span className={styles.errorText} role="alert">
              {fieldErrors.phone}
            </span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Interests (optional)</label>
        <div className={styles.checkboxGroup}>
          {INTEREST_AREAS.map(area => (
            <label key={area} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.interestAreas?.includes(area) || false}
                onChange={() => handleInterestToggle(area)}
                className={styles.checkbox}
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </div>

      {state.isError && state.errorMessage && (
        <div className={styles.errorMessage} role="alert">
          {state.errorMessage}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? 'Submitting...' : 'Join Waitlist'}
      </button>

      <div className={styles.formFooter}>
        <img
          src="https://media.vitalicesf.com/mb-powered-logo-vertical-d8eaecd9101acbd5089e8a7572712137814e8f8ab9a2bedc1bf33db1650951de.svg"
          alt="Powered by Mindbody"
          className={styles.mindbodyLogo}
        />
        <a
          href="https://www.mindbodyonline.com/company/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.privacyLink}
        >
          Privacy Policy
        </a>
      </div>
    </form>
  );
};
