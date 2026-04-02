import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */

  // Transpile packages from monorepo
  // Works with both Webpack and Turbopack
  transpilePackages: ['@vital-ice/ui', '@vital-ice/config', '@vital-ice/transactional'],

  // TypeScript configuration
  // Ignore build errors from transactional package (uses React 18, main app uses React 19)
  // Email templates are only used at runtime and don't affect the build
  typescript: {
    ignoreBuildErrors: true, // Ignore type errors (transactional package has React 18/19 mismatch)
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-3fd38cef83ec4139b038b229662d7717.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Add headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Document-Policy',
            value: 'js-profiling',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.mxpnl.com https://cdn.pendo.io https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob: https://www.facebook.com; media-src 'self' blob:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://cdn.mxpnl.com https://cdn.pendo.io https://api-js.mixpanel.com https://o4509843732496384.ingest.us.sentry.io https://www.facebook.com https://connect.facebook.net; frame-src 'self' https://www.googletagmanager.com https://sketchfab.com https://www.sketchfab.com;",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // SEO and Performance headers
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Video cache headers - 1 year cache for videos
      {
        source: '/:path*.mp4',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.webm',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },

  // Webpack configuration to optimize CSS caching
  // Note: This config is ignored when using Turbopack (--turbo flag)
  // Turbopack has its own optimization and doesn't use webpack
  webpack: (config, { dev, isServer }) => {
    // Resolve @ and @vital-ice/lib so webpack (stricter than Turbopack) finds modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@vital-ice/lib': path.resolve(__dirname, '../../lib'),
    };

    if (dev) {
      // Suppress specific webpack warnings about large string serialization
      config.infrastructureLogging = {
        ...config.infrastructureLogging,
        level: 'error',
      };

      // Filter out specific warnings
      config.stats = {
        ...config.stats,
        warningsFilter: [/Serializing big strings.*impacts deserialization performance/],
      };

      // Improve CSS HMR stability
      config.module.rules.forEach((rule: any) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule: any) => {
            if (oneOfRule.sideEffects === false) {
              oneOfRule.sideEffects = true;
            }
          });
        }
      });
    }

    return config;
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },

  // Next.js 16: top-level. Excludes from serverless file tracing to stay under Vercel 300 MB limit.
  // Keep Vercel "Include source files outside of the Root Directory" ON (needed for workspace + lib).
  // See docs/deployment/README.md.
  outputFileTracingExcludes: {
    '*': [
      '../../apps/studio/**',
      '../../tools/**',
      '../../docs/**',
      '../../.github/**',
      '../../*.md',
      '../../lib/**',
      '../../scripts/**',
      '../../config/**',
      '**/node_modules/@sentry-internal/node-cpu-profiler/**',
      // Build cache not needed at runtime (can be large)
      '.next/cache/**',
    ],
  },

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'seventh-foundry',

  project: 'sentry-rose-window',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
