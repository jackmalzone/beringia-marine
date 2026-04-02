# Mindbody API Endpoints Required for Implementation

## Overview

This document lists the specific Mindbody API 6.0 endpoints we need to implement the custom forms and backend integration.

## Required Endpoints (Phase 1 - Leads/Prospects)

### 1. GET /client/requiredclientfields

**Purpose**: Fetch required fields before creating a client  
**Status**: ✅ Implemented  
**Location**: `packages/mindbody-sdk/src/client.ts` → `getRequiredClientFields()`  
**API Route**: `/api/mindbody/required-fields`

**What we need from you:**

- API endpoint documentation/spec
- Example request/response
- Any special headers or parameters

---

### 2. POST /client/addclient

**Purpose**: Create a new client/prospect/lead in Mindbody  
**Status**: ✅ Implemented  
**Location**: `packages/mindbody-sdk/src/client.ts` → `addClient()`  
**API Routes**:

- `/api/mindbody/lead` (generic)
- `/api/mindbody/contact` (contact form)
- `/api/mindbody/waitlist` (waitlist form)
- `/api/mindbody/membership-inquiry` (membership inquiry form)

**What we need from you:**

- Complete request body structure
- Required vs optional fields
- Response structure
- Error codes and messages (especially for duplicate clients)
- Example successful request/response
- Example error responses

**Key Fields We're Using:**

- `FirstName` (required)
- `LastName` (required)
- `Email` (required)
- `MobilePhone` (optional)
- `IsProspect: true` (always set for leads)
- `Notes` (for storing form-specific data)
- `LeadChannelId` (optional, for LeadManagement tracking)
- `ProspectStage` (optional, for sales pipeline)

---

### 3. GET /site/prospectstages

**Purpose**: Get available prospect stages for lead tracking  
**Status**: ✅ Implemented (not yet used in forms)  
**Location**: `packages/mindbody-sdk/src/client.ts` → `getProspectStages()`

**What we need from you:**

- Response structure
- How to map prospect stages to form submissions

---

### 4. GET /site/memberships

**Purpose**: Get available memberships (for membership inquiry form)  
**Status**: ✅ Implemented (not yet used in forms)  
**Location**: `packages/mindbody-sdk/src/client.ts` → `getMemberships()`

**What we need from you:**

- Response structure
- Membership tier names/IDs

---

### 5. GET /site/liabilitywaiver

**Purpose**: Get liability waiver information (for future waiver consent)  
**Status**: ✅ Implemented (not yet used)  
**Location**: `packages/mindbody-sdk/src/client.ts` → `getLiabilityWaiver()`

**What we need from you:**

- Response structure
- How to mark waiver as accepted when creating client

---

## Authentication Requirements

**What we need from you:**

1. **API Key** - For authentication
2. **Site ID** - Your Mindbody site ID
3. **Base URL** - API base URL (default: `https://api.mindbodyonline.com/public/v6`)
4. **Optional: Staff Authorization Token** - If needed for certain operations

**Environment Variables to Set:**

```bash
MBO_API_KEY=your_api_key_here
MBO_SITE_ID=your_site_id_here
MBO_API_BASE_URL=https://api.mindbodyonline.com/public/v6  # Optional
MBO_AUTHORIZATION=your_staff_token_here  # Optional
```

---

## Current Implementation Status

### ✅ Completed

- API client with retry logic and error handling
- TypeScript types for all endpoints
- API routes for all form types
- Form components with React Hook Form + Zod validation
- Monorepo structure with shared packages
- Environment variable validation

### 🔄 Ready for API Credentials

- All code is in place
- Just need API key and site ID to test
- Forms will work once credentials are configured

### 📋 What We Need From You

1. **API Credentials:**
   - API Key
   - Site ID
   - Base URL (if different from default)

2. **Endpoint Documentation:**
   - For `POST /client/addclient`:
     - Complete request body schema
     - Required fields validation rules
     - Response structure
     - Error codes (especially duplicate client handling)
     - Example requests/responses

3. **Business Configuration:**
   - LeadChannelId values (if using LeadManagement)
   - ProspectStage IDs (if using sales pipeline)
   - Membership tier names/IDs (for membership inquiry form)

4. **Testing:**
   - Sandbox/test credentials (if available)
   - Test site ID for development

---

## Future Endpoints (Phase 2 - Not Yet Implemented)

These will be needed for booking/class scheduling:

- `GET /appointment/availabledates`
- `GET /appointment/bookableitems`
- `GET /appointment/scheduleitems`
- `POST /appointment/addappointment`
- `GET /class/classes`
- `GET /class/classschedules`
- `POST /class/addclienttoclass`

## Related Documentation

- [Main Documentation Index](./README.md)
- [Setup Guide](./SETUP.md)
- [Add Client Tutorial](./TUTORIAL.md)
- [Endpoints by Form](./ENDPOINTS_BY_FORM.md)

---

## Files to Update Once You Provide API Info

1. **Environment Variables** (`.env.local` or Vercel):
   - Add `MBO_API_KEY`
   - Add `MBO_SITE_ID`

2. **API Client** (`packages/mindbody-sdk/src/client.ts`):
   - May need adjustments based on actual API response structure

3. **Form Hooks** (`packages/ui/src/forms/hooks/*.ts`):
   - May need to add LeadChannelId or ProspectStage based on your setup

---

## Questions for You

1. Do you have LeadManagement enabled? (affects LeadChannelId usage)
2. Do you use prospect stages for sales pipeline? (affects ProspectStage usage)
3. What are your membership tier names? (for membership inquiry form dropdown)
4. Do you have a sandbox/test environment we can use for development?
5. Are there any custom client fields we should be aware of?

---

## Next Steps

Once you provide:

1. API credentials → We'll add them to environment variables
2. Endpoint documentation → We'll verify our implementation matches
3. Business configuration → We'll update forms with correct values
4. Test credentials → We'll test end-to-end form submissions

Then we can test the complete flow and make any necessary adjustments!
