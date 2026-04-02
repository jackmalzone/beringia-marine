import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MapboxMap } from '../MapboxMap';

// Mock mapbox-gl
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn((event, callback) => {
      // Simulate map load event
      if (event === 'load') {
        setTimeout(callback, 100);
      }
    }),
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
  accessToken: '',
}));

// Mock the mapbox config
jest.mock('@/lib/config/mapbox', () => ({
  getMapboxConfig: jest.fn(() => ({
    accessToken: 'pk.test-token',
    defaultStyle: 'mapbox://styles/jackmalzone/cmhzsb6s600ki01subx5w69nz',
    defaultCenter: [-122.434, 37.800115],
    defaultZoom: 15,
    markerColor: '#0066cc',
  })),
  BUSINESS_LOCATION: {
    name: 'Vital Ice',
    address: '2400 Chestnut St, San Francisco, CA 94123',
    phone: '(415) 555-0123',
    coordinates: [-122.434, 37.800115],
  },
}));

describe('MapboxMap Integration', () => {
  it('integrates with business location data correctly', () => {
    const { container } = render(
      <MapboxMap
        center={[-122.434, 37.800115]}
        zoom={15}
        height="400px"
        showBusinessMarker={true}
      />
    );

    // Should render without errors
    expect(container.firstChild).toBeInTheDocument();

    // Should have the correct height
    const mapContainer = container.firstChild as HTMLElement;
    expect(mapContainer).toHaveStyle({ height: '400px' });
  });

  it('can be used as a drop-in replacement for iframe', () => {
    // This test verifies that the component can replace the existing Google Maps iframe
    const { container } = render(
      <div style={{ width: '100%', height: '400px' }}>
        <MapboxMap height="400px" className="mapFrame" />
      </div>
    );

    expect(container.querySelector('.mapFrame')).toBeInTheDocument();
  });
});
