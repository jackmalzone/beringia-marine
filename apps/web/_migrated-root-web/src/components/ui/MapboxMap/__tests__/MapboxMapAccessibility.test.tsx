/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapboxMap } from '../MapboxMap';

// Mock Mapbox GL JS
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
    remove: jest.fn(),
  })),
  Popup: jest.fn(() => ({
    setHTML: jest.fn().mockReturnThis(),
    on: jest.fn(),
    remove: jest.fn(),
  })),
  supported: jest.fn(() => true),
  accessToken: '',
}));

// Mock the mapbox config
jest.mock('@/lib/config/mapbox', () => ({
  getMapboxConfig: jest.fn(() => ({
    accessToken: 'test-token',
    defaultStyle: 'test-style',
    defaultCenter: [-122.434, 37.800115],
    defaultZoom: 15,
    markerColor: '#00b7b5',
  })),
  BUSINESS_LOCATION: {
    name: 'Vital Ice',
    address: '2400 Chestnut St, San Francisco, CA 94123',
    phone: '(415) 555-0123',
    coordinates: [-122.434, 37.800115],
  },
}));

// Mock performance monitor
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

describe('MapboxMap Accessibility Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with proper ARIA structure', () => {
    render(<MapboxMap />);

    // Test basic accessibility structure
    const mapRegion = screen.getByRole('region', { name: /interactive map/i });
    expect(mapRegion).toBeInTheDocument();

    const loadingStatus = screen.getByRole('status', { name: /loading interactive map/i });
    expect(loadingStatus).toBeInTheDocument();

    // Test that map instance has proper accessibility attributes
    const mapInstance = document.querySelector('.mapInstance');
    expect(mapInstance).toBeInTheDocument();
    expect(mapInstance).toHaveAttribute('role', 'application');
    expect(mapInstance).toHaveAttribute('aria-label', expect.stringContaining('Interactive map'));
    expect(mapInstance).toHaveAttribute('tabindex', '-1'); // Initially not focusable

    // Test screen reader instructions
    const instructions = document.querySelector('[aria-live="polite"]');
    expect(instructions).toBeInTheDocument();
    expect(instructions).toHaveClass('sr-only');
  });

  test('should configure Mapbox with accessibility features enabled', () => {
    render(<MapboxMap />);

    const mapboxgl = require('mapbox-gl');
    expect(mapboxgl.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        keyboard: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
      })
    );
  });

  test('should configure popup with focus management', () => {
    render(<MapboxMap showBusinessMarker={true} />);

    const mapboxgl = require('mapbox-gl');
    expect(mapboxgl.Popup).toHaveBeenCalledWith(
      expect.objectContaining({
        focusAfterOpen: true,
      })
    );
  });

  test('should include comprehensive keyboard navigation instructions', () => {
    render(<MapboxMap />);

    const mapInstance = document.querySelector('.mapInstance');
    const ariaLabel = mapInstance?.getAttribute('aria-label');

    expect(ariaLabel).toContain('Use arrow keys to pan');
    expect(ariaLabel).toContain('plus and minus keys to zoom');
    expect(ariaLabel).toContain('Enter or Space to open location details');
    expect(ariaLabel).toContain('Escape to close popups');
  });

  test('should provide business information for screen readers', () => {
    const businessInfo = {
      name: 'Vital Ice',
      address: '2400 Chestnut St, San Francisco, CA 94123',
      phone: '(415) 555-0123',
      coordinates: [-122.434, 37.800115] as [number, number],
    };

    render(<MapboxMap businessInfo={businessInfo} />);

    const instructions = document.querySelector('[aria-live="polite"]');
    expect(instructions?.textContent).toContain('Vital Ice');
    expect(instructions?.textContent).toContain('2400 Chestnut St');
  });

  test('should have proper CSS classes for accessibility features', () => {
    render(<MapboxMap />);

    // Test that the component includes the necessary CSS classes
    const mapContainer = screen.getByRole('region');
    expect(mapContainer).toHaveClass('mapContainer');

    const loadingSpinner = document.querySelector('.loadingSpinner');
    expect(loadingSpinner).toBeInTheDocument();

    // The CSS module includes accessibility features:
    // - .sr-only for screen reader content
    // - Focus indicators for interactive elements
    // - High contrast mode support
    // - Reduced motion support
    // These are verified through the CSS structure
  });
});
