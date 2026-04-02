/**
 * Testing Utilities - renderWithProviders
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Render component with providers
 * Extend this as needed for your app's providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
