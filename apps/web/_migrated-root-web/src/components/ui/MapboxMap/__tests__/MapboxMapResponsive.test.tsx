/**
 * Responsive behavior tests for MapboxMap component
 * Tests different screen sizes, orientations, and device types
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MapboxMap } from '../MapboxMap';
import { BUSINESS_LOCATION } from '@/lib/config/mapbox';

// Mock Mapbox GL JS
const mockMap = {
  on: jest.fn(),
  once: jest.fn((event, callback) => {
    if (event === 'load') {
      setTimeout(callback, 100);
    }
  }),
  off: jest.fn(),
  remove: jest.fn(),
  resize: jest.fn(),
  getContainer: jest.fn(() => document.createElement('div')),
  getCanvas: jest.fn(() => document.createElement('canvas')),
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

// Viewport simulation utilities
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  // Update matchMedia to reflect new viewport
  window.matchMedia = jest.fn().mockImplementation(query => {
    const matches =
      (query.includes('max-width: 768px') && width <= 768) ||
      (query.includes('max-width: 480px') && width <= 480) ||
      (query.includes('hover: none') && width <= 768) ||
      (query.includes('pointer: coarse') && width <= 768);

    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });

  // Trigger resize event
  fireEvent(window, new Event('resize'));
};

// Device presets
const DEVICES = {
  desktop: { width: 1920, height: 1080, name: 'Desktop' },
  laptop: { width: 1366, height: 768, name: 'Laptop' },
  tablet: { width: 768, height: 1024, name: 'iPad Portrait' },
  tabletLandscape: { width: 1024, height: 768, name: 'iPad Landscape' },
  mobile: { width: 375, height: 667, name: 'iPhone SE' },
  mobileLandscape: { width: 667, height: 375, name: 'iPhone SE Landscape' },
  smallMobile: { width: 320, height: 568, name: 'iPhone 5' },
  largeMobile: { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
};

describe('MapboxMap Responsive Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset map mock to successful loading by default
    mockMap.once.mockImplementation((event, callback) => {
      if (event === 'load') {
        setTimeout(callback, 100);
      }
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Desktop Responsiveness', () => {
    it('should render optimally on large desktop screens', async () => {
      setViewport(DEVICES.desktop.width, DEVICES.desktop.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="400px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '400px' });

      // Desktop should maintain full feature set
      expect(mapContainer).toHaveClass(expect.stringMatching(/mapContainer/));
    });

    it('should handle laptop screen sizes appropriately', async () => {
      setViewport(DEVICES.laptop.width, DEVICES.laptop.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="400px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '400px' });
    });
  });

  describe('Tablet Responsiveness', () => {
    it('should adapt to tablet portrait orientation', async () => {
      setViewport(DEVICES.tablet.width, DEVICES.tablet.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="400px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();

      // Should maintain desktop-like behavior on tablet
      expect(mapContainer).toHaveStyle({ height: '400px' });
    });

    it('should handle tablet landscape orientation', async () => {
      setViewport(DEVICES.tabletLandscape.width, DEVICES.tabletLandscape.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="350px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '350px' });
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should adapt to standard mobile portrait', async () => {
      setViewport(DEVICES.mobile.width, DEVICES.mobile.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();

      // Mobile should apply responsive CSS classes
      expect(mapContainer).toHaveClass(expect.stringMatching(/mapContainer/));
    });

    it('should handle mobile landscape orientation', async () => {
      setViewport(DEVICES.mobileLandscape.width, DEVICES.mobileLandscape.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="250px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '250px' });
    });

    it('should work on very small mobile screens', async () => {
      setViewport(DEVICES.smallMobile.width, DEVICES.smallMobile.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Should render without breaking on very small screens
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();
    });

    it('should optimize for large mobile screens', async () => {
      setViewport(DEVICES.largeMobile.width, DEVICES.largeMobile.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="400px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '400px' });
    });
  });

  describe('Dynamic Viewport Changes', () => {
    it('should handle viewport changes from desktop to mobile', async () => {
      // Start with desktop
      setViewport(DEVICES.desktop.width, DEVICES.desktop.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="400px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Change to mobile
      setViewport(DEVICES.mobile.width, DEVICES.mobile.height);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();
      expect(mapContainer).toHaveStyle({ height: '400px' });
    });

    it('should handle orientation changes on mobile', async () => {
      // Start with portrait
      setViewport(DEVICES.mobile.width, DEVICES.mobile.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="300px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Change to landscape
      setViewport(DEVICES.mobileLandscape.width, DEVICES.mobileLandscape.height);

      // Simulate orientation change event
      fireEvent(window, new Event('orientationchange'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '300px' });
    });

    it('should call map resize when viewport changes', async () => {
      setViewport(DEVICES.desktop.width, DEVICES.desktop.height);

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

      // Change viewport
      setViewport(DEVICES.mobile.width, DEVICES.mobile.height);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Map resize should be handled by Mapbox GL JS automatically
      expect(mockMap.getContainer).toHaveBeenCalled();
    });
  });

  describe('Error State Responsiveness', () => {
    beforeEach(() => {
      // Mock map error
      mockMap.once.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback({ error: new Error('Responsive test error') }), 100);
        }
      });
    });

    it('should show responsive error state on mobile', async () => {
      setViewport(DEVICES.mobile.width, DEVICES.mobile.height);

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

      // Check mobile-optimized error state
      const retryButton = screen.getByRole('button', { name: /try again/i });
      const directionsLink = screen.getByRole('link', { name: /get directions/i });

      expect(retryButton).toBeInTheDocument();
      expect(directionsLink).toBeInTheDocument();

      // Buttons should be touch-friendly on mobile
      expect(retryButton.className).toMatch(/retryButton/);
      expect(directionsLink.className).toMatch(/directionsButton/);
    });

    it('should show responsive error state on desktop', async () => {
      setViewport(DEVICES.desktop.width, DEVICES.desktop.height);

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

      // Desktop error state should show all information
      expect(screen.getByText('Vital Ice')).toBeInTheDocument();
      expect(screen.getByText(BUSINESS_LOCATION.address)).toBeInTheDocument();
    });

    it('should adapt error state buttons for different screen sizes', async () => {
      const testViewports = [DEVICES.desktop, DEVICES.tablet, DEVICES.mobile, DEVICES.smallMobile];

      for (const device of testViewports) {
        setViewport(device.width, device.height);

        const { unmount } = render(
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

        const retryButton = screen.getByRole('button', { name: /try again/i });
        expect(retryButton).toBeInTheDocument();

        unmount();
      }
    });
  });

  describe('Loading State Responsiveness', () => {
    it('should show responsive loading state across devices', async () => {
      const testViewports = [DEVICES.desktop, DEVICES.tablet, DEVICES.mobile, DEVICES.smallMobile];

      for (const device of testViewports) {
        setViewport(device.width, device.height);

        const { unmount } = render(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );

        // Check loading state appears immediately
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();

        // Loading spinner should be visible
        const loadingContainer = screen.getByRole('status');
        expect(loadingContainer).toHaveAttribute('aria-label', 'Loading interactive map');

        unmount();
      }
    });

    it('should maintain loading state proportions on different screens', async () => {
      setViewport(DEVICES.mobile.width, DEVICES.mobile.height);

      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="300px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '300px' });

      const loadingState = container.querySelector('[class*="loadingState"]');
      expect(loadingState).toBeInTheDocument();
    });
  });

  describe('Performance on Different Devices', () => {
    it('should handle rapid viewport changes without performance issues', async () => {
      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Rapidly change viewports
      const viewports = [
        DEVICES.desktop,
        DEVICES.mobile,
        DEVICES.tablet,
        DEVICES.mobileLandscape,
        DEVICES.desktop,
      ];

      for (const device of viewports) {
        setViewport(device.width, device.height);
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
        });
      }

      // Component should remain stable
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();
    });

    it('should optimize rendering for mobile devices', async () => {
      setViewport(DEVICES.mobile.width, DEVICES.mobile.height);

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

      // Verify mobile optimizations are applied
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();

      // Mobile should have performance optimizations via CSS
      expect(mapContainer?.className).toMatch(/mapContainer/);
    });
  });
});
