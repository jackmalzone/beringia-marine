'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  DEFAULT_DEPTH_ZONE,
  type DepthZone,
  isDepthZone,
} from '@/lib/depth-zones';

const MAIN_SELECTOR = 'main[data-home-page]';
const SECTION_SELECTOR = `${MAIN_SELECTOR} [data-depth]`;

const IO_THRESHOLDS = [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1];
const ROOT_MARGIN = '-18% 0px -48% 0px';

/**
 * Hysteresis margin: a new zone must beat the current zone's ratio by this
 * amount before a switch occurs. Prevents oscillation at section boundaries.
 */
const HYSTERESIS = 0.06;

function applyDepthZone(zone: DepthZone) {
  document.documentElement.setAttribute('data-home-depth', zone);
}

function clearHomeDepth() {
  document.documentElement.removeAttribute('data-home-depth');
}

/**
 * Tracks `[data-depth]` sections on the homepage and sets `html[data-home-depth]`
 * for CSS-driven header / accent tuning. No context — inspect in DevTools on <html>.
 */
export default function HomepageDepthObserver() {
  const pathname = usePathname();
  const ratiosRef = useRef<Map<Element, number>>(new Map());
  const lastZoneRef = useRef<DepthZone>(DEFAULT_DEPTH_ZONE);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (pathname !== '/') {
      clearHomeDepth();
      ratiosRef.current.clear();
      return;
    }

    lastZoneRef.current = DEFAULT_DEPTH_ZONE;
    applyDepthZone(lastZoneRef.current);

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
    );
    if (sections.length === 0) {
      return () => { clearHomeDepth(); };
    }

    const ratios = ratiosRef.current;
    sections.forEach((el) => ratios.set(el, 0));

    const pickZone = (): DepthZone => {
      let bestEl: HTMLElement | null = null;
      let bestRatio = 0;
      let currentRatio = 0;

      for (const el of sections) {
        const r = ratios.get(el) ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          bestEl = el;
        }
        if (isDepthZone(el.dataset.depth) && el.dataset.depth === lastZoneRef.current) {
          currentRatio = r;
        }
      }

      if (!bestEl || bestRatio < 0.02) return lastZoneRef.current;

      const raw = bestEl.dataset.depth;
      if (!isDepthZone(raw)) return lastZoneRef.current;
      if (raw === lastZoneRef.current) return lastZoneRef.current;

      if (bestRatio - currentRatio < HYSTERESIS) return lastZoneRef.current;

      return raw;
    };

    const sync = () => {
      const next = pickZone();
      if (next !== lastZoneRef.current) {
        lastZoneRef.current = next;
        applyDepthZone(next);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(sync);
      },
      {
        root: null,
        rootMargin: ROOT_MARGIN,
        threshold: IO_THRESHOLDS,
      }
    );

    sections.forEach((el) => observer.observe(el));
    sync();

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      sections.forEach((el) => ratios.delete(el));
      clearHomeDepth();
    };
  }, [pathname]);

  return null;
}
