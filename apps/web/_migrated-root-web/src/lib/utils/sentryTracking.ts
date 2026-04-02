import * as Sentry from '@sentry/nextjs';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

// Store tracking resources for cleanup
let trackingState: {
  memoryIntervalId: NodeJS.Timeout | null;
  beforeunloadHandler: (() => void) | null;
  unloadHandler: (() => void) | null;
  pagehideHandler: (() => void) | null;
  loadHandler: (() => void) | null;
  initialized: boolean;
} = {
  memoryIntervalId: null,
  beforeunloadHandler: null,
  unloadHandler: null,
  pagehideHandler: null,
  loadHandler: null,
  initialized: false,
};

// Track page reloads and performance issues
export const trackPageReload = () => {
  if (typeof window === 'undefined') return;

  // Track if this is a page reload
  const navigationEntry = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;

  if (navigationEntry && navigationEntry.type === 'reload') {
    Sentry.captureMessage('Page reload detected', {
      level: 'warning',
      tags: {
        navigation_type: 'reload',
        url: window.location.href,
        user_agent: navigator.userAgent,
      },
      extra: {
        navigation_timing: {
          loadEventEnd: navigationEntry.loadEventEnd,
          domContentLoadedEventEnd: navigationEntry.domContentLoadedEventEnd,
          responseEnd: navigationEntry.responseEnd,
        },
      },
    });
  }
};

// Track video performance issues
export const trackVideoPerformance = (videoSrc: string, error?: Error) => {
  if (error) {
    Sentry.captureException(error, {
      tags: {
        component: 'VideoBackground',
        video_src: videoSrc,
        error_type: 'video_performance',
      },
      extra: {
        video_src: videoSrc,
        user_agent: navigator.userAgent,
        connection: (navigator as Navigator & { connection?: unknown }).connection,
        device_memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
        hardware_concurrency: navigator.hardwareConcurrency,
      },
    });
  }
};

// Track smooth scrolling issues
export const trackSmoothScrollIssue = (error: Error) => {
  Sentry.captureException(error, {
    tags: {
      component: 'SmoothScrollProvider',
      error_type: 'smooth_scroll',
    },
    extra: {
      user_agent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    },
  });
};

// Track Mindbody widget issues
export const trackMindbodyWidgetIssue = (widgetType: string, error: Error) => {
  Sentry.captureException(error, {
    tags: {
      component: 'MindbodyWidget',
      widget_type: widgetType,
      error_type: 'widget_load',
    },
    extra: {
      widget_type: widgetType,
      user_agent: navigator.userAgent,
      url: window.location.href,
    },
  });
};

// Track browser-specific issues
export const trackBrowserIssue = (
  browser: string,
  issue: string,
  details?: Record<string, unknown>
) => {
  Sentry.captureMessage(`Browser-specific issue: ${issue}`, {
    level: 'warning',
    tags: {
      browser,
      issue_type: issue,
    },
    extra: {
      browser,
      issue,
      details,
      user_agent: navigator.userAgent,
      url: window.location.href,
    },
  });
};

// Track memory usage issues
export const trackMemoryUsage = () => {
  if (
    typeof window === 'undefined' ||
    !(
      performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory
  )
    return;

  const memory = (
    performance as Performance & {
      memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    }
  ).memory;
  const usedMB = memory.usedJSHeapSize / 1024 / 1024;
  const totalMB = memory.totalJSHeapSize / 1024 / 1024;
  const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

  // Alert if memory usage is high
  if (usedMB > limitMB * 0.8) {
    Sentry.captureMessage('High memory usage detected', {
      level: 'warning',
      tags: {
        issue_type: 'high_memory_usage',
      },
      extra: {
        used_mb: usedMB,
        total_mb: totalMB,
        limit_mb: limitMB,
        usage_percentage: (usedMB / limitMB) * 100,
      },
    });
  }
};

// Track page visibility changes (potential reload indicators)
export const trackPageVisibility = () => {
  if (typeof document === 'undefined') return;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: 'Page hidden',
        level: 'info',
        data: {
          timestamp: new Date().toISOString(),
          memory: (performance as PerformanceWithMemory).memory
            ? {
                used: (performance as PerformanceWithMemory).memory!.usedJSHeapSize,
                total: (performance as PerformanceWithMemory).memory!.totalJSHeapSize,
                limit: (performance as PerformanceWithMemory).memory!.jsHeapSizeLimit,
              }
            : null,
        },
      });
    } else if (document.visibilityState === 'visible') {
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: 'Page visible',
        level: 'info',
        data: {
          timestamp: new Date().toISOString(),
          memory: (performance as PerformanceWithMemory).memory
            ? {
                used: (performance as PerformanceWithMemory).memory!.usedJSHeapSize,
                total: (performance as PerformanceWithMemory).memory!.totalJSHeapSize,
                limit: (performance as PerformanceWithMemory).memory!.jsHeapSizeLimit,
              }
            : null,
        },
      });
    }
  });
};

