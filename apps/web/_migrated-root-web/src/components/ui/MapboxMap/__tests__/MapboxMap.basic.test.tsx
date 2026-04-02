import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapboxMap } from '../MapboxMap';

// Mock mapbox-gl to prevent actual map loading
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
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
    accessToken: 'pk.test-token',
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

describe('MapboxMap Basic Functionality', () => {
  it('renders without crashing', () => {
    render(<MapboxMap />);
    expect(screen.getByText('Loading interactive map...')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { container } = render(
      <MapboxMap height="500px" className="custom-map" showBusinessMarker={false} />
    );

    const mapContainer = container.querySelector('[class*="mapContainer"]');
    expect(mapContainer).toHaveStyle({ height: '500px' });
    expect(mapContainer).toHaveClass('custom-map');
  });

  it('has proper CSS classes for styling', () => {
    const { container } = render(<MapboxMap />);

    expect(container.querySelector('[class*="mapContainer"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="loadingState"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="loadingSpinner"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="loadingText"]')).toBeInTheDocument();
  });
});
