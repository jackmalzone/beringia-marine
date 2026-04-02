/**
 * Email sending utility using Resend API
 */

import { Resend } from 'resend';
import { env } from '@vital-ice/config';
import type {
  MembershipInquiryNotificationProps,
  ContactFormNotificationProps,
  NewsletterSignupNotificationProps,
  RegistrationNotificationProps,
} from '../emails';
import { MembershipInquiryNotification } from '../emails/MembershipInquiryNotification';
import { ContactFormNotification } from '../emails/ContactFormNotification';
import { NewsletterSignupNotification } from '../emails/NewsletterSignupNotification';
import { RegistrationNotification } from '../emails/RegistrationNotification';

const RESEND_API_KEY = env.RESEND_API_KEY;
const FROM_EMAIL = 'Vital Ice <no-reply@vitalicesf.com>';
const TO_EMAIL = 'info@vitalicesf.com';

// Initialize Resend client (following Resend's recommended pattern)
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Log configuration status (without exposing API key)
if (process.env.NODE_ENV === 'development') {
  console.log('[Email] Configuration check:', {
    hasApiKey: !!RESEND_API_KEY,
    apiKeyLength: RESEND_API_KEY?.length || 0,
    fromEmail: FROM_EMAIL,
    toEmail: TO_EMAIL,
    resendInitialized: !!resend,
  });
}

/**
 * Generate plain text version of email for preview text
 */
function generatePlainText(props: MembershipInquiryNotificationProps): string {
  const fullName = `${props.firstName} ${props.lastName}`;
  let text = `New Membership Inquiry from ${fullName}\n\n`;
  text += `Name: ${fullName}\n`;
  text += `Email: ${props.email}\n`;
  if (props.phone) text += `Phone: ${props.phone}\n`;
  if (props.membershipTier) text += `Membership Interest: ${props.membershipTier}\n`;
  if (props.message) text += `\nMessage:\n${props.message}\n`;
  return text;
}

/**
 * Send membership inquiry notification email
 */
