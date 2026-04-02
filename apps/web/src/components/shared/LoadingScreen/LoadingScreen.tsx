'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';

const PHRASES = [
  'Initializing marine systems...',
  'Calibrating navigation sensors...',
  'Establishing ocean connectivity...',
  'Loading hydrographic data...',
  'Configuring autonomous systems...',
  'Optimizing sonar arrays...',
  'Mapping ocean intelligence...',
  'Syncing marine networks...',
  'Deploying underwater solutions...',
  'Processing bathymetric data...',
  'Analyzing subsea telemetry...',
  'Initializing ROV systems...',
  'Configuring multibeam arrays...',
  'Loading acoustic profiles...',
  'Calibrating depth sensors...',
] as const;

function pickRandom(current: string): string {
  const pool = PHRASES.filter((p) => p !== current);
  return pool[Math.floor(Math.random() * pool.length)];
}

interface LoadingScreenProps {
  /** Minimum time (ms) before the screen can dismiss. Default 2400. */
  minDuration?: number;
  onComplete?: () => void;
}

export default function LoadingScreen({
  minDuration = 2400,
  onComplete,
}: LoadingScreenProps) {
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [dismissed, setDismissed] = useState(false);

  const dismiss = useCallback(() => {
    setDismissed(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(dismiss, minDuration);
    const interval = setInterval(() => {
      setPhrase((prev) => pickRandom(prev));
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [minDuration, dismiss]);

  return (
    <div
      className={`${styles.container} ${dismissed ? styles.out : ''}`}
      aria-live="polite"
      role="status"
    >
      <div className={styles.logoWrap}>
        <Image
          src="/assets/beringia/logo-white-transparent.png"
          alt="Beringia Marine"
          width={360}
          height={360}
          className={styles.logo}
          priority
        />
        <span className={styles.pulse} aria-hidden="true" />
        <span className={styles.pulse2} aria-hidden="true" />
      </div>

      <div className={styles.phrases}>
        <span className={styles.phrase} key={phrase}>
          {phrase}
        </span>
      </div>
    </div>
  );
}
