'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MindbodyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log to Sentry if it's NOT a Mindbody-related error
    if (!this.isMindbodyError(error)) {
      Sentry.captureException(error, {
        extra: {
          componentStack: errorInfo.componentStack,
          errorInfo: errorInfo,
        },
      });
    }
  }

  private isMindbodyError(error: Error): boolean {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Known Mindbody/Mixpanel error patterns
    const mindbodyPatterns = [
      'mixpanel',
      'mindbody',
      'healcode',
      'jquery',
      'invalid storage entry',
      'not valid json',
      'message channel closed',
      'site.webmanifest',
      'manifest fetch',
      '429',
      '403',
      'too many requests',
      'you must name your new library',
      'silent error',
    ];

    return mindbodyPatterns.some(pattern => message.includes(pattern) || stack.includes(pattern));
  }

  render() {
    if (this.state.hasError) {
      // For Mindbody errors, just render children normally
      if (this.state.error && this.isMindbodyError(this.state.error)) {
        return this.props.children;
      }

      // For legitimate errors, show fallback
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
