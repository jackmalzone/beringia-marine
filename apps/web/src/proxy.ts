import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export function proxy(request: NextRequest) {
  // Block access to /studio routes and redirect to studio subdomain
  if (request.nextUrl.pathname.startsWith('/studio')) {
    const studioUrl = new URL('https://studio.example.com');
    studioUrl.pathname = request.nextUrl.pathname.replace('/studio', '');
    studioUrl.search = request.nextUrl.search;

    // Return 410 Gone status with redirect header
    const response = new NextResponse(null, {
      status: 410,
      statusText: 'Gone - Studio moved to studio.example.com',
    });
    response.headers.set('Location', studioUrl.toString());
    return response;
  }

  // Silently handle socket.io connection attempts - return early to prevent logging
  if (request.nextUrl.pathname.startsWith('/socket.io')) {
    return new NextResponse(null, {
      status: 204, // No Content
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Connection': 'close',
      },
    });
  }

  // Check for potential reload indicators
  const referer = request.headers.get('referer');
  const userAgent = request.headers.get('user-agent') || '';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost =
    request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';

  if (referer) {
    // Detect if this might be a reload (same page)
    if (referer.includes(request.nextUrl.pathname)) {
      // Filter out development/localhost reloads unless they show suspicious patterns
      const shouldReport =
        !isDevelopment ||
        (isDevelopment &&
          (userAgent.includes('Mobile') ||
            userAgent.includes('Android') ||
            userAgent.includes('iPhone') ||
            request.headers.get('cache-control') === 'no-cache'));

      if (shouldReport) {
        Sentry.captureMessage('Potential page reload detected', {
          level: 'warning',
          tags: {
            pathname: request.nextUrl.pathname,
            referer: referer,
            component: 'proxy',
            reload_type: 'same_page',
            environment: isDevelopment ? 'development' : 'production',
            is_localhost: isLocalhost,
            is_mobile:
              userAgent.includes('Mobile') ||
              userAgent.includes('Android') ||
              userAgent.includes('iPhone'),
          },
          extra: {
            userAgent,
            accept: request.headers.get('accept'),
            cacheControl: request.headers.get('cache-control'),
            pragma: request.headers.get('pragma'),
            timestamp: new Date().toISOString(),
            hostname: request.nextUrl.hostname,
          },
        });
      }
    }
  }

  // Check for browser-specific headers and potential reload triggers
  // Check for potential memory pressure or performance issues
  const acceptEncoding = request.headers.get('accept-encoding');
  const connection = request.headers.get('connection');

  // Safari-specific tracking (more common for reloads)
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Safari browser detected',
      level: 'info',
      data: {
        userAgent,
        pathname: request.nextUrl.pathname,
        acceptEncoding,
        connection,
      },
    });
  } else if (userAgent.includes('Chrome')) {
    // Chrome-specific tracking
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Chrome browser detected',
      level: 'info',
      data: {
        userAgent,
        pathname: request.nextUrl.pathname,
        acceptEncoding,
        connection,
      },
    });
  }

  // Check for potential memory-related reloads
  if (
    request.headers.get('cache-control') === 'no-cache' ||
    request.headers.get('pragma') === 'no-cache'
  ) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'No-cache request detected',
      level: 'info',
      data: {
        pathname: request.nextUrl.pathname,
        cacheControl: request.headers.get('cache-control'),
        pragma: request.headers.get('pragma'),
      },
    });
  }

  // Monitor for potential memory pressure indicators
  const contentLength = request.headers.get('content-length');

  // Check for potential memory-related reloads
  if (contentLength && parseInt(contentLength) > 1000000) {
    // > 1MB
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Large request detected',
      level: 'info',
      data: {
        pathname: request.nextUrl.pathname,
        contentLength,
        userAgent,
      },
    });
  }

  // Forward pathname to the server so root layout can inject the crawler-visible
  // SSR block (literal <h1> + content). Server Components read request headers,
  // so we must set x-pathname on the request, not the response.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon-*.png (favicon files)
     * - fonts/ (font files)
     * - site.webmanifest (web manifest)
     * - images/ (image assets)
     * - socket.io (handled silently in proxy function)
     * Include /studio paths for blocking
     */
    '/((?!api|_next/static|_next/image|favicon|fonts|site.webmanifest|images|socket.io|apple-touch-icon).*)',
    '/studio/:path*', // Block /studio routes
    '/socket.io/:path*', // Explicitly match socket.io to handle it
  ],
};
