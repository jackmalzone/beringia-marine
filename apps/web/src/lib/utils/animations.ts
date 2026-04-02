'use client';

// Dynamic import for Lenis to reduce initial bundle size
import { Variants } from '@/lib/motion';

// Initialize Lenis for smooth scrolling with dynamic import
export const setupSmoothScroll = async () => {
  try {
    const { default: Lenis } = await import('lenis');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return lenis;
  } catch {
    // Lenis not available, return null
    return null;
  }
};

// Spring configurations for different animation types
export const springConfigs = {
  // Gentle, organic spring for subtle animations
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
    mass: 0.8,
  },

  // Responsive spring for interactive elements
  responsive: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    mass: 0.5,
  },

  // Bouncy spring for playful animations
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
    mass: 0.8,
  },

  // Smooth spring for page transitions
  smooth: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 30,
    mass: 1,
  },

  // Quick spring for micro-interactions
  quick: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
    mass: 0.3,
  },

  // Heavy spring for dramatic effects
  heavy: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 18,
    mass: 1.2,
  },
};

// Fade in animations with spring physics
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...springConfigs.gentle,
      duration: 0.6,
    },
  },
};

// Stagger fade in for lists
export const staggerFadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Scale animations with spring physics
export const scaleVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      ...springConfigs.responsive,
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      ...springConfigs.quick,
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      ...springConfigs.quick,
      duration: 0.1,
    },
  },
};

// Slide animations with spring physics
export const slideVariants = {
  // Slide from left
  slideLeft: {
    hidden: {
      x: -50,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        ...springConfigs.smooth,
        duration: 0.6,
      },
    },
  },

  // Slide from right
  slideRight: {
    hidden: {
      x: 50,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        ...springConfigs.smooth,
        duration: 0.6,
      },
    },
  },

  // Slide from bottom
  slideUp: {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ...springConfigs.gentle,
        duration: 0.7,
      },
    },
  },

  // Slide from top
  slideDown: {
    hidden: {
      y: -50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ...springConfigs.gentle,
        duration: 0.7,
      },
    },
  },
};

// Parallax scroll animations with spring physics
export const parallaxVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ...springConfigs.heavy,
      duration: 1,
    },
  },
};

// Card hover animations with spring physics
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springConfigs.responsive,
      duration: 0.5,
    },
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      ...springConfigs.quick,
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      ...springConfigs.quick,
      duration: 0.1,
    },
  },
};

// Button animations with spring physics
export const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...springConfigs.responsive,
      duration: 0.4,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      ...springConfigs.quick,
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      ...springConfigs.quick,
      duration: 0.1,
    },
  },
};

// Text reveal animations with spring physics
export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...springConfigs.gentle,
      duration: 0.6,
    },
  },
};

// Stagger text reveal for paragraphs
export const staggerTextVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Floating animation with spring physics
export const floatVariants: Variants = {
  hidden: {
    y: 0,
  },
  visible: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pulse animation with spring physics
export const pulseVariants: Variants = {
  hidden: {
    scale: 1,
  },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Rotate animation with spring physics
export const rotateVariants: Variants = {
  hidden: {
    rotate: 0,
  },
  visible: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Page transition animations
export const pageTransitionVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...springConfigs.smooth,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      ...springConfigs.quick,
      duration: 0.3,
    },
  },
};

// Modal animations with spring physics
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...springConfigs.responsive,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      ...springConfigs.quick,
      duration: 0.2,
    },
  },
};

// Utility function to create custom spring animations
export const createSpringAnimation = (
  stiffness: number = 100,
  damping: number = 20,
  mass: number = 1
) => ({
  type: 'spring' as const,
  stiffness,
  damping,
  mass,
});

// Utility function for staggered animations
export const createStaggerAnimation = (
  staggerDelay: number = 0.1,
  childAnimation: Variants = fadeInVariants
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.2,
    },
  },
  ...childAnimation,
});

// Export all variants for easy access
export const animations = {
  fadeIn: fadeInVariants,
  scale: scaleVariants,
  slide: slideVariants,
  parallax: parallaxVariants,
  card: cardVariants,
  button: buttonVariants,
  textReveal: textRevealVariants,
  staggerText: staggerTextVariants,
  float: floatVariants,
  pulse: pulseVariants,
  rotate: rotateVariants,
  pageTransition: pageTransitionVariants,
  modal: modalVariants,
  springConfigs,
};

// GSAP functions removed - not used anywhere in the app
