'use client';

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import VILogo from '@/components/ui/Logo/VILogo';
import { createLogger } from '@/lib/utils/logger';

const logger = createLogger('PageErrorBoundary');

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName: string;
}

/**
 * Page-level error boundary that provides a full-page error experience
 * while maintaining the Vital Ice branding and design
 */
export function PageErrorBoundary({ children, pageName }: PageErrorBoundaryProps) {
  const handlePageError = (error: Error, errorInfo: React.ErrorInfo) => {
    logger.error('Page-level error occurred', error, {
      pageName,
      componentStack: errorInfo.componentStack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    });
  };

  const pageFallback = (
    <div className="page-error-container">
      <div className="page-error-content">
        <div className="page-error-logo">
          <VILogo width={120} height={80} color="#00b7b5" />
        </div>

        <h1 className="page-error-title">Something went wrong</h1>

        <p className="page-error-message">
          We&apos;re experiencing a temporary issue with this page. Our team has been notified and
          is working to resolve it.
        </p>

        <div className="page-error-actions">
          <button onClick={() => window.location.reload()} className="page-error-button primary">
            Reload Page
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="page-error-button secondary"
          >
            Go Home
          </button>
        </div>

        <div className="page-error-support">
          <p>
            If this problem persists, please contact us at{' '}
            <a href="mailto:support@vitalicesf.com">support@vitalicesf.com</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .page-error-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: white;
        }

        .page-error-content {
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .page-error-logo {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .page-error-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #00b7b5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .page-error-message {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .page-error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .page-error-button {
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: 50px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .page-error-button.primary {
          background: linear-gradient(135deg, #00b7b5 0%, #9ec7c5 100%);
          color: #000000;
        }

        .page-error-button.primary:hover {
          background: linear-gradient(135deg, #9ec7c5 0%, #00b7b5 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 183, 181, 0.3);
        }

        .page-error-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .page-error-button.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .page-error-support {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .page-error-support a {
          color: #00b7b5;
          text-decoration: none;
        }

        .page-error-support a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .page-error-container {
            padding: 1rem;
          }

          .page-error-title {
            font-size: 2rem;
          }

          .page-error-actions {
            flex-direction: column;
            align-items: center;
          }

          .page-error-button {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );

  return (
    <ErrorBoundary
      level="page"
      componentName={pageName}
      onError={handlePageError}
      fallback={pageFallback}
    >
      {children}
    </ErrorBoundary>
  );
}

export default PageErrorBoundary;
