'use client';

import { createContext, useContext, ReactNode } from 'react';
import { GlobalSettings } from '@/lib/sanity/types';
import { TEMPLATE_BUSINESS, type BusinessInfo } from '@vital-ice/config';

interface GlobalSettingsContextType {
  globalSettings: GlobalSettings | null;
  businessInfo: BusinessInfo;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(undefined);

interface GlobalSettingsProviderProps {
  children: ReactNode;
  globalSettings?: GlobalSettings | null;
}

export const GlobalSettingsProvider = ({
  children,
  globalSettings,
}: GlobalSettingsProviderProps) => {
  // Use Sanity business info if available, otherwise fallback to static
  const businessInfo = globalSettings?.businessInfo || TEMPLATE_BUSINESS;

  return (
    <GlobalSettingsContext.Provider value={{ globalSettings, businessInfo }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  if (context === undefined) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
};

export default GlobalSettingsProvider;
