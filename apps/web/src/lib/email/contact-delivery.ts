import nodemailer from 'nodemailer';
import { TEMPLATE_BUSINESS } from '@vital-ice/config';
import type { ContactFormData } from '@vital-ice/ui';

export type ContactDeliveryResult = { success: true } | { success: false; error: string };

/**
 * Optional: Gmail (or Google Workspace) with an app password — same pattern as submit-application.
 */
async function deliverViaSmtp(data: ContactFormData): Promise<ContactDeliveryResult> {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) {
    return { success: false, error: 'SMTP is not fully configured.' };
  }

  const to = process.env.CONTACT_INBOX_EMAIL?.trim() || TEMPLATE_BUSINESS.email;
  const name = `${data.firstName} ${data.lastName}`.trim();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message || '—').replace(/\n/g, '<br/>')}</p>
  `;

  try {
    await transporter.sendMail({
      from: user,
      to,
      replyTo: data.email,
      subject: `Website contact: ${name}`,
      html,
    });
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'SMTP send failed.';
    return { success: false, error: msg };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Server-side contact delivery (used when the browser does not post to Web3Forms directly).
 * Primary path: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the UI package — browser submits to Web3Forms
 * (Cloudflare blocks most server-side fetches to api.web3forms.com).
 *
 * Fallback: `EMAIL_USER` + `EMAIL_PASSWORD` (Gmail app password).
 */
export async function deliverContactForm(data: ContactFormData): Promise<ContactDeliveryResult> {
  if (process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASSWORD?.trim()) {
    return deliverViaSmtp(data);
  }

  return {
    success: false,
    error:
      'Contact delivery is not configured. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY for Web3Forms (browser), or EMAIL_USER and EMAIL_PASSWORD for Gmail SMTP on /api/contact.',
  };
}
