import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Disable static optimization for studio
  output: 'standalone',
  // Ensure proper handling of Sanity Studio assets
  transpilePackages: ['next-sanity'],
  // Exclude jsdom from server bundling to resolve version conflicts
  // jsdom is used by isomorphic-dompurify but shouldn't be bundled by Next.js
  serverExternalPackages: ['jsdom'],
};

export default nextConfig;
