/**
 * Performance monitoring utilities for Insights blog system
 * Tracks key performance metrics: FCP, LCP, TTI, hydration time
 */

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  tti?: number; // Time to Interactive
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  hydrationTime?: number;
  componentName?: string;
}

export interface InsightsPerformanceReport {
  page: 'listing' | 'article';
  metrics: PerformanceMetrics;
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: string;
}

/**
 * Measure and report Web Vitals for insights pages
 */
export function measureWebVitals(callback: (_metric: PerformanceMetrics) => void) {
  if (typeof window === 'undefined') return;

  // Measure FCP (First Contentful Paint)
  const fcpObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      callback({ fcp: fcp.startTime });
    }
  });

  try {
    fcpObserver.observe({ entryTypes: ['paint'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Browser doesn't support this observer
  }

  // Measure LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number };
    callback({ lcp: lastEntry.startTime || lastEntry.renderTime || 0 });
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Browser doesn't support this observer
  }

  // Measure FID (First Input Delay)
  const fidObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    const firstInput = entries[0] as PerformanceEntry & { processingStart?: number };
    if (firstInput && firstInput.processingStart) {
      callback({ fid: firstInput.processingStart - firstInput.startTime });
    }
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Browser doesn't support this observer
  }

  // Measure CLS (Cumulative Layout Shift)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      const layoutShift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
      if (!layoutShift.hadRecentInput) {
        clsValue += layoutShift.value || 0;
      }
    });
    callback({ cls: clsValue });
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Browser doesn't support this observer
  }
}

/**
 * Measure component hydration time
 */
export function measureHydrationTime(componentName: string): () => void {
  const startTime = performance.now();

  return () => {
    const hydrationTime = performance.now() - startTime;
    reportMetric({
      hydrationTime,
      componentName,
    });
  };
}

/**
 * Report performance metrics to analytics
 */
export function reportMetric(_metric: PerformanceMetrics) {
  if (typeof window === 'undefined') return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Performance]', _metric);
  }

  // Send to analytics in production
  if (
    process.env.NODE_ENV === 'production' &&
    (window as Window & { gtag?: (..._args: unknown[]) => void }).gtag
  ) {
    Object.entries(_metric).forEach(([key, value]) => {
      if (typeof value === 'number') {
        (window as Window & { gtag?: (..._args: unknown[]) => void }).gtag?.(
          'event',
          'web_vitals',
          {
            event_category: 'Performance',
            event_label: key,
            value: Math.round(value),
            non_interaction: true,
          }
        );
      }
    });
  }
}

/**
 * Generate performance report for insights pages
 */
export function generatePerformanceReport(
  page: 'listing' | 'article',
  metrics: PerformanceMetrics
): InsightsPerformanceReport {
  return {
    page,
    metrics,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    connection:
      typeof navigator !== 'undefined' && 'connection' in navigator
        ? (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
            ?.effectiveType
        : undefined,
  };
}

/**
 * Check if performance meets targets
 */
export function checkPerformanceTargets(metrics: PerformanceMetrics): {
  passed: boolean;
  failures: string[];
} {
  const failures: string[] = [];

  // Target: FCP < 1.8s
  if (metrics.fcp && metrics.fcp > 1800) {
    failures.push(`FCP too slow: ${metrics.fcp.toFixed(0)}ms (target: <1800ms)`);
  }

  // Target: LCP < 2.5s
  if (metrics.lcp && metrics.lcp > 2500) {
    failures.push(`LCP too slow: ${metrics.lcp.toFixed(0)}ms (target: <2500ms)`);
  }

  // Target: FID < 100ms
  if (metrics.fid && metrics.fid > 100) {
    failures.push(`FID too slow: ${metrics.fid.toFixed(0)}ms (target: <100ms)`);
  }

  // Target: CLS < 0.1
  if (metrics.cls && metrics.cls > 0.1) {
    failures.push(`CLS too high: ${metrics.cls.toFixed(3)} (target: <0.1)`);
  }

  // Target: Hydration < 500ms
  if (metrics.hydrationTime && metrics.hydrationTime > 500) {
    failures.push(`Hydration too slow: ${metrics.hydrationTime.toFixed(0)}ms (target: <500ms)`);
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Prefetch article pages for better navigation performance
 */
export function prefetchArticles(slugs: string[]) {
  if (typeof window === 'undefined') return;

  slugs.forEach(slug => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/insights/${slug}`;
    document.head.appendChild(link);
  });
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(imageUrls: string[]) {
  if (typeof window === 'undefined') return;

  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
}
