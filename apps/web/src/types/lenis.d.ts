/**
 * Type definitions for Lenis smooth scrolling library
 * @see https://github.com/studio-freight/lenis
 */

declare module 'lenis' {
  export interface LenisOptions {
    duration?: number;
    easing?: (_t: number) => number;
    direction?: 'vertical' | 'horizontal';
    gestureDirection?: 'vertical' | 'horizontal' | 'both';
    smooth?: boolean;
    mouseMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
    wheelEventsTarget?: HTMLElement | Window;
    eventsTarget?: HTMLElement | Window;
    smoothWheel?: boolean;
    syncTouch?: boolean;
    syncTouchLerp?: number;
    touchInertiaMultiplier?: number;
    orientation?: 'vertical' | 'horizontal';
    lerp?: number;
  }

  export default class Lenis {
    constructor(_options?: LenisOptions);

    /**
     * Scroll to a target
     */
    scrollTo(
      _target: number | string | HTMLElement,
      _options?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        easing?: (_t: number) => number;
        lerp?: number;
        onComplete?: () => void;
      }
    ): void;

    /**
     * Start the smooth scroll
     */
    start(): void;

    /**
     * Stop the smooth scroll
     */
    stop(): void;

    /**
     * Destroy the instance
     */
    destroy(): void;

    /**
     * Update the scroll
     */
    raf(_time: number): void;

    /**
     * Add event listener
     */
    on(_event: 'scroll', _callback: (_e: LenisScrollEvent) => void): void;

    /**
     * Remove event listener
     */
    off(_event: 'scroll', _callback: (_e: LenisScrollEvent) => void): void;

    /**
     * Current scroll position
     */
    scroll: number;

    /**
     * Animation frame ID
     */
    animatedScroll: number;

    /**
     * Target scroll position
     */
    targetScroll: number;

    /**
     * Scroll velocity
     */
    velocity: number;

    /**
     * Whether scrolling is smooth
     */
    isSmooth: boolean;

    /**
     * Whether currently scrolling
     */
    isScrolling: boolean;

    /**
     * Scroll limit
     */
    limit: number;
  }

  export interface LenisScrollEvent {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
  }
}
