'use client';

import { useEffect } from 'react';
import type { AnalyticsConfig } from '@/lib/analytics/config';
import { initializeAnalytics } from '@/lib/utils/analytics';

/**
 * DeferredAnalytics - Loads analytics scripts after page load to improve performance
 * This component defers non-critical analytics providers until the page is interactive.
 */
interface DeferredAnalyticsProps {
  analyticsConfig: AnalyticsConfig;
}

function getGtmScriptSelector(gtmId: string): string {
  return `script[data-analytics-provider="gtm"][data-gtm-id="${gtmId}"]`;
}

function loadGtm(gtmId: string): void {
  if (typeof window === 'undefined' || !gtmId) return;
  if (document.querySelector(getGtmScriptSelector(gtmId))) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  gtmScript.dataset.analyticsProvider = 'gtm';
  gtmScript.dataset.gtmId = gtmId;
  document.head.appendChild(gtmScript);
}

export default function DeferredAnalytics({ analyticsConfig }: DeferredAnalyticsProps) {
  const canTrack = analyticsConfig.enabled && !analyticsConfig.consentRequired;

  useEffect(() => {
    const gtmId = analyticsConfig.gtmId;
    if (!canTrack || !gtmId) return;

    // Wait for page to be interactive before loading analytics
    const loadAnalytics = () => {
      // Initialize Mixpanel analytics (deferred)
      initializeAnalytics();

      // Load Google Tag Manager
      loadGtm(gtmId);
    };

    // Load analytics after page load or after 3 seconds, whichever comes first
    let loadTimer: number | null = null;
    const onWindowLoad = () => {
      loadTimer = window.setTimeout(loadAnalytics, 1000);
    };

    if (document.readyState === 'complete') {
      // Page already loaded
      onWindowLoad();
    } else {
      // Wait for page load
      window.addEventListener('load', onWindowLoad);
    }

    // Fallback: Load after 3 seconds even if page isn't fully loaded
    const fallbackTimer = window.setTimeout(() => {
      if (!document.querySelector(getGtmScriptSelector(gtmId))) {
        loadAnalytics();
      }
    }, 3000);

    return () => {
      window.removeEventListener('load', onWindowLoad);
      window.clearTimeout(fallbackTimer);
      if (loadTimer !== null) {
        window.clearTimeout(loadTimer);
      }
    };
  }, [analyticsConfig.gtmId, canTrack]);

  return null;
}
