// Analytics utility for proper Mixpanel initialization

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

// Initialize Mixpanel with proper configuration
export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;

  // Check if Mixpanel is already loaded
  if (window.mixpanel) {
    // If Mixpanel is already initialized, reinitialize with proper name
    try {
      window.mixpanel.init(
        'YOUR_PROJECT_TOKEN',
        {
          debug: false,
          track_pageview: true,
          persistence: 'localStorage',
        },
        'default' // Required name parameter to avoid initialization errors
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
