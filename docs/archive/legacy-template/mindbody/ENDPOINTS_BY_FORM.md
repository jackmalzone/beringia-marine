# Mindbody API Endpoints Required by Form Type

This document maps each form to the specific Mindbody API 6.0 endpoints it requires from the reference documentation.

## API Key Configuration

**App Name**: Vital-Ice

**API Key**: `a431330263df42b886bc5eb7fbcafbe7`

**Base URL**: `https://api.mindbodyonline.com/public/v6/` (note trailing slash)

**API Version**: 6

**App Name Header**: `-A 'Vital-Ice'` (optional but recommended)

**Site ID**: `5745503` ✅ (Access granted and activated)

**Required Headers**:

- `Api-Key`: `a431330263df42b886bc5eb7fbcafbe7` (required - API-Key authentication)
- `SiteId`: `5745503` (required - ✅ provided)
- `Content-Type`: `application/json` (for POST requests)
- `Accept`: `application/json`
- `authorization`: `[OPTIONAL]` (staff user authorization token for Business Mode operations)
- `User-Agent`: `Vital-Ice` (optional but recommended - app name identification)

**✅ Site ID**: `5745503` - Access granted and activated

---

## 1. Contact Form (`/api/mindbody/contact`)

**Form Fields**: firstName, lastName, email, phone (optional), message (optional)

### Required Endpoints:

#### 1.1 `GET /client/requiredclientfields`

- **Purpose**: Gets the list of fields that a new client has to fill out in business mode, specifically for the sign-up process. AddClient and UpdateClient validate against these fields.
- **Endpoint**: `GET /public/v6/client/requiredclientfields`
- **When**: Called once on form load or before validation
- **Query Parameters**: None
- **Headers**: `Api-Key`, `SiteId`, `authorization` (optional - for Business Mode), `User-Agent: Vital-Ice`
- **Response**: `GetRequiredClientFieldsResponse` with `RequiredFields: string[]`
- **Why**: Ensures all required fields are collected (varies by business configuration)
- **Official Docs**: Gets the list of fields that a new client has to fill out in business mode

#### 1.2 `POST /client/addclient`

- **Purpose**: Creates a new client record at the specified business. Passing a User Token as Authorization will create a client and respect Business Mode required fields. Omitting the token will create a client and respect Consumer Mode required fields.
- **Endpoint**: `POST /public/v6/client/addclient`
- **When**: On form submission
- **Headers**: `Api-Key`, `SiteId`, `Content-Type: application/json`, `authorization` (optional), `User-Agent: Vital-Ice`
- **Request Model**: `AddClientRequest`
  - **Always Required**: `FirstName` (String), `LastName` (String)
  - **Used in Contact Form**: `Email`, `MobilePhone`, `IsProspect: true`, `Notes` (for message)
  - **Important**: All other parameters are optional, but note that any of the optional parameters could be required by a particular business, depending on how the business has configured the site settings.
  - **Emergency Contact**: If `GetRequiredClientFields` returns `EmergContact` in the list of required fields, then all emergency contact parameters are required:
    - `EmergencyContactInfoEmail`
    - `EmergencyContactInfoName`
    - `EmergencyContactInfoPhone`
    - `EmergencyContactInfoRelationship`
- **Response**: `AddClientResponse` with `Client` object containing `Id`, `UniqueId`, `FirstName`, `LastName`, etc.
- **Why**: Primary endpoint for creating prospects/leads
- **Important Note**: Starting the week of May 11th, 2020 all versions of the Public API will no longer allow duplicate clients to be created. A duplicate client is created when two profiles have the same first name, last name and email.
- **Sales Pipeline**: If you have purchased an Ultimate tier then this endpoint will automatically start showing new opportunity on Sales Pipeline.

### Optional Endpoints:

#### 1.3 `GET /site/prospectstages` (Optional)

- **Purpose**: Get the list of prospect stages that represent the prospect stage options for prospective clients.
- **Endpoint**: `GET /public/v6/site/prospectstages`
- **When**: If using sales pipeline tracking
- **Query Parameters**:
  - `request.active` (Boolean, optional): When true, the response only contains prospect stages which are activated. When false, only deactivated prospect stages are returned. Default: All Prospect Stages
- **Headers**: `Api-Key`, `SiteId`, `authorization` (optional), `User-Agent: Vital-Ice`
- **Response**: `GetProspectStagesResponse` with `ProspectStages[]` array
- **Why**: For LeadManagement tracking and sales pipeline

