/**
 * Meta Pixel (Facebook Pixel) utility functions
 * Provides type-safe event tracking for Facebook Pixel
 */

// Track sent events to prevent duplicates within a short time window
const sentEvents = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1000; // Prevent duplicate events within 1 second

/**
 * Standard Meta Pixel Events
 * These are pre-defined events that Facebook recognizes
 */
export type StandardMetaPixelEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Schedule'
  | 'Contact'
  | 'FindLocation'
  | 'Subscribe'
  | 'StartTrial';

/**
 * Track a standard Meta Pixel event
 * @param eventName - Standard event name
 * @param parameters - Optional event parameters
 * @param dedupe - Whether to deduplicate this event (default: true)
 */
export function trackMetaPixelEvent(
  eventName: StandardMetaPixelEvent,
  parameters?: Record<string, unknown>,
  dedupe: boolean = true
): void {
  if (typeof window === 'undefined' || !window.fbq) {
    // Pixel not loaded yet - silently fail
    return;
  }

  // Create deduplication key
  const eventKey = dedupe
    ? `${eventName}_${JSON.stringify(parameters || {})}`
    : `${eventName}_${Date.now()}`;

  // Check if we've sent this event recently
  if (dedupe && sentEvents.has(eventKey)) {
    const lastSent = sentEvents.get(eventKey);
    if (lastSent && Date.now() - lastSent < DEDUPE_WINDOW_MS) {
      // Duplicate event within deduplication window - skip
      return;
    }
  }

  try {
    // Track the event
    window.fbq('track', eventName, parameters);

    // Record that we sent this event
    if (dedupe) {
      sentEvents.set(eventKey, Date.now());

      // Clean up old entries (older than dedupe window)
      setTimeout(() => {
        sentEvents.delete(eventKey);
      }, DEDUPE_WINDOW_MS * 2);
    }
  } catch (error) {
    // Meta Pixel event tracking failed - log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Meta Pixel tracking error:', error, { eventName, parameters });
    }
    // In production, silently fail to avoid disrupting user experience
  }
}

/**
 * Track a custom Meta Pixel event
 * @param eventName - Custom event name (must start with uppercase letter)
 * @param parameters - Optional event parameters
 */
export function trackMetaPixelCustomEvent(
  eventName: string,
  parameters?: Record<string, unknown>
): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  try {
    window.fbq('trackCustom', eventName, parameters);
  } catch (error) {
    // Meta Pixel custom event tracking failed
    // eslint-disable-next-line no-console
    console.error('Meta Pixel custom event tracking error:', error);
  }
}

/**
 * Track a page view (usually automatic, but can be called manually)
 */
export function trackMetaPixelPageView(): void {
  trackMetaPixelEvent('PageView');
}

/**
 * Track when user views a service page
 * @param serviceName - Name of the service
 * @param serviceId - Service identifier
 * @param value - Optional value/price of the service
 */
export function trackMetaPixelViewContent(
  serviceName: string,
  serviceId?: string,
  value?: number
): void {
  trackMetaPixelEvent(
    'ViewContent',
    {
      content_name: serviceName,
      content_ids: serviceId ? [serviceId] : undefined,
      content_type: 'service',
      content_category: 'wellness',
      ...(value && { value, currency: 'USD' }),
    },
    true
  );
}

/**
 * Track when user initiates booking/checkout
 * @param serviceName - Service being booked
 * @param value - Estimated value of booking
 * @param serviceId - Service identifier
 */
export function trackMetaPixelInitiateCheckout(
  serviceName: string,
  value?: number,
  serviceId?: string
): void {
  trackMetaPixelEvent(
    'InitiateCheckout',
    {
      content_name: serviceName,
      content_type: 'service',
      content_category: 'wellness',
      content_ids: serviceId ? [serviceId] : undefined,
      ...(value && { value, currency: 'USD' }),
    },
    true
  );
}

/**
 * Track when user completes a booking/purchase
 * @param serviceName - Service booked
 * @param value - Value of the booking
 * @param bookingId - Unique booking identifier
 *
 * Note: Currently, Purchase events are not automatically tracked because bookings
 * happen through the Mindbody widget. To implement Purchase tracking:
 * 1. Add a booking confirmation/success page and track Purchase on page load
 * 2. Integrate with Mindbody widget callbacks if available
 * 3. Add tracking to booking API success responses
 */
export function trackMetaPixelPurchase(
  serviceName: string,
  value: number,
  bookingId?: string
): void {
  trackMetaPixelEvent(
    'Purchase',
    {
      content_name: serviceName,
      content_type: 'service',
      content_category: 'wellness',
      value,
      currency: 'USD',
      content_ids: bookingId ? [bookingId] : undefined,
    },
    true
  );
}

/**
 * Track when user submits a lead form (contact form, newsletter signup, etc.)
 * @param formName - Name/type of form
 * @param value - Optional value of the lead
 * @param source - Optional source of the lead (e.g., 'contact_page', 'newsletter')
 */
export function trackMetaPixelLead(formName: string, value?: number, source?: string): void {
  trackMetaPixelEvent(
    'Lead',
    {
      content_name: formName,
      content_type: 'form',
      content_category: 'lead_generation',
      ...(value && { value, currency: 'USD' }),
      ...(source && { source }),
    },
    true
  );
}

/**
 * Track when user schedules an appointment
 * @param serviceName - Service being scheduled
 * @param value - Value of the appointment
 *
 * Note: Currently, Schedule events are not automatically tracked because bookings
 * happen through the Mindbody widget. To implement Schedule tracking:
 * 1. Add a booking confirmation/success page and track Schedule on page load
 * 2. Integrate with Mindbody widget callbacks if available
 * 3. Add tracking to booking API success responses
 */
export function trackMetaPixelSchedule(serviceName: string, value?: number): void {
  trackMetaPixelEvent('Schedule', {
    content_name: serviceName,
    value,
    currency: 'USD',
  });
}

/**
 * Track when user contacts the business
 * @param contactMethod - Method of contact (email, phone, form, etc.)
 */
export function trackMetaPixelContact(contactMethod: string): void {
  trackMetaPixelEvent('Contact', {
    content_name: contactMethod,
  });
}

/**
 * Track when user completes registration (account creation, membership signup)
 * @param registrationType - Type of registration
 * @param value - Value of registration
 * @param status - Optional registration status (e.g., 'success', 'pending')
 */
export function trackMetaPixelCompleteRegistration(
  registrationType: string,
  value?: number,
  status?: string
): void {
  trackMetaPixelEvent(
    'CompleteRegistration',
    {
      content_name: registrationType,
      content_type: 'registration',
      content_category: 'membership',
      ...(value && { value, currency: 'USD' }),
      ...(status && { status }),
    },
    true
  );
}

/**
 * Track when user searches for services
 * @param searchTerm - Search query
 */
export function trackMetaPixelSearch(searchTerm: string): void {
  trackMetaPixelEvent('Search', {
    search_string: searchTerm,
  });
}

/**
 * Track when user subscribes to newsletter or service
 * @param subscriptionType - Type of subscription
 */
export function trackMetaPixelSubscribe(subscriptionType: string): void {
  trackMetaPixelEvent('Subscribe', {
    content_name: subscriptionType,
  });
}

/**
 * Track when user finds a business location
 * @param locationName - Name or identifier of the location
 */
export function trackMetaPixelFindLocation(locationName?: string): void {
  trackMetaPixelEvent('FindLocation', {
    content_name: locationName || 'Vital Ice',
  });
}
