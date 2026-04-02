'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  getMapboxConfig,
  BUSINESS_LOCATION,
  type BusinessLocationData,
  // type MapboxConfig, // Unused type removed
} from '@/lib/config/mapbox';
import { mapboxPerformanceMonitor } from './MapboxPerformanceMonitor';
import styles from './MapboxMap.module.css';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// Performance optimization: Track active map instances to prevent memory leaks
const activeMapInstances = new Set<mapboxgl.Map>();

// Performance optimization: Debounce map initialization to prevent rapid re-renders
let mapInitializationTimeout: NodeJS.Timeout | null = null;

// Performance optimization: Generate unique map IDs for tracking
let mapInstanceCounter = 0;
const generateMapId = () => `mapbox-${Date.now()}-${++mapInstanceCounter}`;

export interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string | number;
  className?: string;
  showBusinessMarker?: boolean;
  businessInfo?: BusinessLocationData;
  onMapLoad?: () => void;
  onError?: () => void;
}

interface MapboxMapState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

// Performance optimization: Global cleanup function for all map instances
export const cleanupAllMapInstances = () => {
  activeMapInstances.forEach(mapInstance => {
    try {
      // Remove all event listeners - simplified approach
      try {
        mapInstance.remove();
      } catch {
        // Ignore errors during cleanup
      }
      mapInstance.remove();
    } catch (error) {
      // Silently handle cleanup errors
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Error during map cleanup:', error);
      }
    }
  });
  activeMapInstances.clear();
};

// Performance optimization: Cleanup on page unload
// Store references to prevent duplicate listeners in hot reload scenarios
let mapCleanupListenersAdded = false;
if (typeof window !== 'undefined' && !mapCleanupListenersAdded) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MapboxMap.tsx:67',message:'Global window listeners added at module level',data:{event:'beforeunload,pagehide',hasCleanup:true,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  window.addEventListener('beforeunload', cleanupAllMapInstances);
  window.addEventListener('pagehide', cleanupAllMapInstances);
  mapCleanupListenersAdded = true;
}

