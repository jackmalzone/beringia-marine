/**
 * SEO Event Tracking Utilities
 *
 * Comprehensive tracking system for SEO-related user interactions
 * including phone clicks, directions, form submissions, and organic traffic attribution.
 */

// Import gtm types for Window interface extensions
import '../utils/gtm';

// Event tracking interface
export interface SEOEvent {
  event: string;
  category: 'SEO' | 'Local' | 'Contact' | 'Navigation';
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
}

// Traffic source attribution interface
export interface TrafficSource {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  fbclid?: string;
  organic_keyword?: string;
  referrer?: string;
}

/**
 * Core SEO Event Tracking Class
 */
export class SEOTracker {
  private static instance: SEOTracker;
  private trafficSource: TrafficSource | null = null;

  private constructor() {
    this.initializeTracker();
  }

  public static getInstance(): SEOTracker {
    if (!SEOTracker.instance) {
      SEOTracker.instance = new SEOTracker();
    }
    return SEOTracker.instance;
  }

  /**
   * Initialize the SEO tracker
   */
  private initializeTracker(): void {
    if (typeof window === 'undefined') return;

    // Capture traffic source on page load
    this.captureTrafficSource();

    // Set up automatic event listeners
    this.setupEventListeners();
  }

  /**
   * Capture and analyze traffic source attribution
   */
  private captureTrafficSource(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;

    this.trafficSource = {
      source: this.getTrafficSource(urlParams, referrer),
      medium: this.getTrafficMedium(urlParams, referrer),
      campaign: urlParams.get('utm_campaign') || undefined,
      term: urlParams.get('utm_term') || undefined,
      content: urlParams.get('utm_content') || undefined,
      gclid: urlParams.get('gclid') || undefined,
      fbclid: urlParams.get('fbclid') || undefined,
      organic_keyword: this.extractOrganicKeyword(referrer),
      referrer: referrer || undefined,
    };

    // Store in session storage for attribution across pages
    try {
      sessionStorage.setItem('seo_traffic_source', JSON.stringify(this.trafficSource));
    } catch {
      // Failed to store traffic source - silently continue
    }
  }

  /**
   * Determine traffic source
   */
  private getTrafficSource(urlParams: URLSearchParams, referrer: string): string {
    // UTM source takes priority
    if (urlParams.get('utm_source')) {
      return urlParams.get('utm_source')!;
    }

    // Google Ads
    if (urlParams.get('gclid')) {
      return 'google';
    }

    // Facebook Ads
    if (urlParams.get('fbclid')) {
      return 'facebook';
    }

    // Organic search engines
    if (referrer) {
      if (referrer.includes('google.')) return 'google';
      if (referrer.includes('bing.')) return 'bing';
      if (referrer.includes('yahoo.')) return 'yahoo';
      if (referrer.includes('duckduckgo.')) return 'duckduckgo';
      if (referrer.includes('yandex.')) return 'yandex';

      // Social media
      if (referrer.includes('facebook.')) return 'facebook';
      if (referrer.includes('instagram.')) return 'instagram';
      if (referrer.includes('linkedin.')) return 'linkedin';
      if (referrer.includes('twitter.') || referrer.includes('t.co')) return 'twitter';

      // Other referrers
      return new URL(referrer).hostname;
    }

    return 'direct';
  }

  /**
   * Determine traffic medium
   */
  private getTrafficMedium(urlParams: URLSearchParams, referrer: string): string {
    // UTM medium takes priority
    if (urlParams.get('utm_medium')) {
      return urlParams.get('utm_medium')!;
    }

    // Paid search
    if (urlParams.get('gclid') || urlParams.get('fbclid')) {
      return 'cpc';
    }

    // Organic search
    if (referrer && this.isSearchEngine(referrer)) {
      return 'organic';
    }

    // Social media
    if (referrer && this.isSocialMedia(referrer)) {
      return 'social';
    }

    // Email
    if (referrer && this.isEmail(referrer)) {
      return 'email';
    }

    // Referral
    if (referrer) {
      return 'referral';
    }

    return 'none';
  }

