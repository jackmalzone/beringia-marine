'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackMetaPixelPageView } from '@/lib/utils/metaPixel';

interface MetaPageViewTrackerProps {
  enabled: boolean;
}

export const MetaPageViewTracker = ({ enabled }: MetaPageViewTrackerProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastEventRef = useRef<{ key: string; ts: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const query = searchParams.toString();
    const eventKey = `${pathname}${query ? `?${query}` : ''}`;
    const now = Date.now();

    // Guard strict-mode duplicate effects for the same route.
    if (lastEventRef.current?.key === eventKey && now - lastEventRef.current.ts < 350) {
      return;
    }

    lastEventRef.current = { key: eventKey, ts: now };
    trackMetaPixelPageView();
  }, [enabled, pathname, searchParams]);

  return null;
};

export default MetaPageViewTracker;
