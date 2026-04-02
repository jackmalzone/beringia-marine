/**
 * Performance monitoring utilities for MapboxMap component
 * Helps track and optimize map loading performance and resource usage
 */

import { createLogger } from '@/lib/utils/logger';

const logger = createLogger('MapboxPerformanceMonitor');

interface MapboxPerformanceMetrics {
  startTime: number;
  initializationTime: number;
  loadTime: number;
  memoryUsage?: number;
  renderTime?: number;
  errorCount: number;
  retryCount: number;
}

interface MapboxPerformanceConfig {
  enableLogging: boolean;
  enableMemoryTracking: boolean;
  maxLoadTime: number;
  maxInitTime: number;
}

class MapboxPerformanceMonitor {
  private metrics: Map<string, MapboxPerformanceMetrics> = new Map();
  private config: MapboxPerformanceConfig;
  private performanceObserver?: PerformanceObserver;

  constructor(config: Partial<MapboxPerformanceConfig> = {}) {
    this.config = {
      enableLogging: process.env.NODE_ENV === 'development',
      enableMemoryTracking: typeof performance !== 'undefined' && 'memory' in performance,
      maxLoadTime: 15000, // 15 seconds
      maxInitTime: 5000, // 5 seconds
      ...config,
    };

    this.initializePerformanceObserver();
  }

