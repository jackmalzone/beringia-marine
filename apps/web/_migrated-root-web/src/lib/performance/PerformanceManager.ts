/**
 * Unified Performance Management System
 * Orchestrates all performance optimizations and monitoring
 */

import { reportPerformanceIssue } from '../utils/errorReporting';

interface PerformanceConfig {
  enableCriticalCSS: boolean;
  enableBundleOptimization: boolean;
  enablePerformanceMonitoring: boolean;
  thresholds: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    bundleSize: number; // JS bundle size in KB
    cssLoadTime: number; // CSS load time in ms
  };
}

class PerformanceManager {
  private config: PerformanceConfig;
  private observers: PerformanceObserver[] = [];
  private initialized = false;

  constructor(config: Partial<PerformanceConfig> = {}) {
    // Adjust thresholds for development vs production
    const isDevelopment = process.env.NODE_ENV === 'development';

    this.config = {
      enableCriticalCSS: true,
      enableBundleOptimization: true,
      // Disable performance monitoring in development to reduce noise
      enablePerformanceMonitoring: !isDevelopment,
      thresholds: {
        fcp: isDevelopment ? 10000 : 1500, // Very lenient in dev
        lcp: isDevelopment ? 15000 : 2500, // Very lenient in dev
        bundleSize: 500,
        cssLoadTime: 1000,
      },
      ...config,
    };
  }

  /**
   * Initialize all performance optimizations
   */
  public initialize(): void {
    if (this.initialized || typeof window === 'undefined') return;

    this.initialized = true;

    if (this.config.enableCriticalCSS) {
      this.initializeCriticalCSS();
    }

    if (this.config.enableBundleOptimization) {
      this.initializeBundleOptimization();
    }

    if (this.config.enablePerformanceMonitoring) {
      // Add a small delay to ensure page is properly loaded before monitoring
      setTimeout(() => {
        this.initializePerformanceMonitoring();
      }, 1000);
    }
  }

  /**
   * Initialize Critical CSS system
   */
  private initializeCriticalCSS(): void {
    // Load non-critical CSS after page load
    this.loadNonCriticalCSS();
  }

  /**
   * Initialize Bundle Optimization
   */
  private initializeBundleOptimization(): void {
    // Monitor bundle size and memory usage
    this.monitorBundlePerformance();
  }

  /**
   * Initialize Performance Monitoring
   */
  private initializePerformanceMonitoring(): void {
    this.monitorCoreWebVitals();
    this.monitorResourceLoading();
  }

  /**
   * Load non-critical CSS asynchronously
   */
  private loadNonCriticalCSS(): void {
    if (document.readyState === 'complete') {
      this.loadDeferredStyles();
    } else {
      window.addEventListener('load', () => this.loadDeferredStyles());
    }
  }

