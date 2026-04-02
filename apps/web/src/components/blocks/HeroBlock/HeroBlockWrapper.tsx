'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { HeroBlock as HeroBlockType } from '@/lib/sanity/types';
import { buildImageUrl } from '@/lib/sanity/image';
import styles from './HeroBlock.module.css';

// Dynamic import for VideoBackground
const VideoBackground = dynamic(() => import('@/components/ui/VideoBackground/VideoBackground'), {
  loading: () => <div className="video-loading" />,
});

interface HeroBlockWrapperProps {
  children: ReactNode;
  data: HeroBlockType;
}

/**
 * Client component wrapper that handles background media and adds structure
 * Wraps server-rendered content to add background and animations
 */
export default function HeroBlockWrapper({ children, data }: HeroBlockWrapperProps) {
  const { backgroundVideo, backgroundImage } = data;

  return (
    <section id="home" className={styles.hero}>
      {/* Background Media */}
      {backgroundVideo ? (
        <VideoBackground videoSrc={backgroundVideo} overlayOpacity={0} isActive={true} />
      ) : backgroundImage ? (
        <div
          className={styles.hero__backgroundImage}
          style={{
            backgroundImage: `url(${buildImageUrl(backgroundImage, { width: 1920, height: 1080, quality: 85 })})`,
          }}
        />
      ) : null}

      <div className={styles.hero__gradientOverlay} aria-hidden="true" />

      {children}

      {/* Scroll indicator */}
      {/* TODO: Move scroll indicator to client wrapper if needed */}
    </section>
  );
}