  private initializePerformanceObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name.includes('mapbox') || entry.name.includes('map-load')) {
            this.logPerformanceEntry(entry);
          }
        });
      });

      this.performanceObserver.observe({
        entryTypes: ['measure', 'navigation', 'resource'],
      });
    } catch (error) {
      if (this.config.enableLogging) {
        logger.error(
          'Failed to initialize performance observer:',
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  }

  private logPerformanceEntry(entry: PerformanceEntry) {
    if (!this.config.enableLogging) return;

    logger.info('Mapbox performance entry:', {
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      entryType: entry.entryType,
    });
  }

  /**
   * Start tracking performance for a map instance
   */
  startTracking(mapId: string): void {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    this.metrics.set(mapId, {
      startTime: startTime,
      initializationTime: 0,
      loadTime: 0,
      errorCount: 0,
      retryCount: 0,
    });

    // Mark the start of map initialization
    if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
      performance.mark(`mapbox-init-start-${mapId}`);
    }

    if (this.config.enableLogging) {
      logger.info(`Started tracking performance for map: ${mapId}`);
    }
  }

  /**
   * Record map initialization completion
   */
  recordInitialization(mapId: string): void {
    const metrics = this.metrics.get(mapId);
    if (!metrics) return;

    const initTime =
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - metrics.startTime;
    metrics.initializationTime = initTime;

    // Mark the end of initialization
    if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
      performance.mark(`mapbox-init-end-${mapId}`);
      performance.measure(
        `mapbox-init-${mapId}`,
        `mapbox-init-start-${mapId}`,
        `mapbox-init-end-${mapId}`
      );
    }

    // Check if initialization took too long
    if (initTime > this.config.maxInitTime) {
      logger.warn(
        `Map initialization took ${initTime}ms (threshold: ${this.config.maxInitTime}ms)`,
        {
          mapId,
          initTime,
          threshold: this.config.maxInitTime,
        }
      );
    }

    if (this.config.enableLogging) {
      logger.info(`Map initialization completed: ${mapId}`, {
        initializationTime: initTime,
      });
    }
  }

  /**
   * Record map load completion
   */
  recordLoad(mapId: string): void {
    const metrics = this.metrics.get(mapId);
    if (!metrics) return;

    const loadTime =
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - metrics.startTime;
    metrics.loadTime = loadTime;

    // Mark the end of loading
    if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
      performance.mark(`mapbox-load-end-${mapId}`);
      performance.measure(
        `mapbox-load-${mapId}`,
        `mapbox-init-start-${mapId}`,
        `mapbox-load-end-${mapId}`
      );
    }

    // Record memory usage if available
    if (
      this.config.enableMemoryTracking &&
      typeof performance !== 'undefined' &&
      'memory' in performance
    ) {
      const memoryInfo = (performance as Performance & { memory?: { usedJSHeapSize: number } })
        .memory;
      if (memoryInfo) {
        metrics.memoryUsage = memoryInfo.usedJSHeapSize;
      }
    }

    // Check if loading took too long
    if (loadTime > this.config.maxLoadTime) {
      logger.warn(`Map loading took ${loadTime}ms (threshold: ${this.config.maxLoadTime}ms)`, {
        mapId,
        loadTime,
        threshold: this.config.maxLoadTime,
      });
    }

    if (this.config.enableLogging) {
      logger.info(`Map load completed: ${mapId}`, {
        loadTime,
        memoryUsage: metrics.memoryUsage,
      });
    }
  }

  /**
   * Record an error occurrence
   */
  recordError(mapId: string, error: Error): void {
    const metrics = this.metrics.get(mapId);
    if (!metrics) return;

    metrics.errorCount++;

    if (this.config.enableLogging) {
      logger.error(`Map error recorded: ${mapId}`, error, {
        errorCount: metrics.errorCount,
        totalErrors: metrics.errorCount,
      });
    }
  }

  /**
   * Record a retry attempt
   */
  recordRetry(mapId: string): void {
    const metrics = this.metrics.get(mapId);
    if (!metrics) return;

    metrics.retryCount++;

    if (this.config.enableLogging) {
      logger.info(`Map retry recorded: ${mapId}`, {
        retryCount: metrics.retryCount,
      });
    }
  }

  /**
   * Get performance metrics for a map instance
   */
  getMetrics(mapId: string): MapboxPerformanceMetrics | null {
    return this.metrics.get(mapId) || null;
  }

  /**
   * Get aggregated performance metrics for all maps
   */
  getAggregatedMetrics(): {
    totalMaps: number;
    averageInitTime: number;
    averageLoadTime: number;
    totalErrors: number;
    totalRetries: number;
    slowMaps: string[];
  } {
    const allMetrics = Array.from(this.metrics.values());
    const mapIds = Array.from(this.metrics.keys());

    if (allMetrics.length === 0) {
      return {
        totalMaps: 0,
        averageInitTime: 0,
        averageLoadTime: 0,
        totalErrors: 0,
        totalRetries: 0,
        slowMaps: [],
      };
    }

    const totalInitTime = allMetrics.reduce((sum, m) => sum + m.initializationTime, 0);
    const totalLoadTime = allMetrics.reduce((sum, m) => sum + m.loadTime, 0);
    const totalErrors = allMetrics.reduce((sum, m) => sum + m.errorCount, 0);
    const totalRetries = allMetrics.reduce((sum, m) => sum + m.retryCount, 0);

    const slowMaps = mapIds.filter(mapId => {
      const metrics = this.metrics.get(mapId);
      return (
        metrics &&
        (metrics.initializationTime > this.config.maxInitTime ||
          metrics.loadTime > this.config.maxLoadTime)
      );
    });

    return {
      totalMaps: allMetrics.length,
      averageInitTime: totalInitTime / allMetrics.length,
      averageLoadTime: totalLoadTime / allMetrics.length,
      totalErrors,
      totalRetries,
      slowMaps,
    };
  }

  /**
   * Clean up metrics for a specific map
   */
  cleanup(mapId: string): void {
    this.metrics.delete(mapId);

    // Clean up performance marks and measures
    if (typeof performance !== 'undefined' && typeof performance.clearMarks === 'function') {
      performance.clearMarks(`mapbox-init-start-${mapId}`);
      performance.clearMarks(`mapbox-init-end-${mapId}`);
      performance.clearMarks(`mapbox-load-end-${mapId}`);
    }

    if (typeof performance !== 'undefined' && typeof performance.clearMeasures === 'function') {
      performance.clearMeasures(`mapbox-init-${mapId}`);
      performance.clearMeasures(`mapbox-load-${mapId}`);
    }

    if (this.config.enableLogging) {
      logger.info(`Cleaned up performance tracking for map: ${mapId}`);
    }
  }

  /**
   * Clean up all metrics and observers
   */
  destroy(): void {
    this.metrics.clear();

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = undefined;
    }

    if (this.config.enableLogging) {
      logger.info('MapboxPerformanceMonitor destroyed');
    }
  }

  /**
   * Generate a performance report
   */
  generateReport(): string {
    const aggregated = this.getAggregatedMetrics();

    return `
Mapbox Performance Report
========================
Total Maps: ${aggregated.totalMaps}
Average Init Time: ${aggregated.averageInitTime.toFixed(2)}ms
Average Load Time: ${aggregated.averageLoadTime.toFixed(2)}ms
Total Errors: ${aggregated.totalErrors}
Total Retries: ${aggregated.totalRetries}
Slow Maps: ${aggregated.slowMaps.length > 0 ? aggregated.slowMaps.join(', ') : 'None'}

Thresholds:
- Max Init Time: ${this.config.maxInitTime}ms
- Max Load Time: ${this.config.maxLoadTime}ms
    `.trim();
  }
}

// Global performance monitor instance
export const mapboxPerformanceMonitor = new MapboxPerformanceMonitor();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    mapboxPerformanceMonitor.destroy();
  });
}

export { MapboxPerformanceMonitor };
export type { MapboxPerformanceMetrics, MapboxPerformanceConfig };
