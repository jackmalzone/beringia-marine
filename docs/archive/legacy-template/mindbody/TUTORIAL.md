# Mindbody API - Add Client Tutorial

This document provides a step-by-step tutorial for adding a new client to Mindbody using the Public API 6.0.

## Overview

**Important Notes**:

- ⚠️ **Starting May 11, 2020**: All API versions no longer allow duplicate clients. A duplicate is defined as two profiles with the same **First Name**, **Last Name**, and **Email**.
- ✅ **Sales Pipeline**: If you have purchased an Ultimate tier, `AddClient` and `UpdateClient` endpoints will automatically show new opportunities on Sales Pipeline if lead criteria match.

## Workflow

### Step 1: Get User Authentication Token (Optional)

If you're adding a client as a staff member, you need to authenticate first:

1. Get a user authentication token by passing login credentials to the authentication endpoint
2. For examples and description, see [User Tokens documentation](https://developers.mindbodyonline.com/)
3. Put the token into the `Authorization` header formatted as `Bearer {authToken}`

**Note**: If you omit the authorization token, the API will use **Consumer Mode** required fields. With a token, it uses **Business Mode** required fields.

### Step 2: Get Required Client Fields

**Always call this first** to determine what fields are required for your business configuration.

#### Request

```bash
curl -X GET \
  https://api.mindbodyonline.com/public/v6/client/requiredclientfields \
  -H 'Api-Key: {yourApiKey}' \
  -H 'SiteId: {yourSiteId}' \
  -A 'Vital-Ice'
```

#### Response

```json
{
  "RequiredClientFields": ["AddressLine1", "City", "State", "PostalCode", "BirthDate"]
}
```

**Important**:

- If `GetRequiredClientFields` returns `EmergContact` in the list, then **all** emergency contact parameters are required:
  - `EmergencyContactInfoEmail`
  - `EmergencyContactInfoName`
  - `EmergencyContactInfoPhone`
  - `EmergencyContactInfoRelationship`
- If `EmergContact` is **not** in the list, then none of the emergency contact parameters are required.

### Step 3: Add Client

Call the `AddClient` endpoint using the required fields obtained in Step 2.

#### Request

```bash
curl -X POST \
  https://api.mindbodyonline.com/public/v6/client/addclient \
  -H 'Content-Type: application/json' \
  -H 'Api-Key: {yourApiKey}' \
  -H 'SiteId: {yourSiteId}' \
  -A 'Vital-Ice' \
  -d '{
    "FirstName": "John",
    "LastName": "Smith",
    "Email": "john.smith@example.com",
    "MobilePhone": "555-123-4567",
    "AddressLine1": "123 ABC Ct",
    "City": "San Luis Obispo",
    "State": "CA",
    "PostalCode": "93401",
    "BirthDate": "1990-01-01",
    "IsProspect": true,
    "Test": false
  }'
```

#### Request Fields

**Always Required**:

- `FirstName` (String) - **REQUIRED**
- `LastName` (String) - **REQUIRED**

**Conditionally Required** (based on `GetRequiredClientFields` response):

- Any fields returned in `RequiredClientFields` array
- If `EmergContact` is in the list, all emergency contact fields are required

**Common Optional Fields**:

- `Email` (String)
- `MobilePhone` (String)
- `HomePhone` (String)
- `WorkPhone` (String)
- `AddressLine1`, `AddressLine2`, `City`, `State`, `PostalCode`, `Country`
- `BirthDate` (DateTime) - Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss`
- `Gender` (String)
- `IsProspect` (Boolean) - Mark as prospect for lead tracking
- `ProspectStage` (ProspectStage) - Prospect stage object with `Id` and `Name`
- `LeadChannelId` (Number) - For LeadManagement tracking
- `Notes` (String) - Staff notes (not shown to clients)
- `Test` (Boolean) - Test mode (default: `false`)
  - `true`: Validates request but does not affect database
  - `false`: Request performs normally and affects live data

#### Response

```json
{
  "Client": {
    "Id": "12345",
    "UniqueId": 67890,
    "FirstName": "John",
    "LastName": "Smith",
    "Email": "john.smith@example.com",
    "MobilePhone": "555-123-4567",
    "IsProspect": true
  },
  "Message": "Client added successfully"
}
```

### Step 4: Send Password Reset Email (Optional)

After the client has been added, you can set up their account by sending a password reset email:

```bash
curl -X POST \
  https://api.mindbodyonline.com/public/v6/client/sendpasswordresetemail \
  -H 'Content-Type: application/json' \
  -H 'Api-Key: {yourApiKey}' \
  -H 'SiteId: {yourSiteId}' \
  -A 'Vital-Ice' \
  -d '{
    "UserEmail": "john.smith@example.com",
    "UserFirstName": "John",
    "UserLastName": "Smith"
  }'