  private loadDeferredStyles(): void {
    // Find all stylesheets marked for deferred loading
    const deferredLinks = document.querySelectorAll('link[data-defer="true"]');

    deferredLinks.forEach(link => {
      const linkElement = link as HTMLLinkElement;
      linkElement.media = 'all';
      linkElement.removeAttribute('data-defer');
    });
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // First Contentful Paint
    const paintObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          const fcp = entry.startTime;

          // Validate FCP value - ignore unrealistic values
          if (fcp > 0 && fcp < 60000 && fcp > this.config.thresholds.fcp) {
            // Max 60 seconds
            reportPerformanceIssue('first_contentful_paint_slow', fcp, this.config.thresholds.fcp, {
              component: 'PerformanceManager',
              action: 'monitorFCP',
              metadata: { fcp },
            });
          }
        }
      });
    });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      // Validate LCP value - ignore unrealistic values
      if (lastEntry && lastEntry.startTime > 0 && lastEntry.startTime < 60000) {
        if (lastEntry.startTime > this.config.thresholds.lcp) {
          reportPerformanceIssue(
            'largest_contentful_paint_slow',
            lastEntry.startTime,
            this.config.thresholds.lcp,
            {
              component: 'PerformanceManager',
              action: 'monitorLCP',
              metadata: { lcp: lastEntry.startTime },
            }
          );
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      this.observers.push(paintObserver, lcpObserver);
    } catch {
      // Browser doesn't support these APIs
    }
  }

  /**
   * Monitor resource loading performance
   */
  private monitorResourceLoading(): void {
    const resourceObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        const resourceEntry = entry as PerformanceResourceTiming;
        const loadTime = resourceEntry.responseEnd - resourceEntry.fetchStart;

        // Monitor CSS loading
        if (entry.name.includes('.css') && loadTime > this.config.thresholds.cssLoadTime) {
          reportPerformanceIssue('css_load_slow', loadTime, this.config.thresholds.cssLoadTime, {
            component: 'PerformanceManager',
            action: 'monitorCSS',
            metadata: {
              cssFile: entry.name,
              loadTime,
            },
          });
        }

        // Monitor JS loading
        if (entry.name.includes('.js') && !entry.name.includes('node_modules')) {
          const transferSize = resourceEntry.transferSize || 0;
          if (transferSize > this.config.thresholds.bundleSize * 1024) {
            reportPerformanceIssue(
              'bundle_size_large',
              transferSize,
              this.config.thresholds.bundleSize * 1024,
              {
                component: 'PerformanceManager',
                action: 'monitorBundle',
                metadata: {
                  jsFile: entry.name,
                  transferSize,
                },
              }
            );
          }
        }
      });
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch {
      // Browser doesn't support resource timing
    }
  }

  /**
   * Monitor bundle performance
   */
  private monitorBundlePerformance(): void {
    window.addEventListener('load', () => {
      // Monitor navigation timing
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const totalLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;

        if (totalLoadTime > 5000) {
          reportPerformanceIssue('page_load_slow', totalLoadTime, 5000, {
            component: 'PerformanceManager',
            action: 'monitorPageLoad',
            metadata: {
              domContentLoadedTime,
              totalLoadTime,
            },
          });
        }
      }

      // Memory monitoring temporarily disabled due to unit confusion issues
      // TODO: Re-implement memory monitoring with proper error handling
      /*
      if ('memory' in performance && process.env.NODE_ENV === 'production') {
        const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
        const memoryThresholdMB = 100;
        const memoryUsageMB = memory.usedJSHeapSize / (1024 * 1024);
        
        if (memoryUsageMB > memoryThresholdMB) {
          reportPerformanceIssue('memory_usage_high', memoryUsageMB, memoryThresholdMB, {
            component: 'PerformanceManager',
            action: 'monitorMemory',
            metadata: { usedJSHeapSizeMB: memoryUsageMB },
          });
        }
      }
      */
    });
  }

  /**
   * Preload a component for better UX
   */
  public preloadComponent(importFn: () => Promise<unknown>): void {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (
          window as unknown as { requestIdleCallback: (_callback: () => void) => void }
        ).requestIdleCallback(() => {
          importFn().catch(() => {
            // Silently fail preloading
          });
        });
      } else {
        setTimeout(() => {
          importFn().catch(() => {
            // Silently fail preloading
          });
        }, 100);
      }
    }
  }

  /**
   * Load CSS asynchronously
   */
  public loadCSSAsync(href: string, media: string = 'all'): void {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // Load as print first to avoid render blocking
    link.onload = () => {
      link.media = media; // Switch to target media after load
    };

    // Fallback for browsers that don't support onload
    setTimeout(() => {
      link.media = media;
    }, 3000);

    document.head.appendChild(link);
  }

  /**
   * Clean up observers when needed
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.initialized = false;
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): Record<string, number> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.fetchStart || 0,
      loadComplete: navigation?.loadEventEnd - navigation?.fetchStart || 0,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      firstContentfulPaint:
        performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    };
  }
}

// Export singleton instance
export const performanceManager = new PerformanceManager();

export default PerformanceManager;
