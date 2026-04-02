/**
 * SEO Performance Monitoring System
 *
 * Monitors Core Web Vitals, keyword rankings, organic traffic,
 * and SEO health metrics for comprehensive performance tracking.
 */

import { seoTracker } from './seo-tracking';
// Import gtm types for Window interface extensions
import '../utils/gtm';

// Performance monitoring interfaces
export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface SEOMetrics {
  organicTraffic: number;
  keywordRankings: Record<string, number>;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerSession: number;
}

export interface SEOHealthCheck {
  timestamp: number;
  coreWebVitals: CoreWebVitals;
  seoMetrics: SEOMetrics;
  technicalIssues: string[];
  recommendations: string[];
}

/**
 * SEO Performance Monitor Class
 */
export class SEOPerformanceMonitor {
  private static instance: SEOPerformanceMonitor;
  private performanceObserver: PerformanceObserver | null = null;
  private vitalsData: Partial<CoreWebVitals> = {};
  private healthCheckIntervalId: NodeJS.Timeout | null = null;
  private loadHandler: (() => void) | null = null;
  private alertThresholds = {
    lcp: 2500, // 2.5 seconds
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    fcp: 1800, // 1.8 seconds
    ttfb: 600, // 600ms
  };

  private constructor() {
    this.initializeMonitoring();
  }

  public static getInstance(): SEOPerformanceMonitor {
    if (!SEOPerformanceMonitor.instance) {
      SEOPerformanceMonitor.instance = new SEOPerformanceMonitor();
    }
    return SEOPerformanceMonitor.instance;
  }

  /**
   * Initialize performance monitoring
   */
  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor page performance
    this.monitorPagePerformance();

