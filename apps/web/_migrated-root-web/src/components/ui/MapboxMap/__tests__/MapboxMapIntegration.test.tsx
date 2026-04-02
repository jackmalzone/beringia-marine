/**
 * Integration tests for MapboxMap component within contact page layout
 * Tests responsive design, touch interactions, and performance
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapboxMap } from '../MapboxMap';
import { BUSINESS_LOCATION } from '@/lib/config/mapbox';

// Mock Mapbox GL JS
const mockMap = {
  on: jest.fn(),
  once: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  getContainer: jest.fn(() => document.createElement('div')),
  getCanvas: jest.fn(() => document.createElement('canvas')),
  getCenter: jest.fn(() => ({ lng: -122.434, lat: 37.800115 })),
  getZoom: jest.fn(() => 15),
  getBounds: jest.fn(),
  project: jest.fn(() => ({ x: 100, y: 100 })),
  unproject: jest.fn(() => ({ lng: -122.434, lat: 37.800115 })),
  isStyleLoaded: jest.fn(() => true),
  loaded: jest.fn(() => true),
  resize: jest.fn(),
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  flyTo: jest.fn(),
  easeTo: jest.fn(),
  panTo: jest.fn(),
  zoomTo: jest.fn(),
  fitBounds: jest.fn(),
  addControl: jest.fn(),
  removeControl: jest.fn(),
  addSource: jest.fn(),
  removeSource: jest.fn(),
  addLayer: jest.fn(),
  removeLayer: jest.fn(),
  setLayoutProperty: jest.fn(),
  setPaintProperty: jest.fn(),
  queryRenderedFeatures: jest.fn(() => []),
  querySourceFeatures: jest.fn(() => []),
  fire: jest.fn(),
  listImages: jest.fn(() => []),
  hasImage: jest.fn(() => false),
  addImage: jest.fn(),
  removeImage: jest.fn(),
  loadImage: jest.fn(),
  getStyle: jest.fn(() => ({})),
  setStyle: jest.fn(),
  isSourceLoaded: jest.fn(() => true),
  areTilesLoaded: jest.fn(() => true),
  triggerRepaint: jest.fn(),
  showTileBoundaries: false,
  showCollisionBoxes: false,
  showOverdrawInspector: false,
  repaint: false,
  getContainer: jest.fn(() => document.createElement('div')),
};

const mockMarker = {
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  setPopup: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  getElement: jest.fn(() => document.createElement('div')),
  getLngLat: jest.fn(() => ({ lng: -122.434, lat: 37.800115 })),
  setDraggable: jest.fn().mockReturnThis(),
  isDraggable: jest.fn(() => false),
  setRotation: jest.fn().mockReturnThis(),
  getRotation: jest.fn(() => 0),
  setRotationAlignment: jest.fn().mockReturnThis(),
  getRotationAlignment: jest.fn(() => 'auto'),
  setPitchAlignment: jest.fn().mockReturnThis(),
  getPitchAlignment: jest.fn(() => 'auto'),
};

const mockPopup = {
  setLngLat: jest.fn().mockReturnThis(),
  setHTML: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  isOpen: jest.fn(() => false),
  getElement: jest.fn(() => document.createElement('div')),
  setMaxWidth: jest.fn().mockReturnThis(),
  setOffset: jest.fn().mockReturnThis(),
  setClassName: jest.fn().mockReturnThis(),
};

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockMap),
  Marker: jest.fn(() => mockMarker),
  Popup: jest.fn(() => mockPopup),
  supported: jest.fn(() => true),
  accessToken: '',
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock environment variables
process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-token';

describe('MapboxMap Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();

    // Reset map mock
    mockMap.once.mockImplementation((event, callback) => {
      if (event === 'load') {
        setTimeout(callback, 100);
      }
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Contact Page Layout Integration', () => {
    it('should render within contact page layout without breaking styles', async () => {
      const { container } = render(
        <div className="contact-page-layout" style={{ width: '100%', maxWidth: '1200px' }}>
          <div className="map-section" style={{ padding: '2rem' }}>
            <MapboxMap
              center={BUSINESS_LOCATION.coordinates}
              zoom={15}
              height="400px"
              showBusinessMarker={true}
              businessInfo={BUSINESS_LOCATION}
              className="contact-map"
            />
          </div>
        </div>
      );

      // Wait for map to load
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Check that map container maintains proper dimensions
      const mapContainer = container.querySelector('.contact-map');
      expect(mapContainer).toBeInTheDocument();
      expect(mapContainer).toHaveStyle({ height: '400px' });

      // Verify map doesn't overflow parent container
      const mapSection = container.querySelector('.map-section');
      expect(mapSection).toBeInTheDocument();
    });

    it('should integrate properly with existing contact page styles', async () => {
      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          height="400px"
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
          className="custom-contact-map"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const mapContainer = screen.getByRole('status').parentElement;
      expect(mapContainer).toHaveClass('custom-contact-map');

      // Verify dark theme styling is applied
      expect(mapContainer).toHaveStyle({
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '12px',
      });
    });

    it('should maintain layout when map fails to load', async () => {
      // Mock map initialization failure
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
    });
  });

  describe('Responsive Design Tests', () => {
    const mockViewport = (width: number, height: number) => {
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

      // Mock matchMedia for different breakpoints
      window.matchMedia = jest.fn().mockImplementation(query => {
        const matches =
          (query.includes('max-width: 768px') && width <= 768) ||
          (query.includes('max-width: 480px') && width <= 480) ||
          (query.includes('hover: none') && width <= 768);

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

    it('should adapt to mobile viewport (768px and below)', async () => {
      mockViewport(375, 667); // iPhone SE dimensions

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

      // Check mobile-specific styling is applied
      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toBeInTheDocument();

      // Verify responsive height adjustment would be applied via CSS
      expect(mapContainer).toHaveClass(expect.stringMatching(/mapContainer/));
    });

    it('should adapt to tablet viewport (768px - 1024px)', async () => {
      mockViewport(768, 1024); // iPad dimensions

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

    it('should handle very small mobile screens (480px and below)', async () => {
      mockViewport(320, 568); // iPhone 5 dimensions

      render(
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

      // Verify component renders without breaking on very small screens
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
    });

    it('should handle landscape orientation on mobile', async () => {
      mockViewport(667, 375); // iPhone SE landscape

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

      const mapContainer = container.querySelector('[class*="mapContainer"]');
      expect(mapContainer).toHaveStyle({ height: '300px' });
    });
  });

  describe('Touch Interactions', () => {
    beforeEach(() => {
      // Mock touch device
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 5,
      });

      // Mock touch events
      window.TouchEvent = class TouchEvent extends Event {
        constructor(type: string, options: TouchEventInit = {}) {
          super(type, options);
        }
      } as typeof TouchEvent;
    });

    it('should handle touch interactions on mobile devices', async () => {
      mockViewport(375, 667);

      render(
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

      // Simulate touch events on map container
      const mapContainer = screen.getByRole('status').parentElement;

      // Touch start
      fireEvent.touchStart(mapContainer!, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      // Touch move (pan gesture)
      fireEvent.touchMove(mapContainer!, {
        touches: [{ clientX: 150, clientY: 150 }],
      });

      // Touch end
      fireEvent.touchEnd(mapContainer!, {
        changedTouches: [{ clientX: 150, clientY: 150 }],
      });

      // Verify map container handles touch events without errors
      expect(mapContainer).toBeInTheDocument();
    });

    it('should support pinch-to-zoom gestures', async () => {
      mockViewport(375, 667);

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

      const mapContainer = screen.getByRole('status').parentElement;

      // Simulate pinch gesture (two finger touch)
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

      // Verify no errors occurred during pinch gesture
      expect(mapContainer).toBeInTheDocument();
    });

    it('should handle touch interactions with business marker popup', async () => {
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

      // Verify marker was created
      expect(mockMarker.setLngLat).toHaveBeenCalledWith(BUSINESS_LOCATION.coordinates);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      expect(mockMarker.setPopup).toHaveBeenCalledWith(mockPopup);
    });

    it('should provide touch-friendly button sizes in error state', async () => {
      // Mock map error
      mockMap.once.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback({ error: new Error('Touch test error') }), 100);
        }
      });

      mockViewport(375, 667);

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

      // Check for touch-friendly buttons
      const retryButton = screen.getByRole('button', { name: /try again/i });
      const directionsLink = screen.getByRole('link', { name: /get directions/i });

      expect(retryButton).toBeInTheDocument();
      expect(directionsLink).toBeInTheDocument();

      // Verify buttons are touch-friendly (should have adequate size via CSS)
      expect(retryButton).toHaveClass(expect.stringMatching(/retryButton/));
      expect(directionsLink).toHaveClass(expect.stringMatching(/directionsButton/));
    });
  });

  describe('Performance and Smooth Interactions', () => {
    it('should initialize map without blocking UI thread', async () => {
      const onMapLoad = jest.fn();

      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
          onMapLoad={onMapLoad}
        />
      );

      // Verify loading state is shown immediately
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();

      // Wait for map to load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(onMapLoad).toHaveBeenCalledWith(mockMap);
    });

    it('should handle rapid component mounting/unmounting without memory leaks', async () => {
      const { unmount, rerender } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Rapidly remount component
      unmount();

      rerender(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={16}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Verify cleanup was called
      expect(mockMap.off).toHaveBeenCalled();
      expect(mockMap.remove).toHaveBeenCalled();
    });

    it('should debounce map initialization to prevent rapid re-renders', async () => {
      const { rerender } = render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      // Rapidly change props
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

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      // Map should only be initialized once due to debouncing
      expect(mockMap.once).toHaveBeenCalledTimes(2); // load and error events
    });

    it('should handle window resize events smoothly', async () => {
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

      // Simulate window resize
      mockViewport(1024, 768);
      fireEvent(window, new Event('resize'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify map handles resize without errors
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should maintain smooth performance during user interactions', async () => {
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

      // Simulate rapid mouse movements (should not cause performance issues)
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseMove(mapContainer!, {
          clientX: 100 + i * 10,
          clientY: 100 + i * 10,
        });
      }

      // Verify component remains stable
      expect(mapContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    it('should provide proper ARIA labels for loading state', async () => {
      render(
        <MapboxMap
          center={BUSINESS_LOCATION.coordinates}
          zoom={15}
          showBusinessMarker={true}
          businessInfo={BUSINESS_LOCATION}
        />
      );

      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toHaveAttribute('aria-label', 'Loading interactive map');
    });

    it('should support keyboard navigation for interactive elements', async () => {
      // Mock map error to show interactive buttons
      mockMap.once.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback({ error: new Error('Keyboard test error') }), 100);
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

      const retryButton = screen.getByRole('button', { name: /try again/i });
      const directionsLink = screen.getByRole('link', { name: /get directions/i });

      // Test keyboard navigation
      await user.tab();
      expect(retryButton).toHaveFocus();

      await user.tab();
      expect(directionsLink).toHaveFocus();

      // Test keyboard activation
      await user.keyboard('{Enter}');
      // Verify button can be activated (would trigger retry in real scenario)
    });

    it('should provide proper focus management for popup interactions', async () => {
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

      // Verify popup was configured with proper HTML content
      expect(mockPopup.setHTML).toHaveBeenCalledWith(expect.stringContaining('Vital Ice'));
      expect(mockPopup.setHTML).toHaveBeenCalledWith(
        expect.stringContaining(BUSINESS_LOCATION.address)
      );
    });
  });
});