// Track potential reload triggers
export const trackReloadTriggers = () => {
  if (typeof window === 'undefined') return;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sentryTracking.ts:204',message:'trackReloadTriggers called - adding window listeners',data:{hasCleanup:true,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  // Clean up existing listeners if any
  if (trackingState.beforeunloadHandler) {
    window.removeEventListener('beforeunload', trackingState.beforeunloadHandler);
  }
  if (trackingState.unloadHandler) {
    window.removeEventListener('unload', trackingState.unloadHandler);
  }
  if (trackingState.pagehideHandler) {
    window.removeEventListener('pagehide', trackingState.pagehideHandler);
  }

  // Track beforeunload events (user-initiated reloads)
  trackingState.beforeunloadHandler = () => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Before unload event',
      level: 'info',
      data: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
      },
    });
  };
  window.addEventListener('beforeunload', trackingState.beforeunloadHandler);

  // Track unload events
  trackingState.unloadHandler = () => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Unload event',
      level: 'info',
      data: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
      },
    });
  };
  window.addEventListener('unload', trackingState.unloadHandler);

  // Track pagehide events
  trackingState.pagehideHandler = () => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Page hide event',
      level: 'info',
      data: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
      },
    });
  };
  window.addEventListener('pagehide', trackingState.pagehideHandler);
};

// Initialize all tracking
export const initializeSentryTracking = () => {
  if (typeof window === 'undefined') return;
  
  // Prevent duplicate initialization
  if (trackingState.initialized) {
    return;
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sentryTracking.ts:249',message:'initializeSentryTracking called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  // Track page reloads
  trackPageReload();

  // Track page visibility
  trackPageVisibility();

  // Track reload triggers
  trackReloadTriggers();

  // Monitor memory usage
  if (trackingState.memoryIntervalId) {
    clearInterval(trackingState.memoryIntervalId);
  }
  trackingState.memoryIntervalId = setInterval(trackMemoryUsage, 30000); // Check every 30 seconds
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sentryTracking.ts:262',message:'setInterval created and stored',data:{intervalId:trackingState.memoryIntervalId?.toString(),hasCleanup:true,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Track browser-specific issues
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    // Safari-specific tracking
    Sentry.setTag('browser', 'safari');
  } else if (userAgent.includes('Chrome')) {
    // Chrome-specific tracking
    Sentry.setTag('browser', 'chrome');
  }

  // Start profiling for page load performance
  Sentry.startSpan(
    {
      op: 'pageload',
      name: 'Page Load Performance',
    },
    span => {
      span.setAttribute('url', window.location.href);
      span.setAttribute('user_agent', userAgent);

      // Track when page is fully loaded
      if (document.readyState === 'complete') {
        span.setAttribute('load_time', performance.now());
      } else {
        if (trackingState.loadHandler) {
          window.removeEventListener('load', trackingState.loadHandler);
        }
        trackingState.loadHandler = () => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sentryTracking.ts:288',message:'window load listener added in span',data:{hasCleanup:true,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          span.setAttribute('load_time', performance.now());
        };
        window.addEventListener('load', trackingState.loadHandler);
      }
    }
  );
  
  trackingState.initialized = true;
};

// Cleanup function to remove all tracking listeners and intervals
export const cleanupSentryTracking = () => {
  if (typeof window === 'undefined') return;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sentryTracking.ts:cleanup',message:'cleanupSentryTracking called',data:{hasInterval:!!trackingState.memoryIntervalId,hasListeners:!!(trackingState.beforeunloadHandler || trackingState.unloadHandler || trackingState.pagehideHandler || trackingState.loadHandler),timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  if (trackingState.memoryIntervalId) {
    clearInterval(trackingState.memoryIntervalId);
    trackingState.memoryIntervalId = null;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sentryTracking.ts:cleanup',message:'Memory interval cleared',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  }

  if (trackingState.beforeunloadHandler) {
    window.removeEventListener('beforeunload', trackingState.beforeunloadHandler);
    trackingState.beforeunloadHandler = null;
  }
  if (trackingState.unloadHandler) {
    window.removeEventListener('unload', trackingState.unloadHandler);
    trackingState.unloadHandler = null;
  }
  if (trackingState.pagehideHandler) {
    window.removeEventListener('pagehide', trackingState.pagehideHandler);
    trackingState.pagehideHandler = null;
  }
  if (trackingState.loadHandler) {
    window.removeEventListener('load', trackingState.loadHandler);
    trackingState.loadHandler = null;
  }

  trackingState.initialized = false;
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sentryTracking.ts:cleanup',message:'All Sentry tracking listeners removed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
};
