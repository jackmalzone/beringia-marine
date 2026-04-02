'use client';

import { FC, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import Image from 'next/image';
import { getBestVideoSource } from '@/lib/utils/videoFormat';
import { usePerformance } from '@/lib/store/AppStore';
import styles from './AdaptiveMedia.module.css';

interface AdaptiveMediaProps {
  videoSources: {
    high?: string;
    medium?: string;
    low?: string;
    webm?: string; // WebM format for better mobile performance
  };
  imageSource: string;
  alt: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const AdaptiveMedia: FC<AdaptiveMediaProps> = ({
  videoSources,
  imageSource,
  alt,
  className = '',
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoad,
  onError,
}) => {
  // Simple video format detection
  const videoSource = getBestVideoSource(videoSources);
  const mediaSource = videoSource || imageSource;
  const mediaType = videoSource ? 'video' : 'image';
  const strategy = { useVideo: !!videoSource };
  const isLoading = false;
  const { performanceProfile, setPreferredVideoFormat, setMediaError } = usePerformance();
  const { preferredVideoFormat, hasMediaError } = performanceProfile;

  // Detect preferred video format based on device and performance
  useEffect(() => {
    const detectPreferredFormat = () => {
      const video = document.createElement('video');

      // Test WebM support
      const canPlayWebM = video.canPlayType('video/webm; codecs="vp8, vorbis"');
      const canPlayWebM9 = video.canPlayType('video/webm; codecs="vp9"');

      // Mobile detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Performance detection
      const isLowEndDevice = navigator.hardwareConcurrency <= 4;
      const hasSlowConnection =
        (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
          ?.effectiveType === 'slow-2g' ||
        (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
          ?.effectiveType === '2g';

      // Prefer WebM for mobile, low-end devices, or slow connections
      if (
        (isMobile || isLowEndDevice || hasSlowConnection) &&
        (canPlayWebM !== '' || canPlayWebM9 !== '')
      ) {
        setPreferredVideoFormat('webm');
      } else {
        setPreferredVideoFormat('mp4');
      }
    };

    detectPreferredFormat();
  }, [setPreferredVideoFormat]);

  // Get optimal video source based on strategy and format preference
  const getOptimalVideoSource = () => {
    if (!strategy?.useVideo) return null;

    // If WebM is preferred and available, use it
    if (preferredVideoFormat === 'webm' && videoSources.webm) {
      return videoSources.webm;
    }

    // Otherwise use the strategy-based source
    return mediaSource;
  };

  const optimalVideoSource = getOptimalVideoSource();

  // Fallback to image if video fails
  const handleVideoError = () => {
    setMediaError(true);
    onError?.();
  };

  const handleVideoLoad = () => {
    onLoad?.();
  };

  const handleImageLoad = () => {
    onLoad?.();
  };

  const handleImageError = () => {
    setMediaError(true);
    onError?.();
  };

  // Reset error state when media source changes
  useEffect(() => {
    setMediaError(false);
  }, [mediaSource, setMediaError]);

  if (isLoading) {
    return (
      <div className={`${styles.loading} ${className}`}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  // If video failed or strategy doesn't use video, show image
  if (mediaType === 'image' || hasMediaError) {
    return (
      <motion.div
        className={`${styles.imageContainer} ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={imageSource}
          alt={alt}
          fill
          className={styles.image}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
    );
  }

  // Show video with fallback
  return (
    <motion.div
      className={`${styles.videoContainer} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {!hasMediaError ? (
          <motion.video
            key="video"
            className={styles.video}
            poster={poster || imageSource}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline={playsInline}
            preload="metadata"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* WebM format for better mobile performance - prioritize if preferred */}
            {preferredVideoFormat === 'webm' && videoSources.webm && (
              <source src={videoSources.webm} type="video/webm" />
            )}
            {/* MP4 fallback - always include for compatibility */}
            <source src={optimalVideoSource || mediaSource} type="video/mp4" />
            {/* Image fallback */}
            <Image
              src={imageSource}
              alt={alt}
              fill
              className={styles.fallbackImage}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.video>
        ) : (
          <motion.div
            key="fallback-image"
            className={styles.fallbackImageContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={imageSource}
              alt={alt}
              fill
              className={styles.fallbackImage}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance indicator (debug mode) - removed to reduce console spam */}
    </motion.div>
  );
};

export default AdaptiveMedia;
