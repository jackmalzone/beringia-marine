/**
 * Lenis smooth scrolling initialization and configuration
 * @see https://github.com/studio-freight/lenis
 */

import Lenis from '@studio-freight/lenis';

/**
 * Custom easing function for smooth scrolling
 * Cubic bezier easing for natural feel
 */
const customEasing = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Initialize Lenis smooth scrolling
 * @returns Lenis instance with cleanup function
 */
export function initLenis(): { lenis: Lenis; cleanup: () => void } {
  // Create Lenis instance with configuration
  const lenis = new Lenis({
    duration: 1.5,
    easing: customEasing,
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    smoothTouch: false, // Disable on touch devices for better native feel
    touchMultiplier: 2,
    infinite: false,
    touchInertiaMultiplier: 35,
  });

  // Animation frame loop for smooth scroll
  let rafId: number;

  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  // Start the animation loop
  rafId = requestAnimationFrame(raf);

  // Cleanup function to destroy instance and cancel animation frame
  const cleanup = () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
  };

  return { lenis, cleanup };
}

/**
 * Scroll to a specific target with Lenis
 * @param lenis - Lenis instance
 * @param target - Target element, selector, or scroll position
 * @param options - Scroll options
 */
export function scrollTo(
  lenis: Lenis,
  target: number | string | HTMLElement,
  options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
    onComplete?: () => void;
  }
): void {
  lenis.scrollTo(target, options);
}

/**
 * Get current scroll progress (0-1)
 * @param lenis - Lenis instance
 * @returns Scroll progress as a number between 0 and 1
 */
export function getScrollProgress(lenis: Lenis): number {
  if (lenis.limit === 0) return 0;
  return lenis.scroll / lenis.limit;
}
