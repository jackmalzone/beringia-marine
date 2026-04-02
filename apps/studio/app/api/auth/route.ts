import { NextResponse } from 'next/server';

export function GET() {
  // Check if auth is properly configured
  const hasCredentials = process.env.STUDIO_USERNAME && process.env.STUDIO_PASSWORD;

  if (!hasCredentials) {
    return new NextResponse('Service Unavailable - Authentication not configured', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Vital Ice CMS"',
      'Content-Type': 'text/plain',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

// Handle other HTTP methods
export function POST() {
  return GET();
}

export function PUT() {
  return GET();
}

export function DELETE() {
  return GET();
}
