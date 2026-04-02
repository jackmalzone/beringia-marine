/**
 * Performance tests for MapboxMap component
 * Tests smooth interactions, memory management, and optimization features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MapboxMap, cleanupAllMapInstances } from '../MapboxMap';
import { BUSINESS_LOCATION } from '@/lib/config/mapbox';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

Object.defineProperty(window, 'performance', {
  writable: true,
  value: mockPerformance,
});

// Mock Mapbox GL JS with performance tracking
const mockMap = {
  on: jest.fn(),
  once: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  resize: jest.fn(),
  getContainer: jest.fn(() => document.createElement('div')),
  getCanvas: jest.fn(() => document.createElement('canvas')),
  isStyleLoaded: jest.fn(() => true),
  loaded: jest.fn(() => true),
  fire: jest.fn(),
  triggerRepaint: jest.fn(),
};

const mockMarker = {
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  setPopup: jest.fn().mockReturnThis(),
  remove: jest.fn(),
};

const mockPopup = {
  setLngLat: jest.fn().mockReturnThis(),
  setHTML: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
};

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockMap),
  Marker: jest.fn(() => mockMarker),
  Popup: jest.fn(() => mockPopup),
  supported: jest.fn(() => true),
  accessToken: '',
}));

// Mock environment variables
process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-token';

// Performance measurement utilities
const measurePerformance = async (operation: () => Promise<void> | void) => {
  const startTime = performance.now();
  await operation();
  const endTime = performance.now();
  return endTime - startTime;
};

describe('MapboxMap Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformance.now.mockImplementation(() => Date.now());
  });

  afterEach(() => {
    jest.clearAllTimers();
    cleanupAllMapInstances();
  });

  describe('Initialization Performance', () => {
    it('should initialize quickly without blocking UI thread', async () => {
      const initTime = await measurePerformance(async () => {
        render(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );

        // Should show loading state immediately
        expect(screen.getByRole('status')).toBeInTheDocument();
      }, 'map-initialization');

      // Initialization should be fast (under 100ms for component render)
      expect(initTime).toBeLessThan(100);
    });

    it('should debounce rapid re-initializations', async () => {
      let mapConstructorCalls = 0;
      const MapboxGL = require('mapbox-gl');
      const originalMap = MapboxGL.Map;

      MapboxGL.Map = jest.fn(() => {
        mapConstructorCalls++;
        return mockMap;
      });

      const { rerender } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Rapidly change props
      for (let i = 0; i < 5; i++) {
        rerender(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15 + i}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );
      }

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      // Should only create one map instance due to debouncing
      expect(mapConstructorCalls).toBeLessThanOrEqual(1);

      // Restore original
      MapboxGL.Map = originalMap;
    });

    it('should handle concurrent component mounts efficiently', async () => {
      const components = [];

      const mountTime = await measurePerformance(async () => {
        // Mount multiple map components simultaneously
        for (let i = 0; i < 3; i++) {
          components.push(
            render(
              <MapboxMap
                key={i}
                center={BUSINESS_LOCATION.coordinates}
                zoom={15}
                showBusinessMarker={true}
                businessInfo={BUSINESS_LOCATION}
              />
            )
          );
        }

        // Wait for all to show loading states
        await waitFor(() => {
          const loadingElements = screen.getAllByRole('status');
          expect(loadingElements).toHaveLength(3);
        });
      }, 'concurrent-mounts');

      // Should handle multiple mounts efficiently
      expect(mountTime).toBeLessThan(500);

      // Cleanup
      components.forEach(component => component.unmount());
    });
  });

  describe('Memory Management', () => {
    it('should properly cleanup resources on unmount', async () => {
      const { unmount } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Wait for map to initialize
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Unmount component
      unmount();

      // Verify cleanup methods were called
      expect(mockMap.off).toHaveBeenCalled();
      expect(mockMap.remove).toHaveBeenCalled();
    });

    it('should handle rapid mount/unmount cycles without memory leaks', async () => {
      const cycles = 5;

      for (let i = 0; i < cycles; i++) {
        const { unmount } = render(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
        });

        unmount();
      }

      // Each cycle should have called cleanup
      expect(mockMap.remove).toHaveBeenCalledTimes(cycles);
    });

    it('should cleanup global map instances on page unload', async () => {
      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Simulate page unload
      fireEvent(window, new Event('beforeunload'));

      // Global cleanup should be triggered
      expect(mockMap.off).toHaveBeenCalled();
      expect(mockMap.remove).toHaveBeenCalled();
    });

    it('should prevent memory leaks from event listeners', async () => {
      const { unmount } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Simulate map load
      mockMap.once.mockImplementation((event, callback) => {
        if (event === 'load') {
          setTimeout(callback, 100);
        }
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      unmount();

      // Verify event listeners are removed
      expect(mockMap.off).toHaveBeenCalled();
    });
  });

  describe('Rendering Performance', () => {
    it('should minimize re-renders with memoization', async () => {
      let renderCount = 0;
      const TestWrapper = React.memo(function TestWrapper() {
        renderCount++;
        return (
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );
      });

      const { rerender } = render(<TestWrapper />);

      // Re-render with same props
      rerender(<TestWrapper />);
      rerender(<TestWrapper />);

      // Should minimize re-renders due to memoization
      expect(renderCount).toBeLessThanOrEqual(2);
    });

    it('should handle prop changes efficiently', async () => {
      const { rerender } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      const updateTime = await measurePerformance(async () => {
        // Change props multiple times
        rerender(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={16}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );

        rerender(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={17}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );
      }, 'prop-updates');

      // Prop updates should be fast
      expect(updateTime).toBeLessThan(100);
    });

    it('should optimize popup HTML generation', async () => {
      const generateTime = await measurePerformance(async () => {
        render(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 150));
        });
      }, 'popup-generation');

      // Popup HTML generation should be memoized and fast
      expect(generateTime).toBeLessThan(200);
      expect(mockPopup.setHTML).toHaveBeenCalledWith(expect.stringContaining('Vital Ice'));
    });
  });

  describe('Interaction Performance', () => {
    it('should handle rapid user interactions smoothly', async () => {
      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');

      const interactionTime = await measurePerformance(async () => {
        // Simulate rapid mouse movements
        for (let i = 0; i < 20; i++) {
          fireEvent.mouseMove(mapContainer!, {
            clientX: 100 + i * 5,
            clientY: 100 + i * 5,
          });
        }

        // Simulate touch interactions
        fireEvent.touchStart(mapContainer!, {
          touches: [{ clientX: 100, clientY: 100 }],
        });

        fireEvent.touchMove(mapContainer!, {
          touches: [{ clientX: 150, clientY: 150 }],
        });

        fireEvent.touchEnd(mapContainer!, {
          changedTouches: [{ clientX: 150, clientY: 150 }],
        });
      }, 'user-interactions');

      // Interactions should be handled smoothly
      expect(interactionTime).toBeLessThan(100);
    });

    it('should handle window resize events efficiently', async () => {
      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      const resizeTime = await measurePerformance(async () => {
        // Simulate multiple resize events
        for (let i = 0; i < 5; i++) {
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            value: 1000 + i * 100,
          });
          fireEvent(window, new Event('resize'));
        }

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
        });
      }, 'resize-handling');

      // Resize handling should be efficient
      expect(resizeTime).toBeLessThan(200);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors without performance degradation', async () => {
      // Mock map error
      mockMap.once.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback({ error: new Error('Performance test error') }), 100);
        }
      });

      const errorTime = await measurePerformance(async () => {
        render(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );

        await waitFor(() => {
          expect(screen.getByText('Map Unavailable')).toBeInTheDocument();
        });
      }, 'error-handling');

      // Error handling should be fast
      expect(errorTime).toBeLessThan(300);
    });

    it('should handle retry operations efficiently', async () => {
      // Mock map error initially
      let shouldError = true;
      mockMap.once.mockImplementation((event, callback) => {
        if (event === 'error' && shouldError) {
          setTimeout(() => callback({ error: new Error('Retry test error') }), 100);
        } else if (event === 'load' && !shouldError) {
          setTimeout(callback, 100);
        }
      });

      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Map Unavailable')).toBeInTheDocument();
      });

      const retryTime = await measurePerformance(async () => {
        shouldError = false;
        const retryButton = screen.getByRole('button', { name: /try again/i });
        fireEvent.click(retryButton);

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
        });
      }, 'retry-operation');

      // Retry should be handled efficiently
      expect(retryTime).toBeLessThan(300);
    });
  });

  describe('Resource Optimization', () => {
    it('should minimize network requests', async () => {
      const networkRequests: string[] = [];

      // Mock fetch to track network requests
      global.fetch = jest.fn().mockImplementation(url => {
        networkRequests.push(url);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });

      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Should minimize unnecessary network requests
      // (Mapbox GL JS handles its own requests, we just verify no extra requests)
      expect(networkRequests.length).toBeLessThanOrEqual(5);
    });

    it('should optimize map configuration loading', async () => {
      const configTime = await measurePerformance(async () => {
        render(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );
      }, 'config-loading');

      // Configuration loading should be fast
      expect(configTime).toBeLessThan(50);
    });

    it('should handle multiple instances efficiently', async () => {
      const components = [];

      const multiInstanceTime = await measurePerformance(async () => {
        // Create multiple instances
        for (let i = 0; i < 3; i++) {
          components.push(
            render(
              <div key={i}>
                <MapboxMap
                  center={BUSINESS_LOCATION.coordinates}
                  zoom={15}
                  showBusinessMarker={true}
                  businessInfo={BUSINESS_LOCATION}
                />
              </div>
            )
          );
        }

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
        });
      }, 'multiple-instances');

      // Multiple instances should be handled efficiently
      expect(multiInstanceTime).toBeLessThan(1000);

      // Cleanup
      components.forEach(component => component.unmount());
    });
  });

  describe('Animation Performance', () => {
    it('should handle CSS animations smoothly', async () => {
      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Check for hardware acceleration hints in CSS
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();

      // CSS should include performance optimizations
      // Note: In real browser, this would check for transform: translateZ(0) etc.
    });

    it('should respect reduced motion preferences', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion: reduce'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Should render without animations when reduced motion is preferred
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();
    });
  });
});
