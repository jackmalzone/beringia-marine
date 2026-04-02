# Membership Inquiry Form - Endpoint Usage

## Overview

The founding membership inquiry form on the book page (`/book`) uses the following Mindbody API endpoints to create prospects and notify staff.

## Endpoint Flow

### 1. Form Submission

**Client-side**: `packages/ui/src/forms/MembershipInquiryForm.tsx`

- User fills out form with: firstName, lastName, email, phone, membershipTier, additionalInfo
- Form calls: `submitMembershipInquiryForm()` from `packages/ui/src/forms/submission.ts`
- Submits to: `POST /api/mindbody/membership-inquiry`

### 2. API Route Handler

**Server-side**: `apps/web/src/app/api/mindbody/membership-inquiry/route.ts`

This route orchestrates the following Mindbody API calls:

#### 2.1 Create Prospect Client

**Endpoint**: `POST /client/addclient` (via `client.addClient()`)

**Request Payload**:

```typescript
{
  FirstName: string,        // Required
  LastName: string,         // Required
  Email: string,            // Collected from form
  MobilePhone: string,      // Optional, from form
  IsProspect: true,         // Marks as lead/inquiry
  AddressLine1: string,     // Required by Mindbody, uses business address
  City: string,             // Required by Mindbody, uses business address
  State: string,             // Required by Mindbody, uses business address
  PostalCode: string,       // Required by Mindbody, uses business address
  Country: string,          // Required by Mindbody, uses business address
  Notes: string,            // Contains: "Membership inquiry - Tier: {tier}\n{additionalInfo}"
  SendScheduleEmails: false,
  SendAccountEmails: false,
  SendPromotionalEmails: false,
  LeadChannelId?: number    // Optional, if provided
}
```

**Response**: `AddClientResponse` with `Client` object containing `Id` and `UniqueId`

#### 2.2 Check for Existing Client (NEW)

**Endpoint**: `GET /client/clients` (via `client.getClients()`)

**When**: Before attempting to create client

**Purpose**: Avoids duplicate errors and allows multiple inquiries from same email

**Query Parameters**:

- `request.searchText`: Client email address
- `request.limit`: 10

**Response**: `GetClientsResponse` with array of matching clients

#### 2.3 Create Contact Log (Notification)

**Endpoint**: `POST /client/addcontactlog` (via `client.addContactLog()`)

**When**: After client is found or created

**Request Payload**:

```typescript
{
  ClientId: string,          // From existing client or addClient response
  Text: string,             // Full inquiry details including message
  ContactName: string,      // Client's full name
  ContactMethodID: 5,       // 5 = Web Form
  ContactLogTypeID: 2,      // 2 = General Inquiry
  SendEmail: true,          // Triggers email notification
  AssignedToStaffID: number, // Staff ID from MBO_DEFAULT_STAFF_ID or 0 (unassigned)
  FollowupByDate: string,   // ISO date string (7 days from now)
  IsComplete: false         // Requires staff follow-up
}
```

**Contact Log Text Format**:

```
New Membership Inquiry

Name: {firstName} {lastName}
Email: {email}
Phone: {phone or "Not provided"}
Membership Tier: {membershipTier or "Not specified"}

Message:
{additionalInfo if provided}
```

**Purpose**: Notifies staff in Mindbody dashboard about the new inquiry

## Endpoints Used

| Endpoint                           | Method | Purpose                               | Status         |
| ---------------------------------- | ------ | ------------------------------------- | -------------- |
| `/api/mindbody/membership-inquiry` | POST   | Next.js API route (server-side proxy) | ✅ Implemented |
| `/client/clients`                  | GET    | Check for existing client by email    | ✅ Implemented |
| `/client/addclient`                | POST   | Create prospect in Mindbody           | ✅ Implemented |
| `/client/addcontactlog`            | POST   | Notify staff via contact log          | ✅ Implemented |
| `/staff/staff`                     | GET    | Get staff members (for assignment)    | ✅ Implemented |

## Optional Endpoints (Not Currently Used)

| Endpoint                       | Purpose                     | Status        | Notes                                                |
| ------------------------------ | --------------------------- | ------------- | ---------------------------------------------------- |
| `/client/requiredclientfields` | Get required fields         | ⚠️ Not called | Currently handled by always including address fields |
| `/site/memberships`            | Get dynamic membership list | ⚠️ Not used   | Form uses hardcoded tiers                            |
| `/site/prospectstages`         | Get prospect stages         | ⚠️ Not used   | Could be used for LeadManagement                     |

## Implementation Details

### Error Handling

- **Duplicate Clients**: Returns 409 status with `DUPLICATE_CLIENT` error code
- **Contact Log Failures**: Logged to Sentry but don't fail the request (client was created successfully)
- **Validation Errors**: Returns 400 status with validation message

### Data Flow

1. Form submission → `/api/mindbody/membership-inquiry`
2. Server validates required fields (firstName, lastName, email)
3. Server calls `GET /client/clients` → Searches for existing client by email
4. If client exists: Uses existing client ID
5. If client doesn't exist: Server calls `POST /client/addclient` → Creates prospect
6. Server calls `POST /client/addcontactlog` → Creates notification with email trigger
7. Server returns success response to client
8. Form shows success message

### Security

- ✅ API calls made server-side (API key never exposed to client)
- ✅ Form data validated before API calls
- ✅ Errors handled gracefully with user-friendly messages

## Current Status

**✅ All appropriate endpoints are being used:**

- `POST /client/addclient` - Creates the prospect
- `POST /client/addcontactlog` - Notifies staff

**✅ Best practices followed:**

- Server-side API calls (secure)
- Proper error handling
- Duplicate client detection
- Contact log for staff notifications
- All required fields included (address fields using business address)

The membership inquiry form is correctly using the appropriate Mindbody API endpoints for creating prospects and notifying staff.

