/**
 * @jest-environment jsdom
 */

import { MapboxPerformanceMonitor } from '../MapboxPerformanceMonitor';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  memory: {
    usedJSHeapSize: 1024 * 1024, // 1MB
  },
};

// Mock PerformanceObserver
class MockPerformanceObserver {
  callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;
  }

  observe() {}
  disconnect() {}
}

// Setup global mocks
Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

Object.defineProperty(global, 'PerformanceObserver', {
  value: MockPerformanceObserver,
  writable: true,
});

describe('MapboxPerformanceMonitor', () => {
  let monitor: MapboxPerformanceMonitor;
  const testMapId = 'test-map-123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformance.now.mockReturnValue(1000);
    monitor = new MapboxPerformanceMonitor({
      enableLogging: false, // Disable logging for tests
      enableMemoryTracking: true,
      maxLoadTime: 5000,
      maxInitTime: 2000,
    });
  });

  afterEach(() => {
    monitor.destroy();
  });

  describe('Performance Tracking', () => {
    it('should start tracking performance for a map instance', () => {
      monitor.startTracking(testMapId);

      const metrics = monitor.getMetrics(testMapId);
      expect(metrics).toBeTruthy();
      expect(metrics?.startTime).toBe(1000);
      expect(metrics?.initializationTime).toBe(0);
      expect(metrics?.errorCount).toBe(0);
      expect(metrics?.retryCount).toBe(0);
      expect(mockPerformance.mark).toHaveBeenCalledWith(`mapbox-init-start-${testMapId}`);
    });

    it('should record initialization completion', () => {
      monitor.startTracking(testMapId);

      // Simulate time passing
      mockPerformance.now.mockReturnValue(2500);
      monitor.recordInitialization(testMapId);

      const metrics = monitor.getMetrics(testMapId);
      expect(metrics?.initializationTime).toBe(1500); // 2500 - 1000
      expect(mockPerformance.mark).toHaveBeenCalledWith(`mapbox-init-end-${testMapId}`);
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        `mapbox-init-${testMapId}`,
        `mapbox-init-start-${testMapId}`,
        `mapbox-init-end-${testMapId}`
      );
    });

    it('should record load completion with memory usage', () => {
      monitor.startTracking(testMapId);

      // Simulate time passing
      mockPerformance.now.mockReturnValue(3000);
      monitor.recordLoad(testMapId);

      const metrics = monitor.getMetrics(testMapId);
      expect(metrics?.loadTime).toBe(2000); // 3000 - 1000
      expect(metrics?.memoryUsage).toBe(1024 * 1024);
      expect(mockPerformance.mark).toHaveBeenCalledWith(`mapbox-load-end-${testMapId}`);
    });

    it('should record errors and increment error count', () => {
      monitor.startTracking(testMapId);

      const testError = new Error('Test error');
      monitor.recordError(testMapId, testError);
      monitor.recordError(testMapId, testError);

      const metrics = monitor.getMetrics(testMapId);
      expect(metrics?.errorCount).toBe(2);
    });

    it('should record retries and increment retry count', () => {
      monitor.startTracking(testMapId);

      monitor.recordRetry(testMapId);
      monitor.recordRetry(testMapId);

      const metrics = monitor.getMetrics(testMapId);
      expect(metrics?.retryCount).toBe(2);
    });
  });

  describe('Aggregated Metrics', () => {
    it('should calculate aggregated metrics for multiple maps', () => {
      const mapId1 = 'map-1';
      const mapId2 = 'map-2';

      // Start tracking for both maps at the same time
      mockPerformance.now.mockReturnValue(1000);
      monitor.startTracking(mapId1);
      monitor.startTracking(mapId2);

      // Simulate different completion times
      mockPerformance.now.mockReturnValue(2000);
      monitor.recordInitialization(mapId1); // 1000ms duration
      monitor.recordLoad(mapId1); // 1000ms duration

      mockPerformance.now.mockReturnValue(4000);
      monitor.recordInitialization(mapId2); // 3000ms duration
      monitor.recordLoad(mapId2); // 3000ms duration

      // Add some errors and retries
      monitor.recordError(mapId1, new Error('Error 1'));
      monitor.recordRetry(mapId2);

      const aggregated = monitor.getAggregatedMetrics();

      expect(aggregated.totalMaps).toBe(2);
      expect(aggregated.averageInitTime).toBe(2000); // (1000 + 3000) / 2 - durations are 1000ms and 3000ms
      expect(aggregated.averageLoadTime).toBe(2000); // (1000 + 3000) / 2 - same durations since load is recorded at same time
      expect(aggregated.totalErrors).toBe(1);
      expect(aggregated.totalRetries).toBe(1);
      expect(aggregated.slowMaps).toContain(mapId2); // Exceeds maxInitTime
    });

    it('should return empty metrics when no maps are tracked', () => {
      const aggregated = monitor.getAggregatedMetrics();

      expect(aggregated.totalMaps).toBe(0);
      expect(aggregated.averageInitTime).toBe(0);
      expect(aggregated.averageLoadTime).toBe(0);
      expect(aggregated.totalErrors).toBe(0);
      expect(aggregated.totalRetries).toBe(0);
      expect(aggregated.slowMaps).toEqual([]);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup metrics for a specific map', () => {
      monitor.startTracking(testMapId);

      expect(monitor.getMetrics(testMapId)).toBeTruthy();

      monitor.cleanup(testMapId);

      expect(monitor.getMetrics(testMapId)).toBeNull();
      expect(mockPerformance.clearMarks).toHaveBeenCalledWith(`mapbox-init-start-${testMapId}`);
      expect(mockPerformance.clearMarks).toHaveBeenCalledWith(`mapbox-init-end-${testMapId}`);
      expect(mockPerformance.clearMarks).toHaveBeenCalledWith(`mapbox-load-end-${testMapId}`);
    });

    it('should cleanup all metrics on destroy', () => {
      monitor.startTracking('map-1');
      monitor.startTracking('map-2');

      expect(monitor.getAggregatedMetrics().totalMaps).toBe(2);

      monitor.destroy();

      expect(monitor.getAggregatedMetrics().totalMaps).toBe(0);
    });
  });

  describe('Performance Report', () => {
    it('should generate a comprehensive performance report', () => {
      monitor.startTracking(testMapId);

      mockPerformance.now.mockReturnValue(2000);
      monitor.recordInitialization(testMapId);
      monitor.recordLoad(testMapId);
      monitor.recordError(testMapId, new Error('Test error'));
      monitor.recordRetry(testMapId);

      const report = monitor.generateReport();

      expect(report).toContain('Mapbox Performance Report');
      expect(report).toContain('Total Maps: 1');
      expect(report).toContain('Average Init Time: 1000.00ms');
      expect(report).toContain('Average Load Time: 1000.00ms');
      expect(report).toContain('Total Errors: 1');
      expect(report).toContain('Total Retries: 1');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing performance API gracefully', () => {
      // Temporarily remove performance API
      const originalPerformance = global.performance;
      delete (global as typeof globalThis & { performance?: Performance }).performance;

      const monitorWithoutPerf = new MapboxPerformanceMonitor();

      expect(() => {
        monitorWithoutPerf.startTracking(testMapId);
        monitorWithoutPerf.recordInitialization(testMapId);
        monitorWithoutPerf.recordLoad(testMapId);
      }).not.toThrow();

      // Restore performance API
      global.performance = originalPerformance;
      monitorWithoutPerf.destroy();
    });

    it('should handle PerformanceObserver errors gracefully', () => {
      // Mock PerformanceObserver to throw
      const OriginalObserver = global.PerformanceObserver;
      global.PerformanceObserver = jest.fn(() => {
        throw new Error('PerformanceObserver not supported');
      }) as jest.MockedClass<typeof PerformanceObserver>;

      expect(() => {
        new MapboxPerformanceMonitor();
      }).not.toThrow();

      // Restore original
      global.PerformanceObserver = OriginalObserver;
    });
  });

  describe('Thresholds', () => {
    it('should identify slow maps based on thresholds', () => {
      const slowMapId = 'slow-map';

      monitor.startTracking(slowMapId);

      // Simulate slow initialization (exceeds 2000ms threshold)
      mockPerformance.now.mockReturnValue(4000);
      monitor.recordInitialization(slowMapId);

      // Simulate slow loading (exceeds 5000ms threshold)
      mockPerformance.now.mockReturnValue(7000);
      monitor.recordLoad(slowMapId);

      const aggregated = monitor.getAggregatedMetrics();
      expect(aggregated.slowMaps).toContain(slowMapId);
    });

    it('should not flag fast maps as slow', () => {
      const fastMapId = 'fast-map';

      monitor.startTracking(fastMapId);

      // Simulate fast initialization (under threshold)
      mockPerformance.now.mockReturnValue(1500);
      monitor.recordInitialization(fastMapId);

      // Simulate fast loading (under threshold)
      mockPerformance.now.mockReturnValue(2000);
      monitor.recordLoad(fastMapId);

      const aggregated = monitor.getAggregatedMetrics();
      expect(aggregated.slowMaps).not.toContain(fastMapId);
    });
  });
});
