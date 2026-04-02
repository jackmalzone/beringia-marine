# Contact Log Notifications for Membership Inquiries

## Overview

When a membership inquiry is submitted through the custom form, the system uses **Mindbody's native Contact Log system** to notify staff. This keeps all notifications within the Mindbody ecosystem where staff can view, manage, and follow up on inquiries.

## How It Works

### 1. Client Creation

- Form submission calls `POST /api/mindbody/membership-inquiry`
- The API route calls `POST /client/addclient` to create a prospect in Mindbody
- Client is marked as `IsProspect: true` so they appear in Lead Management

### 2. Contact Log Creation (Notification)

- After the client is successfully created, the system calls `POST /client/addcontactlog`
- The contact log includes:
  - **All inquiry details**: Name, email, phone, membership tier
  - **The message**: Any text from the `additionalInfo` field is included in the contact log `Text` field
  - **Contact method**: Set to "Email" (how the client wants to be contacted)
  - **Assignment**: Can be assigned to a specific staff member via `AssignedToStaffId`
  - **Follow-up status**: `IsComplete: false` so staff know to follow up

### 3. Staff Notification

- **Primary method**: Staff see the contact log in their Mindbody dashboard
- Contact logs appear in the client's profile and in the Lead Management pipeline
- Staff can filter, search, and manage contact logs directly in Mindbody
- **Email notifications**: If desired, staff can configure email alerts in Mindbody's dashboard settings (Settings → Notifications/Email Preferences) to receive emails when new contact logs are created. This is configured in Mindbody, not via API.

## Message Handling

When a client adds a message in the `additionalInfo` field:

1. **Stored in Client Notes**: The message is saved in the client's `Notes` field in Mindbody
2. **Included in Contact Log**: The message is prominently included in the contact log `Text` field
3. **Visible to Staff**: Staff see the full message when viewing the contact log in their dashboard

**Example Contact Log Text:**

```
New Membership Inquiry

Name: Jane Doe
Email: jane@example.com
Phone: 555-123-4567
Membership Tier: Founding Member

Message:
I'm interested in learning more about your cold plunge therapy.
I've been doing contrast therapy at home and would love to try
your professional facilities.
```

## Benefits of Contact Log Approach

- **Native Integration**: Everything stays within Mindbody's ecosystem
- **No External Dependencies**: No need for separate email services or notification systems
- **Centralized Tracking**: All inquiries and follow-ups tracked in one place
- **Staff Assignment**: Can assign inquiries to specific staff members
- **Follow-up Management**: Staff can mark contact logs as complete, set follow-up dates
- **Lead Pipeline**: Prospects automatically appear in Mindbody's Lead Management system

## Email Notifications (Optional)

If staff want to receive email notifications when contact logs are created:

1. **Configure in Mindbody Dashboard**: Go to Settings → Notifications/Email Preferences
2. **Enable Contact Log Alerts**: Set up email alerts for new contact logs
3. **Staff-Specific**: Each staff member can configure their own notification preferences

This is a Mindbody dashboard setting, not something controlled via API. The contact log itself serves as the primary notification mechanism.

## Implementation Details

**Files**:

- `apps/web/src/app/api/mindbody/membership-inquiry/route.ts`
- `apps/web/src/app/api/mindbody/contact/route.ts`

The implementation:

1. **Checks for existing client** via `GET /client/clients` (by email)
2. If client exists: Uses existing client ID
3. If client doesn't exist: Creates prospect via `addClient()`
4. Creates a contact log via `addContactLog()` with all inquiry details
5. Includes any message from `additionalInfo`/`message` in the contact log text
6. Assigns to staff member (from `MBO_DEFAULT_STAFF_ID` env var) or unassigned
7. Handles errors gracefully (contact log failures don't break inquiry submission)

**Contact Log Fields Used:**

- `ClientId`: The newly created/existing client's ID
- `Text`: Full inquiry details including message
- `ContactName`: Client's full name
- `ContactMethodID`: `5` (Web Form)
- `ContactLogTypeID`: `2` (General Inquiry)
- `SendEmail`: `true` (Triggers email notification to assigned staff)
- `AssignedToStaffID`: Staff ID from `MBO_DEFAULT_STAFF_ID` env var, or `0` (unassigned)
- `FollowupByDate`: 7 days from creation date
- `IsComplete`: `false` (requires follow-up)

## Summary

**The Contact Log IS the notification mechanism.** When a client submits an inquiry with a message:

- The message is included in the contact log text
- Staff see it in their Mindbody dashboard
- Staff can be assigned to follow up
- Email notifications (if enabled) are configured in Mindbody's dashboard, not in code

This approach keeps everything within the Mindbody ecosystem and leverages Mindbody's built-in lead management and notification features.

