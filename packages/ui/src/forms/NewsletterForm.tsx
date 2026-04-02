'use client';

import React from 'react';
import { useNewsletterForm } from './hooks/useNewsletterForm';
import styles from './NewsletterForm.module.css';

const REFERRAL_SOURCES = [
  'Social Media',
  'Friend/Family',
  'Google Search',
  'Website',
  'Other',
];

export interface NewsletterFormProps {
  onSuccess?: () => void;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSuccess }) => {
  const { form, onSubmit, state } = useNewsletterForm({ onSuccess });

  if (state.isSuccess) {
    return (
      <div className={styles.successMessage}>
        <p>Thanks for connecting! We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.formGroup}>
        <input
          type="text"
          id="firstName"
          {...form.register('firstName')}
          placeholder="First Name *"
          className={`${styles.formInput} ${
            form.formState.errors.firstName ? styles.inputError : ''
          }`}
          aria-invalid={!!form.formState.errors.firstName}
          aria-label="First Name"
        />
        {form.formState.errors.firstName && (
          <span className={styles.errorText} role="alert">
            {form.formState.errors.firstName.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          id="lastName"
          {...form.register('lastName')}
          placeholder="Last Name *"
          className={`${styles.formInput} ${
            form.formState.errors.lastName ? styles.inputError : ''
          }`}
          aria-invalid={!!form.formState.errors.lastName}
          aria-label="Last Name"
          required
        />
        {form.formState.errors.lastName && (
          <span className={styles.errorText} role="alert">
            {form.formState.errors.lastName.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          id="email"
          {...form.register('email')}
          placeholder="Email *"
          className={`${styles.formInput} ${
            form.formState.errors.email ? styles.inputError : ''
          }`}
          aria-invalid={!!form.formState.errors.email}
          aria-label="Email"
        />
        {form.formState.errors.email && (
          <span className={styles.errorText} role="alert">
            {form.formState.errors.email.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="tel"
          id="phone"
          {...form.register('phone')}
          placeholder="Phone (optional)"
          className={`${styles.formInput} ${
            form.formState.errors.phone ? styles.inputError : ''
          }`}
          aria-invalid={!!form.formState.errors.phone}
          aria-label="Phone"
        />
        {form.formState.errors.phone && (
          <span className={styles.errorText} role="alert">
            {form.formState.errors.phone.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <select
          id="referralSource"
          {...form.register('referralSource')}
          className={styles.formSelect}
        >
          <option value="">How did you hear about us?</option>
          {REFERRAL_SOURCES.map(source => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.checkboxGroup}>
        <span className={styles.checkboxLabel}>Subscribe to reminders and notifications</span>
        <div className={styles.checkboxRow}>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="sendScheduleEmails"
              {...form.register('sendScheduleEmails')}
              className={styles.checkbox}
            />
            <label htmlFor="sendScheduleEmails" className={styles.checkboxLabelInline}>
              Email
            </label>
          </div>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="sendScheduleTexts"
              {...form.register('sendScheduleTexts')}
              className={styles.checkbox}
            />
            <label htmlFor="sendScheduleTexts" className={styles.checkboxLabelInline}>
              Text
            </label>
          </div>
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
        {state.isSubmitting ? 'Connecting...' : 'Connect'}
      </button>

      <div className={styles.formFooter}>
        <a href="/terms" className={styles.privacyLink}>
          Terms &amp; privacy
        </a>
      </div>
    </form>
  );
};

