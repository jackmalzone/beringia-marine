'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BUSINESS_LOCATION } from '@/lib/config/mapbox';
import styles from './MapboxMap.module.css';

const BUSINESS_ZOOM = 17; // Higher zoom for more precise location view

export default function MapboxMapComponent() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      // Mapbox access token is required (removed console.error for production build)
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // Try different coordinates for 2400 Chestnut St, San Francisco, CA
    const EXACT_COORDINATES: [number, number] = [-122.443, 37.8001]; // [lng, lat] - simplified

    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: EXACT_COORDINATES,
      zoom: BUSINESS_ZOOM,
      style: 'mapbox://styles/jackmalzone/cmhzsb6s600ki01subx5w69nz',
    });

    // Add business marker following the implementation guide - basic approach first
    new mapboxgl.Marker({ color: '#00b7b5' })
      .setLngLat(EXACT_COORDINATES)
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div>
            <h3>Vital Ice</h3>
            <p>2400 Chestnut St<br>San Francisco, CA 94123</p>
          </div>
        `)
      )
      .addTo(mapRef.current);

    mapRef.current.on('load', () => {
      setIsLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div className={styles.mapWrapper}>
      {!isLoaded && (
        <div className={styles.loadingState} role="status" aria-label="Loading interactive map">
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <div className={styles.loadingText}>Loading map...</div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className={styles.mapContainer}
        style={{ opacity: isLoaded ? 1 : 0, height: '400px' }}
        role="application"
        aria-label={`Interactive map showing ${BUSINESS_LOCATION.name} location. Use arrow keys to pan, plus and minus keys to zoom.`}
        tabIndex={isLoaded ? 0 : -1}
      />
    </div>
  );
}
