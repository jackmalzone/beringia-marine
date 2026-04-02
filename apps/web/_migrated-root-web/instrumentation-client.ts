// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://87a54d85ac4fa0d12bba04869c5fa53e@o4509843732496384.ingest.us.sentry.io/4509843734265856',

  // Enable performance monitoring
  tracesSampleRate: 1.0,

  // Enable profiling
  profileSessionSampleRate: 1.0, // Profile 100% of sessions
  profileLifecycle: 'trace', // Enable profiling during active traces

  // Enable browser profiling
  profilesSampleRate: 1.0, // Profile 100% of transactions

  // Set trace propagation targets for better performance tracking
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  // Enable session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  // Integrations for better error tracking
  integrations: [
    // Send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
    // Browser performance monitoring
    Sentry.browserTracingIntegration(),
    // Browser profiling integration for detailed performance analysis
    Sentry.browserProfilingIntegration(),
    // User feedback integration for collecting user reports
    Sentry.feedbackIntegration({
      // Disable the auto-injected button
      autoInject: false,
      colorScheme: 'system',
      isEmailRequired: true,
      isNameRequired: true,
      showBranding: false,
      formTitle: 'Report a Problem',
      submitButtonLabel: 'Submit Report',
      cancelButtonLabel: 'Cancel',
      successMessageText: 'Thank you for your feedback!',
      emailPlaceholder: 'Your email address',
      namePlaceholder: 'Your name',
      commentPlaceholder: 'What went wrong?',
      theme: {
        colors: {
          primary: '#00b7b5',
        },
      },
    }),
  ],

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Debug mode for development
  debug: false, // Disable debug in all environments to prevent warnings

  // Capture unhandled promise rejections
  attachStacktrace: true,

  // Filter out common noise
  beforeSend(event) {
    // Filter out favicon errors
    if (event.request?.url?.includes('favicon.ico')) {
      return null;
    }

    // Filter out common video errors
    if (event.exception?.values?.[0]?.value?.includes('video')) {
      return null;
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
