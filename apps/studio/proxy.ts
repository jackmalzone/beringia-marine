import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Skip auth in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Allow access to login page and API routes
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Fallback security: If no credentials are configured, deny access
  const validUser = process.env.STUDIO_USERNAME;
  const validPassword = process.env.STUDIO_PASSWORD;

  if (!validUser || !validPassword) {
    console.error('Studio authentication credentials not configured');
    return new NextResponse('Service Unavailable - Authentication not configured', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('studio_session');

  if (sessionCookie?.value) {
    // Session exists - add security headers and allow access
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }

  // No session - redirect to login page
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)'],
};
