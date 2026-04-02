/**
 * Next.js 16 root proxy. All logic lives in src/proxy.ts; this file exists so Next
 * can statically read config. Proxy runs on Node.js runtime (do not add runtime = 'edge').
 */
import type { NextRequest } from 'next/server';
import { proxy as proxyImpl } from '@/proxy';

export function proxy(request: NextRequest) {
  return proxyImpl(request);
}

/** Must be defined inline so Next can statically read it. */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon|fonts|site.webmanifest|images|socket.io|apple-touch-icon).*)',
    '/studio/:path*',
    '/socket.io/:path*',
  ],
};
