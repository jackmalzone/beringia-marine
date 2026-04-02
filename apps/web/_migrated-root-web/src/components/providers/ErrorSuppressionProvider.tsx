'use client';

import { useEffect } from 'react';
import { setupMindbodyErrorSuppression } from '@/lib/utils/mindbodyErrorSuppression';

interface ErrorSuppressionProviderProps {
  children: React.ReactNode;
}

export default function ErrorSuppressionProvider({ children }: ErrorSuppressionProviderProps) {
  useEffect(() => {
    // Setup specialized Mindbody error suppression
    const cleanup = setupMindbodyErrorSuppression();

    // Cleanup function
    return cleanup;
  }, []);

  return <>{children}</>;
}
