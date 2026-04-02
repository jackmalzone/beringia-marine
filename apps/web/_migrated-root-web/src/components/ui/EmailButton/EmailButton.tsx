'use client';

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { MailtoHandler } from '@/lib/utils/MailtoHandler';
import { NoScriptFallback } from './NoScriptFallback';
import type { EmailButtonProps, MailtoOptions, MailtoResult } from '@/types/email';
import styles from './EmailButton.module.css';

// Lazy load FallbackUI component to reduce initial bundle size
const FallbackUI = lazy(() =>
  import('@/components/ui/FallbackUI/FallbackUI').then(module => ({
    default: module.FallbackUI,
  }))
);

export const EmailButton: React.FC<EmailButtonProps> = ({
  email,
  subject,
  body,
  cc,
  bcc,
  children,
  className = '',
  showFallbackOnFailure = true,
  onSuccess,
  onFailure,
  disabled = false,
  'aria-label': ariaLabel,
  debounceDelay = 1000,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastResult, setLastResult] = useState<MailtoResult | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (disabled || isLoading || isRetrying) {
        return;
      }

      // Debounce rapid clicks to prevent multiple mailto attempts
      const now = Date.now();
      if (now - lastClickTime < debounceDelay) {
        return;
      }
      setLastClickTime(now);

      const mailtoOptions: MailtoOptions = {
        email,
        subject,
        body,
        cc,
        bcc,
      };

      setIsLoading(true);
      setError(null);

      try {
        const result = await MailtoHandler.open(mailtoOptions);

        if (result.success) {
          setRetryCount(0);
          setLastResult(null);
          onSuccess?.();
        } else {
          const errorMessage = result.error || 'Failed to open email client';
          setError(errorMessage);
          setLastResult(result);
          onFailure?.(errorMessage);

          if (!result.retryable || retryCount >= 2) {
            if (showFallbackOnFailure) {
              setShowFallback(true);
            }
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        onFailure?.(errorMessage);

        if (showFallbackOnFailure) {
          setShowFallback(true);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      disabled,
      isLoading,
      isRetrying,
      email,
      subject,
      body,
      cc,
      bcc,
      onSuccess,
      onFailure,
      showFallbackOnFailure,
      retryCount,
      lastClickTime,
      debounceDelay,
    ]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    },
    [handleClick]
  );

  const handleRetry = useCallback(async () => {
    if (retryCount >= 2) return;

    setIsRetrying(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mailtoOptions: MailtoOptions = {
        email,
        subject,
        body,
        cc,
        bcc,
      };

      const result = await MailtoHandler.open(mailtoOptions);

      if (result.success) {
        setRetryCount(0);
        setLastResult(null);
        onSuccess?.();
      } else {
        setRetryCount(prev => prev + 1);
        const errorMessage = result.error || 'Failed to open email client';
        setError(errorMessage);
        setLastResult(result);
        onFailure?.(errorMessage);

        if (!result.retryable || retryCount + 1 >= 2) {
          if (showFallbackOnFailure) {
            setShowFallback(true);
          }
        }
      }
    } catch (err) {
      setRetryCount(prev => prev + 1);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLastResult({ success: false, error: errorMessage, retryable: false });
      onFailure?.(errorMessage);

      if (showFallbackOnFailure) {
        setShowFallback(true);
      }
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, email, subject, body, cc, bcc, onSuccess, onFailure, showFallbackOnFailure]);

  const handleFallbackClose = useCallback(() => {
    setShowFallback(false);
    setError(null);
    setRetryCount(0);
    setLastResult(null);
  }, []);

  const handleFallbackCopy = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const buttonClassName = `${className} ${styles.emailButton} ${
    isLoading || isRetrying ? styles.loading : ''
  } ${disabled ? styles.disabled : ''}`.trim();

  const defaultAriaLabel =
    ariaLabel || `Send email to ${email}${subject ? ` with subject: ${subject}` : ''}`;

  return (
    <>
      <NoScriptFallback
        email={email}
        subject={subject}
        body={body}
        cc={cc}
        bcc={bcc}
        className={className}
      >
        {children}
      </NoScriptFallback>

      <button
        type="button"
        className={buttonClassName}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading || isRetrying}
        aria-label={defaultAriaLabel}
        aria-describedby={error ? 'email-button-error' : undefined}
        role="button"
        tabIndex={0}
      >
        {isLoading || isRetrying ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.loadingText}>
              {isRetrying ? 'Retrying...' : 'Opening email...'}
            </span>
          </span>
        ) : (
          children
        )}
      </button>

      {error && !showFallback && (
        <div
          id="email-button-error"
          className={styles.errorMessage}
          role="alert"
          aria-live="polite"
        >
          <div className={styles.errorText}>{error}</div>
          {retryCount < 2 && !isRetrying && lastResult?.retryable !== false && (
            <button
              onClick={handleRetry}
              className={styles.retryButton}
              type="button"
              disabled={isRetrying}
            >
              Try Again ({2 - retryCount} attempts left)
            </button>
          )}
        </div>
      )}

      {showFallback && (
        <Suspense fallback={<div className={styles.fallbackLoader}>Loading...</div>}>
          <FallbackUI
            email={email}
            subject={subject}
            isVisible={showFallback}
            onClose={handleFallbackClose}
            onCopy={handleFallbackCopy}
          />
        </Suspense>
      )}
    </>
  );
};

export default EmailButton;
