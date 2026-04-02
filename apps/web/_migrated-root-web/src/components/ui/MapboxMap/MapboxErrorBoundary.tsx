'use client';

import React, { Component, ReactNode } from 'react';
import { reportError, ErrorCategory, ErrorSeverity } from '@/lib/utils/errorReporting';
import { createLogger } from '@/lib/utils/logger';
import styles from './MapboxMap.module.css';

const logger = createLogger('MapboxErrorBoundary');

interface MapboxErrorBoundaryProps {
  children: ReactNode;
  fallbackContent?: ReactNode;
  businessInfo?: {
    name: string;
    address: string;
    phone?: string;
  };
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface MapboxErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

/**
 * Specialized Error Boundary for MapboxMap component
 * Provides map-specific error handling and fallback UI
 */
export class MapboxErrorBoundary extends Component<
  MapboxErrorBoundaryProps,
  MapboxErrorBoundaryState
> {
  private maxRetries = 2;

  constructor(props: MapboxErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<MapboxErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report Mapbox-specific errors with appropriate categorization
    reportError(error, {
      category: ErrorCategory.THIRD_PARTY,
      severity: ErrorSeverity.MEDIUM,
      component: 'MapboxMap',
      action: 'componentDidCatch',
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        isMapboxError: true,
        errorType: this.categorizeMapboxError(error),
      },
    });

    logger.error('Mapbox component error caught', error, {
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount,
    });

    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private categorizeMapboxError(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes('access token') || message.includes('unauthorized')) {
      return 'authentication';
    }
    if (message.includes('network') || message.includes('timeout')) {
      return 'network';
    }
    if (message.includes('webgl') || message.includes('not supported')) {
      return 'browser_compatibility';
    }
    if (message.includes('style') || message.includes('source')) {
      return 'configuration';
    }

    return 'unknown';
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      logger.info('Retrying MapboxMap component', {
        retryCount: this.state.retryCount + 1,
        maxRetries: this.maxRetries,
      });

      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallbackContent) {
        return this.props.fallbackContent;
      }

      // Render map-specific fallback UI
      return this.renderMapFallback();
    }

    return this.props.children;
  }

  private renderMapFallback() {
    const { businessInfo } = this.props;
    const { error, retryCount } = this.state;
    const canRetry = retryCount < this.maxRetries;
    const errorType = error ? this.categorizeMapboxError(error) : 'unknown';

    return (
      <div className={styles.mapContainer}>
        <div className={styles.errorState}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>🗺️</div>
            <div className={styles.errorMessage}>
              <h4>Interactive Map Unavailable</h4>
              <p>{this.getErrorMessage(errorType)}</p>

              {businessInfo && (
                <div className={styles.fallbackContent}>
                  <h5>Visit Us At:</h5>
                  <div className={styles.businessInfo}>
                    <div className={styles.businessName}>{businessInfo.name}</div>
                    <div className={styles.businessAddress}>{businessInfo.address}</div>
                    {businessInfo.phone && (
                      <div className={styles.businessPhone}>
                        <a href={`tel:${businessInfo.phone}`}>{businessInfo.phone}</a>
                      </div>
                    )}
                  </div>

                  <div className={styles.fallbackActions}>
                    {canRetry && (
                      <button
                        onClick={this.handleRetry}
                        className={styles.retryButton}
                        type="button"
                      >
                        Try Again ({this.maxRetries - retryCount} attempts left)
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionsButton}
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && error && (
                <details className={styles.errorDetails}>
                  <summary>Error Details (Development)</summary>
                  <div>
                    <strong>Error Type:</strong> {errorType}
                  </div>
                  <div>
                    <strong>Retry Count:</strong> {retryCount}/{this.maxRetries}
                  </div>
                  <code>{error.stack}</code>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getErrorMessage(errorType: string): string {
    switch (errorType) {
      case 'authentication':
        return 'Map service authentication failed. Please contact support if this issue persists.';
      case 'network':
        return 'Unable to connect to map services. Please check your internet connection.';
      case 'browser_compatibility':
        return 'Your browser may not support interactive maps. Please try using a modern browser.';
      case 'configuration':
        return 'Map configuration error. Please contact support if this issue persists.';
      default:
        return "We're having trouble loading the interactive map. You can still get directions using the link below.";
    }
  }
}

export default MapboxErrorBoundary;
