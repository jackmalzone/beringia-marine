import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { createMindbodyClient } from '@/lib/mindbody/client';
import type { AddClientRequest, ContactFormData, WaitlistFormData, MembershipInquiryFormData } from '@/lib/mindbody/types';

/**
 * POST /api/mindbody/lead
 * Creates a prospect/lead in Mindbody
 */
export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/mindbody/lead',
    },
    async span => {
      try {
        const body = await request.json();
        const { type, ...formData } = body;

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
          IsProspect: true, // Always mark as prospect for leads
          SendScheduleEmails: formData.sendScheduleEmails ?? false,
          SendAccountEmails: formData.sendAccountEmails ?? false,
          SendPromotionalEmails: formData.sendPromotionalEmails ?? false,
        };

        // Add type-specific fields
        if (type === 'contact' && 'message' in formData) {
          const contactData = formData as ContactFormData;
          addClientRequest.Notes = contactData.message || undefined;
        } else if (type === 'waitlist' && 'interestAreas' in formData) {
          const waitlistData = formData as WaitlistFormData;
          addClientRequest.Notes = `Waitlist interest: ${waitlistData.interestAreas?.join(', ') || 'General'}`;
        } else if (type === 'membership' && 'membershipTier' in formData) {
          const membershipData = formData as MembershipInquiryFormData;
          addClientRequest.Notes = `Membership inquiry - Tier: ${membershipData.membershipTier || 'Not specified'}\n${membershipData.additionalInfo || ''}`;
        }

        // Add LeadChannelId if provided (for LeadManagement tracking)
        if (formData.leadChannelId) {
          addClientRequest.LeadChannelId = formData.leadChannelId;
        }

        // Add ProspectStage if provided
        if (formData.prospectStageId) {
          addClientRequest.ProspectStage = {
            Id: formData.prospectStageId,
            Name: formData.prospectStageName || '',
          };
        }

        // Call Mindbody API
        const response = await client.addClient(addClientRequest);

        span.setAttribute('client_id', response.Client?.Id || 'unknown');
        span.setAttribute('lead_type', type || 'unknown');

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
            endpoint: '/api/mindbody/lead',
            error_type: 'mindbody_api_error',
          },
          extra: {
            error: error instanceof Error ? error.message : String(error),
            body: await request.clone().json().catch(() => ({})),
          },
        });

        return NextResponse.json(
          {
            success: false,
            error: {
              code: error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN_ERROR',
              message: error instanceof Error ? error.message : 'Failed to create lead',
            },
          },
          { status: 500 }
        );
      }
    }
  );
}
