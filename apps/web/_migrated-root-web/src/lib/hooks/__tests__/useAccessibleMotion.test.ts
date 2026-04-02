import { renderHook } from '@testing-library/react';
import { useAccessibleMotion } from '../useAccessibleMotion';
import * as motion from '@/lib/motion';

// Mock the useReducedMotion hook
jest.mock('@/lib/motion', () => ({
  useReducedMotion: jest.fn(),
}));

describe('useAccessibleMotion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return shouldReduceMotion as false when motion is not reduced', () => {
    (motion.useReducedMotion as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useAccessibleMotion());

    expect(result.current.shouldReduceMotion).toBe(false);
    expect(result.current.transition).toBeUndefined();
    expect(result.current.variants).toBeUndefined();
  });

  it('should return shouldReduceMotion as true when motion is reduced', () => {
    (motion.useReducedMotion as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAccessibleMotion());

    expect(result.current.shouldReduceMotion).toBe(true);
    expect(result.current.transition).toEqual({ duration: 0.01 });
    expect(result.current.variants).toEqual({
      hidden: {},
      visible: {},
      hover: {},
      tap: {},
    });
  });

  it('should provide instant transitions when reduced motion is preferred', () => {
    (motion.useReducedMotion as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAccessibleMotion());

    expect(result.current.transition?.duration).toBe(0.01);
  });

  it('should provide empty animation variants when reduced motion is preferred', () => {
    (motion.useReducedMotion as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAccessibleMotion());

    expect(result.current.variants?.hidden).toEqual({});
    expect(result.current.variants?.visible).toEqual({});
    expect(result.current.variants?.hover).toEqual({});
    expect(result.current.variants?.tap).toEqual({});
  });
});
