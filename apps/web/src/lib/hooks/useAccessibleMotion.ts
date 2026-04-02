'use client';

import { useReducedMotion } from '@/lib/motion';

/**
 * Hook to check if animations should be reduced for accessibility
 * Respects user's prefers-reduced-motion system preference
 *
 * @returns Object with shouldReduceMotion boolean and transition configs
 */
export function useAccessibleMotion() {
  const shouldReduceMotion = useReducedMotion();

  return {
    shouldReduceMotion,
    // Provide instant transitions when motion should be reduced
    transition: shouldReduceMotion ? { duration: 0.01 } : undefined,
    // Provide no animation variants when motion should be reduced
    variants: shouldReduceMotion
      ? {
          hidden: {},
          visible: {},
          hover: {},
          tap: {},
        }
      : undefined,
  };
}
