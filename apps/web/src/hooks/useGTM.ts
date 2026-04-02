/**
 * React hook for Google Tag Manager integration
 * Provides easy-to-use GTM tracking functions in React components
 */

import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  gtmPushEvent,
  gtmTrackPageView,
  gtmTrackEvent,
  gtmTrackConversion,
  gtmTrackFormSubmission,
  gtmTrackButtonClick,
  gtmTrackBookingAttempt,
  gtmTrackEmailInteraction,
  gtmSetUserProperties,
} from '@/lib/utils/gtm';

/**
 * Hook for GTM tracking functionality
 */
export function useGTM() {
  const pathname = usePathname();

  // Track page views automatically when pathname changes
  useEffect(() => {
    if (pathname) {
      gtmTrackPageView(pathname);
    }
  }, [pathname]);

  // Memoized tracking functions
  const trackEvent = useCallback(
    (eventName: string, eventCategory?: string, eventLabel?: string, value?: number) => {
      gtmTrackEvent(eventName, eventCategory, eventLabel, value);
    },
    []
  );

  const trackConversion = useCallback(
    (conversionId: string, conversionValue?: number, currency?: string) => {
      gtmTrackConversion(conversionId, conversionValue, currency);
    },
    []
  );

  const trackFormSubmission = useCallback((formName: string, formType?: string) => {
    gtmTrackFormSubmission(formName, formType);
  }, []);

  const trackButtonClick = useCallback((buttonName: string, buttonLocation?: string) => {
    gtmTrackButtonClick(buttonName, buttonLocation);
  }, []);

  const trackBookingAttempt = useCallback((service?: string, location?: string) => {
    gtmTrackBookingAttempt(service, location);
  }, []);

  const trackEmailInteraction = useCallback((action: string, emailType?: string) => {
    gtmTrackEmailInteraction(action, emailType);
  }, []);

  const pushEvent = useCallback((event: string, parameters?: Record<string, unknown>) => {
    gtmPushEvent(event, parameters);
  }, []);

  const setUserProperties = useCallback((userId?: string, properties?: Record<string, unknown>) => {
    gtmSetUserProperties(userId, properties);
  }, []);

  return {
    trackEvent,
    trackConversion,
    trackFormSubmission,
    trackButtonClick,
    trackBookingAttempt,
    trackEmailInteraction,
    pushEvent,
    setUserProperties,
  };
}

/**
 * Hook for tracking specific component interactions
 * @param componentName - Name of the component
 */
export function useGTMComponent(componentName: string) {
  const { trackEvent, trackButtonClick } = useGTM();

  const trackComponentEvent = useCallback(
    (action: string, label?: string, value?: number) => {
      trackEvent(`${componentName}_${action}`, 'component', label, value);
    },
    [componentName, trackEvent]
  );

  const trackComponentClick = useCallback(
    (buttonName: string) => {
      trackButtonClick(buttonName, componentName);
    },
    [componentName, trackButtonClick]
  );

  return {
    trackComponentEvent,
    trackComponentClick,
  };
}