    // Set up periodic health checks
    this.setupPeriodicHealthChecks();
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', entry => {
      const lcp = entry.startTime;
      this.vitalsData.lcp = lcp;
      this.checkThreshold('lcp', lcp);
      this.reportVital('LCP', lcp);
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', entry => {
      const performanceEntry = entry as PerformanceEntry & { processingStart: number };
      const fid = performanceEntry.processingStart - entry.startTime;
      this.vitalsData.fid = fid;
      this.checkThreshold('fid', fid);
      this.reportVital('FID', fid);
    });

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', entry => {
      const layoutEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
      if (!layoutEntry.hadRecentInput) {
        const cls = (this.vitalsData.cls || 0) + layoutEntry.value;
        this.vitalsData.cls = cls;
        this.checkThreshold('cls', cls);
        this.reportVital('CLS', cls);
      }
    });

    // First Contentful Paint (FCP)
    this.observeMetric('paint', entry => {
      if (entry.name === 'first-contentful-paint') {
        const fcp = entry.startTime;
        this.vitalsData.fcp = fcp;
        this.reportVital('FCP', fcp);
      }
    });

    // Navigation timing for TTFB
    this.monitorNavigationTiming();
  }

  /**
   * Observe specific performance metrics
   */
  private observeMetric(type: string, callback: (_entry: PerformanceEntry) => void): void {
    try {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(callback);
      });
      observer.observe({ type, buffered: true });
    } catch {
      // Failed to observe metric - silently continue
    }
  }

  /**
   * Monitor navigation timing for TTFB
   */
  private monitorNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        this.vitalsData.ttfb = ttfb;
        this.reportVital('TTFB', ttfb);
      }
    });
  }

  /**
   * Monitor general page performance
   */
  private monitorPagePerformance(): void {
    if (typeof window === 'undefined') return;

    // Monitor resource loading
    this.observeMetric('resource', entry => {
      const resourceEntry = entry as PerformanceEntry & { duration: number };
      if (resourceEntry.duration > 1000) {
        // Resources taking > 1s
        this.reportSlowResource(entry.name, resourceEntry.duration);
      }
    });

    // Monitor long tasks
    this.observeMetric('longtask', entry => {
      const longTaskEntry = entry as PerformanceEntry & { duration: number };
      this.reportLongTask(longTaskEntry.duration);
    });
  }

  /**
   * Check if metric exceeds threshold and alert
   */
  private checkThreshold(metric: keyof typeof this.alertThresholds, value: number): void {
    const threshold = this.alertThresholds[metric];
    if (value > threshold) {
      this.alertPerformanceIssue(metric, value);
    }
  }

  /**
   * Report Core Web Vital to analytics
   */
  private reportVital(name: string, value: number): void {
    // Report to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        non_interaction: true,
      });
    }

    // Report to our SEO tracking system
    seoTracker.trackPageEngagement(`core_web_vital_${name.toLowerCase()}`, Math.round(value));

    // Log for development (removed console.log for production build)
  }

  /**
   * Report slow resource loading
   */
  private reportSlowResource(resourceName: string, duration: number): void {
    seoTracker.trackPageEngagement('slow_resource_load', Math.round(duration));

    // Log for development (removed console.warn for production build)
  }

  /**
   * Report long tasks that block main thread
   */
  private reportLongTask(duration: number): void {
    seoTracker.trackPageEngagement('long_task_detected', Math.round(duration));

    // Log for development (removed console.warn for production build)
  }

  /**
   * Alert when performance thresholds are exceeded
   */
  private alertPerformanceIssue(metric: string, value: number): void {
    // Track performance degradation
    seoTracker.trackPageEngagement('performance_threshold_exceeded', Math.round(value));

    // Could integrate with error reporting service here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_alert', {
        event_category: 'Performance',
        event_label: metric,
        value: Math.round(value),
      });
    }
  }

  /**
   * Set up periodic SEO health checks
   */
  private setupPeriodicHealthChecks(): void {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seo-performance-monitor.ts:248',message:'setupPeriodicHealthChecks called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Run health check every 5 minutes
    this.healthCheckIntervalId = setInterval(
      () => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seo-performance-monitor.ts:252',message:'SEO health check interval fired',data:{intervalId:this.healthCheckIntervalId?.toString(),timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        this.runSEOHealthCheck();
      },
      5 * 60 * 1000
    );
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seo-performance-monitor.ts:250',message:'setInterval created and stored',data:{intervalId:this.healthCheckIntervalId?.toString(),hasCleanup:true,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Run initial health check after page load
    if (typeof window !== 'undefined') {
      this.loadHandler = () => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seo-performance-monitor.ts:259',message:'window load listener added',data:{hasCleanup:true,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        setTimeout(() => this.runSEOHealthCheck(), 3000);
      };
      window.addEventListener('load', this.loadHandler);
    }
  }

  /**
   * Cleanup method to clear intervals and remove event listeners
   */
  public cleanup(): void {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seo-performance-monitor.ts:cleanup',message:'SEOPerformanceMonitor cleanup called',data:{hasInterval:!!this.healthCheckIntervalId,hasLoadHandler:!!this.loadHandler,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (this.healthCheckIntervalId) {
      clearInterval(this.healthCheckIntervalId);
      this.healthCheckIntervalId = null;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seo-performance-monitor.ts:cleanup',message:'Health check interval cleared',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
    if (this.loadHandler && typeof window !== 'undefined') {
      window.removeEventListener('load', this.loadHandler);
      this.loadHandler = null;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seo-performance-monitor.ts:cleanup',message:'Load handler removed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }

  /**
   * Run comprehensive SEO health check
   */
  private runSEOHealthCheck(): void {
    const healthCheck: Partial<SEOHealthCheck> = {
      timestamp: Date.now(),
      coreWebVitals: this.vitalsData as CoreWebVitals,
      technicalIssues: [],
      recommendations: [],
    };

    // Check for technical SEO issues
    this.checkTechnicalSEO(healthCheck);

    // Check performance issues
    this.checkPerformanceIssues(healthCheck);

    // Report health check results
    this.reportHealthCheck(healthCheck);
  }

  /**
   * Check for technical SEO issues
   */
  private checkTechnicalSEO(healthCheck: Partial<SEOHealthCheck>): void {
    if (typeof window === 'undefined') return;

    const issues = healthCheck.technicalIssues || [];
    const recommendations = healthCheck.recommendations || [];

    // Check for missing meta tags
    if (!document.querySelector('meta[name="description"]')) {
      issues.push('Missing meta description');
      recommendations.push('Add meta description for better search snippets');
    }

    // Check for missing canonical URL
    if (!document.querySelector('link[rel="canonical"]')) {
      issues.push('Missing canonical URL');
      recommendations.push('Add canonical URL to prevent duplicate content issues');
    }

    // Check for missing structured data
    if (!document.querySelector('script[type="application/ld+json"]')) {
      issues.push('Missing structured data');
      recommendations.push('Add JSON-LD structured data for rich results');
    }

    // Check for missing Open Graph tags
    if (!document.querySelector('meta[property="og:title"]')) {
      issues.push('Missing Open Graph tags');
      recommendations.push('Add Open Graph tags for better social media sharing');
    }

    // Check page title length
    const title = document.title;
    if (title.length > 60) {
      issues.push('Page title too long');
      recommendations.push('Keep page titles under 60 characters for better search display');
    }

    healthCheck.technicalIssues = issues;
    healthCheck.recommendations = recommendations;
  }

  /**
   * Check for performance issues
   */
  private checkPerformanceIssues(healthCheck: Partial<SEOHealthCheck>): void {
    const issues = healthCheck.technicalIssues || [];
    const recommendations = healthCheck.recommendations || [];
    const vitals = this.vitalsData;

    // Check LCP
    if (vitals.lcp && vitals.lcp > this.alertThresholds.lcp) {
      issues.push(`Poor LCP: ${Math.round(vitals.lcp)}ms`);
      recommendations.push('Optimize images and reduce server response time to improve LCP');
    }

    // Check FID
    if (vitals.fid && vitals.fid > this.alertThresholds.fid) {
      issues.push(`Poor FID: ${Math.round(vitals.fid)}ms`);
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }

    // Check CLS
    if (vitals.cls && vitals.cls > this.alertThresholds.cls) {
      issues.push(`Poor CLS: ${vitals.cls.toFixed(3)}`);
      recommendations.push(
        'Add size attributes to images and avoid inserting content above existing content'
      );
    }

    healthCheck.technicalIssues = issues;
    healthCheck.recommendations = recommendations;
  }

  /**
   * Report health check results
   */
  private reportHealthCheck(healthCheck: Partial<SEOHealthCheck>): void {
    const issueCount = healthCheck.technicalIssues?.length || 0;

    // Track SEO health score
    seoTracker.trackPageEngagement('seo_health_check', issueCount);

    // Log results in development (removed console.log for production build)

    // Store results for potential dashboard use
    try {
      localStorage.setItem('seo_health_check', JSON.stringify(healthCheck));
    } catch {
      // Failed to store health check results - silently continue
    }
  }

  /**
   * Get current Core Web Vitals
   */
  public getCurrentVitals(): Partial<CoreWebVitals> {
    return { ...this.vitalsData };
  }

  /**
   * Get SEO health score (0-100)
   */
  public getSEOHealthScore(): number {
    let score = 100;
    const vitals = this.vitalsData;

    // Deduct points for poor Core Web Vitals
    if (vitals.lcp && vitals.lcp > this.alertThresholds.lcp) score -= 20;
    if (vitals.fid && vitals.fid > this.alertThresholds.fid) score -= 20;
    if (vitals.cls && vitals.cls > this.alertThresholds.cls) score -= 20;

    // Check technical SEO factors
    if (typeof window !== 'undefined') {
      if (!document.querySelector('meta[name="description"]')) score -= 10;
      if (!document.querySelector('link[rel="canonical"]')) score -= 10;
      if (!document.querySelector('script[type="application/ld+json"]')) score -= 10;
      if (!document.querySelector('meta[property="og:title"]')) score -= 5;
      if (document.title.length > 60) score -= 5;
    }

    return Math.max(0, score);
  }

  /**
   * Force a health check (for manual testing)
   */
  public forceHealthCheck(): void {
    this.runSEOHealthCheck();
  }
}

// Export singleton instance
export const seoPerformanceMonitor = SEOPerformanceMonitor.getInstance();

// Convenience functions
export const getCurrentVitals = () => seoPerformanceMonitor.getCurrentVitals();
export const getSEOHealthScore = () => seoPerformanceMonitor.getSEOHealthScore();
export const forceHealthCheck = () => seoPerformanceMonitor.forceHealthCheck();

export default SEOPerformanceMonitor;
