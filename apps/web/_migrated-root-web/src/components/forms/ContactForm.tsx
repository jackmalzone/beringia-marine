'use client';

import React, { useState } from 'react';
import { submitContactForm } from '@/lib/forms/submission';
import { validateContactForm } from '@/lib/forms/validation';
import { trackMetaPixelContact } from '@/lib/utils/metaPixel';
import type { ContactFormData, FormSubmissionState } from '@/lib/forms/types';
import styles from './ContactForm.module.css';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [state, setState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
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

    // Validate form
    const validation = validateContactForm(formData);
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
      const response = await submitContactForm(formData);

      if (response.success) {
        setState({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
        });

        // Track analytics
        trackMetaPixelContact('Contact Form');

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          errorMessage: response.error?.message || 'Failed to submit form. Please try again.',
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
        <p>We&apos;ve received your message and will get back to you soon.</p>
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
            aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
          />
          {fieldErrors.firstName && (
            <span id="firstName-error" className={styles.errorText} role="alert">
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
            aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
          />
          {fieldErrors.lastName && (
            <span id="lastName-error" className={styles.errorText} role="alert">
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
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email && (
            <span id="email-error" className={styles.errorText} role="alert">
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
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
          />
          {fieldErrors.phone && (
            <span id="phone-error" className={styles.errorText} role="alert">
              {fieldErrors.phone}
            </span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.formLabel}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={styles.formTextarea}
          rows={5}
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
        {state.isSubmitting ? 'Submitting...' : 'Send Message'}
      </button>
    </form>
  );
};
