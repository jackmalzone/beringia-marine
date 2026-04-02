// Jest setup file for @vital-ice/ui package

require('@testing-library/jest-dom');

// Mock fetch globally if not available
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

// Mock window if not available
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to silence console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

