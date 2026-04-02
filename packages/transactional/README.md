# @vital-ice/transactional

Email templates and sending utilities for Vital Ice form submissions.

## Overview

This package contains React Email templates for transactional emails sent when users submit forms on the Vital Ice website. Emails are sent via the Resend API.

## Email Templates

### Membership Inquiry Notification

Sent when a user submits the membership inquiry form.

**Template**: `emails/MembershipInquiryNotification.tsx`

**Props**:

- `firstName`: string
- `lastName`: string
- `email`: string
- `phone?`: string (optional)
- `membershipTier?`: string (optional)
- `message?`: string (optional)

### Contact Form Notification

Sent when a user submits the contact form.

**Template**: `emails/ContactFormNotification.tsx`

**Props**:

- `firstName`: string
- `lastName`: string
- `email`: string
- `phone?`: string (optional)
- `message?`: string (optional)

## Usage

### Sending Emails

```typescript
import { sendMembershipInquiryEmail, sendContactFormEmail } from '@vital-ice/transactional';

// Send membership inquiry email
await sendMembershipInquiryEmail({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '555-123-4567',
  membershipTier: 'Founding Member',
  message: "I'm interested in learning more...",
});

// Send contact form email
await sendContactFormEmail({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  phone: '555-987-6543',
  message: 'I have a question about...',
});
```

## Development

### Preview Email Templates

Start the React Email preview server:

```bash
cd packages/transactional
pnpm dev
```

Then visit [http://localhost:3000](http://localhost:3000) to preview your email templates.

### Environment Variables

Required in `.env.local`:

```bash
RESEND_API_KEY=re_...
```

## Configuration

- **From Email**: `Vital Ice <no-reply@vitalicesf.com>`
- **To Email**: `info@vitalicesf.com`
- **API**: Resend API (https://api.resend.com/emails)

## Dependencies

- `@react-email/components` - React Email components
- `@react-email/render` - Render React components to HTML
- `@vital-ice/config` - Environment configuration
- `react` & `react-dom` - React runtime
