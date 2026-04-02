'use client';

import { FC, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from '@/lib/motion';
import dynamic from 'next/dynamic';
import * as Sentry from '@sentry/nextjs';

// Dynamic import for VideoBackground to reduce initial bundle size
// SSR disabled: Component uses browser-only APIs (navigator, window, IntersectionObserver)
// SEO is handled via poster images and structured data, not server-rendered video elements
const VideoBackground = dynamic(
  () => import('@/components/ui/VideoBackground/VideoBackground'),
  {
    ssr: false,
    loading: () => <div className="video-loading" />,
  }
) as React.ComponentType<{
  videoSrc: string;
  webmSrc?: string;
  posterSrc?: string;
  overlayOpacity?: number;
  isActive?: boolean;
  onLoad?: () => void;
  ariaLabel?: string;
}>;
import { textRevealVariants, buttonVariants, springConfigs } from '@/lib/utils/animations';
import { usePerformance } from '@/lib/store/AppStore';
import { TEMPLATE_HERO_VIDEO, templateRaster } from '@/lib/config/template-assets';
import styles from './Hero.module.css';

// Video rotation uses local template-safe assets (same loop; posters vary for variety)
const VIDEOS = [0, 1, 2, 3, 4, 5, 6, 7].map((_, idx) => ({
  src: TEMPLATE_HERO_VIDEO.mp4,
  webm: TEMPLATE_HERO_VIDEO.webm,
  poster: templateRaster(idx),
  type: idx % 2 === 0 ? ('cold' as const) : ('hot' as const),
  textTheme:
    idx === 4
      ? ('highKey' as const)
      : ('standard' as const),
}));

// Enhanced text color schemes with better contrast and readability
const TEXT_THEMES = {
  standard: {
    headline: '#ffffff',
    subhead: 'rgba(255, 255, 255, 0.9)',
    button: '#ffffff',
    buttonBg: 'rgba(255, 255, 255, 0.12)',
    buttonBorder: 'rgba(255, 255, 255, 0.25)',
    textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
  },
  enhanced: {
    headline: '#ffffff',
    subhead: 'rgba(255, 255, 255, 0.9)',
    button: '#ffffff',
    buttonBg: 'rgba(255, 255, 255, 0.12)',
    buttonBorder: 'rgba(255, 255, 255, 0.25)',
    textShadow: '0 3px 12px rgba(0, 0, 0, 0.7)', // Stronger shadow for light backgrounds
  },
  highKey: {
    headline: '#1a365d',
    subhead: 'rgba(26, 54, 93, 0.85)',
    button: '#2c5282',
    buttonBg: 'rgba(44, 82, 130, 0.15)',
    buttonBorder: 'rgba(44, 82, 130, 0.35)',
    textShadow: '0 2px 8px rgba(255, 255, 255, 0.3)',
  },
};

const Hero: FC = () => {
  const { performanceProfile, updatePerformanceProfile } = usePerformance();
  const { currentVideoIndex } = performanceProfile;
  const { scrollYProgress } = useScroll();
  const currentVideoIndexRef = useRef(currentVideoIndex);

  // Get current video theme
  const currentVideo = VIDEOS[currentVideoIndex];
  const currentTheme =
    TEXT_THEMES[(currentVideo?.textTheme as keyof typeof TEXT_THEMES) || 'standard'];

  // Mobile-optimized: Remove scroll effects on mobile for better performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const blurAmount = useTransform(scrollYProgress, [0, 0.1], [isMobile ? 0 : 8, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, isMobile ? 1 : 0.8]);
  const textY = useTransform(scrollYProgress, [0, 0.1], [0, isMobile ? 0 : -20]);

  // Update ref when currentVideoIndex changes
  useEffect(() => {
    currentVideoIndexRef.current = currentVideoIndex;
  }, [currentVideoIndex]);

  // Simple video rotation - no complex performance detection
  useEffect(() => {
    return Sentry.startSpan(
      {
        op: 'ui.video_rotation',
        name: 'Hero Video Rotation Setup',
      },
      span => {
        span.setAttribute('video_count', VIDEOS.length);
        span.setAttribute('rotation_interval', '8000ms');

        const interval = setInterval(() => {
          Sentry.startSpan(
            {
              op: 'ui.video_switch',
              name: 'Video Switch',
            },
            switchSpan => {
              const currentIndex = currentVideoIndexRef.current;
              const nextIndex = (currentIndex + 1) % VIDEOS.length;
              switchSpan.setAttribute('from_index', currentIndex);
              switchSpan.setAttribute('to_index', nextIndex);
              updatePerformanceProfile({ currentVideoIndex: nextIndex });
            }
          );
        }, 8000);

        return () => {
          clearInterval(interval);
        };
      }
    );
  }, [updatePerformanceProfile]);

  // Performance optimization: Only render active video and next video (preload next)
  // This prevents all 8 videos from loading simultaneously (saves ~112MB)
  const activeIndex = currentVideoIndex;
  const nextIndex = (activeIndex + 1) % VIDEOS.length;
  const videosToRender = [activeIndex, nextIndex];

  return (
    <section id="home" className={styles.hero}>
      {/* Only render active video and next video for preloading - lazy load others */}
      {videosToRender.map(index => {
        const video = VIDEOS[index];
        return (
          <VideoBackground
            key={`${video.src}-${index === activeIndex ? 'active' : 'next'}`}
            videoSrc={video.src}
            webmSrc={video.webm}
            posterSrc={video.poster}
            overlayOpacity={0}
            isActive={index === activeIndex}
            ariaLabel={`${video.type} ambient background video ${index + 1}`}
          />
        );
      })}

      <div className={styles.hero__gradientOverlay} aria-hidden="true" />

      {/* Animated Blue Blob Overlay */}
      <motion.div
        className={styles.hero__blueBlob}
        animate={{
          x: [0, -20, 20, -10, 0],
          scaleX: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      <div className={styles.hero__content}>
        <motion.div
          className={styles.hero__textContainer}
          style={{
            filter: `blur(${blurAmount}px)`,
            opacity: textOpacity,
            y: textY,
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
        >
          <motion.div
            className={styles.hero__location}
            style={{
              color: currentTheme.subhead,
              textShadow: currentTheme.textShadow,
            }}
            variants={textRevealVariants}
            transition={{
              ...springConfigs.gentle,
              duration: 0.8,
            }}
          >
            SAN FRANCISCO
          </motion.div>

          <motion.div
            role="heading"
            aria-level={1}
            className={styles.hero__headline}
            style={{
              color: currentTheme.headline,
              textShadow: currentTheme.textShadow,
            }}
            variants={textRevealVariants}
            transition={{
              ...springConfigs.responsive,
              duration: 0.8,
            }}
          >
            Live Better — Together.
          </motion.div>

          <motion.button
            className={styles.hero__button}
            style={{
              color: currentTheme.button,
              background: currentTheme.buttonBg,
              borderColor: currentTheme.buttonBorder,
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{
              ...springConfigs.responsive,
              duration: 0.6,
            }}
            onClick={useCallback(() => {
              // Try to scroll to the form container first, fallback to section
              const formContainer = document.getElementById('newsletter-form');
              const newsletterSection = document.getElementById('newsletter');
              const targetElement = formContainer || newsletterSection;
              
              if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });
              }
            }, [])}
          >
            <motion.span
              className={styles.hero__buttonText}
              whileHover={{ scale: 1.02 }}
              transition={springConfigs.quick}
            >
              <span className={styles.hero__buttonTextHover}>COMING SOON</span>
              <span className={styles.hero__buttonTextDefault}>Stay In The Loop</span>
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.hero__scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className={styles.hero__scrollIndicatorContainer}>
          <motion.div
            className={styles.hero__scrollIndicatorDot}
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
