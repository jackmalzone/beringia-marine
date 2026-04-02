'use client';

import { FC, useEffect, useState, useRef, useCallback } from 'react';
import * as Sentry from '@sentry/nextjs';
import styles from './VideoBackground.module.css';

// Detect connection speed for format optimization
const getConnectionSpeed = (): 'slow' | 'fast' => {
  if (typeof window === 'undefined') return 'fast';
  
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  if (!connection) return 'fast';
  
  const effectiveType = connection.effectiveType;
  return effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'fast';
};

export interface VideoBackgroundProps {
  videoSrc: string;
  webmSrc?: string;
  posterSrc?: string;
  overlayOpacity?: number;
  isActive?: boolean;
  onLoad?: () => void;
  ariaLabel?: string;
}

type VideoState = 'idle' | 'loading' | 'ready' | 'playing' | 'error' | 'paused';

const VideoBackground: FC<VideoBackgroundProps> = ({
  videoSrc,
  webmSrc,
  posterSrc,
  overlayOpacity = 0.5,
  isActive = true,
  onLoad,
  ariaLabel = 'Background video',
}) => {
  const [state, setState] = useState<VideoState>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const playAttemptRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<VideoState>('idle');

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Safe state setter that only updates if component is mounted
  const setStateSafe = useCallback((newState: VideoState) => {
    if (isMountedRef.current) {
      stateRef.current = newState;
      setState(newState);
    }
  }, []);

  // Determine optimal source order based on device and connection
  const getSourceOrder = useCallback(() => {
    if (typeof window === 'undefined') {
      // SSR: Default to MP4 first for Safari compatibility
      return { mp4First: true };
    }

    const connectionSpeed = getConnectionSpeed();
    const isMobile = window.innerWidth <= 768;
    
    // Prefer WebM for mobile or slow connections (better compression)
    // Prefer MP4 for desktop fast connections (better compatibility)
    return {
      mp4First: !isMobile && connectionSpeed === 'fast',
      preferWebM: isMobile || connectionSpeed === 'slow',
    };
  }, []);

  const sourceOrder = getSourceOrder();

  // Intersection Observer for viewport-based loading
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    intersectionObserverRef.current = new IntersectionObserver(
      entries => {
        if (!isMountedRef.current) return;
        const entry = entries[0];
        const currentState = stateRef.current;
        if (entry.isIntersecting && isActive && currentState === 'idle') {
          // Video is in viewport and active - start loading
          setStateSafe('loading');
          video.load();
        } else if (!entry.isIntersecting && currentState !== 'idle') {
          // Video is out of viewport - pause and reset
          video.pause();
          setStateSafe('paused');
        }
      },
      {
        root: null,
        rootMargin: '50px', // Start loading slightly before entering viewport
        threshold: 0.1,
      }
    );

    intersectionObserverRef.current.observe(container);

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [isActive, setStateSafe]);

  // Attempt to play video - defined outside useEffect to avoid closure issues
  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isActive || !isMountedRef.current) return;

    // Check current state via ref to avoid stale closure
    if (stateRef.current === 'playing') return;

    try {
      // Reset to start if needed
      if (video.currentTime > 0.1) {
        video.currentTime = 0;
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        await playPromise;
        if (isMountedRef.current && videoRef.current === video) {
          setStateSafe('playing');
          playAttemptRef.current = 0;
        }
      }
    } catch (error) {
      // Autoplay blocked - normal behavior, will play on user interaction
      if (!isMountedRef.current) return;
      playAttemptRef.current += 1;
      if (playAttemptRef.current < 3) {
        // Retry after a short delay (for cases where video becomes ready after initial attempt)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          const currentVideo = videoRef.current;
          if (isMountedRef.current && currentVideo && isActive && currentVideo.readyState >= 2) {
            attemptPlay();
          }
        }, 500);
      }
    }
  }, [isActive, state, setStateSafe]);

  // Handle video loading and playback state machine
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // State machine transitions
    const handleLoadedData = () => {
      if (!isMountedRef.current) return;
      setStateSafe('ready');
      if (isActive) {
        attemptPlay();
      }
    };

    const handleCanPlay = () => {
      if (!isMountedRef.current) return;
      setStateSafe('ready');
      if (isActive && video.paused) {
        attemptPlay();
      }
    };

    const handlePlay = () => {
      if (!isMountedRef.current) return;
      setStateSafe('playing');
    };

    const handlePause = () => {
      if (!isMountedRef.current) return;
      const currentState = stateRef.current;
      if (isActive && currentState !== 'error') {
        setStateSafe('paused');
      }
    };

    const handleError = () => {
      if (!isMountedRef.current) return;
      setStateSafe('error');
      const error = video.error;
      if (error && error.code !== 2 && error.code !== 3) {
        // Only log serious errors (not network/decode errors)
        Sentry.captureException(new Error(`Video error: ${error.message || 'Unknown error'}`), {
          tags: {
            component: 'VideoBackground',
            video_src: videoSrc,
            error_code: error.code?.toString() || 'unknown',
          },
          extra: {
            errorCode: error.code,
            errorMessage: error.message,
            networkState: video.networkState,
            readyState: video.readyState,
            currentSrc: video.currentSrc,
          },
        });
      }
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Handle active/inactive state
    const currentState = stateRef.current;
    if (isActive) {
      if (currentState === 'idle' || currentState === 'paused') {
        // Start loading if not already loaded
        if (video.readyState === 0) {
          setStateSafe('loading');
          video.load();
        } else if (video.readyState >= 2 && video.paused) {
          // Video is ready but paused - try to play
          attemptPlay();
        }
      }
    } else {
      // Pause when inactive
      if (currentState === 'playing') {
        video.pause();
        setStateSafe('paused');
      }
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive, videoSrc, setStateSafe, attemptPlay]);

  // Handle user interaction for autoplay-blocked videos
  useEffect(() => {
    const currentState = stateRef.current;
    if (!isActive || currentState === 'playing') return;

    const handleUserInteraction = async () => {
      if (!isMountedRef.current) return;
      const video = videoRef.current;
      const currentState = stateRef.current;
      if (!video || (currentState !== 'ready' && currentState !== 'paused')) return;

      try {
        await video.play();
        if (isMountedRef.current) {
          setStateSafe('playing');
        }
      } catch (error) {
        // Silently handle autoplay errors
      }
    };

    const events = ['touchstart', 'click', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isActive, setStateSafe]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Call onLoad callback when video is ready
  useEffect(() => {
    if (state === 'ready' && onLoad) {
      onLoad();
    }
  }, [state, onLoad]);

  const isPlaying = state === 'playing';
  const hasError = state === 'error';

  return (
    <div ref={containerRef} className={styles.videoContainer}>
      <video
        ref={videoRef}
        autoPlay={isActive}
        muted
        loop
        playsInline
        preload={isActive ? 'metadata' : 'none'}
        poster={posterSrc}
        className={`${styles.video} ${isActive ? styles.active : styles.inactive}`}
        aria-label={ariaLabel}
        role="img"
        aria-hidden="true"
        style={{
          willChange: isActive ? 'auto' : 'none',
        }}
      >
        {/* Optimize source order: WebM first for mobile/slow connections, MP4 first for desktop/fast */}
        {sourceOrder.preferWebM && webmSrc ? (
          <>
            <source src={webmSrc} type="video/webm" />
            <source src={videoSrc} type="video/mp4" />
          </>
        ) : (
          <>
            <source src={videoSrc} type="video/mp4" />
            {webmSrc && <source src={webmSrc} type="video/webm" />}
          </>
        )}
      </video>

      {/* Error state indicator */}
      {hasError && (
        <div className={styles.errorIcon} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            <path
              d="M12 8V12M12 16H12.01"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <div
        className={styles.overlay}
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        aria-hidden="true"
      />
      <div className={styles.bottomGradient} aria-hidden="true" />
    </div>
  );
};

export default VideoBackground;














