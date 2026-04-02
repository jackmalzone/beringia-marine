'use client';

import { useEffect } from 'react';
import MetaPageViewTracker from '@/components/analytics/MetaPageViewTracker';
import type { AnalyticsConfig } from '@/lib/analytics/config';
import { initializeMetaPixel } from '@/lib/utils/metaPixel';

interface AnalyticsBootProps {
  analyticsConfig: AnalyticsConfig;
}

export default function AnalyticsBoot({ analyticsConfig }: AnalyticsBootProps) {
  const canTrack = analyticsConfig.enabled && !analyticsConfig.consentRequired;

  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;
    (window as Window & { __analyticsConfig?: AnalyticsConfig }).__analyticsConfig = analyticsConfig;
  }, [analyticsConfig]);

  useEffect(() => {
    if (!canTrack || !analyticsConfig.metaPixelId) return;
    initializeMetaPixel(analyticsConfig.metaPixelId);
  }, [canTrack, analyticsConfig.metaPixelId]);

  return <MetaPageViewTracker enabled={canTrack && Boolean(analyticsConfig.metaPixelId)} />;
}
