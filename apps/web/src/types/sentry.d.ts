/**
 * Sentry type declarations for global window object
 */

declare global {
  interface Window {
    Sentry?: {
      captureException: (
        error: Error,
        context?: {
          tags?: Record<string, string>;
          extra?: Record<string, unknown>;
        }
      ) => void;
      captureMessage: (
        message: string,
        context?: {
          level?: 'info' | 'warning' | 'error';
          tags?: Record<string, string>;
          extra?: Record<string, unknown>;
        }
      ) => void;
    };
  }

  // For server-side usage
  namespace globalThis {
    const Sentry:
      | {
          captureException: (
            error: Error,
            context?: {
              tags?: Record<string, string>;
              extra?: Record<string, unknown>;
            }
          ) => void;
        }
      | undefined;
  }
}

export {};
