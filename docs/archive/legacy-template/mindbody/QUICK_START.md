# Mindbody API - Quick Start Guide

**Status**: ✅ Ready to test - API access granted!

## Configuration

### Environment Variables

Add these to your `.env.local` file (for local development):

```bash
# Mindbody API Configuration
MBO_API_KEY=a431330263df42b886bc5eb7fbcafbe7
MBO_SITE_ID=5745503
MBO_API_BASE_URL=https://api.mindbodyonline.com/public/v6/
```

### Vercel Production

Add the same environment variables to your Vercel project:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `MBO_API_KEY` = `a431330263df42b886bc5eb7fbcafbe7`
   - `MBO_SITE_ID` = `5745503`
   - `MBO_API_BASE_URL` = `https://api.mindbodyonline.com/public/v6/` (optional, has default)

## Testing Steps

### 1. Test Required Fields Endpoint

First, check what fields are required for your business:

```bash
# Local development
curl http://localhost:3000/api/mindbody/required-fields

# Or test directly against Mindbody API
curl -X GET \
  'https://api.mindbodyonline.com/public/v6/client/requiredclientfields' \
  -H 'Api-Key: a431330263df42b886bc5eb7fbcafbe7' \
  -H 'SiteId: 5745503' \
  -H 'User-Agent: Vital-Ice'
```

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "RequiredClientFields": [
      "FirstName",
      "LastName",
      "Email"
      // ... other required fields
    ]
  }
}
```

### 2. Test Contact Form Submission (Test Mode)

Test without creating actual data:

```bash
curl -X POST http://localhost:3000/api/mindbody/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "message": "Test message"
  }'
```

**Note**: The API route will automatically set `Test: true` if you want to validate without creating data. Check the implementation for test mode support.

### 3. Test Waitlist Form

```bash
curl -X POST http://localhost:3000/api/mindbody/waitlist \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "interestAreas": ["Cold Plunge", "Infrared Sauna"]
  }'
```

### 4. Test Membership Inquiry Form

```bash
curl -X POST http://localhost:3000/api/mindbody/membership-inquiry \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "membershipTier": "Founding Member",
    "additionalInfo": "Interested in founding membership"
  }'
```

## Expected Responses

### Success Response

```json
{
  "success": true,
  "data": {
    "clientId": "12345",
    "uniqueId": "67890",
    "message": "Client added successfully"
  }
}
```

### Duplicate Client Error (409)

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_CLIENT",
    "message": "A client with this name and email already exists"
  }
}
```

### Missing Required Fields (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "First name, last name, and email are required"
  }
}
```

## Testing Checklist

- [ ] Environment variables set in `.env.local`
- [ ] Environment variables set in Vercel (for production)
- [ ] Test `GET /api/mindbody/required-fields` endpoint
- [ ] Verify required fields match form fields
- [ ] Test contact form submission (with test data)
- [ ] Test waitlist form submission (with test data)
- [ ] Test membership inquiry form submission (with test data)
- [ ] Verify duplicate client handling (try submitting same email twice)
- [ ] Check Sentry for any errors
- [ ] Test on production after deployment

## Troubleshooting

### Error: "Invalid environment variables"

- Check that `MBO_API_KEY` and `MBO_SITE_ID` are set
- Restart your development server after adding env vars
- Verify no typos in variable names

### Error: "InvalidSiteId" or "InvalidSourceCredentials"

- Verify Site ID is correct: `5745503`
- Check that API access has been granted
- Ensure API key is correct: `a431330263df42b886bc5eb7fbcafbe7`

### Error: "MissingRequiredFields"

- Call `GET /api/mindbody/required-fields` first
- Check what fields are required for your business
- Update forms to collect all required fields

### Error: "TooManyRequests" (429)

- You're hitting rate limits (2000 RPM recommended)
- Our implementation has retry logic, but reduce request frequency if persistent

## Next Steps After Testing

1. ✅ Verify all forms work correctly
2. ✅ Test duplicate client handling
3. ✅ Verify required fields are collected
4. 📋 Consider implementing dynamic memberships dropdown
5. 📋 Consider adding prospect stages for lead tracking
6. 📋 Consider adding LeadChannelId for LeadManagement

## Related Documentation

- [Complete Testing Guide](./TESTING.md) - **📖 Comprehensive testing methods and scenarios**
- [Setup Guide](./SETUP.md) - Complete setup instructions
- [Add Client Tutorial](./TUTORIAL.md) - Detailed tutorial
- [Best Practices](./BEST_PRACTICES.md) - API usage guidelines
- [Endpoints by Form](./ENDPOINTS_BY_FORM.md) - Endpoint details

---

**Last Updated**: Ready for testing with Site ID `5745503`
