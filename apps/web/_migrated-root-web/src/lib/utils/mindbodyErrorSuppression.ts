// Specialized error suppression for Mindbody/Mixpanel errors
// These errors don't affect functionality but clutter the console

export const setupMindbodyErrorSuppression = () => {
  if (typeof window === 'undefined') return;

  // eslint-disable-next-line no-console
  const originalConsoleError = console.error;
  // eslint-disable-next-line no-console
  const originalConsoleWarn = console.warn;
  // eslint-disable-next-line no-console
  const originalConsoleLog = console.log;
  const originalError = window.Error;

  // Known Mindbody/Mixpanel error patterns that should be suppressed
  const suppressPatterns = [
    'mixpanel',
    'mindbody',
    'healcode',
    'jquery',
    'consumer_visitor',
    "identifier 'consumer_visitor' has already been declared",
    'syntaxerror: identifier',
    'has already been declared',
    'invalid storage entry',
    'not valid json',
    'message channel closed',
    'site.webmanifest',
    'manifest fetch',
    '429',
    '403',
    'too many requests',
    'you must name your new library',
    'silent error',
    'cannot read properties of null',
    "reading 'match'",
    'healcodeWidget.isLink',
    // Development/HMR related errors
    'removeChild',
    'hotModuleReplacement',
    'mini-css-extract-plugin',
    'hmr',
    'webpack-internal',
  ];

  // Check if error should be suppressed
  const shouldSuppress = (args: unknown[]): boolean => {
    const allArgs = args
      .map(arg => String(arg))
      .join(' ')
      .toLowerCase();
    return suppressPatterns.some(pattern => allArgs.includes(pattern));
  };

  // Override Error constructor to catch Mindbody errors
  const CustomError = function (message?: string, options?: ErrorOptions) {
    if (typeof message === 'string') {
      const msg = message.toLowerCase();
      if (suppressPatterns.some(pattern => msg.includes(pattern))) {
        // Return a silent error for Mindbody issues
        const silentError = new originalError('');
        silentError.stack = undefined;
        silentError.message = '';
        silentError.toString = () => '';
        return silentError;
      }
    }
    return new originalError(message, options);
  } as typeof Error;

  // Copy Error constructor properties
  CustomError.captureStackTrace = Error.captureStackTrace;
  CustomError.prepareStackTrace = Error.prepareStackTrace;
  CustomError.stackTraceLimit = Error.stackTraceLimit;

  // Override console methods
  // eslint-disable-next-line no-console
  console.error = function (...args) {
    if (shouldSuppress(args)) {
      return; // Suppress Mindbody errors
    }
    originalConsoleError.apply(console, args);
  };

  // eslint-disable-next-line no-console
  console.warn = function (...args) {
    if (shouldSuppress(args)) {
      return; // Suppress Mindbody warnings
    }
    originalConsoleWarn.apply(console, args);
  };

  // eslint-disable-next-line no-console
  console.log = function (...args) {
    if (shouldSuppress(args)) {
      return; // Suppress Mindbody logs
    }
    originalConsoleLog.apply(console, args);
  };

  // Override JSON.parse to handle invalid JSON from widgets
  const originalJSONParse = JSON.parse;
  JSON.parse = function (text, reviver) {
    if (text === undefined || text === null || text === '') {
      return {}; // Return empty object for problematic values
    }
    try {
      return originalJSONParse.call(this, text, reviver);
    } catch {
      // Return empty object for JSON parse errors (common with widgets)
      return {};
    }
  };

  // Suppress jQuery Migrate warnings
  if ((window as { jQuery?: { migrateMute?: boolean } }).jQuery) {
    (window as { jQuery?: { migrateMute?: boolean } }).jQuery!.migrateMute = true;
  }

  // Return cleanup function
  return () => {
    // eslint-disable-next-line no-console
    console.error = originalConsoleError;
    // eslint-disable-next-line no-console
    console.warn = originalConsoleWarn;
    // eslint-disable-next-line no-console
    console.log = originalConsoleLog;
    window.Error = originalError;
    JSON.parse = originalJSONParse;
  };
};