export async function sendMembershipInquiryEmail(
  props: MembershipInquiryNotificationProps
) {
  console.log('[Email] sendMembershipInquiryEmail called', {
    email: props.email,
    firstName: props.firstName,
    lastName: props.lastName,
  });

  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping email send');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    console.log('[Email] Attempting to send membership inquiry email...', {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Membership Inquiry from ${props.firstName} ${props.lastName}`,
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Membership Inquiry from ${props.firstName} ${props.lastName}`,
      react: MembershipInquiryNotification(props),
      text: generatePlainText(props),
    });

    if (error) {
      console.error('[Email] Resend API error:', {
        error,
        errorType: typeof error,
        errorMessage: error?.message,
        errorName: error?.name,
        fullError: JSON.stringify(error, null, 2),
      });
      return { success: false, error: error.message || String(error) };
    }

    console.log('[Email] Membership inquiry email sent successfully!', {
      emailId: data?.id,
      data: JSON.stringify(data, null, 2),
    });

    return { success: true, data };
  } catch (error) {
    console.error('[Email] Exception while sending email:', {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate plain text version of contact form email
 */
function generateContactFormPlainText(props: ContactFormNotificationProps): string {
  const fullName = `${props.firstName} ${props.lastName}`;
  let text = `New Contact Form Submission from ${fullName}\n\n`;
  text += `Name: ${fullName}\n`;
  text += `Email: ${props.email}\n`;
  if (props.phone) text += `Phone: ${props.phone}\n`;
  if (props.message) text += `\nMessage:\n${props.message}\n`;
  return text;
}

/**
 * Send contact form notification email
 */
export async function sendContactFormEmail(props: ContactFormNotificationProps) {
  console.log('[Email] sendContactFormEmail called', {
    email: props.email,
    firstName: props.firstName,
    lastName: props.lastName,
  });

  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping email send');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    console.log('[Email] Attempting to send contact form email...', {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Contact Form Submission from ${props.firstName} ${props.lastName}`,
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Contact Form Submission from ${props.firstName} ${props.lastName}`,
      react: ContactFormNotification(props),
      text: generateContactFormPlainText(props),
    });

    if (error) {
      console.error('[Email] Resend API error:', {
        error,
        errorType: typeof error,
        errorMessage: error?.message,
        errorName: error?.name,
        fullError: JSON.stringify(error, null, 2),
      });
      return { success: false, error: error.message || String(error) };
    }

    console.log('[Email] Contact form email sent successfully!', {
      emailId: data?.id,
      data: JSON.stringify(data, null, 2),
    });

    return { success: true, data };
  } catch (error) {
    console.error('[Email] Exception while sending email:', {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate plain text version of newsletter signup email
 */
function generateNewsletterPlainText(props: NewsletterSignupNotificationProps): string {
  const fullName = `${props.firstName} ${props.lastName}`;
  let text = `New Newsletter Signup from ${fullName}\n\n`;
  text += `Name: ${fullName}\n`;
  text += `Email: ${props.email}\n`;
  if (props.phone) text += `Phone: ${props.phone}\n`;
  if (props.referralSource) text += `How They Heard About Us: ${props.referralSource}\n`;
  const preferences = [];
  if (props.sendScheduleEmails) preferences.push('Schedule Emails');
  if (props.sendScheduleTexts) preferences.push('Schedule Texts');
  if (props.sendPromotionalEmails) preferences.push('Promotional Emails');
  if (props.sendPromotionalTexts) preferences.push('Promotional Texts');
  if (preferences.length > 0) {
    text += `Subscription Preferences: ${preferences.join(', ')}\n`;
  }
  return text;
}

/**
 * Send newsletter signup notification email
 */
export async function sendNewsletterSignupEmail(
  props: NewsletterSignupNotificationProps
) {
  console.log('[Email] sendNewsletterSignupEmail called', {
    email: props.email,
    firstName: props.firstName,
    lastName: props.lastName,
  });

  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping email send');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    console.log('[Email] Attempting to send newsletter signup email...', {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Newsletter Signup from ${props.firstName} ${props.lastName}`,
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Newsletter Signup from ${props.firstName} ${props.lastName}`,
      react: NewsletterSignupNotification(props),
      text: generateNewsletterPlainText(props),
    });

    if (error) {
      console.error('[Email] Resend API error:', {
        error,
        errorType: typeof error,
        errorMessage: error?.message,
        errorName: error?.name,
        fullError: JSON.stringify(error, null, 2),
      });
      return { success: false, error: error.message || String(error) };
    }

    console.log('[Email] Newsletter signup email sent successfully!', {
      emailId: data?.id,
      data: JSON.stringify(data, null, 2),
    });

    return { success: true, data };
  } catch (error) {
    console.error('[Email] Exception while sending email:', {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate plain text version of registration email
 */
function generateRegistrationPlainText(props: RegistrationNotificationProps): string {
  const fullName = `${props.firstName} ${props.lastName}`;
  let text = `New Client Registration: ${fullName}\n\n`;
  text += `Name: ${fullName}\n`;
  text += `Email: ${props.email}\n`;
  if (props.phone) text += `Phone: ${props.phone}\n`;
  if (props.birthDate) {
    try {
      const date = new Date(props.birthDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      text += `Birth Date: ${date}\n`;
    } catch {
      text += `Birth Date: ${props.birthDate}\n`;
    }
  }
  text += `\nAddress:\n${props.addressLine1}\n`;
  if (props.addressLine2) text += `${props.addressLine2}\n`;
  text += `${props.city}, ${props.state} ${props.postalCode}\n`;
  if (props.country && props.country !== 'US') text += `${props.country}\n`;
  const preferences = [];
  if (props.sendScheduleEmails) preferences.push('Schedule Emails');
  if (props.sendScheduleTexts) preferences.push('Schedule Texts');
  if (props.sendPromotionalEmails) preferences.push('Promotional Emails');
  if (props.sendPromotionalTexts) preferences.push('Promotional Texts');
  if (preferences.length > 0) {
    text += `\nCommunication Preferences: ${preferences.join(', ')}\n`;
  }
  if (props.otherInformation) {
    text += `\nAdditional Information:\n${props.otherInformation}\n`;
  }
  text += `\nLiability Release: ${props.liabilityRelease ? '✓ Signed and Agreed' : '✗ Not Signed'}\n`;
  return text;
}

/**
 * Send registration notification email
 */
export async function sendRegistrationEmail(
  props: RegistrationNotificationProps
) {
  console.log('[Email] sendRegistrationEmail called', {
    email: props.email,
    firstName: props.firstName,
    lastName: props.lastName,
  });

  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping email send');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    console.log('[Email] Attempting to send registration email...', {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Client Registration: ${props.firstName} ${props.lastName}`,
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Client Registration: ${props.firstName} ${props.lastName}`,
      react: RegistrationNotification(props),
      text: generateRegistrationPlainText(props),
    });

    if (error) {
      console.error('[Email] Resend API error:', {
        error,
        errorType: typeof error,
        errorMessage: error?.message,
        errorName: error?.name,
        fullError: JSON.stringify(error, null, 2),
      });
      return { success: false, error: error.message || String(error) };
    }

    console.log('[Email] Registration email sent successfully!', {
      emailId: data?.id,
      data: JSON.stringify(data, null, 2),
    });

    return { success: true, data };
  } catch (error) {
    console.error('[Email] Exception while sending email:', {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
