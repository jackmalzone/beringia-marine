'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen/LoadingScreen';

interface NavigationLoadingContextType {
  startNavigation: () => void;
  isLoading: boolean;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined);

export const useNavigationLoading = () => {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error('useNavigationLoading must be used within NavigationLoadingProvider');
  }
  return context;
};

interface NavigationLoadingProviderProps {
  children: React.ReactNode;
}

export default function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle initial page load
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
        setHasInitialized(true);
      }, 2000); // Shorter initial load time

      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // Remove automatic navigation loading - only use manual startNavigation

  const startNavigation = useCallback(() => {
    // Only start navigation loading if we're past the initial load
    if (hasInitialized && !isInitialLoad && !isLoading) {
      setIsLoading(true);

      // Auto-stop loading after 800ms
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      // Return cleanup function
      return () => clearTimeout(timer);
    }
  }, [hasInitialized, isInitialLoad, isLoading]);

  const handleInitialComplete = useCallback(() => {
    // This will be called by LoadingScreen when initial load completes
    setIsInitialLoad(false);
    setHasInitialized(true);
  }, []);

  const handleNavigationComplete = useCallback(() => {
    // This will be called by LoadingScreen when navigation load completes
    setIsLoading(false);
  }, []);

  const value = {
    startNavigation,
    isLoading: isInitialLoad || isLoading,
  };

  if (isInitialLoad) {
    return <LoadingScreen onComplete={handleInitialComplete} duration={2000} />;
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleNavigationComplete} duration={800} />;
  }

  return (
    <NavigationLoadingContext.Provider value={value}>{children}</NavigationLoadingContext.Provider>
  );
}
