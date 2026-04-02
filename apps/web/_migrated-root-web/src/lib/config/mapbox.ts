/**
 * Mapbox GL JS Configuration
 *
 * This file contains configuration settings for Mapbox integration,
 * including access token validation, default map settings, and business location data.
 */

import { VITAL_ICE_BUSINESS } from './business-info';

export interface MapboxConfig {
  accessToken: string;
  defaultStyle: string;
  defaultCenter: [number, number];
  defaultZoom: number;
  markerColor: string;
}

export interface BusinessLocationData {
  name: string;
  address: string;
  phone?: string;
  coordinates: [number, number];
}

/**
 * Validates that the Mapbox access token is available
 */
export function validateMapboxToken(): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!token) {
    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? 'Mapbox access token is missing. Check your .env.local file for NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.'
        : 'Mapbox access token is missing. Please contact support if this issue persists.';

    // eslint-disable-next-line no-console
    console.error('Mapbox Configuration Error:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      environment: process.env.NODE_ENV,
      availableEnvVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
    });

    throw new Error(errorMessage);
  }

  if (!token.startsWith('pk.')) {
    // eslint-disable-next-line no-console
    console.error('Invalid Mapbox token format:', { tokenPrefix: token.substring(0, 10) });
    throw new Error('Invalid Mapbox configuration. Please contact support if this issue persists.');
  }

  // Basic token format validation
  if (token.length < 50) {
    // eslint-disable-next-line no-console
    console.error('Mapbox token too short:', { tokenLength: token.length });
    throw new Error('Invalid Mapbox configuration. Please contact support if this issue persists.');
  }

  return token;
}

/**
 * Default Mapbox configuration settings
 */
export const MAPBOX_CONFIG: MapboxConfig = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  defaultStyle: 'mapbox://styles/jackmalzone/cmhzsb6s600ki01subx5w69nz',
  defaultCenter: [
    VITAL_ICE_BUSINESS.coordinates.longitude,
    VITAL_ICE_BUSINESS.coordinates.latitude,
  ],
  defaultZoom: 15,
  markerColor: '#0066cc',
};

/**
 * Business location data for map integration
 */
export const BUSINESS_LOCATION: BusinessLocationData = {
  name: VITAL_ICE_BUSINESS.name,
  address: `${VITAL_ICE_BUSINESS.address.street}, ${VITAL_ICE_BUSINESS.address.city}, ${VITAL_ICE_BUSINESS.address.state} ${VITAL_ICE_BUSINESS.address.zipCode}`,
  ...(VITAL_ICE_BUSINESS.phone && { phone: VITAL_ICE_BUSINESS.phone }),
  coordinates: [VITAL_ICE_BUSINESS.coordinates.longitude, VITAL_ICE_BUSINESS.coordinates.latitude],
};

/**
 * Utility function to get validated Mapbox configuration
 */
export function getMapboxConfig(): MapboxConfig {
  return {
    ...MAPBOX_CONFIG,
    accessToken: validateMapboxToken(),
  };
}
