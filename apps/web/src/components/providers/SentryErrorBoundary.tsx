'use client';

import React, { ReactNode, FC } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const sentryFallback = (
  <div
    style={{
      padding: '20px',
      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h2>Something went wrong</h2>
    <p>We&apos;ve been notified and are working to fix this issue.</p>
    <button
      onClick={() => {
        window.location.reload();
      }}
      style={{
        padding: '10px 20px',
        backgroundColor: '#00b7b5',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px',
      }}
    >
      Try Again
    </button>
  </div>
);

/**
 * Sentry error boundary that logs errors to Sentry
 * Uses the ErrorBoundary component internally to avoid TypeScript issues
 */
const SentryErrorBoundary: FC<Props> = ({ children, fallback }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log the error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  };

  return (
    <ErrorBoundary
      level="component"
      componentName="SentryErrorBoundary"
      onError={handleError}
      fallback={fallback || sentryFallback}
    >
      {children}
    </ErrorBoundary>
  );
};

export { SentryErrorBoundary };
export default SentryErrorBoundary;
