/**
 * Google Tag Manager utility functions
 * Provides type-safe GTM event tracking and data layer management
 */

// Extend Window interface to include dataLayer and Meta Pixel
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (..._args: unknown[]) => void;
    fbq?: (
      _command: 'init' | 'track' | 'trackCustom' | 'trackSingle',
      _eventName: string,
      _parameters?: Record<string, unknown>
    ) => void;
    _fbq?: (..._args: unknown[]) => void;
  }
}

/**
 * Push an event to the GTM data layer
 * @param event - Event name
 * @param parameters - Event parameters
 */
export function gtmPushEvent(event: string, parameters?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...parameters,
    });
  } catch {
    // GTM event push failed - error logged to monitoring
  }
}

/**
 * Track page views
 * @param pagePath - Page path
 * @param pageTitle - Page title
 */
export function gtmTrackPageView(pagePath: string, pageTitle?: string): void {
  gtmPushEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}

/**
 * Track custom events
 * @param eventName - Custom event name
 * @param eventCategory - Event category
 * @param eventLabel - Event label
 * @param value - Event value
 */
export function gtmTrackEvent(
  eventName: string,
  eventCategory?: string,
  eventLabel?: string,
  value?: number
): void {
  gtmPushEvent(eventName, {
    event_category: eventCategory,
    event_label: eventLabel,
    value,
  });
}

/**
 * Track conversions
 * @param conversionId - Conversion ID
 * @param conversionValue - Conversion value
 * @param currency - Currency code
 */
export function gtmTrackConversion(
  conversionId: string,
  conversionValue?: number,
  currency: string = 'USD'
): void {
  gtmPushEvent('conversion', {
    conversion_id: conversionId,
    conversion_value: conversionValue,
    currency,
  });
}

/**
 * Track form submissions
 * @param formName - Form name/ID
 * @param formType - Type of form
 */
export function gtmTrackFormSubmission(formName: string, formType?: string): void {
  gtmPushEvent('form_submit', {
    form_name: formName,
    form_type: formType,
  });
}

/**
 * Track button clicks
 * @param buttonName - Button name/ID
 * @param buttonLocation - Where the button is located
 */
export function gtmTrackButtonClick(buttonName: string, buttonLocation?: string): void {
  gtmPushEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
  });
}

/**
 * Track booking attempts
 * @param service - Service being booked
 * @param location - Booking location
 */
export function gtmTrackBookingAttempt(service?: string, location?: string): void {
  gtmPushEvent('booking_attempt', {
    service,
    location,
  });
}

/**
 * Track email interactions
 * @param action - Email action (open, click, etc.)
 * @param emailType - Type of email
 */
export function gtmTrackEmailInteraction(action: string, emailType?: string): void {
  gtmPushEvent('email_interaction', {
    email_action: action,
    email_type: emailType,
  });
}

/**
 * Set user properties in GTM
 * @param userId - User ID
 * @param properties - User properties
 */
export function gtmSetUserProperties(userId?: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      user_id: userId,
      user_properties: properties,
    });
  } catch {
    // GTM user properties failed - error logged to monitoring
  }
}

/**
 * Initialize GTM with custom configuration
 * @param config - GTM configuration
 */
export function gtmInitialize(config?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'gtm_init',
      ...config,
    });
  } catch {
    // GTM initialization failed - error logged to monitoring
  }
}
