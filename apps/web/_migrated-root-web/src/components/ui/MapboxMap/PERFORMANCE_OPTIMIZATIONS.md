# MapboxMap Performance Optimizations

This document outlines the performance optimizations implemented for the MapboxMap component to ensure efficient resource usage, prevent memory leaks, and minimize billing impact.

## Overview

The MapboxMap component has been enhanced with comprehensive performance optimizations that address:

1. **Memory Management**: Proper cleanup of map instances and event listeners
2. **Resource Tracking**: Active monitoring of map instances to prevent leaks
3. **Billing Optimization**: Minimizing unnecessary map loads and API calls
4. **Error Boundaries**: Component-level error handling with graceful degradation
5. **Performance Monitoring**: Real-time tracking of initialization and load times

## Key Optimizations

### 1. Memory Leak Prevention

#### Active Instance Tracking

```typescript
const activeMapInstances = new Set<mapboxgl.Map>();
```

- Tracks all active map instances globally
- Ensures proper cleanup on page unload
- Prevents orphaned map instances

#### Enhanced Cleanup Function

```typescript
const cleanupMap = useCallback(() => {
  if (map.current) {
    // Remove from active instances tracking
    activeMapInstances.delete(map.current);

    // Remove all event listeners to prevent memory leaks
    map.current.off();

    // Properly dispose of the map instance
    map.current.remove();
    map.current = null;
  }

  // Performance monitoring cleanup
  mapboxPerformanceMonitor.cleanup(mapId.current);
}, []);
```

#### Global Cleanup on Page Unload

```typescript
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupAllMapInstances);
  window.addEventListener('pagehide', cleanupAllMapInstances);
}
```

### 2. Optimized Map Initialization

#### Debounced Initialization

```typescript
let mapInitializationTimeout: NodeJS.Timeout | null = null;

// Debounce map initialization to prevent rapid re-renders
mapInitializationTimeout = setTimeout(() => {
  // Initialize map after 100ms delay
}, 100);
```

#### Performance-Optimized Map Settings

```typescript
map.current = new mapboxgl.Map({
  container: mapContainer.current,
  style: mapConfig.defaultStyle,
  center: center || mapConfig.defaultCenter,
  zoom: zoom || mapConfig.defaultZoom,
  attributionControl: true,
  // Performance optimizations
  preserveDrawingBuffer: false, // Reduces memory usage
  antialias: false, // Improves performance on lower-end devices
  optimizeForTerrain: false, // Reduces initial load time
  refreshExpiredTiles: false, // Minimizes unnecessary network requests
});
```

### 3. Component-Level Error Boundary

#### MapboxErrorBoundary

- Specialized error boundary for map-specific errors
- Categorizes errors (authentication, network, browser compatibility, configuration)
- Provides appropriate fallback UI based on error type
- Includes retry mechanism with limits

```typescript
export class MapboxErrorBoundary extends Component {
  private categorizeMapboxError(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes('access token')) return 'authentication';
    if (message.includes('network')) return 'network';
    if (message.includes('webgl')) return 'browser_compatibility';
    if (message.includes('style')) return 'configuration';

    return 'unknown';
  }
}
```

### 4. Performance Monitoring

#### MapboxPerformanceMonitor

- Tracks initialization and load times
- Monitors memory usage (when available)
- Records error and retry counts
- Identifies slow-loading maps
- Generates performance reports

```typescript
class MapboxPerformanceMonitor {
  startTracking(mapId: string): void;
  recordInitialization(mapId: string): void;
  recordLoad(mapId: string): void;
  recordError(mapId: string, error: Error): void;
  recordRetry(mapId: string): void;
  getAggregatedMetrics(): AggregatedMetrics;
  generateReport(): string;
}
```

### 5. CSS Performance Optimizations

#### Hardware Acceleration

```css
.mapContainer {
  contain: layout style paint;
  will-change: transform;
  transform: translateZ(0); /* Force hardware acceleration */
}

.mapInstance {
  contain: strict;
  will-change: transform;
  transform: translateZ(0);
  /* Optimize rendering */
  image-rendering: optimizeSpeed;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
}
```

### 6. Memoization and Optimization

#### Memoized Configuration

```typescript
const mapConfig = useMemo(() => {
  try {
    return getMapboxConfig();
  } catch (error) {
    handleError(error instanceof Error ? error : new Error('Failed to get map configuration'));
    return null;
  }
}, [handleError]);
```

#### Memoized Popup Content

```typescript
const popupHTML = useMemo(() => {
  if (!businessInfo) return '';
  return generatePopupHTML(businessInfo);
}, [businessInfo]);
```

#### React.memo Wrapper

```typescript
export const MapboxMap = React.memo(MapboxMapCore);
```

## Performance Metrics

### Thresholds

- **Maximum Initialization Time**: 5 seconds
- **Maximum Load Time**: 15 seconds
- **Maximum Retries**: 2 attempts
- **Memory Tracking**: Enabled when available

### Monitoring Features

- Real-time performance tracking
- Automatic slow map detection
- Memory usage monitoring
- Error categorization and reporting
- Aggregated performance metrics

## Usage Guidelines

### Best Practices

1. **Always wrap with error boundary**:

```typescript
<MapboxErrorBoundary businessInfo={businessInfo}>
  <MapboxMap {...props} />
</MapboxErrorBoundary>
```

2. **Monitor performance in development**:

```typescript
import { mapboxPerformanceMonitor } from '@/components/ui/MapboxMap';

// Get performance report
console.log(mapboxPerformanceMonitor.generateReport());
```

3. **Handle cleanup properly**:

```typescript
useEffect(() => {
  return () => {
    // Cleanup is handled automatically
  };
}, []);
```

### Performance Monitoring

#### Development Mode

- Detailed logging enabled
- Performance marks and measures
- Memory usage tracking
- Error stack traces

#### Production Mode

- Minimal logging
- Essential error reporting
- Performance metrics collection
- Graceful error handling

## Testing

### Performance Tests

- Memory leak detection
- Initialization time validation
- Error handling verification
- Cleanup functionality testing

### Integration Tests

- Component rendering with error boundary
- Performance monitor integration
- Cleanup on unmount
- Error recovery mechanisms

## Browser Compatibility

### Supported Features

- **WebGL Support**: Required for Mapbox GL JS
- **Performance API**: Optional, graceful degradation
- **Memory API**: Optional, enhanced monitoring when available
- **PerformanceObserver**: Optional, detailed performance tracking

### Fallback Handling

- Graceful degradation when Performance API unavailable
- Error boundaries for unsupported browsers
- Alternative content for WebGL-incompatible devices

## Billing Optimization

### Network Request Minimization

- Debounced initialization prevents rapid re-initialization
- `refreshExpiredTiles: false` reduces unnecessary tile requests
- Proper cleanup prevents background requests
- Single map instance per component lifecycle

### Resource Management

- Efficient memory usage with proper cleanup
- Optimized map settings for performance
- Minimal resource allocation during initialization
- Proactive error handling to prevent resource waste

## Monitoring and Debugging

### Development Tools

```typescript
// Get current performance metrics
const metrics = mapboxPerformanceMonitor.getAggregatedMetrics();

// Generate detailed report
const report = mapboxPerformanceMonitor.generateReport();

// Check for slow maps
const slowMaps = metrics.slowMaps;
```

### Production Monitoring

- Error categorization and reporting
- Performance threshold monitoring
- Memory usage tracking (when available)
- Automatic cleanup verification

This comprehensive performance optimization ensures the MapboxMap component operates efficiently while providing excellent user experience and minimizing resource usage.
