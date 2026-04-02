import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'GET /api/sentry-example-api',
    },
    async span => {
      try {
        // Simulate some work that will be profiled
        span.setAttribute('test_type', 'api_profiling');

        // Simulate database query
        await Sentry.startSpan(
          {
            op: 'db.query',
            name: 'Simulated Database Query',
          },
          async dbSpan => {
            dbSpan.setAttribute('db.operation', 'SELECT');
            dbSpan.setAttribute('db.table', 'users');

            // Simulate database delay
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        );

        // Simulate external API call
        await Sentry.startSpan(
          {
            op: 'http.client',
            name: 'Simulated External API Call',
          },
          async apiSpan => {
            apiSpan.setAttribute('http.url', 'https://api.example.com/data');
            apiSpan.setAttribute('http.method', 'GET');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 150));
          }
        );

        return NextResponse.json({
          success: true,
          message: 'API call completed with profiling',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            endpoint: '/api/sentry-example-api',
            error_type: 'api_error',
          },
        });

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
    }
  );
}
