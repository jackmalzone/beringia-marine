/**
 * Meta Pixel (Facebook Pixel) utility functions
 * Provides type-safe event tracking for Facebook Pixel
 */
import { auditEvent } from '@/lib/analytics/audit';

// Track sent events to prevent duplicates within a short time window
const sentEvents = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1000; // Prevent duplicate events within 1 second
const FBQ_FLUSH_POLL_MS = 50;
const FBQ_FLUSH_TIMEOUT_MS = 2500;

type FbqCommand = 'track' | 'trackCustom';

interface FbqQueuedCall {
  command: FbqCommand;
  eventName: string;
  parameters?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

const fbqQueue: FbqQueuedCall[] = [];
let fbqFlushIntervalId: number | null = null;
let fbqFlushStartedAt = 0;

function isFbqReady(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

function sendFbqCall(call: FbqQueuedCall): void {
  if (!isFbqReady()) {
    throw new Error('fbq is not available');
  }

  const args: unknown[] = [call.command, call.eventName];
  if (call.parameters) {
    args.push(call.parameters);
  }
  if (call.options) {
    if (!call.parameters) {
      args.push({});
    }
    args.push(call.options);
  }

  (window as Window & { fbq?: (..._args: unknown[]) => void }).fbq?.(...args);
}

function flushFbqQueue(): boolean {
  if (!isFbqReady()) return false;

  while (fbqQueue.length > 0) {
    const call = fbqQueue.shift();
    if (!call) continue;
    sendFbqCall(call);
    auditEvent({
      provider: 'meta',
      name: call.eventName,
      params: call.parameters,
      status: 'sent',
      note: 'flushed from queue',
    });
  }

  return true;
}

function stopFlushLoop(): void {
  if (fbqFlushIntervalId !== null && typeof window !== 'undefined') {
    window.clearInterval(fbqFlushIntervalId);
  }
  fbqFlushIntervalId = null;
  fbqFlushStartedAt = 0;
}

function startFlushLoop(): void {
  if (typeof window === 'undefined' || fbqFlushIntervalId !== null) return;

  fbqFlushStartedAt = Date.now();
  fbqFlushIntervalId = window.setInterval(() => {
    if (flushFbqQueue()) {
      stopFlushLoop();
      return;
    }

    if (Date.now() - fbqFlushStartedAt >= FBQ_FLUSH_TIMEOUT_MS) {
      while (fbqQueue.length > 0) {
        const pending = fbqQueue.shift();
        if (!pending) continue;
        auditEvent({
          provider: 'meta',
          name: pending.eventName,
          params: pending.parameters,
          status: 'skipped',
          note: 'fbq never became available',
        });
      }
      stopFlushLoop();
    }
  }, FBQ_FLUSH_POLL_MS);
}

function enqueueFbq(call: FbqQueuedCall): void {
  if (typeof window === 'undefined') return;

  if (isFbqReady()) {
    sendFbqCall(call);
    auditEvent({
      provider: 'meta',
      name: call.eventName,
      params: call.parameters,
      status: 'sent',
    });
    return;
  }

  fbqQueue.push(call);
  auditEvent({
    provider: 'meta',
    name: call.eventName,
    params: call.parameters,
    status: 'queued',
  });
  startFlushLoop();
}

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
  dedupe: boolean = true,
  eventId?: string
): void {
  if (typeof window === 'undefined') return;

  // Create deduplication key
  const eventKey = dedupe
    ? `${eventName}_${JSON.stringify(parameters || {})}_${eventId || ''}`
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
    enqueueFbq({
      command: 'track',
      eventName,
      parameters,
      options: eventId ? { eventID: eventId } : undefined,
    });

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
  parameters?: Record<string, unknown>,
  eventId?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    enqueueFbq({
      command: 'trackCustom',
      eventName,
      parameters,
      options: eventId ? { eventID: eventId } : undefined,
    });
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
 * Initialize the Meta Pixel runtime
 * Important: this initializes fbq but does not fire PageView.
 */
export function initializeMetaPixel(pixelId: string): void {
  if (typeof window === 'undefined' || !pixelId) return;
  if ((window as Window & { fbq?: unknown }).fbq) {
    flushFbqQueue();
    return;
  }

  (function (f: Window, b: Document, e: string, v: string, n?: any, t?: HTMLElement, s?: HTMLElement) {
    if ((f as Window & { fbq?: unknown }).fbq) return;
    n = (f as Window & { fbq?: any }).fbq = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod.apply(n, args);
      } else {
        n.queue.push(args);
      }
    };
    if (!(f as Window & { _fbq?: unknown })._fbq) {
      (f as Window & { _fbq?: unknown })._fbq = n;
    }
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e) as HTMLElement;
    (t as HTMLScriptElement).async = true;
    (t as HTMLScriptElement).src = v;
    s = b.getElementsByTagName(e)[0] as HTMLElement;
    s?.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  try {
    (window as Window & { fbq?: (..._args: unknown[]) => void }).fbq?.('init', pixelId);
    flushFbqQueue();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Meta Pixel init error:', error);
    }
  }
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
 * Fire Purchase from a dedicated thank-you or confirmation route when you have
 * transaction metadata (value, content_ids) available.
 */
export function trackMetaPixelPurchase(
  serviceName: string,
  value: number,
  bookingId?: string,
  eventId?: string
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
    true,
    eventId
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
 * Fire Schedule from your own scheduling confirmation flow when applicable.
 */
export function trackMetaPixelSchedule(serviceName: string, value?: number, eventId?: string): void {
  trackMetaPixelEvent(
    'Schedule',
    {
      content_name: serviceName,
      value,
      currency: 'USD',
    },
    true,
    eventId
  );
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
    content_name: locationName || 'Premium Service Business',
  });
}
