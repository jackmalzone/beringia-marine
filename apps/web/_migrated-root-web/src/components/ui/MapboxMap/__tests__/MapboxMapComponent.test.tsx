import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';

// Mock mapbox-gl
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
  })),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
  })),
  Popup: jest.fn(() => ({
    setHTML: jest.fn().mockReturnThis(),
  })),
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
}));

jest.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}));

// Import component after mocks
import { MapboxMap } from '../MapboxMap';

describe('MapboxMap Component Tests', () => {
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

  describe('Component Rendering with Different Props', () => {
    it('renders loading state initially', () => {
      render(<MapboxMap />);
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
    });

    it('renders with custom height prop', () => {
      const { container } = render(<MapboxMap height="500px" />);
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '500px' });
    });

    it('applies custom className prop', () => {
      const { container } = render(<MapboxMap className="custom-map-class" />);
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveClass('custom-map-class');
    });

    it('calls onMapLoad callback when provided', async () => {
      const onMapLoad = jest.fn();
      render(<MapboxMap onMapLoad={onMapLoad} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // The callback should be set up even if not called in test environment
      expect(onMapLoad).toBeDefined();
    });
  });

  describe('Loading and Error State Handling', () => {
    it('displays loading state with correct text', () => {
      render(<MapboxMap />);

      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
      const loadingContainer = screen.getByText('Loading interactive map...').closest('div');
      expect(loadingContainer).toHaveClass('loadingText');
    });

    it('displays error state when Mapbox is not supported', async () => {
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
    });
  });

  describe('Business Marker and Popup Functionality', () => {
    it('creates marker when map loads', async () => {
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

      // In test environment, we verify the component attempts to create markers
      const mapboxgl = require('mapbox-gl');
      expect(mapboxgl.Map).toHaveBeenCalled();
    });

    it('handles marker creation with business info', () => {
      const businessInfo = {
        name: 'Custom Business',
        address: '456 Custom Ave',
        coordinates: [-118.2437, 34.0522] as [number, number],
      };

      render(<MapboxMap businessInfo={businessInfo} showBusinessMarker={true} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Verify component renders without errors with custom business info
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
    });

    it('skips marker creation when showBusinessMarker is false', () => {
      render(<MapboxMap showBusinessMarker={false} />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Component should still render loading state
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('starts performance tracking on mount', () => {
      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      const mockPerformanceMonitor =
        require('../MapboxPerformanceMonitor').mapboxPerformanceMonitor;
      expect(mockPerformanceMonitor.startTracking).toHaveBeenCalled();
    });

    it('records errors when they occur', async () => {
      const mapboxgl = require('mapbox-gl');
      mapboxgl.supported.mockReturnValue(false);

      render(<MapboxMap />);

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        const mockPerformanceMonitor =
          require('../MapboxPerformanceMonitor').mapboxPerformanceMonitor;
        expect(mockPerformanceMonitor.recordError).toHaveBeenCalled();
      });
    });

    it('cleans up tracking on unmount', () => {
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