---

## 2. Waitlist Form (`/api/mindbody/waitlist`)

**Form Fields**: firstName, lastName, email, phone (optional), interestAreas[] (optional)

### Required Endpoints:

#### 2.1 `GET /client/requiredclientfields`

- **Same as 1.1** - See [Contact Form section](#11-get-clientrequiredclientfields) for full details
- **Purpose**: Gets the list of fields that a new client has to fill out in business mode
- **Endpoint**: `GET /public/v6/client/requiredclientfields`
- **When**: Called once on form load or before validation
- **Response**: `GetRequiredClientFieldsResponse` with `RequiredFields: string[]`
- **Why**: Ensures all required fields are collected

#### 2.2 `POST /client/addclient`

- **Same as 1.2** - See [Contact Form section](#12-post-clientaddclient) for full details
- **Purpose**: Creates a new client record (prospect/lead from waitlist form)
- **Endpoint**: `POST /public/v6/client/addclient`
- **When**: On form submission
- **Request Model**: `AddClientRequest`
  - **Always Required**: `FirstName`, `LastName`
  - **Used in Waitlist Form**: `Email`, `MobilePhone`, `IsProspect: true`, `Notes` (for interest areas: `Waitlist interest: ${interestAreas.join(', ')}`)
- **Response**: `AddClientResponse` with `Client` object
- **Why**: Primary endpoint for creating prospects/leads

### Optional Endpoints:

#### 2.3 `GET /site/prospectstages` (Optional)

- **Same as 1.3** - See [Contact Form section](#13-get-siteprospectstages-optional) for full details
- **Purpose**: Get the list of prospect stages for prospective clients
- **Endpoint**: `GET /public/v6/site/prospectstages`
- **When**: If using sales pipeline tracking
- **Response**: `GetProspectStagesResponse` with `ProspectStages[]` array
- **Why**: For LeadManagement tracking and sales pipeline

---

## 3. Membership Inquiry Form (`/api/mindbody/membership-inquiry`)

**Form Fields**: firstName, lastName, email, phone (optional), membershipTier (optional), additionalInfo (optional)

### Required Endpoints:

#### 3.1 `GET /client/requiredclientfields`

- **Same as 1.1** - See [Contact Form section](#11-get-clientrequiredclientfields) for full details
- **Purpose**: Gets the list of fields that a new client has to fill out in business mode
- **Endpoint**: `GET /public/v6/client/requiredclientfields`
- **When**: Called once on form load or before validation
- **Response**: `GetRequiredClientFieldsResponse` with `RequiredFields: string[]`
- **Why**: Ensures all required fields are collected

#### 3.2 `GET /site/memberships`

- **Purpose**: Get the memberships at a site.
- **Endpoint**: `GET /public/v6/site/memberships`
- **When**: On form load (should be called to make dropdown dynamic)
- **Query Parameters**:
  - `request.membershipIds` (array<Number>, optional): The requested membership IDs. Default: all IDs that the authenticated user's access level allows.
- **Headers**: `Api-Key`, `SiteId`, `authorization` (optional), `User-Agent: Vital-Ice`
- **Response**: `GetMembershipsResponse` with `Memberships[]` array containing:
  - `Id` (Number)
  - `Name` (String)
  - `Description` (String, optional)
  - `ShortDescription` (String, optional)
  - `Price` (Decimal, optional)
  - `OnlinePrice` (Decimal, optional)
  - `Program` (Program object, optional)
  - `MembershipTypeRestrictions` (array, optional)
- **Why**: Should replace hardcoded `MEMBERSHIP_TIERS` array in `MembershipInquiryForm.tsx`
- **Note**: Currently not implemented - form uses hardcoded tiers. This endpoint is already implemented in the SDK but not used in the form component.

#### 3.3 `POST /client/addclient`

- **Same as 1.2** - See [Contact Form section](#12-post-clientaddclient) for full details
- **Purpose**: Creates a new client record (prospect/lead from membership inquiry form)
- **Endpoint**: `POST /public/v6/client/addclient`
- **When**: On form submission
- **Request Model**: `AddClientRequest`
  - **Always Required**: `FirstName`, `LastName`
  - **Used in Membership Inquiry Form**: `Email`, `MobilePhone`, `IsProspect: true`, `Notes` (for membership tier + additional info: `Membership inquiry - Tier: ${membershipTier}\n${additionalInfo}`)
- **Response**: `AddClientResponse` with `Client` object
- **Why**: Primary endpoint for creating prospects/leads

### Optional Endpoints:

#### 3.4 `GET /site/prospectstages` (Optional)

- **Same as 1.3** - See [Contact Form section](#13-get-siteprospectstages-optional) for full details
- **Purpose**: Get the list of prospect stages for prospective clients
- **Endpoint**: `GET /public/v6/site/prospectstages`
- **When**: If using sales pipeline tracking
- **Response**: `GetProspectStagesResponse` with `ProspectStages[]` array
- **Why**: For LeadManagement tracking and sales pipeline

---

## Summary: Endpoint Usage Matrix

| Endpoint                           | Contact Form  | Waitlist Form | Membership Inquiry    | Priority                      |
| ---------------------------------- | ------------- | ------------- | --------------------- | ----------------------------- |
| `GET /client/requiredclientfields` | ✅ Required   | ✅ Required   | ✅ Required           | **Critical**                  |
| `POST /client/addclient`           | ✅ Required   | ✅ Required   | ✅ Required           | **Critical**                  |
| `GET /site/memberships`            | ❌ Not needed | ❌ Not needed | ✅ **Should be used** | High (for membership form)    |
| `GET /site/prospectstages`         | ⚠️ Optional   | ⚠️ Optional   | ⚠️ Optional           | Low (if using LeadManagement) |

---

## Implementation Notes

### Current Status:

- ✅ All forms use `GET /client/requiredclientfields` (via `/api/mindbody/required-fields`)
- ✅ All forms use `POST /client/addclient` (via respective API routes)
- ⚠️ `GET /site/memberships` is **not yet implemented** - membership form uses hardcoded tiers
- ⚠️ `GET /site/prospectstages` is implemented but **not used** in forms

### Recommended Next Steps:

1. **Implement `GET /site/memberships`**:
   - Add to SDK: `packages/mindbody-sdk/src/client.ts` (already exists)
   - Create API route: `/api/mindbody/memberships` (if needed)
   - Update `MembershipInquiryForm.tsx` to fetch and use dynamic membership list

2. **Consider `GET /site/prospectstages`**:
   - If using LeadManagement, integrate prospect stages into form submissions
   - Map form types to appropriate prospect stages

3. **Error Handling**:
   - All endpoints should handle duplicate client errors (409 status)
   - Reference: Lines 348-356 in `mindbody-api-reference.md`

---

## Authentication Requirements

All endpoints require:

- **API Key**: `a431330263df42b886bc5eb7fbcafbe7` (header: `api-key`) - **Required for all endpoints**
- **Site ID**: `5745503` (header: `SiteId`) - ✅ **Provided and activated**
- **Optional**: User Token (header: `authorization`) - Only for staff operations. When provided:
  - Creates client and respects **Business Mode** required fields
  - When omitted, creates client and respects **Consumer Mode** required fields

**Important**: To make sure you are collecting all required pieces of information, first run `GetRequiredClientFields`.

---

## Important Notes from Reference

### Duplicate Prevention (Lines 348-356):

⚠️ **Starting May 11, 2020**: All API versions no longer allow duplicate clients. A duplicate is defined as two profiles with the same:

- First Name
- Last Name
- Email

### Required Fields (Lines 358-363):

- Always call `GET /client/requiredclientfields` first
- Required fields vary by business configuration
- If `EmergContact` is in required fields, all emergency contact fields become required

### Testing:

- Use `Test: true` parameter in `AddClientRequest` to validate without creating data. The method is validated, but no client data is added or updated. Default: `false`
- Sandbox environment available for testing

### Business Mode vs Consumer Mode:

- **Business Mode**: When `authorization` header (User Token) is provided, the API respects Business Mode required fields
- **Consumer Mode**: When `authorization` header is omitted, the API respects Consumer Mode required fields
- Always call `GET /client/requiredclientfields` first to ensure you're collecting all required fields for your mode

---

## Related Documentation

- [Main Documentation Index](./README.md)
- [Complete API Reference](./API_REFERENCE.md)
- [Add Client Tutorial](./TUTORIAL.md)
- [Best Practices](./BEST_PRACTICES.md)
- [Setup Guide](./SETUP.md)

---

**Last Updated**: Based on [API Reference](./API_REFERENCE.md) and current implementation
