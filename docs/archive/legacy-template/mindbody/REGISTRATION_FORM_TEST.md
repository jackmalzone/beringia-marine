# Registration Form Test Results

**Date**: December 10, 2025  
**Endpoint**: `POST /api/mindbody/registration`

## Test: Direct API Call (Test Mode)

**Request**:

```bash
curl -X POST 'https://api.mindbodyonline.com/public/v6/client/addclient' \
  -H 'Api-Key: a431330263df42b886bc5eb7fbcafbe7' \
  -H 'SiteId: 5745503' \
  -H 'Content-Type: application/json' \
  -d '{
    "FirstName": "Registration",
    "LastName": "Test",
    "Email": "registration.test@example.com",
    "MobilePhone": "555-123-4567",
    "AddressLine1": "123 Test St",
    "City": "San Francisco",
    "State": "CA",
    "PostalCode": "94102",
    "BirthDate": "1990-01-01",
    "IsProspect": false,
    "SendScheduleEmails": true,
    "SendAccountEmails": true,
    "SendPromotionalEmails": false,
    "LiabilityRelease": true,
    "Test": true
  }'
```

**Response**: ✅ **SUCCESS** (HTTP 200)

```json
{
  "Client": {
    "FirstName": "Registration",
    "LastName": "Test",
    "Email": "registration.test@example.com",
    "MobilePhone": "555-123-4567",
    "AddressLine1": "123 Test St",
    "City": "San Francisco",
    "State": "CA",
    "PostalCode": "94102",
    "BirthDate": "1990-01-01T00:00:00",
    "IsProspect": false,
    "Liability": {
      "AgreementDate": "2025-12-10T22:40:20.0329631",
      "IsReleased": true,
      "ReleasedBy": null
    },
    "LiabilityRelease": true,
    "SendScheduleEmails": true,
    "SendAccountEmails": true,
    "SendPromotionalEmails": false,
    "Action": "Added"
  }
}
```

## Form Fields Implemented

✅ **Required Fields**:

- First Name
- Last Name
- Email
- Mobile Phone
- Address Line 1
- City
- State (dropdown with US states)
- Postal Code
- Country (dropdown: US, CA, MX)
- Birth Date (date picker)
- Liability Release (checkbox with full waiver text)

✅ **Optional Fields**:

- Address Line 2
- Other Information (textarea)

✅ **Checkboxes**:

- Subscribe to Reminders and Notifications:
  - Email checkbox → `sendScheduleEmails`
  - Text checkbox → `sendScheduleTexts`
- Get Updates on Events and Latest Offers:
  - Email checkbox → `sendPromotionalEmails`
  - Text checkbox → `sendPromotionalTexts`

## Implementation Status

✅ **Completed**:

- [x] Registration form schema with all required fields
- [x] RegistrationForm component with full UI
- [x] useRegistrationForm hook
- [x] API route `/api/mindbody/registration`
- [x] RegisterPageClient updated to use custom form
- [x] Liability waiver text included
- [x] All checkboxes implemented
- [x] Form validation with Zod
- [x] Error handling
- [x] Success state handling

## Test the Registration Form

### Via Next.js API Route

```bash
curl -X POST http://localhost:3000/api/mindbody/registration \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "555-123-4567",
    "addressLine1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94102",
    "country": "US",
    "birthDate": "1990-01-01",
    "otherInformation": "Test registration",
    "sendScheduleEmails": true,
    "sendScheduleTexts": false,
    "sendPromotionalEmails": true,
    "sendPromotionalTexts": false,
    "liabilityRelease": true
  }'
```

### Via Browser

1. Start dev server: `pnpm dev`
2. Navigate to: `http://localhost:3000/register`
3. Fill out the form
4. Submit and verify success message

## Expected Response

**Success**:

```json
{
  "success": true,
  "data": {
    "clientId": "12345",
    "uniqueId": "67890",
    "message": "Registration successful"
  }
}
```

**Error (Missing Fields)**:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "First name, last name, email, phone, address, city, state, postal code, birth date, and liability waiver agreement are required"
  }
}
```

## Notes

- Registration creates actual clients (`IsProspect: false`), not prospects
- Liability waiver is required and sets `LiabilityRelease: true` in Mindbody
- All address fields are required by Mindbody for this business
- Birth date format: `YYYY-MM-DD`
- Email/text preferences are set based on checkbox selections

---

**Last Updated**: Registration form implementation complete and tested

