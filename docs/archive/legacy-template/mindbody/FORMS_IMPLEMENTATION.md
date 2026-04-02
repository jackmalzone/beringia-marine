# Mindbody Forms Implementation Guide

## Overview

All forms in the Vital Ice application use a consistent strategy for handling client creation and staff notifications through the Mindbody API.

## Implementation Strategy

### Core Principles

1. **Check for Existing Clients First**: All forms search for existing clients by email before attempting to create new ones
2. **Always Allow Submission**: Forms never fail due to duplicate clients - they gracefully handle existing clients
3. **Contact Log Notifications**: All inquiry forms create contact logs with email notifications enabled
4. **Staff Assignment**: Contact logs are assigned to the staff member configured in `MBO_DEFAULT_STAFF_ID`

## Form Types

### 1. Membership Inquiry Form

**Route**: `POST /api/mindbody/membership-inquiry`

**Fields**: firstName, lastName, email, phone, membershipTier, additionalInfo

**Flow**:

1. Search for existing client by email
2. If found: Use existing client ID
3. If not found: Create new prospect (`IsProspect: true`)
4. Create contact log with membership tier and message
5. Assign to staff (from `MBO_DEFAULT_STAFF_ID`)

**Contact Log**:

- `ContactMethodID`: 5 (Web Form)
- `ContactLogTypeID`: 2 (General Inquiry)
- `SendEmail`: true
- Includes membership tier and any additional message

### 2. Contact Form

**Route**: `POST /api/mindbody/contact`

**Fields**: firstName, lastName, email, phone, message

**Flow**:

1. Search for existing client by email
2. If found: Use existing client ID
3. If not found: Create new prospect (`IsProspect: true`)
4. Create contact log with message
5. Assign to staff (from `MBO_DEFAULT_STAFF_ID`)

**Contact Log**:

- `ContactMethodID`: 5 (Web Form)
- `ContactLogTypeID`: 2 (General Inquiry)
- `SendEmail`: true
- Includes contact message

### 3. Newsletter Form

**Route**: `POST /api/mindbody/newsletter`

**Fields**: firstName, email, phone, referralSource, subscription preferences

**Flow**:

1. Search for existing client by email (matches by email only since only first name collected)
2. If found: Use existing client ID
3. If not found: Create new prospect with newsletter preferences
4. No contact log created (newsletter signup, not an inquiry)

**Note**: Newsletter form does not create contact logs as it's for subscription management, not inquiries.

### 4. Registration Form

**Route**: `POST /api/mindbody/registration`

**Fields**: Full registration data including address, birth date, liability waiver

**Flow**:

1. Search for existing client by email and name
2. If found: Return friendly message (user already has account)
3. If not found: Create new client (`IsProspect: false` - actual client account)
4. No contact log created (registration, not an inquiry)

**Note**: Registration creates actual client accounts, not prospects. Returns friendly message if account already exists.

## Contact Log Configuration

### Required Fields

All contact logs include:

```typescript
{
  ClientId: string,
  Text: string,              // Full inquiry details
  ContactName: string,       // Client's full name
  ContactMethodID: 5,       // Web Form
  ContactLogTypeID: 2,      // General Inquiry
  SendEmail: true,           // Triggers email notification
  AssignedToStaffID: number, // From MBO_DEFAULT_STAFF_ID or 0
  FollowupByDate: string,   // ISO date (7 days from now)
  IsComplete: false         // Requires follow-up
}
```

### Staff Assignment

- **Primary**: Uses `MBO_DEFAULT_STAFF_ID` environment variable
- **Fallback**: If not set, uses `0` (unassigned - notifies all staff with alerts enabled)
- **Finding Staff ID**: Run `node scripts/find-staff-id.js` or find manually in Mindbody dashboard

### Email Notifications

- **Trigger**: `SendEmail: true` in contact log request
- **Recipient**: Assigned staff member (or all staff if unassigned)
- **Requirement**: Staff must have contact log email alerts enabled in Mindbody dashboard
- **Configuration**: Settings → Notifications/Email Preferences in Mindbody

## Environment Variables

```bash
# Required
MBO_API_KEY=a431330263df42b886bc5eb7fbcafbe7
MBO_SITE_ID=5745503

# Optional
MBO_API_BASE_URL=https://api.mindbodyonline.com/public/v6/
MBO_AUTHORIZATION=[STAFF_TOKEN]  # For enhanced permissions
MBO_DEFAULT_STAFF_ID=[STAFF_ID]  # For contact log assignment
```

## Error Handling

### Duplicate Clients

- **Strategy**: Check for existing clients first (prevents most duplicate errors)
- **If duplicate still occurs**: Forms return success with friendly message
- **No 409 errors**: Forms always succeed for better UX

### Contact Log Failures

- **Strategy**: Logged to Sentry but don't fail form submission
- **Reason**: Client was created/found successfully, contact log is secondary
- **Monitoring**: Check Sentry for `add_contact_log` errors

### Search Failures

- **Strategy**: If client search fails, attempt to create client anyway
- **Fallback**: Forms still work even if search endpoint has issues
- **Logging**: Search failures logged to Sentry for debugging

## Best Practices

1. ✅ **Always check for existing clients first** - Prevents duplicate errors
2. ✅ **Create contact logs for inquiries** - Ensures staff notifications
3. ✅ **Use proper contact log fields** - ContactMethodID, ContactLogTypeID, SendEmail
4. ✅ **Assign to specific staff** - Use MBO_DEFAULT_STAFF_ID for targeted notifications
5. ✅ **Handle errors gracefully** - Forms should always succeed from user perspective
6. ✅ **Log everything** - Use Sentry for error tracking and debugging

## Related Documentation

- [Contact Log Notifications](./CONTACT_LOG_NOTIFICATIONS.md) - Detailed contact log implementation
- [Membership Inquiry Endpoints](./MEMBERSHIP_INQUIRY_ENDPOINTS.md) - Membership form specifics
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Setup Guide](./SETUP.md) - Environment configuration

