'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  useEffect(() => {
    if (!isInitialLoad) return;
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      setHasInitialized(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [isInitialLoad]);

  const startNavigation = useCallback(() => {
    if (hasInitialized && !isInitialLoad && !isLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [hasInitialized, isInitialLoad, isLoading]);

  const value = {
    startNavigation,
    isLoading: isInitialLoad || isLoading,
  };

  return (
    <NavigationLoadingContext.Provider value={value}>{children}</NavigationLoadingContext.Provider>
  );
}