  /**
   * Extract organic search keywords (limited due to privacy)
   */
  private extractOrganicKeyword(referrer: string): string | undefined {
    if (!referrer) return undefined;

    try {
      const url = new URL(referrer);

      // Google (very limited due to SSL)
      if (url.hostname.includes('google.')) {
        const q = url.searchParams.get('q');
        return q || 'not provided';
      }

      // Bing
      if (url.hostname.includes('bing.')) {
        return url.searchParams.get('q') || undefined;
      }

      // Yahoo
      if (url.hostname.includes('yahoo.')) {
        return url.searchParams.get('p') || undefined;
      }

      // DuckDuckGo
      if (url.hostname.includes('duckduckgo.')) {
        return url.searchParams.get('q') || undefined;
      }
    } catch {
      // Failed to extract organic keyword - silently continue
    }

    return undefined;
  }

  /**
   * Check if referrer is a search engine
   */
  private isSearchEngine(referrer: string): boolean {
    const searchEngines = ['google.', 'bing.', 'yahoo.', 'duckduckgo.', 'yandex.', 'baidu.'];
    return searchEngines.some(engine => referrer.includes(engine));
  }

  /**
   * Check if referrer is social media
   */
  private isSocialMedia(referrer: string): boolean {
    const socialPlatforms = [
      'facebook.',
      'instagram.',
      'linkedin.',
      'twitter.',
      't.co',
      'youtube.',
      'tiktok.',
    ];
    return socialPlatforms.some(platform => referrer.includes(platform));
  }

  /**
   * Check if referrer is email
   */
  private isEmail(referrer: string): boolean {
    const emailPlatforms = ['mail.', 'gmail.', 'outlook.', 'yahoo.', 'mailchimp.'];
    return emailPlatforms.some(platform => referrer.includes(platform));
  }

  /**
   * Set up automatic event listeners for common SEO interactions
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Phone number clicks
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href^="tel:"]') as HTMLAnchorElement;

      if (link) {
        this.trackPhoneClick(link.href.replace('tel:', ''));
      }
    });

    // Email clicks
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href^="mailto:"]') as HTMLAnchorElement;

      if (link) {
        this.trackEmailClick(link.href.replace('mailto:', ''));
      }
    });

    // Direction clicks
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;

      if (
        link &&
        (link.href.includes('maps.google.') ||
          link.href.includes('directions') ||
          link.textContent?.toLowerCase().includes('directions'))
      ) {
        this.trackDirectionsClick(link.href);
      }
    });

    // External link clicks
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;

      if (link && link.hostname !== window.location.hostname) {
        this.trackExternalLinkClick(link.href, link.textContent || '');
      }
    });
  }

  /**
   * Track phone number clicks
   */
  public trackPhoneClick(phoneNumber: string): void {
    this.trackEvent({
      event: 'phone_click',
      category: 'Contact',
      action: 'Phone Click',
      label: phoneNumber,
      custom_parameters: {
        phone_number: phoneNumber,
        traffic_source: this.trafficSource?.source || 'unknown',
        traffic_medium: this.trafficSource?.medium || 'unknown',
      },
    });
  }

  /**
   * Track email clicks
   */
  public trackEmailClick(email: string): void {
    this.trackEvent({
      event: 'email_click',
      category: 'Contact',
      action: 'Email Click',
      label: email,
      custom_parameters: {
        email_address: email,
        traffic_source: this.trafficSource?.source || 'unknown',
        traffic_medium: this.trafficSource?.medium || 'unknown',
      },
    });
  }

  /**
   * Track directions clicks
   */
  public trackDirectionsClick(url: string): void {
    this.trackEvent({
      event: 'directions_click',
      category: 'Local',
      action: 'Directions Click',
      label: url,
      custom_parameters: {
        directions_url: url,
        traffic_source: this.trafficSource?.source || 'unknown',
        traffic_medium: this.trafficSource?.medium || 'unknown',
      },
    });
  }

  /**
   * Track external link clicks
   */
  public trackExternalLinkClick(url: string, linkText: string): void {
    this.trackEvent({
      event: 'external_link_click',
      category: 'Navigation',
      action: 'External Link Click',
      label: url,
      custom_parameters: {
        link_url: url,
        link_text: linkText,
        traffic_source: this.trafficSource?.source || 'unknown',
      },
    });
  }

