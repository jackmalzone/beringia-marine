'use client';

import { useEffect, useRef, useState } from 'react';

const EDGE_PX = 8;
const DELTA_PX = 8;

/**
 * Hides the fixed sub-nav only when the user scrolls up; stays visible while scrolling down.
 * At (or very near) the top of the page the bar is always shown.
 */
export function useClientNavScrollContext() {
  const [navHidden, setNavHidden] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const y = window.scrollY;
        const dy = y - lastYRef.current;
        lastYRef.current = y;

        if (y <= EDGE_PX) {
          setNavHidden(false);
        } else if (dy < -DELTA_PX) {
          setNavHidden(true);
        } else if (dy > DELTA_PX) {
          setNavHidden(false);
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { navHidden };
}
