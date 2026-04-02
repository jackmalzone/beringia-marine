# Mindbody API Test Results

**Date**: December 10, 2025  
**Site ID**: `5745503`  
**API Key**: `a431330263df42b886bc5eb7fbcafbe7`  
**Status**: ✅ **API Access Working**

---

## Test Results Summary

### ✅ Test 1: Get Required Client Fields

**Endpoint**: `GET /client/requiredclientfields`

**Request**:

```bash
curl -X GET 'https://api.mindbodyonline.com/public/v6/client/requiredclientfields' \
  -H 'Api-Key: a431330263df42b886bc5eb7fbcafbe7' \
  -H 'SiteId: 5745503' \
  -H 'User-Agent: Vital-Ice'
```

**Response**: ✅ **SUCCESS** (HTTP 200)

```json
{
  "RequiredClientFields": ["AddressLine1", "State", "City", "PostalCode", "MobilePhone", "Email"]
}
```

**Analysis**:

- ✅ API credentials are valid
- ✅ Site ID is correct
- ✅ Endpoint is accessible
- ⚠️ **Important**: Required fields include address fields that our forms may not currently collect

---

### ✅ Test 2: Add Client (Test Mode) - With All Required Fields

**Endpoint**: `POST /client/addclient`

**Request**:

```bash
curl -X POST 'https://api.mindbodyonline.com/public/v6/client/addclient' \
  -H 'Api-Key: a431330263df42b886bc5eb7fbcafbe7' \
  -H 'SiteId: 5745503' \
  -H 'Content-Type: application/json' \
  -d '{
    "FirstName": "Test",
    "LastName": "API",
    "Email": "test.api@example.com",
    "MobilePhone": "555-123-4567",
    "AddressLine1": "123 Test St",
    "City": "San Francisco",
    "State": "CA",
    "PostalCode": "94102",
    "IsProspect": true,
    "Test": true
  }'
```

**Response**: ✅ **SUCCESS** (HTTP 200)

```json
{
  "Client": {
    "FirstName": "Test",
    "LastName": "API",
    "Email": "test.api@example.com",
    "MobilePhone": "555-123-4567",
    "AddressLine1": "123 Test St",
    "City": "San Francisco",
    "State": "CA",
    "PostalCode": "94102",
    "IsProspect": true,
    "Action": "Added"
    // ... full client object
  }
}
```

**Analysis**:

- ✅ Client creation works when all required fields are provided
- ✅ Test mode (`Test: true`) works correctly
- ✅ Prospect flag (`IsProspect: true`) is set correctly
- ✅ All address fields are properly saved

---

### ⚠️ Test 3: Add Client - Missing Required Fields

**Request**: Same as Test 2, but without address fields

**Response**: ❌ **ERROR** (HTTP 400)

```json
{
  "Error": {
    "Message": "The following are required: AddressLine1, City, State, PostalCode",
    "Code": "MissingRequiredFields"
  }
}
```

**Analysis**:

- ✅ Error handling works correctly
- ⚠️ **Action Required**: Forms need to collect address fields

---

## Required Fields for Your Business

Based on the API response, your Mindbody business requires:

1. ✅ **FirstName** - Already collected
2. ✅ **LastName** - Already collected
3. ✅ **Email** - Already collected
4. ✅ **MobilePhone** - Already collected (optional in forms)
5. ⚠️ **AddressLine1** - **NOT currently collected** - **NEEDS TO BE ADDED**
6. ⚠️ **City** - **NOT currently collected** - **NEEDS TO BE ADDED**
7. ⚠️ **State** - **NOT currently collected** - **NEEDS TO BE ADDED**
8. ⚠️ **PostalCode** - **NOT currently collected** - **NEEDS TO BE ADDED**

---

## Action Items

### 🔴 Critical: Update Forms

All three forms (Contact, Waitlist, Membership Inquiry) need to collect:

- Address Line 1 (required)
- City (required)
- State (required)
- Postal Code (required)

### Options:

1. **Add address fields to all forms** (recommended)
2. **Use default/placeholder values** (not recommended for real data)
3. **Make address optional in Mindbody settings** (if possible)

### 📋 Forms to Update

- [ ] `packages/ui/src/forms/ContactForm.tsx`
- [ ] `packages/ui/src/forms/WaitlistForm.tsx`
- [ ] `packages/ui/src/forms/MembershipInquiryForm.tsx`

### 📋 API Routes to Update

- [ ] `apps/web/src/app/api/mindbody/contact/route.ts` - Map address fields
- [ ] `apps/web/src/app/api/mindbody/waitlist/route.ts` - Map address fields
- [ ] `apps/web/src/app/api/mindbody/membership-inquiry/route.ts` - Map address fields

---

## Next Steps

1. ✅ **API Access Verified** - Credentials work correctly
2. ✅ **Endpoints Working** - Both GET and POST endpoints respond correctly
3. ⚠️ **Update Forms** - Add address fields to match required fields
4. ⚠️ **Update API Routes** - Map address fields in request payloads
5. 🧪 **Test End-to-End** - Test complete form submission flow

---

## Test Commands for Future Use

### Test Required Fields

```bash
curl http://localhost:3000/api/mindbody/required-fields
```

### Test Contact Form (after adding address fields)

```bash
curl -X POST http://localhost:3000/api/mindbody/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "addressLine1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94102",
    "message": "Test message"
  }'
```

---

## Summary

✅ **API Integration Status**: **WORKING**  
✅ **Credentials**: **VALID**  
✅ **Endpoints**: **RESPONDING CORRECTLY**  
⚠️ **Forms**: **NEED TO BE UPDATED** to collect required address fields

The API is ready to use once the forms are updated to collect the required address information.

---

**Last Updated**: Test results from December 10, 2025
