import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { createMindbodyClient } from '@/lib/mindbody/client';

export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'GET /api/mindbody/required-fields',
    },
    async span => {
      try {
        const client = createMindbodyClient();
        const response = await client.getRequiredClientFields();

        span.setAttribute('required_fields_count', response.RequiredFields?.length || 0);

        return NextResponse.json({
          success: true,
          data: response,
        });
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            endpoint: '/api/mindbody/required-fields',
            error_type: 'mindbody_api_error',
          },
          extra: {
            error: error instanceof Error ? error.message : String(error),
          },
        });

        return NextResponse.json(
          {
            success: false,
            error: {
              code: error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN_ERROR',
              message: error instanceof Error ? error.message : 'Failed to fetch required fields',
            },
          },
          { status: 500 }
        );
      }
    }
  );
}
