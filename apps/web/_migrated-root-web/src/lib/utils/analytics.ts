// Analytics utility for proper Mixpanel initialization
// This fixes the "You must name your new library" error

declare global {
  interface Window {
    mixpanel?: {
      init: (token: string, config?: Record<string, unknown>, name?: string) => void;
      track: (event: string, properties?: Record<string, unknown>) => void;
      identify: (id: string) => void;
      people: {
        set: (properties: Record<string, unknown>) => void;
      };
    };
  }
}

// Suppress specific Mindbody Mixpanel errors
const suppressMindbodyErrors = () => {
  if (typeof window === 'undefined') return;

  // eslint-disable-next-line no-console
  const originalConsoleError = console.error;
  const originalError = window.Error;

  // Override Error constructor to catch Mindbody Mixpanel errors
  window.Error = function (message: string) {
    if (
      typeof message === 'string' &&
      (message.includes('Mixpanel error: You must name your new library') ||
        message.includes('You must name your new library'))
    ) {
      // Return a silent error that won't be logged
      const silentError = new originalError('Silent Mindbody error');
      silentError.stack = undefined;
      return silentError;
    }
    return new originalError(message);
  } as typeof window.Error;

  // eslint-disable-next-line no-console
  console.error = (...args) => {
    // Check if this is the specific Mindbody Mixpanel error (multiple patterns)
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Mixpanel error: "You must name your new library') ||
        args[0].includes('Mixpanel error: You must name your new library') ||
        args[0].includes('You must name your new library'))
    ) {
      // Suppress this specific error silently
      return;
    }

    // Check if this is a Mindbody-related Mixpanel error
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      (args[0].includes('mixpanel-2-latest.min.js') ||
        args[0].includes('application-59ae') ||
        args[0].includes('mindbodyonline.com') ||
        args[0].includes('healcode.js'))
    ) {
      // Suppress Mindbody-related Mixpanel errors
      return;
    }

    // Check if the error stack trace contains Mindbody-related files
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      args[0].includes('Mixpanel error') &&
      args.some(
        arg =>
          typeof arg === 'string' &&
          (arg.includes('healcode.js') ||
            arg.includes('application-59ae') ||
            arg.includes('mindbodyonline.com'))
      )
    ) {
      // Suppress Mindbody-related Mixpanel errors
      return;
    }

    // Pass through all other errors normally
    originalConsoleError.apply(console, args);
  };

  // Return cleanup function
  return () => {
    // eslint-disable-next-line no-console
    console.error = originalConsoleError;
    window.Error = originalError;
  };
};

// Initialize Mixpanel with proper configuration
export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;

  // Set up error suppression
  const cleanupErrorSuppression = suppressMindbodyErrors();

  // Check if Mixpanel is already loaded
  if (window.mixpanel) {
    // If Mixpanel is already initialized, reinitialize with proper name
    try {
      // This will fix the "You must name your new library" error
      window.mixpanel.init(
        'YOUR_PROJECT_TOKEN',
        {
          debug: false,
          track_pageview: true,
          persistence: 'localStorage',
        },
        'default' // ← This is the required name parameter!
      );
    } catch (error) {
      // Log error to monitoring service instead of console
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureMessage('Mixpanel reinitialization failed', {
          level: 'warning',
          tags: { component: 'Analytics', action: 'reinitializeMixpanel' },
          extra: { error: error instanceof Error ? error.message : String(error) },
        });
      }
    }
  }

  // Return cleanup function for potential use
  return cleanupErrorSuppression;
};

// Track events
export const trackEvent = (event: string, properties?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.mixpanel) return;

  try {
    window.mixpanel.track(event, properties);
  } catch (error) {
    // Log error to monitoring service instead of console
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureMessage('Failed to track event', {
        level: 'warning',
        tags: { component: 'Analytics', action: 'trackEvent' },
        extra: { event, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }
};

// Identify user
export const identifyUser = (userId: string) => {
  if (typeof window === 'undefined' || !window.mixpanel) return;

  try {
    window.mixpanel.identify(userId);
  } catch (error) {
    // Log error to monitoring service instead of console
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureMessage('Failed to identify user', {
        level: 'warning',
        tags: { component: 'Analytics', action: 'identifyUser' },
        extra: { userId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.mixpanel) return;

  try {
    window.mixpanel.people.set(properties);
  } catch (error) {
    // Log error to monitoring service instead of console
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureMessage('Failed to set user properties', {
        level: 'warning',
        tags: { component: 'Analytics', action: 'setUserProperties' },
        extra: { error: error instanceof Error ? error.message : String(error) },
      });
    }
  }
};
