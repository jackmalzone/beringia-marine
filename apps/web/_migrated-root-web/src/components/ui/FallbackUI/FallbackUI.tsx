'use client';

import React, { useState, useEffect } from 'react';
import type { FallbackUIProps } from '@/types/email';
import styles from './FallbackUI.module.css';

export const FallbackUI: React.FC<FallbackUIProps> = ({
  email,
  subject,
  isVisible,
  onClose,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // Reset copy state when modal opens/closes
  useEffect(() => {
    if (!isVisible) {
      setCopied(false);
      setCopyError(false);
    }
  }, [isVisible]);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setCopyError(false);
        onCopy?.();

        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for environments without clipboard API
        throw new Error('Clipboard API not available');
      }
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Handle escape key globally when modal is open
  useEffect(() => {
    if (!isVisible) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fallback-title"
      aria-describedby="fallback-description"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 id="fallback-title" className={styles.title}>
            Email Client Not Available
          </h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
            type="button"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <p id="fallback-description" className={styles.description}>
            We couldn&apos;t open your default email client. You can copy the email address below
            and paste it into your preferred email application.
          </p>

          <div className={styles.emailSection}>
            <label htmlFor="email-address" className={styles.label}>
              Email Address:
            </label>
            <div className={styles.emailContainer}>
              <input
                id="email-address"
                type="text"
                value={email}
                readOnly
                className={styles.emailInput}
                aria-label="Email address"
              />
              <button
                className={`${styles.copyButton} ${copied ? styles.copied : ''} ${copyError ? styles.error : ''}`}
                onClick={handleCopyEmail}
                type="button"
                aria-label="Copy email address to clipboard"
              >
                {copied ? '✓ Copied!' : copyError ? 'Failed' : 'Copy'}
              </button>
            </div>
          </div>

          {subject && (
            <div className={styles.subjectSection}>
              <label htmlFor="email-subject" className={styles.label}>
                Subject:
              </label>
              <input
                id="email-subject"
                type="text"
                value={subject}
                readOnly
                className={styles.subjectInput}
                aria-label="Email subject"
              />
            </div>
          )}

          <div className={styles.instructions}>
            <h4 className={styles.instructionsTitle}>How to send the email:</h4>
            <ol className={styles.instructionsList}>
              <li>Open your email application (Gmail, Outlook, Apple Mail, etc.)</li>
              <li>Create a new email</li>
              <li>Paste the copied email address in the &ldquo;To&rdquo; field</li>
              {subject && <li>Add the subject: &ldquo;{subject}&rdquo;</li>}
              <li>Write your message and send</li>
            </ol>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={onClose} type="button">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default FallbackUI;
