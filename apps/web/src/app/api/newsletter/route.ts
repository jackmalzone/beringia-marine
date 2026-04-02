import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { sendNewsletterSignupEmail } from '@vital-ice/transactional';
import type { NewsletterFormData } from '@vital-ice/ui';
import { EMAIL_SUBMIT_STUB_ID } from '@vital-ice/ui';
import { getInvalidRequestMessage, getApiErrorMessage } from '@/lib/utils/apiErrorMessages';

export async function POST(request: NextRequest) {
  return Sentry.startSpan({ op: 'http.server', name: 'POST /api/newsletter' }, async () => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'INVALID_REQUEST', message: getInvalidRequestMessage() },
        },
        { status: 400 }
      );
    }

    const formData = body as NewsletterFormData;
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

    const result = await sendNewsletterSignupEmail({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      referralSource: formData.referralSource,
      sendScheduleEmails: formData.sendScheduleEmails,
      sendScheduleTexts: formData.sendScheduleTexts,
      sendPromotionalEmails: formData.sendPromotionalEmails,
      sendPromotionalTexts: formData.sendPromotionalTexts,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_ERROR',
            message:
              typeof result.error === 'string' ? result.error : getApiErrorMessage('EMAIL_ERROR'),
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        clientId: EMAIL_SUBMIT_STUB_ID,
        uniqueId: EMAIL_SUBMIT_STUB_ID,
        message: 'Submitted',
      },
    });
  });
}