  /**
   * Track form submissions (for non-Mindbody forms)
   */
  public trackFormSubmission(formName: string, formData?: Record<string, string>): void {
    this.trackEvent({
      event: 'form_submission',
      category: 'Contact',
      action: 'Form Submission',
      label: formName,
      custom_parameters: {
        form_name: formName,
        traffic_source: this.trafficSource?.source || 'unknown',
        traffic_medium: this.trafficSource?.medium || 'unknown',
        ...formData,
      },
    });
  }

  /**
   * Track local search interactions
   */
  public trackLocalSearchInteraction(interactionType: string, details?: string): void {
    this.trackEvent({
      event: 'local_search_interaction',
      category: 'Local',
      action: interactionType,
      label: details,
      custom_parameters: {
        interaction_type: interactionType,
        traffic_source: this.trafficSource?.source || 'unknown',
        traffic_medium: this.trafficSource?.medium || 'unknown',
      },
    });
  }

  /**
   * Track organic search landing
   */
  public trackOrganicLanding(keyword?: string): void {
    if (this.trafficSource?.medium === 'organic') {
      this.trackEvent({
        event: 'organic_landing',
        category: 'SEO',
        action: 'Organic Landing',
        label: keyword || this.trafficSource.organic_keyword || 'unknown',
        custom_parameters: {
          search_engine: this.trafficSource.source,
          keyword: keyword || this.trafficSource.organic_keyword || 'not provided',
          landing_page: window.location.pathname,
        },
      });
    }
  }

  /**
   * Track page engagement for SEO
   */
  public trackPageEngagement(engagementType: string, value?: number): void {
    this.trackEvent({
      event: 'page_engagement',
      category: 'SEO',
      action: engagementType,
      value: value,
      custom_parameters: {
        engagement_type: engagementType,
        page_path: window.location.pathname,
        traffic_source: this.trafficSource?.source || 'unknown',
        traffic_medium: this.trafficSource?.medium || 'unknown',
      },
    });
  }

  /**
   * Core event tracking method
   */
  private trackEvent(eventData: SEOEvent): void {
    if (typeof window === 'undefined') return;

    // Google Analytics 4 (gtag)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventData.event, {
        event_category: eventData.category,
        event_label: eventData.label,
        value: eventData.value,
        ...eventData.custom_parameters,
      });
    }

    // Google Tag Manager (dataLayer)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventData.event,
        eventCategory: eventData.category,
        eventAction: eventData.action,
        eventLabel: eventData.label,
        eventValue: eventData.value,
        ...eventData.custom_parameters,
      });
    }

    // Console logging for development (removed console.log for production build)
  }

  /**
   * Get current traffic source
   */
  public getCurrentTrafficSource(): TrafficSource | null {
    return this.trafficSource;
  }

  /**
   * Get traffic source from session storage (for attribution across pages)
   */
  public getStoredTrafficSource(): TrafficSource | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = sessionStorage.getItem('seo_traffic_source');
      return stored ? JSON.parse(stored) : null;
    } catch {
      // Failed to retrieve stored traffic source - silently continue
      return null;
    }
  }
}

// Convenience functions for easy usage
export const seoTracker = SEOTracker.getInstance();

export const trackPhoneClick = (phoneNumber: string) => seoTracker.trackPhoneClick(phoneNumber);
export const trackEmailClick = (email: string) => seoTracker.trackEmailClick(email);
export const trackDirectionsClick = (url: string) => seoTracker.trackDirectionsClick(url);
export const trackFormSubmission = (formName: string, formData?: Record<string, string>) =>
  seoTracker.trackFormSubmission(formName, formData);
export const trackLocalSearchInteraction = (interactionType: string, details?: string) =>
  seoTracker.trackLocalSearchInteraction(interactionType, details);
export const trackOrganicLanding = (keyword?: string) => seoTracker.trackOrganicLanding(keyword);
export const trackPageEngagement = (engagementType: string, value?: number) =>
  seoTracker.trackPageEngagement(engagementType, value);

// Global Window interface extensions are declared in src/lib/utils/gtm.ts

export default SEOTracker;
