'use client';

import { motion, useInView, Variants } from '@/lib/motion';
import { useRef } from 'react';
import {
  fadeInVariants,
  slideVariants,
  scaleVariants,
  parallaxVariants,
  springConfigs,
} from '@/lib/utils/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | 'fadeIn'
    | 'slideLeft'
    | 'slideRight'
    | 'slideUp'
    | 'slideDown'
    | 'scale'
    | 'parallax';
  delay?: number;
  duration?: number;
  springConfig?: keyof typeof springConfigs;
  threshold?: number;
  once?: boolean;
  as?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration,
  springConfig = 'gentle',
  threshold = 0.1,
  once = true,
  as = 'section',
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, {
    amount: threshold,
    once,
    margin: '-100px 0px -100px 0px',
  });

  const getVariants = () => {
    const baseVariants = {
      fadeIn: fadeInVariants,
      scale: scaleVariants,
      parallax: parallaxVariants,
      ...slideVariants,
    };

    const selectedVariant = baseVariants[animation];

    if (!selectedVariant) return fadeInVariants;

    // Customize the transition with spring physics
    const customTransition = {
      ...springConfigs[springConfig],
      delay,
      ...(duration && { duration }),
    };

    return {
      ...selectedVariant,
      visible: {
        ...selectedVariant.visible,
        transition: customTransition,
      },
    };
  };

  // Safely get motion component, fallback to motion.div if invalid
  const MotionComponent =
    (motion[as as keyof typeof motion] as React.ComponentType<any>) || motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={animation === 'scale' ? 'hover' : undefined}
      whileTap={animation === 'scale' ? 'tap' : undefined}
    >
      {children}
    </MotionComponent>
  );
};

export default AnimatedSection;
