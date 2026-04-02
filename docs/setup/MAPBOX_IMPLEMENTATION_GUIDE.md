# Mapbox Implementation Guide for Contact Page

This guide provides comprehensive instructions for implementing Mapbox GL JS in a React/Next.js application, specifically for the contact page map functionality.

## Overview

Mapbox GL JS is a JavaScript library that uses WebGL to render interactive maps from vector tiles and Mapbox styles. This implementation will replace any existing map solution on the contact page with a modern, performant Mapbox-powered map.

## Prerequisites

- React/Next.js application
- Mapbox account and access token
- npm or yarn package manager

## Installation

Install the required Mapbox GL JS package:

```bash
npm install mapbox-gl
```

## Basic Implementation Steps

### 1. Create Map Container Element

The first step is to create a container element where the map will be rendered. Mapbox GL JS works by adding a map to an existing DOM element, typically a `div`.

#### Component Structure (React/Next.js)

```jsx
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './MapComponent.module.css';

function MapComponent() {
  return (
    <>
      <div id="map-container" className={styles.mapContainer} />
    </>
  );
}

export default MapComponent;
```

#### CSS Styling

Create proper CSS to ensure the map container has dimensions:

```css
/* MapComponent.module.css */
.mapContainer {
  height: 400px; /* or desired height */
  width: 100%;
  border-radius: 8px; /* optional styling */
}

/* For full-screen maps */
.fullScreenContainer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

/* Sidebar for map controls (optional) */
.sidebar {
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  margin: 12px;
  border-radius: 4px;
}

/* Reset button styling (optional) */
.resetButton {
  position: absolute;
  top: 50px;
  z-index: 1;
  left: 12px;
  padding: 4px 10px;
  border-radius: 10px;
  cursor: pointer;
}
```

**Important Warning**: A common pitfall is adding a map to a container that has no height. Always ensure your map container is properly styled with explicit dimensions.

### 2. Add Mapbox GL JS Map

#### Basic Map Implementation

```jsx
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './MapComponent.module.css';

// Configuration constants
const INITIAL_CENTER = [-74.0242, 40.6941]; // [longitude, latitude]
const INITIAL_ZOOM = 10.12;

function MapComponent() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken = 'your-mapbox-access-token-here';

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/jackmalzone/cmhzsb6s600ki01subx5w69nz', // Custom Vital Ice map style
    });

    // Cleanup function
    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} className={styles.mapContainer} />
    </>
  );
}

export default MapComponent;
```

#### Key Configuration Options

