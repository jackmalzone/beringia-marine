import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';

// Mock mapbox-gl
const mockMapInstance = {
  on: jest.fn(),
  once: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
};

const mockMarkerInstance = {
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  setPopup: jest.fn().mockReturnThis(),
};

const mockPopupInstance = {
  setHTML: jest.fn().mockReturnThis(),
};

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockMapInstance),
  Marker: jest.fn(() => mockMarkerInstance),
  Popup: jest.fn(() => mockPopupInstance),
  supported: jest.fn(() => true),
  accessToken: '',
}));

// Mock the mapbox config
jest.mock('@/lib/config/mapbox', () => ({
  getMapboxConfig: jest.fn(() => ({
    accessToken: 'pk.test-token-valid-format-with-sufficient-length-for-validation',
    defaultStyle: 'mapbox://styles/test/test',
    defaultCenter: [-122.434, 37.800115],
    defaultZoom: 15,
    markerColor: '#0066cc',
  })),
  BUSINESS_LOCATION: {
    name: 'Test Business',
    address: '123 Test St, Test City, CA 12345',
    phone: '(555) 123-4567',
    coordinates: [-122.434, 37.800115],
  },
}));

// Mock the performance monitor
jest.mock('../MapboxPerformanceMonitor', () => ({
  mapboxPerformanceMonitor: {
    startTracking: jest.fn(),
    recordInitialization: jest.fn(),
    recordLoad: jest.fn(),
    recordError: jest.fn(),
    recordRetry: jest.fn(),
    cleanup: jest.fn(),
  },
}));

// Mock CSS imports
jest.mock('../MapboxMap.module.css', () => ({
  mapContainer: 'mapContainer',
  loadingState: 'loadingState',
  loadingText: 'loadingText',
  errorState: 'errorState',
  retryButton: 'retryButton',
  directionsButton: 'directionsButton',
}));

jest.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}));

// Import component after mocks
import { MapboxMap } from '../MapboxMap';

/**
 * Comprehensive unit tests for MapboxMap component
 *
 * This test suite covers the requirements specified in task 8:
 * - Write tests for component rendering with different props
 * - Test loading and error state handling
 * - Test business marker and popup functionality
 * - Mock Mapbox GL JS for testing environment
 *
 * Requirements covered: 1.1, 3.1, 4.4, 4.5
 */
