'use client';

import React from 'react';
import { useContactForm } from './hooks/useContactForm';
import styles from './ContactForm.module.css';

export interface ContactFormProps {
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const { form, onSubmit, state } = useContactForm({ onSuccess });

  if (state.isSuccess) {
    return (
      <div className={styles.successMessage}>
        <h3>Thank You!</h3>
        <p>We&apos;ve received your message and will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.formLabel}>
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            {...form.register('firstName')}
            className={`${styles.formInput} ${
              form.formState.errors.firstName ? styles.inputError : ''
            }`}
            aria-invalid={!!form.formState.errors.firstName}
            aria-describedby={form.formState.errors.firstName ? 'firstName-error' : undefined}
          />
          {form.formState.errors.firstName && (
            <span id="firstName-error" className={styles.errorText} role="alert">
              {form.formState.errors.firstName.message}
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
            {...form.register('lastName')}
            className={`${styles.formInput} ${
              form.formState.errors.lastName ? styles.inputError : ''
            }`}
            aria-invalid={!!form.formState.errors.lastName}
            aria-describedby={form.formState.errors.lastName ? 'lastName-error' : undefined}
          />
          {form.formState.errors.lastName && (
            <span id="lastName-error" className={styles.errorText} role="alert">
              {form.formState.errors.lastName.message}
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
            {...form.register('email')}
            className={`${styles.formInput} ${
              form.formState.errors.email ? styles.inputError : ''
            }`}
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
          />
          {form.formState.errors.email && (
            <span id="email-error" className={styles.errorText} role="alert">
              {form.formState.errors.email.message}
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
            {...form.register('phone')}
            className={`${styles.formInput} ${
              form.formState.errors.phone ? styles.inputError : ''
            }`}
            aria-invalid={!!form.formState.errors.phone}
            aria-describedby={form.formState.errors.phone ? 'phone-error' : undefined}
          />
          {form.formState.errors.phone && (
            <span id="phone-error" className={styles.errorText} role="alert">
              {form.formState.errors.phone.message}
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
          {...form.register('message')}
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

      <div className={styles.formFooter}>
        <a href="/terms" className={styles.privacyLink}>
          Terms &amp; privacy
        </a>
      </div>
    </form>
  );
};
