'use client';

import { useEffect } from 'react';
import { initializeAnalytics } from '@/lib/utils/analytics';

/**
 * DeferredAnalytics - Loads analytics scripts after page load to improve performance
 * This component defers Google Tag Manager and other analytics until the page is interactive
 */
export default function DeferredAnalytics() {
  useEffect(() => {
    // Wait for page to be interactive before loading analytics
    const loadAnalytics = () => {
      // Initialize Mixpanel analytics (deferred)
      initializeAnalytics();

      // Load Google Tag Manager
      if (!window.dataLayer) {
        window.dataLayer = [];
      }

      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MFQGZL94');`;
      document.head.appendChild(gtmScript);

      // Load Meta Pixel (Facebook Pixel)
      if (!window.fbq) {
        (function (f: Window, b: Document, e: string, v: string, n: any, t: any, s: any) {
          if ((f as any).fbq) return;
          n = (f as any).fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!(f as any)._fbq) (f as any)._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode?.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js', {}, {}, {});

        (window as any).fbq('init', '1374688407654467');
        (window as any).fbq('track', 'PageView');
      }
    };

    // Load analytics after page load or after 3 seconds, whichever comes first
    if (document.readyState === 'complete') {
      // Page already loaded
      setTimeout(loadAnalytics, 1000);
    } else {
      // Wait for page load
      window.addEventListener('load', () => {
        setTimeout(loadAnalytics, 1000);
      });
    }

    // Fallback: Load after 3 seconds even if page isn't fully loaded
    const fallbackTimer = setTimeout(() => {
      if (!document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
        loadAnalytics();
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  return null;
}
