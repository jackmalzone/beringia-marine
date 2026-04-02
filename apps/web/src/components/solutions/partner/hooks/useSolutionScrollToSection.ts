'use client';

import { useEffect } from 'react';

/**
 * Migration `useScrollToSection`: when the URL hash targets a section, scroll it into view.
 * Offsets are handled by `scroll-margin-top` on section anchors (see shell.module.css).
 */
export function useSolutionScrollToSection(partnerSlug: string) {
  useEffect(() => {
    const run = () => {
      const raw = window.location.hash.replace(/^#/, '');
      if (!raw) return;
      const el = document.getElementById(raw);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const t0 = window.setTimeout(run, 120);
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(run);
    });
    window.addEventListener('hashchange', run);
    return () => {
      window.clearTimeout(t0);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener('hashchange', run);
    };
  }, [partnerSlug]);
}
