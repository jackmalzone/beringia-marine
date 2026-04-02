'use client';

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Delay before reveal in ms — used for stagger effects */
  delay?: number;
  as?: 'div' | 'section' | 'article';
}

/**
 * Lightweight scroll-triggered reveal. Adds `data-revealed` when the element
 * enters the viewport, letting CSS handle the animation. No runtime animation
 * frames — just one IntersectionObserver per mount.
 */
export default function ScrollReveal({
  children,
  className,
  style,
  delay = 0,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => el.setAttribute('data-revealed', ''), delay);
          } else {
            el.setAttribute('data-revealed', '');
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
