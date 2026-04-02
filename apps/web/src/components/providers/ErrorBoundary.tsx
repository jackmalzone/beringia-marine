'use client';

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { createLogger } from '@/lib/utils/logger';
import { reportError, ErrorCategory, ErrorSeverity } from '@/lib/utils/errorReporting';

const logger = createLogger('ErrorBoundary');

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'page' | 'component' | 'widget';
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}

/**
 * Enhanced Error Boundary with proper error categorization and recovery
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    const { level = 'component', componentName, onError } = this.props;

    // Determine error category and severity based on level
    let category = ErrorCategory.RECOVERABLE;
    let severity = ErrorSeverity.MEDIUM;

    if (level === 'page') {
      category = ErrorCategory.CRITICAL;
      severity = ErrorSeverity.HIGH;
    } else if (level === 'widget') {
      category = ErrorCategory.THIRD_PARTY;
      severity = ErrorSeverity.LOW;
    }

    // Report error using centralized service
    reportError(_error, {
      category,
      severity,
      component: componentName || `${level}-boundary`,
      action: 'componentDidCatch',
      metadata: {
        level,
        componentStack: _errorInfo.componentStack,
        retryCount: this.retryCount,
        errorId: this.state.errorId,
      },
    });

    // Update state with error info
    this.setState({ errorInfo: _errorInfo });

    // Call custom error handler if provided
    if (onError) {
      onError(_error, _errorInfo);
    }
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      logger.info('Retrying component render', {
        componentName: this.props.componentName,
        retryCount: this.retryCount,
        errorId: this.state.errorId,
      });

      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
      });
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback, level = 'component', componentName } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI based on error level
      return this.renderDefaultFallback(level, componentName);
    }

    return this.props.children;
  }

  private renderDefaultFallback(level: string, componentName?: string) {
    const canRetry = this.retryCount < this.maxRetries;

    if (level === 'page') {
      return (
        <div className="error-boundary-page">
          <div className="error-content">
            <h1>Something went wrong</h1>
            <p>We&apos;re sorry, but something unexpected happened.</p>
            <div className="error-actions">
              <button onClick={this.handleReload} className="error-button primary">
                Reload Page
              </button>
              {canRetry && (
                <button onClick={this.handleRetry} className="error-button secondary">
                  Try Again ({this.maxRetries - this.retryCount} attempts left)
                </button>
              )}
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    if (level === 'widget') {
      return (
        <div className="error-boundary-widget">
          <div className="error-content-small">
            <p>Unable to load {componentName || 'component'}</p>
            {canRetry && (
              <button onClick={this.handleRetry} className="error-button-small">
                Retry
              </button>
            )}
          </div>
        </div>
      );
    }

    // Default component-level fallback
    return (
      <div className="error-boundary-component">
        <div className="error-content-medium">
          <h3>Component Error</h3>
          <p>This {componentName || 'component'} encountered an error.</p>
          {canRetry && (
            <button onClick={this.handleRetry} className="error-button">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }
}

/**
 * Higher-order component for wrapping components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithErrorBoundaryComponent;
}

/**
 * Hook for handling async errors in functional components
 */
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: Record<string, unknown>) => {
    logger.error('Async error handled', error, context);

    Sentry.withScope(scope => {
      scope.setTag('asyncError', true);
      if (context) {
        scope.setContext('errorContext', context);
      }
      Sentry.captureException(error);
    });
  }, []);

  return handleError;
}

export default ErrorBoundary;
