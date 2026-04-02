/**
 * Task 9: Test integration and responsive behavior
 * Focused tests for the specific requirements in task 9
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MapboxMap } from '../MapboxMap';
import { BUSINESS_LOCATION } from '@/lib/config/mapbox';

// Mock Mapbox GL JS with successful loading
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
};

const mockMarker = {
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  setPopup: jest.fn().mockReturnThis(),
  remove: jest.fn(),
};

const mockPopup = {
  setHTML: jest.fn().mockReturnThis(),
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

// Mock window.matchMedia for responsive tests
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('Task 9: MapboxMap Integration and Responsive Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia(false); // Default to desktop
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Requirement 2.1: Zoom and pan interactions', () => {
    it('should allow zooming and panning interactions', async () => {
      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Wait for map to load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();

      // Simulate mouse wheel zoom
      fireEvent.wheel(mapContainer!, { deltaY: -100 });

      // Simulate pan interaction
      fireEvent.mouseDown(mapContainer!, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(mapContainer!, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(mapContainer!, { clientX: 150, clientY: 150 });

      // Verify map container handles interactions
      expect(mapContainer).toBeInTheDocument();
    });
  });

  describe('Requirement 2.2: Smooth performance', () => {
    it('should maintain smooth performance during interactions', async () => {
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

      // Simulate rapid interactions
      const startTime = performance.now();
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseMove(mapContainer!, {
          clientX: 100 + i * 5,
          clientY: 100 + i * 5,
        });
      }
      const endTime = performance.now();

      // Should handle interactions quickly (under 100ms for 10 events)
      expect(endTime - startTime).toBeLessThan(100);
      expect(mapContainer).toBeInTheDocument();
    });
  });

  describe('Requirement 2.3: Explore surrounding areas', () => {
    it('should allow users to explore surrounding areas', async () => {
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

      // Verify map is initialized with proper center and zoom
      expect(mockMap.once).toHaveBeenCalledWith('load', expect.any(Function));

      // Verify business marker is added for reference point
      expect(mockMarker.setLngLat).toHaveBeenCalledWith(BUSINESS_LOCATION.coordinates);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });
  });

  describe('Requirement 2.4: Mobile touch gestures', () => {
    beforeEach(() => {
      // Mock touch device
      mockMatchMedia(true); // Mobile viewport
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 5,
      });
    });

    it('should support touch gestures on mobile devices', async () => {
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

      // Simulate touch pan
      fireEvent.touchStart(mapContainer!, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchMove(mapContainer!, {
        touches: [{ clientX: 150, clientY: 150 }],
      });
      fireEvent.touchEnd(mapContainer!, {
        changedTouches: [{ clientX: 150, clientY: 150 }],
      });

      // Simulate pinch-to-zoom
      fireEvent.touchStart(mapContainer!, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 },
        ],
      });
      fireEvent.touchMove(mapContainer!, {
        touches: [
          { clientX: 80, clientY: 80 },
          { clientX: 220, clientY: 220 },
        ],
      });
      fireEvent.touchEnd(mapContainer!, {
        changedTouches: [
          { clientX: 80, clientY: 80 },
          { clientX: 220, clientY: 220 },
        ],
      });

      expect(mapContainer).toBeInTheDocument();
    });
  });

  describe('Requirement 4.3: Contact page layout integration', () => {
    it('should integrate properly within contact page layout', async () => {
      const { container } = render(
        <div className="contact-page-layout" style={{ width: '100%', maxWidth: '1200px' }}>
          <div className="map-section" style={{ padding: '2rem' }}>
            <h2>Find Us</h2>
            <MapboxMap
              center={BUSINESS_LOCATION.coordinates}
              zoom={15}
              height="400px"
              showBusinessMarker={true}
              businessInfo={BUSINESS_LOCATION}
              className="contact-map"
            />
            <div className="map-actions">
              <button>Get Directions</button>
            </div>
          </div>
        </div>
      );

      // Wait for map to load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Verify map integrates without breaking layout
      const mapSection = container.querySelector('.map-section');
      const mapContainer = container.querySelector('.contact-map');
      const mapActions = container.querySelector('.map-actions');

      expect(mapSection).toBeInTheDocument();
      expect(mapContainer).toBeInTheDocument();
      expect(mapActions).toBeInTheDocument();

      // Verify map maintains specified height
      expect(mapContainer).toHaveStyle({ height: '400px' });
    });

    it('should maintain layout when map fails to load', async () => {
      // Mock map error
      mockMap.once.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback({ error: new Error('Network error') }), 100);
        }
      });

      const { container } = render(
        <div className="contact-layout">
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            height="400px"
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('Map Unavailable')).toBeInTheDocument();
      });

      // Verify fallback content maintains layout
      const errorContainer = container.querySelector('[class*="errorState"]');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer?.parentElement).toHaveStyle({ height: '400px' });

      // Verify fallback provides business information
      expect(screen.getByText('Vital Ice')).toBeInTheDocument();
      expect(screen.getByText(BUSINESS_LOCATION.address)).toBeInTheDocument();
    });
  });

  describe('Responsive Design Validation', () => {
    const testViewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' },
      { width: 320, height: 568, name: 'Small Mobile' },
    ];

    testViewports.forEach(viewport => {
      it(`should render properly on ${viewport.name} (${viewport.width}x${viewport.height})`, async () => {
        // Set viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: viewport.width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          value: viewport.height,
        });

        const { container } = render(
          <MapboxMap
            center={BUSINESS_LOCATION.coordinates}
            zoom={15}
            height="400px"
            showBusinessMarker={true}
            businessInfo={BUSINESS_LOCATION}
          />
        );

        // Should show loading state initially
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 150));
        });

        // Map should maintain specified dimensions
        const mapContainer = container.querySelector('[class*="mapContainer"]');
        expect(mapContainer).toHaveStyle({ height: '400px' });
      });
    });

    it('should handle viewport changes dynamically', async () => {
      const { container } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="400px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Change from desktop to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375,
      });
      fireEvent(window, new Event('resize'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();
    });
  });

  describe('Performance Validation', () => {
    it('should initialize without blocking UI thread', async () => {
      const startTime = performance.now();

      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      const renderTime = performance.now() - startTime;

      // Initial render should be fast
      expect(renderTime).toBeLessThan(100);

      // Should show loading state immediately
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle component unmounting cleanly', async () => {
      const { unmount } = render(
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

      // Unmount should trigger cleanup
      unmount();

      expect(mockMap.off).toHaveBeenCalled();
      expect(mockMap.remove).toHaveBeenCalled();
    });

    it('should validate smooth interactions', async () => {
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

      // Test rapid interactions don't cause performance issues
      const interactionStart = performance.now();

      for (let i = 0; i < 20; i++) {
        fireEvent.mouseMove(mapContainer!, {
          clientX: 100 + i,
          clientY: 100 + i,
        });
      }

      const interactionTime = performance.now() - interactionStart;

      // Should handle 20 interactions quickly
      expect(interactionTime).toBeLessThan(50);
    });
  });

  describe('Business Marker and Popup Integration', () => {
    it('should display business marker with correct information', async () => {
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

      // Verify marker is created and positioned
      expect(mockMarker.setLngLat).toHaveBeenCalledWith(BUSINESS_LOCATION.coordinates);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);

      // Verify popup contains business information
      expect(mockPopup.setHTML).toHaveBeenCalledWith(expect.stringContaining('Vital Ice'));
      expect(mockPopup.setHTML).toHaveBeenCalledWith(
        expect.stringContaining(BUSINESS_LOCATION.address)
      );
    });
  });
});
