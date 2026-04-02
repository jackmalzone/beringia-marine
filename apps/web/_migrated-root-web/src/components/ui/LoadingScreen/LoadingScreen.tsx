'use client';

import { useEffect } from 'react';
import VILogo from '@/components/ui/Logo/VILogo';
import { useLoading } from '@/lib/store/AppStore';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete: () => void;
  duration?: number; // in milliseconds
}

export default function LoadingScreen({ onComplete, duration = 4000 }: LoadingScreenProps) {
  const { isLoading, loadingProgress, setLoadingProgress, startLoading, completeLoading } =
    useLoading();

  useEffect(() => {
    // Reset state when component mounts
    startLoading();
    setLoadingProgress(0);

    let currentProgress = 0;
    const stepDuration = Math.max(10, duration / 100); // Ensure minimum 10ms intervals

    // Start the loading progress with proper state management
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      setLoadingProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        // Small delay to ensure the 100% state is visible
        setTimeout(() => {
          completeLoading();
          onComplete();
        }, 100);
      }
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
    };
  }, [duration, onComplete, setLoadingProgress, startLoading, completeLoading]);

  // Don't render if not visible
  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.loadingScreen}>
      {/* Background */}
      <div className={styles.background} />

      {/* Logo */}
      <div className={styles.logoContainer}>
        <VILogo
          width={200}
          height={120}
          color="#00b7b5"
          strokeWidth={2}
          className={styles.loadingLogo}
        />
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.max(0, Math.min(100, loadingProgress))}%`,
              opacity: loadingProgress > 0 ? 1 : 0,
            }}
          />
        </div>
        <div className={styles.progressText}>
          {Math.max(0, Math.min(100, Math.round(loadingProgress)))}%
        </div>
      </div>
    </div>
  );
}
