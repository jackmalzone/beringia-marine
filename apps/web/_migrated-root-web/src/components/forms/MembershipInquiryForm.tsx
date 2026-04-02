'use client';

import React, { useState } from 'react';
import { submitMembershipInquiryForm } from '@/lib/forms/submission';
import { validateMembershipInquiryForm } from '@/lib/forms/validation';
import { trackMetaPixelContact } from '@/lib/utils/metaPixel';
import type { MembershipInquiryFormData, FormSubmissionState } from '@/lib/forms/types';
import styles from './MembershipInquiryForm.module.css';

const MEMBERSHIP_TIERS = [
  'Founding Member',
  'Community Member',
  'Private Member',
  'Not Sure',
];

export const MembershipInquiryForm: React.FC = () => {
  const [formData, setFormData] = useState<MembershipInquiryFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    membershipTier: '',
    additionalInfo: '',
  });

  const [state, setState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateMembershipInquiryForm(formData);
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
      const response = await submitMembershipInquiryForm(formData);

      if (response.success) {
        setState({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
        });

        // Track analytics
        trackMetaPixelContact('Membership Inquiry Form');

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          membershipTier: '',
          additionalInfo: '',
        });
      } else {
        setState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          errorMessage: response.error?.message || 'Failed to submit inquiry. Please try again.',
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
        <h3>Thank You!</h3>
        <p>We&apos;ve received your membership inquiry and will contact you soon.</p>
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
        <label htmlFor="membershipTier" className={styles.formLabel}>
          Membership Interest
        </label>
        <select
          id="membershipTier"
          name="membershipTier"
          value={formData.membershipTier}
          onChange={handleChange}
          className={styles.formSelect}
        >
          <option value="">Select a membership tier</option>
          {MEMBERSHIP_TIERS.map(tier => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="additionalInfo" className={styles.formLabel}>
          Additional Information
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          className={styles.formTextarea}
          rows={4}
          placeholder="Tell us more about your interest in Vital Ice..."
        />
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
        {state.isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
};
