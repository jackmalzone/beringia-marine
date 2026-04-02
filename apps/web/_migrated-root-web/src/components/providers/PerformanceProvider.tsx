'use client';

import { FC, ReactNode, useEffect } from 'react';
import { performanceManager } from '@/lib/performance/PerformanceManager';

interface PerformanceProviderProps {
  children: ReactNode;
}

/**
 * Performance Provider - Initializes all performance optimizations
 * This should be placed high in the component tree
 */
export const PerformanceProvider: FC<PerformanceProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize performance manager on client side
    performanceManager.initialize();

    // Cleanup on unmount
    return () => {
      performanceManager.cleanup();
    };
  }, []);

  return <>{children}</>;
};