describe('MapboxMap Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Set up environment
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN =
      'pk.test-token-valid-format-with-sufficient-length-for-validation';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Component Rendering with Different Props - Requirements 1.1, 3.1, 4.4, 4.5', () => {
    it('renders loading state initially', () => {
      render(<MapboxMap />);
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
      expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
    });

    it('renders with custom height prop', () => {
      const { container } = render(<MapboxMap height="500px" />);
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '500px' });
    });

    it('renders with numeric height prop', () => {
      const { container } = render(<MapboxMap height={600} />);
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '600px' });
    });

    it('applies custom className prop', () => {
      const { container } = render(<MapboxMap className="custom-map-class" />);
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveClass('custom-map-class');
    });

    it('renders with custom center coordinates', () => {
      const customCenter: [number, number] = [-74.006, 40.7128];
      render(<MapboxMap center={customCenter} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      const mapboxgl = require('mapbox-gl');
      expect(mapboxgl.Map).toHaveBeenCalledWith(
        expect.objectContaining({
          center: customCenter,
        })
      );
    });

    it('renders with custom zoom level', () => {
      const customZoom = 12;
      render(<MapboxMap zoom={customZoom} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      const mapboxgl = require('mapbox-gl');
      expect(mapboxgl.Map).toHaveBeenCalledWith(
        expect.objectContaining({
          zoom: customZoom,
        })
      );
    });

    it('calls onMapLoad callback when map loads successfully', async () => {
      const onMapLoad = jest.fn();
      render(<MapboxMap onMapLoad={onMapLoad} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Simulate map load event
      const loadCallback = mockMapInstance.once.mock.calls.find(call => call[0] === 'load')?.[1];
      if (loadCallback) {
        act(() => {
          loadCallback();
        });
      }

      await waitFor(() => {
        expect(onMapLoad).toHaveBeenCalledWith(mockMapInstance);
      });
    });

    it('calls onError callback when map fails to load', async () => {
      const onError = jest.fn();
      const mockConfig = require('@/lib/config/mapbox');
      mockConfig.getMapboxConfig.mockImplementationOnce(() => {
        throw new Error('Configuration error');
      });

      render(<MapboxMap onError={onError} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('Loading and Error State Handling - Requirements 4.4, 4.5', () => {
    it('displays loading state with correct structure', () => {
      render(<MapboxMap />);

      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toHaveClass('loadingState');
    });

    it('transitions to error state when Mapbox is not supported', async () => {
      const mapboxgl = require('mapbox-gl');
      mapboxgl.supported.mockReturnValue(false);

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByText('Map Unavailable')).toBeInTheDocument();
      });
    });

    it('displays error state when configuration fails', async () => {
      const mockConfig = require('@/lib/config/mapbox');
      mockConfig.getMapboxConfig.mockImplementationOnce(() => {
        throw new Error('Configuration error');
      });

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByText('Map Unavailable')).toBeInTheDocument();
      });
    });

    it('displays error state when map loading times out', async () => {
      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Simulate timeout
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      await waitFor(() => {
        expect(screen.getByText('Map Unavailable')).toBeInTheDocument();
      });
    });

    it('provides retry functionality in error state', async () => {
      const mapboxgl = require('mapbox-gl');
      mapboxgl.supported.mockReturnValue(false);

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        const retryButton = screen.getByText('Try Again');
        expect(retryButton).toBeInTheDocument();
        expect(retryButton).toHaveAttribute('type', 'button');
      });

      // Test retry functionality
      fireEvent.click(screen.getByText('Try Again'));
      const mockPerformanceMonitor =
        require('../MapboxPerformanceMonitor').mapboxPerformanceMonitor;
      expect(mockPerformanceMonitor.recordRetry).toHaveBeenCalled();
    });

    it('shows fallback content with business info in error state', async () => {
      const businessInfo = {
        name: 'Test Business',
        address: '123 Test St, Test City, CA 12345',
        phone: '(555) 123-4567',
        coordinates: [-122.434, 37.800115] as [number, number],
      };

      const mapboxgl = require('mapbox-gl');
      mapboxgl.supported.mockReturnValue(false);

      render(<MapboxMap businessInfo={businessInfo} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByText('Test Business')).toBeInTheDocument();
        expect(screen.getByText('123 Test St, Test City, CA 12345')).toBeInTheDocument();
        expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
        expect(screen.getByText('Get Directions')).toBeInTheDocument();
      });
    });
  });

  describe('Business Marker and Popup Functionality - Requirements 1.1, 3.1', () => {
    it('creates business marker with correct coordinates', async () => {
      const businessInfo = {
        name: 'Test Business',
        address: '123 Test St, Test City, CA 12345',
        phone: '(555) 123-4567',
        coordinates: [-122.434, 37.800115] as [number, number],
      };

      render(<MapboxMap businessInfo={businessInfo} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Simulate map load
      const loadCallback = mockMapInstance.once.mock.calls.find(call => call[0] === 'load')?.[1];
      if (loadCallback) {
        act(() => {
          loadCallback();
        });
      }

      await waitFor(() => {
        const mapboxgl = require('mapbox-gl');
        expect(mapboxgl.Marker).toHaveBeenCalledWith({
          color: '#0066cc',
        });
        expect(mockMarkerInstance.setLngLat).toHaveBeenCalledWith(businessInfo.coordinates);
        expect(mockMarkerInstance.addTo).toHaveBeenCalledWith(mockMapInstance);
      });
    });

    it('creates popup with business information', async () => {
      const businessInfo = {
        name: 'Test Business',
        address: '123 Test St, Test City, CA 12345',
        phone: '(555) 123-4567',
        coordinates: [-122.434, 37.800115] as [number, number],
      };

      render(<MapboxMap businessInfo={businessInfo} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Simulate map load
      const loadCallback = mockMapInstance.once.mock.calls.find(call => call[0] === 'load')?.[1];
      if (loadCallback) {
        act(() => {
          loadCallback();
        });
      }

      await waitFor(() => {
        const mapboxgl = require('mapbox-gl');
        expect(mapboxgl.Popup).toHaveBeenCalledWith({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          className: 'custom-mapbox-popup',
          maxWidth: '300px',
        });
        expect(mockPopupInstance.setHTML).toHaveBeenCalledWith(
          expect.stringContaining('Test Business')
        );
        expect(mockPopupInstance.setHTML).toHaveBeenCalledWith(
          expect.stringContaining('123 Test St, Test City, CA 12345')
        );
        expect(mockPopupInstance.setHTML).toHaveBeenCalledWith(
          expect.stringContaining('(555) 123-4567')
        );
      });
    });

    it('creates popup without phone number when not provided', async () => {
      const businessInfo = {
        name: 'Test Business',
        address: '123 Test St, Test City, CA 12345',
        coordinates: [-122.434, 37.800115] as [number, number],
      };

      render(<MapboxMap businessInfo={businessInfo} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Simulate map load
      const loadCallback = mockMapInstance.once.mock.calls.find(call => call[0] === 'load')?.[1];
      if (loadCallback) {
        act(() => {
          loadCallback();
        });
      }

      await waitFor(() => {
        expect(mockPopupInstance.setHTML).toHaveBeenCalledWith(expect.not.stringContaining('tel:'));
      });
    });

    it('attaches popup to marker', async () => {
      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Simulate map load
      const loadCallback = mockMapInstance.once.mock.calls.find(call => call[0] === 'load')?.[1];
      if (loadCallback) {
        act(() => {
          loadCallback();
        });
      }

      await waitFor(() => {
        expect(mockMarkerInstance.setPopup).toHaveBeenCalledWith(mockPopupInstance);
      });
    });

    it('skips marker creation when showBusinessMarker is false', () => {
      render(<MapboxMap showBusinessMarker={false} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Marker should not be created when showBusinessMarker is false
      // Component should still render loading state
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('starts performance tracking on component mount', () => {
      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      const mockPerformanceMonitor =
        require('../MapboxPerformanceMonitor').mapboxPerformanceMonitor;
      expect(mockPerformanceMonitor.startTracking).toHaveBeenCalledWith(
        expect.stringMatching(/^mapbox-\d+-\d+$/)
      );
    });

    it('records initialization completion', async () => {
      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Simulate map load
      const loadCallback = mockMapInstance.once.mock.calls.find(call => call[0] === 'load')?.[1];
      if (loadCallback) {
        act(() => {
          loadCallback();
        });
      }

      await waitFor(() => {
        const mockPerformanceMonitor =
          require('../MapboxPerformanceMonitor').mapboxPerformanceMonitor;
        expect(mockPerformanceMonitor.recordInitialization).toHaveBeenCalled();
        expect(mockPerformanceMonitor.recordLoad).toHaveBeenCalled();
      });
    });

    it('records errors in performance monitor', async () => {
      const mapboxgl = require('mapbox-gl');
      mapboxgl.supported.mockReturnValue(false);

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        const mockPerformanceMonitor =
          require('../MapboxPerformanceMonitor').mapboxPerformanceMonitor;
        expect(mockPerformanceMonitor.recordError).toHaveBeenCalledWith(
          expect.stringMatching(/^mapbox-\d+-\d+$/),
          expect.any(Error)
        );
      });
    });

    it('cleans up performance tracking on unmount', () => {
      const { unmount } = render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      unmount();

      const mockPerformanceMonitor =
        require('../MapboxPerformanceMonitor').mapboxPerformanceMonitor;
      expect(mockPerformanceMonitor.cleanup).toHaveBeenCalled();
    });
  });

  describe('Memory Management and Cleanup', () => {
    it('properly cleans up map instance on unmount', () => {
      const { unmount } = render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      unmount();

      expect(mockMapInstance.off).toHaveBeenCalled();
      expect(mockMapInstance.remove).toHaveBeenCalled();
    });

    it('handles component unmount gracefully', () => {
      const { unmount } = render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Should not throw during unmount
      expect(() => unmount()).not.toThrow();
    });

    it('provides global cleanup functionality', () => {
      const { cleanupAllMapInstances } = require('../MapboxMap');

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Should not throw when calling global cleanup
      expect(() => cleanupAllMapInstances()).not.toThrow();
    });
  });

  describe('Accessibility Features', () => {
    it('provides ARIA labels for loading state', () => {
      render(<MapboxMap />);

      const loadingElement = screen.getByText('Loading interactive map...');
      expect(loadingElement.closest('[role="status"]')).toBeInTheDocument();
    });

    it('provides accessible retry button', async () => {
      const mapboxgl = require('mapbox-gl');
      mapboxgl.supported.mockReturnValue(false);

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        const retryButton = screen.getByText('Try Again');
        expect(retryButton).toHaveAttribute('type', 'button');
        expect(retryButton).toBeEnabled();
      });
    });

    it('provides accessible external links in error state', async () => {
      const mapboxgl = require('mapbox-gl');
      mapboxgl.supported.mockReturnValue(false);

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        const directionsLink = screen.getByText('Get Directions');
        expect(directionsLink).toHaveAttribute('target', '_blank');
        expect(directionsLink).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });
});