```

This sends an email to the client with a link to create a password.

## Staff Permissions

**Important**: A staff member with the **"Add client"** staff permission can bypass the required fields and add a new client using only first and last names (when using Business Mode with authorization token).

## Example: Adding a Prospect/Lead

For our forms (Contact, Waitlist, Membership Inquiry), we're creating prospects:

```json
{
  "FirstName": "Jane",
  "LastName": "Doe",
  "Email": "jane.doe@example.com",
  "MobilePhone": "555-987-6543",
  "IsProspect": true,
  "Notes": "Contact form submission - interested in cold plunge",
  "SendScheduleEmails": false,
  "SendAccountEmails": false,
  "SendPromotionalEmails": false
}
```

## Error Handling

### Duplicate Client Error

If you try to create a duplicate client (same FirstName, LastName, and Email):

**Response**: `409 Conflict`

```json
{
  "Error": {
    "Code": "InvalidClientCreation",
    "Message": "Client creation cannot result in duplicate client records"
  }
}
```

**Our Implementation**: Already handles this with a 409 status code and appropriate error message.

### Missing Required Fields

If required fields are missing:

**Response**: `400 Bad Request`

```json
{
  "Error": {
    "Code": "MissingRequiredFields",
    "Message": "One or more fields that are required in this request are missing"
  }
}
```

## Best Practices

1. ✅ **Always call `GetRequiredClientFields` first** - Required fields vary by business
2. ✅ **Use `Test: true` during development** - Validate without affecting database
3. ✅ **Handle duplicate client errors** - Check for 409 status and provide user feedback
4. ✅ **Set `IsProspect: true` for leads** - Properly track prospects in sales pipeline
5. ✅ **Use `LeadChannelId` if using LeadManagement** - Track where leads come from
6. ✅ **Set email/text preferences explicitly** - Default to `false` for prospects
7. ✅ **Store form-specific data in `Notes`** - Include context about the submission

## Testing

### Using Test Parameter

```json
{
  "FirstName": "Test",
  "LastName": "User",
  "Email": "test@example.com",
  "Test": true
}
```

This validates the request but does not create the client in the database.

### Using Sandbox

Use the Mindbody sandbox for testing:

- **Studio ID**: `-99`
- **Username**: `Siteowner`
- **Password**: `apitest1234`

**Note**: Sandbox is refreshed nightly, so changes are cleared.

## Implementation in Our Codebase

### Current Implementation

✅ **Already Implemented**:

- `GET /api/mindbody/required-fields` - Fetches required fields
- `POST /api/mindbody/contact` - Creates contact form prospect
- `POST /api/mindbody/waitlist` - Creates waitlist prospect
- `POST /api/mindbody/membership-inquiry` - Creates membership inquiry prospect
- Duplicate client error handling (409)
- Proper field mapping from forms to API

### Form to API Mapping

**Contact Form**:

```typescript
{
  FirstName: formData.firstName,
  LastName: formData.lastName,
  Email: formData.email,
  MobilePhone: formData.phone,
  IsProspect: true,
  Notes: formData.message,
  SendScheduleEmails: false,
  SendAccountEmails: false,
  SendPromotionalEmails: false
}
```

**Waitlist Form**:

```typescript
{
  FirstName: formData.firstName,
  LastName: formData.lastName,
  Email: formData.email,
  MobilePhone: formData.phone,
  IsProspect: true,
  Notes: `Waitlist interest: ${formData.interestAreas?.join(', ')}`,
  SendScheduleEmails: false,
  SendAccountEmails: false,
  SendPromotionalEmails: false
}
```

**Membership Inquiry Form**:

```typescript
{
  FirstName: formData.firstName,
  LastName: formData.lastName,
  Email: formData.email,
  MobilePhone: formData.phone,
  IsProspect: true,
  Notes: `Membership inquiry - Tier: ${formData.membershipTier}\n${formData.additionalInfo}`,
  SendScheduleEmails: false,
  SendAccountEmails: false,
  SendPromotionalEmails: false
}
```

## Related Documentation

- [Main Documentation Index](./README.md)
- [Endpoint Details by Form](./ENDPOINTS_BY_FORM.md)
- [Complete Models Reference](./MODELS.md)
- [API Best Practices](./BEST_PRACTICES.md)
- [API Setup Guide](./SETUP.md)

---

**Last Updated**: Based on official Mindbody API 6.0 Add Client tutorial