- **container**: Reference to the DOM element where the map will be rendered
- **center**: Initial center coordinates as `[longitude, latitude]`
- **zoom**: Initial zoom level (0 = world view, 22 = street level)
- **style**: Map style URL (optional, defaults to Mapbox's default style)

### 3. Respond to Map Events

Add interactivity by listening to map events and updating component state:

```jsx
useEffect(() => {
  mapboxgl.accessToken = 'your-mapbox-access-token-here';

  mapRef.current = new mapboxgl.Map({
    container: mapContainerRef.current,
    center: center,
    zoom: zoom,
  });

  // Listen for map movement events
  mapRef.current.on('move', () => {
    // Get current center coordinates and zoom level
    const mapCenter = mapRef.current.getCenter();
    const mapZoom = mapRef.current.getZoom();

    // Update component state
    setCenter([mapCenter.lng, mapCenter.lat]);
    setZoom(mapZoom);
  });

  return () => {
    mapRef.current.remove();
  };
}, []);

// Display current coordinates (optional)
return (
  <>
    <div className={styles.sidebar}>
      Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
    </div>
    <div id="map-container" ref={mapContainerRef} className={styles.mapContainer} />
  </>
);
```

### 4. Control Map from External Events

Add external controls to manipulate the map programmatically:

```jsx
const handleResetClick = () => {
  mapRef.current.flyTo({
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
  });
};

return (
  <>
    <div className={styles.sidebar}>
      Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
    </div>
    <button className={styles.resetButton} onClick={handleResetClick}>
      Reset
    </button>
    <div id="map-container" ref={mapContainerRef} className={styles.mapContainer} />
  </>
);
```

## Advanced Features

### Adding Markers

```jsx
useEffect(() => {
  // ... map initialization code ...

  // Add a marker
  new mapboxgl.Marker().setLngLat([-74.0242, 40.6941]).addTo(mapRef.current);
}, []);
```

### Custom Popup

```jsx
const popup = new mapboxgl.Popup({ closeOnClick: false })
  .setLngLat([-74.0242, 40.6941])
  .setHTML('<h3>Business Location</h3><p>Visit us here!</p>')
  .addTo(mapRef.current);
```

## Custom Markers

### Creating Custom HTML Markers

Instead of using the default Mapbox marker, you can create custom HTML elements for more control over styling and appearance.

#### Step 1: Create Custom Marker Element

```jsx
// Create a custom marker element
const createCustomMarker = () => {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.style.backgroundImage =
    'url(https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png)';
  el.style.width = '50px';
  el.style.height = '50px';
  el.style.backgroundSize = 'cover';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  return el;
};
```

#### Step 2: Add Custom Marker to Map

```jsx
useEffect(() => {
  // ... map initialization ...

  // Create custom marker element
  const markerElement = createCustomMarker();

  // Add custom marker to map
  new mapboxgl.Marker(markerElement)
    .setLngLat(BUSINESS_LOCATION)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3>Vital Ice Recovery</h3>
          <p>Visit our location</p>
        `)
    )
    .addTo(mapRef.current);
}, []);
```

#### Step 3: CSS Styling for Custom Markers

```css
/* Add to your CSS module or global styles */
.custom-marker {
  background-image: url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.custom-marker:hover {
  transform: scale(1.1);
}

/* Custom popup styling */
.mapboxgl-popup {
  max-width: 200px;
}

.mapboxgl-popup-content {
  text-align: center;
  font-family: 'Open Sans', sans-serif;
  padding: 16px;
  border-radius: 8px;
}
```

### Multiple Custom Markers with GeoJSON

For multiple locations, you can use GeoJSON data to define marker positions and properties:

#### Step 1: Define GeoJSON Data

```jsx
const businessLocations = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.4341, 37.8001], // [longitude, latitude]
      },
      properties: {
        title: 'Vital Ice Recovery',
        description: '2400 Chestnut St, San Francisco, CA 94123',
        phone: '+1-415-555-0123',
        type: 'main-location',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749], // Another location
      },
      properties: {
        title: 'Vital Ice Downtown',
        description: 'Downtown Location',
        phone: '+1-415-555-0124',
        type: 'branch-location',
      },
    },
  ],
};
```

#### Step 2: Create Markers from GeoJSON

```jsx
useEffect(() => {
  // ... map initialization ...

  // Add markers for each feature in the GeoJSON
  for (const feature of businessLocations.features) {
    // Create custom marker element
    const el = document.createElement('div');
    el.className = `custom-marker ${feature.properties.type}`;

    // Different styling based on location type
    if (feature.properties.type === 'main-location') {
      el.style.backgroundColor = '#00b7b5';
      el.style.width = '60px';
      el.style.height = '60px';
    } else {
      el.style.backgroundColor = '#9ec7c5';
      el.style.width = '40px';
      el.style.height = '40px';
    }

    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.border = '3px solid #ffffff';
    el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';

    // Create marker with popup
    new mapboxgl.Marker(el)
      .setLngLat(feature.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="custom-popup">
              <h3>${feature.properties.title}</h3>
              <p>${feature.properties.description}</p>
              ${feature.properties.phone ? `<p><a href="tel:${feature.properties.phone}">Call: ${feature.properties.phone}</a></p>` : ''}
            </div>
          `)
      )
      .addTo(mapRef.current);
  }
}, []);
```

### Advanced Custom Marker with React Component

For more complex markers, you can render React components as markers:

```jsx
import { createRoot } from 'react-dom/client';

// Custom marker component
const CustomMarkerComponent = ({ location, onClick }) => (
  <div
    className="react-marker"
    onClick={() => onClick(location)}
    style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#00b7b5',
      border: '3px solid white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '12px',
    }}
  >
    {location.name.charAt(0)}
  </div>
);

// In your useEffect
useEffect(() => {
  // ... map initialization ...

  const markerContainer = document.createElement('div');
  const root = createRoot(markerContainer);

  root.render(
    <CustomMarkerComponent
      location={BUSINESS_LOCATION}
      onClick={location => {
        console.log('Marker clicked:', location);
      }}
    />
  );

  new mapboxgl.Marker(markerContainer)
    .setLngLat(BUSINESS_LOCATION.coordinates)
    .addTo(mapRef.current);
}, []);
```

### Animated Custom Markers

Add animations and interactions to your custom markers:

```css
.animated-marker {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00b7b5, #9ec7c5);
  cursor: pointer;
  position: relative;
  animation: pulse 2s infinite;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.animated-marker::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 183, 181, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 183, 181, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 183, 181, 0);
  }
}

.animated-marker:hover {
  transform: scale(1.1);
  animation-play-state: paused;
}
```

### Best Practices for Custom Markers

1. **Performance**: Limit the number of custom HTML markers for better performance
2. **Accessibility**: Add proper ARIA labels and keyboard navigation
3. **Responsive Design**: Ensure markers scale appropriately on different screen sizes
4. **Loading States**: Show loading indicators while marker assets load
5. **Error Handling**: Provide fallbacks if custom marker images fail to load

```jsx
// Accessible custom marker
const createAccessibleMarker = location => {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${location.name} location marker`);
  el.setAttribute('tabindex', '0');

  // Keyboard navigation
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Trigger popup or action
    }
  });

  return el;
};
```

## Business Location Configuration

For the contact page implementation, you'll want to center the map on your business location:

```jsx
// Update these coordinates to your business location
const BUSINESS_LOCATION = [-122.434, 37.800115]; // Vital Ice: 2400 Chestnut St, San Francisco
const BUSINESS_ZOOM = 15; // Appropriate zoom for business view

