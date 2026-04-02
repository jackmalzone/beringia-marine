/**
 * Centralized framer-motion imports for bundle optimization
 * Import from here instead of directly from 'framer-motion'
 */

// Re-export only what we need to reduce bundle size
export {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useAnimation,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

// Re-export types
export type { Variants, Transition, MotionProps, MotionValue } from 'framer-motion';
