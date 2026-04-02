/**
 * Production-ready logging service for Vital Ice website
 * Replaces console statements with proper logging that works in both development and production
 */

import * as Sentry from '@sentry/nextjs';

// eslint-disable-next-line no-unused-vars
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;
  private isClient: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  /**
   * Log general information
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, context);
    }

    // In production, send to monitoring service
    if (!this.isDevelopment) {
      Sentry.addBreadcrumb({
        message,
        level: 'info',
        data: context,
      });
    }
  }

  /**
   * Log warnings
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, context);
    }

    // Always send warnings to monitoring
    Sentry.captureMessage(message, {
      level: 'warning',
      tags: {
        component: context?.component,
        action: context?.action,
      },
      extra: context,
    });
  }

  /**
   * Log errors
   */
  error(message: string, error?: Error, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error, context);
    }

    // Always send errors to monitoring
    if (error) {
      Sentry.captureException(error, {
        tags: {
          component: context?.component,
          action: context?.action,
        },
        extra: {
          message,
          ...context,
        },
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        tags: {
          component: context?.component,
          action: context?.action,
        },
        extra: context,
      });
    }
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`[PERF] ${metric}: ${value}ms`, context);
    }

    // Send performance data to monitoring
    Sentry.addBreadcrumb({
      message: `Performance: ${metric}`,
      level: 'info',
      data: {
        metric,
        value,
        unit: 'ms',
        ...context,
      },
    });
  }

  /**
   * Log user interactions for analytics
   */
  interaction(action: string, element: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`[INTERACTION] ${action} on ${element}`, context);
    }

    // Send to analytics service
    Sentry.addBreadcrumb({
      message: `User interaction: ${action}`,
      level: 'info',
      data: {
        action,
        element,
        ...context,
      },
    });
  }

  /**
   * Log API calls and responses
   */
  api(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
    const message = `${method} ${url} - ${status}`;

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`[API] ${message} ${duration ? `(${duration}ms)` : ''}`, context);
    }

    Sentry.addBreadcrumb({
      message: `API: ${message}`,
      level: status >= 400 ? 'error' : 'info',
      data: {
        method,
        url,
        status,
        duration,
        ...context,
      },
    });
  }

  /**
   * Create a scoped logger for a specific component
   */
  scope(component: string): ScopedLogger {
    return new ScopedLogger(this, component);
  }
}

/**
 * Scoped logger that automatically includes component context
 */
class ScopedLogger {
  // eslint-disable-next-line no-unused-vars
  constructor(
    private logger: Logger,
    private component: string
  ) {}

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, { component: this.component, ...context });
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, { component: this.component, ...context });
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, { component: this.component, ...context });
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, error, { component: this.component, ...context });
  }

  performance(metric: string, value: number, context?: LogContext): void {
    this.logger.performance(metric, value, { component: this.component, ...context });
  }

  interaction(action: string, element: string, context?: LogContext): void {
    this.logger.interaction(action, element, { component: this.component, ...context });
  }

  api(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
    this.logger.api(method, url, status, duration, { component: this.component, ...context });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const createLogger = (component: string) => logger.scope(component);

// Export types
export type { LogContext };
export { ScopedLogger };