const MapboxMapCore: React.FC<MapboxMapProps> = ({
  center,
  zoom,
  height,
  className,
  showBusinessMarker = true,
  businessInfo = BUSINESS_LOCATION,
  onMapLoad,
  onError,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapId = useRef<string>(generateMapId());
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [state, setState] = useState<MapboxMapState>({
    isLoading: false,
    isLoaded: false,
    error: null,
  });

  const handleError = useCallback(
    (error: Error) => {
      // Performance monitoring: Record error
      mapboxPerformanceMonitor.recordError(mapId.current, error);

      // Log error for debugging in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Mapbox error:', error);
      }
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
        isLoaded: false,
      }));
      onError?.();
    },
    [onError]
  );

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      // Performance monitoring: Record retry
      mapboxPerformanceMonitor.recordRetry(mapId.current);

      setRetryCount(prev => prev + 1);
      setState(prev => ({
        ...prev,
        error: null,
        isLoading: false,
        isLoaded: false,
      }));
      // Force re-render by updating a dependency
      setTimeout(() => {
        setState(prev => ({ ...prev }));
      }, 100);
    }
  }, [retryCount]);

  // Performance optimization: Memoize map configuration to prevent unnecessary re-renders
  const mapConfig = useMemo(() => {
    try {
      return getMapboxConfig();
    } catch {
      // Handle error in the main useEffect instead
      return null;
    }
  }, []);

  // Performance optimization: Memoize popup HTML to prevent recreation on every render
  const popupHTML = useMemo(() => {
    if (!businessInfo) return '';

    return `
      <div class="mapbox-popup-content" role="dialog" aria-labelledby="popup-title-${mapId.current}" aria-describedby="popup-content-${mapId.current}">
        <div class="popup-header">
          <h3 class="popup-title" id="popup-title-${mapId.current}">${businessInfo.name}</h3>
        </div>
        <div class="popup-body" id="popup-content-${mapId.current}">
          <div class="popup-address" role="group" aria-label="Business address">
            <svg class="popup-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${businessInfo.address}</span>
          </div>
          ${
            businessInfo.phone
              ? `
            <div class="popup-phone" role="group" aria-label="Business phone">
              <svg class="popup-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <a href="tel:${businessInfo.phone}" class="popup-phone-link" aria-label="Call ${businessInfo.name} at ${businessInfo.phone}">${businessInfo.phone}</a>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }, [businessInfo]);

  // Accessibility: Handle keyboard navigation for map interactions
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!map.current || !state.isLoaded) return;

      const mapInstance = map.current;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          mapInstance.panBy([0, -50]);
          break;
        case 'ArrowDown':
          event.preventDefault();
          mapInstance.panBy([0, 50]);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          mapInstance.panBy([-50, 0]);
          break;
        case 'ArrowRight':
          event.preventDefault();
          mapInstance.panBy([50, 0]);
          break;
        case '+':
        case '=':
          event.preventDefault();
          mapInstance.zoomIn();
          break;
        case '-':
          event.preventDefault();
          mapInstance.zoomOut();
          break;
        case 'Enter':
        case ' ':
          if (markerRef.current && !isPopupOpen) {
            event.preventDefault();
            markerRef.current.togglePopup();
          }
          break;
        case 'Escape':
          if (isPopupOpen && popupRef.current) {
            event.preventDefault();
            popupRef.current.remove();
          }
          break;
      }
    },
    [state.isLoaded, isPopupOpen]
  );

  // Performance optimization: Cleanup function to properly dispose of map resources
  const cleanupMap = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    if (mapInitializationTimeout) {
      clearTimeout(mapInitializationTimeout);
      mapInitializationTimeout = null;
    }

    // Clean up popup and marker references
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (map.current) {
      // Remove from active instances tracking
      activeMapInstances.delete(map.current);

      // Remove all event listeners to prevent memory leaks
      try {
        // Just remove the map instance, it will clean up listeners automatically
      } catch {
        // Ignore errors during cleanup
      }

      // Properly dispose of the map instance
      map.current.remove();
      map.current = null;
    }

    // Performance monitoring: Cleanup tracking
    mapboxPerformanceMonitor.cleanup(mapId.current);

    setState({
      isLoading: false,
      isLoaded: false,
      error: null,
    });
    setIsPopupOpen(false);
  }, []);

  useEffect(() => {
    // Prevent multiple map instances
    if (map.current || !mapContainer.current || !mapConfig) return;

    // Performance monitoring: Start tracking
    mapboxPerformanceMonitor.startTracking(mapId.current);

    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Set the access token
      mapboxgl.accessToken = mapConfig.accessToken;

      // Check if Mapbox GL JS is supported
      if (!mapboxgl.supported()) {
        throw new Error(
          'Your browser does not support Mapbox GL JS. Please try using a modern browser.'
        );
      }

      // Performance optimization: Initialize map with optimized settings
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapConfig.defaultStyle,
        center: center || mapConfig.defaultCenter,
        zoom: zoom || mapConfig.defaultZoom,
        attributionControl: true,
        // Performance optimizations
        preserveDrawingBuffer: false, // Reduces memory usage
        antialias: false, // Improves performance on lower-end devices
        // optimizeForTerrain: false, // Not available in this version
        refreshExpiredTiles: false, // Minimizes unnecessary network requests
        // Accessibility optimizations
        keyboard: true, // Enable keyboard navigation
        doubleClickZoom: true, // Enable double-click zoom
        touchZoomRotate: true, // Enable touch gestures
      });

      const mapInstance = map.current;

      // Track active instance for cleanup
      activeMapInstances.add(mapInstance);

      // Performance optimization: Use passive event listeners where possible
      const handleMapLoad = () => {
        // Performance monitoring: Record initialization completion
        mapboxPerformanceMonitor.recordInitialization(mapId.current);

        setState(prev => ({
          ...prev,
          isLoading: false,
          isLoaded: true,
          error: null,
        }));
        onMapLoad?.();

        // Performance monitoring: Record load completion
        mapboxPerformanceMonitor.recordLoad(mapId.current);

        // Clear timeout when map loads successfully
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
      };

      const handleMapError = (e: mapboxgl.ErrorEvent) => {
        const errorMessage = e.error?.message || 'Unknown map error occurred';
        handleError(new Error(`Map initialization failed: ${errorMessage}`));
      };

      // Add event listeners
      mapInstance.once('load', handleMapLoad);
      mapInstance.on('error', handleMapError);

      // Performance optimization: Set a reasonable timeout for map loading
      loadTimeoutRef.current = setTimeout(() => {
        setState(currentState => {
          if (!currentState.isLoaded) {
            handleError(
              new Error(
                'Map loading timed out. Please check your internet connection and try again.'
              )
            );
          }
          return currentState;
        });
      }, 15000); // Increased to 15 seconds for better reliability

      // Performance optimization: Add business marker only after map loads
      if (showBusinessMarker && businessInfo) {
        mapInstance.once('load', () => {
          try {
            const marker = new mapboxgl.Marker({
              color: mapConfig.markerColor,
            })
              .setLngLat(businessInfo.coordinates)
              .addTo(mapInstance);

            // Store marker reference for accessibility
            markerRef.current = marker;

            // Only create popup if we have content
            if (popupHTML) {
              const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: false,
                className: 'custom-mapbox-popup',
                maxWidth: '300px', // Performance: Limit popup size
                focusAfterOpen: true, // Accessibility: Focus management
              }).setHTML(popupHTML);

              // Store popup reference for accessibility
              popupRef.current = popup;

              // Accessibility: Track popup state for keyboard navigation
              popup.on('open', () => {
                setIsPopupOpen(true);
                // Announce popup opening to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.className = styles.srOnly;
                announcement.textContent = `Business information popup opened for ${businessInfo.name}`;
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
              });

              popup.on('close', () => {
                setIsPopupOpen(false);
                // Return focus to map container when popup closes
                if (mapContainer.current) {
                  mapContainer.current.focus();
                }
              });

              marker.setPopup(popup);

              // Accessibility: Add marker element attributes after it's added to DOM
              setTimeout(() => {
                const markerElement = marker.getElement();
                if (markerElement) {
                  markerElement.setAttribute('role', 'button');
                  markerElement.setAttribute(
                    'aria-label',
                    `${businessInfo.name} location marker. Press Enter or Space to view business information.`
                  );
                  markerElement.setAttribute('tabindex', '0');
                  markerElement.style.cursor = 'pointer';

                  // Add keyboard support to marker
                  markerElement.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      marker.togglePopup();
                    }
                  });
                }
              }, 100);
            }
          } catch (markerError) {
            // Log marker error but don't fail the entire map
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.warn('Failed to add business marker:', markerError);
            }
          }
        });
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to initialize map'));
    }

    // Cleanup function with enhanced resource management
    return cleanupMap;
  }, [center, zoom, showBusinessMarker, businessInfo, onMapLoad, retryCount, mapConfig, popupHTML]);

  // Accessibility: Add keyboard event listeners
  useEffect(() => {
    const mapElement = mapContainer.current;
    if (mapElement && state.isLoaded) {
      mapElement.addEventListener('keydown', handleKeyDown);
      return () => {
        mapElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, state.isLoaded]);

  // Performance optimization: Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [cleanupMap]);

  // Handle container style
  const containerStyle: React.CSSProperties = {
    height: height || '400px',
  };

  // Render loading state
  if (state.isLoading || (!state.isLoaded && !state.error)) {
    return (
      <div
        className={`${styles.mapContainer} ${className || ''}`}
        style={containerStyle}
        role="region"
        aria-label="Interactive map"
      >
        <div className={styles.loadingState} role="status" aria-label="Loading interactive map">
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <div className={styles.loadingText}>Loading interactive map...</div>
        </div>
      </div>
    );
  }

  // Render error state with fallback content
  if (state.error) {
    return (
      <div
        className={`${styles.mapContainer} ${className || ''}`}
        style={containerStyle}
        role="region"
        aria-label="Map error - fallback content available"
      >
        <div className={styles.errorState}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon} aria-hidden="true">
              ⚠️
            </div>
            <div className={styles.errorMessage}>
              <h4>Map Unavailable</h4>
              <p>We&apos;re having trouble loading the interactive map.</p>
              {businessInfo && (
                <div
                  className={styles.fallbackContent}
                  role="complementary"
                  aria-labelledby="fallback-heading"
                >
                  <h5 id="fallback-heading">Visit Us At:</h5>
                  <div className={styles.businessInfo}>
                    <div className={styles.businessName}>{businessInfo.name}</div>
                    <div className={styles.businessAddress}>{businessInfo.address}</div>
                    {businessInfo.phone && (
                      <div className={styles.businessPhone}>
                        <a
                          href={`tel:${businessInfo.phone}`}
                          aria-label={`Call ${businessInfo.name} at ${businessInfo.phone}`}
                        >
                          {businessInfo.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  <div
                    className={styles.fallbackActions}
                    role="group"
                    aria-label="Map alternatives"
                  >
                    {retryCount < 3 && (
                      <button
                        onClick={handleRetry}
                        className={styles.retryButton}
                        type="button"
                        aria-label="Retry loading the interactive map"
                      >
                        Try Again
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionsButton}
                      aria-label={`Get directions to ${businessInfo.name} on Google Maps (opens in new tab)`}
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              )}
              {process.env.NODE_ENV === 'development' && (
                <details className={styles.errorDetails}>
                  <summary>Error Details</summary>
                  <code>{state.error}</code>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render map
  return (
    <div
      className={`${styles.mapContainer} ${className || ''}`}
      style={containerStyle}
      role="region"
      aria-label="Interactive map"
    >
      <div
        ref={mapContainer}
        className={styles.mapInstance}
        role="application"
        aria-label={`Interactive map showing ${businessInfo?.name || 'business'} location. Use arrow keys to pan, plus and minus keys to zoom, Enter or Space to open location details, and Escape to close popups.`}
        tabIndex={state.isLoaded ? 0 : -1}
        aria-describedby={`map-instructions-${mapId.current}`}
      />
      <div id={`map-instructions-${mapId.current}`} className={styles.srOnly} aria-live="polite">
        {state.isLoaded
          ? `Interactive map loaded. ${businessInfo?.name || 'Business'} is located at ${businessInfo?.address || 'the marked location'}. Use keyboard navigation: arrow keys to pan, plus/minus to zoom, Enter or Space to view details.`
          : 'Map is loading...'}
      </div>
    </div>
  );
};

// Export the core component for testing
export { MapboxMapCore };

// Performance optimization: Wrap with error boundary and memoization
export const MapboxMap = React.memo(MapboxMapCore);

// Set display name for debugging
MapboxMap.displayName = 'MapboxMap';
