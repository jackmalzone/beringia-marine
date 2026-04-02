'use client';

import React, { Component, ReactNode } from 'react';
import { reportError, ErrorCategory, ErrorSeverity } from '@/lib/utils/errorReporting';
import { createLogger } from '@/lib/utils/logger';

const logger = createLogger('EmailErrorBoundary');

interface EmailErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  email?: string;
  componentName?: string;
}

interface EmailErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

/**
 * Specialized Error Boundary for email functionality with retry mechanisms
 * and user-friendly error messages for different failure scenarios
 */
export class EmailErrorBoundary extends Component<
  EmailErrorBoundaryProps,
  EmailErrorBoundaryState
> {
  private maxRetries = 2;
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: EmailErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<EmailErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `email_error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    const { componentName, onError, email } = this.props;

    // Report error with email-specific context
    reportError(_error, {
      category: ErrorCategory.RECOVERABLE,
      severity: ErrorSeverity.MEDIUM,
      component: componentName || 'EmailErrorBoundary',
      action: 'componentDidCatch',
      metadata: {
        email: email ? email.substring(0, email.indexOf('@')) + '@***' : undefined, // Anonymize email
        componentStack: _errorInfo.componentStack,
        retryCount: this.state.retryCount,
        errorId: this.state.errorId,
        errorType: 'email_component_error',
      },
    });

    this.setState({ errorInfo: _errorInfo });

    logger.error('Email component error caught', _error, {
      componentName,
      email: email ? email.substring(0, email.indexOf('@')) + '@***' : undefined,
      retryCount: this.state.retryCount,
      errorId: this.state.errorId,
    });

    if (onError) {
      onError(_error, _errorInfo);
    }
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      const newRetryCount = this.state.retryCount + 1;

      logger.info('Retrying email component', {
        componentName: this.props.componentName,
        retryCount: newRetryCount,
        errorId: this.state.errorId,
      });

      // Add a small delay before retry to allow for transient issues to resolve
      const timeout = setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: null,
          retryCount: newRetryCount,
        });
      }, 1000);

      this.retryTimeouts.push(timeout);
    }
  };

  handleManualEmail = () => {
    const { email } = this.props;
    if (email) {
      // Provide manual email instructions

      // Try to copy email to clipboard as fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(email)
          .then(() => {
            // Email address copied successfully
          })
          .catch(() => {
            // Failed to copy email address
          });
      } else {
        // Manual email instructions provided
      }
    }
  };

  private getErrorMessage(error: Error): string {
    const message = error.message.toLowerCase();

    // Categorize error messages for user-friendly display
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }

    if (message.includes('mailto') || message.includes('email client')) {
      return 'Unable to open your email client. You can copy the email address and send manually.';
    }

    if (message.includes('clipboard')) {
      return 'Unable to copy to clipboard. Please manually select and copy the email address.';
    }

    if (message.includes('permission') || message.includes('blocked')) {
      return 'Browser security settings are preventing email functionality. Please allow popups or try a different browser.';
    }

    if (message.includes('timeout')) {
      return 'The request timed out. Please try again in a moment.';
    }

    // Generic fallback message
    return 'An unexpected error occurred with the email functionality. Please try again or contact us manually.';
  }

  render() {
    if (this.state.hasError) {
      const { fallback, email } = this.props;
      const canRetry = this.state.retryCount < this.maxRetries;
      const userFriendlyMessage = this.state.error
        ? this.getErrorMessage(this.state.error)
        : 'An error occurred';

      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default email error UI
      return (
        <div className="email-error-boundary" role="alert" aria-live="polite">
          <div className="email-error-content">
            <div className="email-error-icon" aria-hidden="true">
              ⚠️
            </div>
            <div className="email-error-message">
              <h4>Email Issue</h4>
              <p>{userFriendlyMessage}</p>
            </div>
            <div className="email-error-actions">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="email-error-button primary"
                  type="button"
                >
                  Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                </button>
              )}
              {email && (
                <button
                  onClick={this.handleManualEmail}
                  className="email-error-button secondary"
                  type="button"
                >
                  Copy Email Address
                </button>
              )}
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="email-error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error.stack}</pre>
                <pre>{JSON.stringify(this.state.errorInfo, null, 2)}</pre>
              </details>
            )}
          </div>
          <style jsx>{`
            .email-error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1rem;
              border: 1px solid #fbbf24;
              border-radius: 0.5rem;
              background-color: #fef3c7;
              color: #92400e;
              margin: 0.5rem 0;
            }

            .email-error-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 0.75rem;
              max-width: 400px;
            }

            .email-error-icon {
              font-size: 1.5rem;
            }

            .email-error-message h4 {
              margin: 0 0 0.25rem 0;
              font-size: 1rem;
              font-weight: 600;
            }

            .email-error-message p {
              margin: 0;
              font-size: 0.875rem;
              line-height: 1.4;
            }

            .email-error-actions {
              display: flex;
              gap: 0.5rem;
              flex-wrap: wrap;
              justify-content: center;
            }

            .email-error-button {
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 0.375rem;
              font-size: 0.875rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }

            .email-error-button.primary {
              background-color: #d97706;
              color: white;
            }

            .email-error-button.primary:hover {
              background-color: #b45309;
            }

            .email-error-button.secondary {
              background-color: transparent;
              color: #92400e;
              border: 1px solid #d97706;
            }

            .email-error-button.secondary:hover {
              background-color: #d97706;
              color: white;
            }

            .email-error-details {
              margin-top: 1rem;
              padding: 0.75rem;
              background-color: #f3f4f6;
              border-radius: 0.375rem;
              font-size: 0.75rem;
              text-align: left;
              max-width: 100%;
              overflow-x: auto;
            }

            .email-error-details summary {
              cursor: pointer;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }

            .email-error-details pre {
              margin: 0.5rem 0;
              white-space: pre-wrap;
              word-break: break-word;
            }

            @media (max-width: 640px) {
              .email-error-boundary {
                padding: 0.75rem;
              }

              .email-error-actions {
                flex-direction: column;
                width: 100%;
              }

              .email-error-button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping email components with error boundaries
 */
export function withEmailErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<EmailErrorBoundaryProps, 'children'>
) {
  const WithEmailErrorBoundaryComponent = (props: P) => (
    <EmailErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </EmailErrorBoundary>
  );

  WithEmailErrorBoundaryComponent.displayName = `withEmailErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithEmailErrorBoundaryComponent;
}

export default EmailErrorBoundary;
