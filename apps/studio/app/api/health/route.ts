import { NextResponse } from 'next/server';

export function GET() {
  const hasCredentials = process.env.STUDIO_USERNAME && process.env.STUDIO_PASSWORD;
  const nodeEnv = process.env.NODE_ENV;

  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: nodeEnv,
      authConfigured: hasCredentials,
      authRequired: nodeEnv === 'production',
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
