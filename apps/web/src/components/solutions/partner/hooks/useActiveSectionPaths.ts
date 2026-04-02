'use client';

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

/**
 * Migration `useActiveSection(sectionRefs)`: returns the path key for the section
 * whose top has crossed under the header + fixed sub-nav band.
 */
export function useActiveSectionPaths(
  sectionRefs: Record<string, RefObject<HTMLElement | null>>,
  orderedPaths: readonly string[]
) {
  const [activePath, setActivePath] = useState<string>(() => orderedPaths[0] ?? '');

  useEffect(() => {
    setActivePath(orderedPaths[0] ?? '');
  }, [orderedPaths.join('\0')]);

  useEffect(() => {
    if (orderedPaths.length === 0) return;

    const measure = () => {
      const headerEl = document.querySelector('header');
      const navEl = document.querySelector('[data-client-subnav]');
      const headerH = headerEl?.getBoundingClientRect().height ?? 96;
      const navH = navEl?.getBoundingClientRect().height ?? 96;
      const topOffsetPx = headerH + navH + 4;

      let current = orderedPaths[0];
      for (const path of orderedPaths) {
        const el = sectionRefs[path]?.current;
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= topOffsetPx) {
          current = path;
        }
      }
      setActivePath((prev) => (prev === current ? prev : current));
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [orderedPaths.join('\0'), sectionRefs]);

  return activePath;
}
