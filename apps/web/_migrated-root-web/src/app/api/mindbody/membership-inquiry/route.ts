import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { createMindbodyClient } from '@/lib/mindbody/client';
import type { AddClientRequest, MembershipInquiryFormData } from '@/lib/mindbody/types';

/**
 * POST /api/mindbody/membership-inquiry
 * Creates a founding membership inquiry (prospect with membership tier metadata)
 */
export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/mindbody/membership-inquiry',
    },
    async span => {
      try {
        const body = await request.json();
        const formData = body as MembershipInquiryFormData;

        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'First name, last name, and email are required',
              },
            },
            { status: 400 }
          );
        }

        const client = createMindbodyClient();

        // Build AddClientRequest
        const addClientRequest: AddClientRequest = {
          FirstName: formData.firstName.trim(),
          LastName: formData.lastName.trim(),
          Email: formData.email.trim().toLowerCase(),
          MobilePhone: formData.phone?.trim(),
          IsProspect: true,
          Notes: `Membership inquiry - Tier: ${formData.membershipTier || 'Not specified'}\n${formData.additionalInfo || ''}`,
          SendScheduleEmails: false,
          SendAccountEmails: false,
          SendPromotionalEmails: false,
        };

        // Add LeadChannelId if provided
        if (body.leadChannelId) {
          addClientRequest.LeadChannelId = body.leadChannelId;
        }

        // Call Mindbody API
        const response = await client.addClient(addClientRequest);

        span.setAttribute('client_id', response.Client?.Id || 'unknown');
        span.setAttribute('membership_tier', formData.membershipTier || 'unknown');

        return NextResponse.json({
          success: true,
          data: {
            clientId: response.Client?.Id,
            uniqueId: response.Client?.UniqueId,
            message: response.Message,
          },
        });
      } catch (error) {
        // Handle duplicate client error
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorCode = error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN_ERROR';
        
        if (errorMessage.toLowerCase().includes('duplicate') || errorCode.includes('DUPLICATE')) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'DUPLICATE_CLIENT',
                message: 'A client with this name and email already exists',
              },
            },
            { status: 409 }
          );
        }

        Sentry.captureException(error, {
          tags: {
            endpoint: '/api/mindbody/membership-inquiry',
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
              message: error instanceof Error ? error.message : 'Failed to submit membership inquiry',
            },
          },
          { status: 500 }
        );
      }
    }
  );
}