// Add business marker
useEffect(() => {
  // ... map initialization ...

  // Add business location marker
  new mapboxgl.Marker({ color: '#FF0000' })
    .setLngLat(BUSINESS_LOCATION)
    .setPopup(
      new mapboxgl.Popup().setHTML(
        '<div><h3>Vital Ice Recovery</h3><p>Visit our location</p></div>'
      )
    )
    .addTo(mapRef.current);
}, []);
```

## Performance Considerations

### Billing Awareness

- Mapbox GL JS usage is billed by map loads
- A map load occurs each time the component mounts and the Map's `load` event fires
- Consider persisting the map component to avoid multiple map loads per user session

### Optimization Tips

- Use appropriate zoom levels for your use case
- Implement proper cleanup in `useEffect` return function
- Consider lazy loading the map component if it's not immediately visible

## Location Helper

Use Mapbox's Location Helper tool to find appropriate coordinates and zoom levels for your specific location: [Mapbox Location Helper](https://docs.mapbox.com/help/interactive-tools/location-helper/)

## Access Token Setup

1. Create a Mapbox account at [mapbox.com](https://mapbox.com)
2. Navigate to your Account page
3. Create a new access token or use the default public token
4. Add the token to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token_here
```

```jsx
// Use in component
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
```

## Integration with Contact Page

For the contact page specifically:

1. Replace existing map implementation with Mapbox component
2. Center map on business location
3. Add business marker with popup containing contact information
4. Style to match existing page design
5. Ensure responsive design for mobile devices
6. Add appropriate loading states and error handling

## Complete Example for Contact Page

```jsx
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './ContactMap.module.css';

const BUSINESS_LOCATION = [-122.434, 37.800115]; // Vital Ice: 2400 Chestnut St, San Francisco
const BUSINESS_ZOOM = 15;

export default function ContactMap() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      console.error('Mapbox access token is required');
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: BUSINESS_LOCATION,
      zoom: BUSINESS_ZOOM,
      style: 'mapbox://styles/jackmalzone/cmhzsb6s600ki01subx5w69nz',
    });

    // Add business marker
    new mapboxgl.Marker({ color: '#0066cc' })
      .setLngLat(BUSINESS_LOCATION)
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="${styles.popupContent}">
            <h3>Vital Ice Recovery</h3>
            <p>123 Business Street<br>City, State 12345</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        `)
      )
      .addTo(mapRef.current);

    mapRef.current.on('load', () => {
      setIsLoaded(true);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <div className={styles.mapWrapper}>
      {!isLoaded && <div className={styles.loadingState}>Loading map...</div>}
      <div
        ref={mapContainerRef}
        className={styles.mapContainer}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
}
```

This implementation provides a solid foundation for integrating Mapbox into your contact page with proper error handling, loading states, and business-specific customization.
