# Testing Mindbody API Endpoints

Complete guide for testing all Mindbody API endpoints.

## Prerequisites

### 1. Set Up Environment Variables

Create `.env.local` in the project root:

```bash
# Mindbody API Configuration
MBO_API_KEY=a431330263df42b886bc5eb7fbcafbe7
MBO_SITE_ID=5745503
MBO_API_BASE_URL=https://api.mindbodyonline.com/public/v6/
```

### 2. Start Development Server

```bash
# From project root
pnpm dev

# Or if using npm/yarn
npm run dev
# or
yarn dev
```

The server will start on `http://localhost:3000` (or the port shown in terminal).

---

## Testing Methods

### Method 1: Test via Next.js API Routes (Recommended)

These routes handle authentication, error handling, and response formatting automatically.

#### 1. Test Required Fields Endpoint

```bash
curl http://localhost:3000/api/mindbody/required-fields
```

**Expected Success Response**:

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

**What to Check**:

- ✅ Response has `success: true`
- ✅ `RequiredClientFields` array contains field names
- ✅ Note which fields are required (may need to update forms)

#### 2. Test Contact Form Endpoint

```bash
curl -X POST http://localhost:3000/api/mindbody/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "555-123-4567",
    "message": "Test contact form submission"
  }'
```

**Expected Success Response**:

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

**Expected Duplicate Error (409)**:

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_CLIENT",
    "message": "A client with this name and email already exists"
  }
}
```

#### 3. Test Waitlist Form Endpoint

```bash
curl -X POST http://localhost:3000/api/mindbody/waitlist \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "555-987-6543",
    "interestAreas": ["Cold Plunge", "Infrared Sauna"]
  }'
```

#### 4. Test Membership Inquiry Form Endpoint

```bash
curl -X POST http://localhost:3000/api/mindbody/membership-inquiry \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Bob",
    "lastName": "Johnson",
    "email": "bob.johnson@example.com",
    "phone": "555-555-5555",
    "membershipTier": "Founding Member",
    "additionalInfo": "Interested in founding membership benefits"
  }'
```

---

### Method 2: Test Directly Against Mindbody API

Test the Mindbody API directly (bypasses Next.js routes):

#### 1. Test Required Fields

```bash
curl -X GET \
  'https://api.mindbodyonline.com/public/v6/client/requiredclientfields' \
  -H 'Api-Key: a431330263df42b886bc5eb7fbcafbe7' \
  -H 'SiteId: 5745503' \
  -H 'User-Agent: Vital-Ice' \
  -H 'Accept: application/json'
```

#### 2. Test Add Client (Direct API)

```bash
curl -X POST \
  'https://api.mindbodyonline.com/public/v6/client/addclient' \
  -H 'Api-Key: a431330263df42b886bc5eb7fbcafbe7' \
  -H 'SiteId: 5745503' \
  -H 'User-Agent: Vital-Ice' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "FirstName": "Test",
    "LastName": "User",
    "Email": "test.user@example.com",
    "MobilePhone": "555-123-4567",
    "IsProspect": true,
    "Test": true
  }'
```

**Note**: `"Test": true` validates the request without creating data in the database.

---

### Method 3: Test via Browser/Forms

#### 1. Test Required Fields in Browser

Open in browser:

```
http://localhost:3000/api/mindbody/required-fields
```

You should see JSON response with required fields.

#### 2. Test Forms on Website

1. Navigate to pages with forms:
   - Contact page: `http://localhost:3000/contact`
   - Waitlist page (if exists)
   - Membership inquiry page (if exists)

2. Fill out and submit forms
3. Check browser console for errors
4. Check network tab for API responses
5. Verify success/error messages display correctly

---

### Method 4: Using HTTP Client Tools

#### Postman Collection

Create a Postman collection with these requests:

**Base URL**: `http://localhost:3000/api/mindbody`

**Headers** (for all requests):

```
Content-Type: application/json
```

**Requests**:

1. **GET Required Fields**
   - Method: `GET`
   - URL: `{{baseUrl}}/required-fields`

2. **POST Contact**
   - Method: `POST`
   - URL: `{{baseUrl}}/contact`
   - Body (JSON):

   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "phone": "555-123-4567",
     "message": "Test message"
   }
   ```

3. **POST Waitlist**
   - Method: `POST`
   - URL: `{{baseUrl}}/waitlist`
   - Body (JSON):

   ```json
   {
     "firstName": "Jane",
     "lastName": "Smith",
     "email": "jane@example.com",
     "phone": "555-987-6543",
     "interestAreas": ["Cold Plunge"]
   }
   ```

4. **POST Membership Inquiry**
   - Method: `POST`
   - URL: `{{baseUrl}}/membership-inquiry`
   - Body (JSON):
   ```json
   {
     "firstName": "Bob",
     "lastName": "Johnson",
     "email": "bob@example.com",
     "phone": "555-555-5555",
     "membershipTier": "Founding Member"
   }
   ```

#### VS Code REST Client

Create `test-api.http`:

```http
### Get Required Fields
GET http://localhost:3000/api/mindbody/required-fields

### Contact Form
POST http://localhost:3000/api/mindbody/contact
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "message": "Test message"
}

### Waitlist Form
POST http://localhost:3000/api/mindbody/waitlist
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "555-987-6543",
  "interestAreas": ["Cold Plunge", "Infrared Sauna"]
}

### Membership Inquiry
POST http://localhost:3000/api/mindbody/membership-inquiry
Content-Type: application/json

{
  "firstName": "Bob",
  "lastName": "Johnson",
  "email": "bob@example.com",
  "phone": "555-555-5555",
  "membershipTier": "Founding Member",
  "additionalInfo": "Interested in founding membership"
}
```

---

## Testing Checklist

### ✅ Basic Functionality

- [ ] Required fields endpoint returns data
- [ ] Contact form creates prospect successfully
- [ ] Waitlist form creates prospect successfully
- [ ] Membership inquiry form creates prospect successfully
- [ ] All endpoints return proper JSON structure

### ✅ Error Handling

- [ ] Duplicate client error (409) handled correctly
- [ ] Missing required fields error (400) handled correctly
- [ ] Invalid API key error handled
- [ ] Network errors handled gracefully
- [ ] Error messages are user-friendly

### ✅ Data Validation

- [ ] Required fields are validated
- [ ] Email format validated
- [ ] Phone number format handled
- [ ] Form data properly mapped to API request

### ✅ Response Format

- [ ] Success responses include `clientId` and `uniqueId`
- [ ] Error responses include `code` and `message`
- [ ] All responses have `success` boolean field

---

## Common Test Scenarios

### Scenario 1: First-Time Submission

**Test**: Submit a form with new email address

**Expected**:

- ✅ Success response
- ✅ Client created in Mindbody
- ✅ Returns `clientId` and `uniqueId`

### Scenario 2: Duplicate Submission

**Test**: Submit same form twice with same email

**Expected**:

- ✅ First submission: Success
- ✅ Second submission: 409 Duplicate Client error
- ✅ Error message: "A client with this name and email already exists"

### Scenario 3: Missing Required Fields

**Test**: Submit form without required fields

**Expected**:

- ✅ 400 Validation Error
- ✅ Error message lists missing fields

### Scenario 4: Invalid Email Format

**Test**: Submit form with invalid email

**Expected**:

- ✅ 400 Validation Error
- ✅ Error message about invalid email

### Scenario 5: Network Error Simulation

**Test**: Disconnect internet and submit form

**Expected**:

- ✅ Error handled gracefully
- ✅ User sees appropriate error message
- ✅ Error logged to Sentry (if configured)

---

## Debugging Tips

### Check Environment Variables

```bash
# Verify env vars are loaded
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.MBO_API_KEY, process.env.MBO_SITE_ID)"
```

### Check Server Logs

Watch the terminal where `pnpm dev` is running for:

- API request logs
- Error messages
- Sentry error reports

### Check Browser Console

Open browser DevTools → Console:

- Look for JavaScript errors
- Check network requests in Network tab
- Verify API responses

### Check Sentry (if configured)

1. Go to Sentry dashboard
2. Check for error reports
3. Review error context and stack traces

### Test with Verbose Output

```bash
# Add -v flag for verbose curl output
curl -v -X POST http://localhost:3000/api/mindbody/contact \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}'
```

---

## Production Testing

After deploying to Vercel:

1. **Add Environment Variables** in Vercel dashboard
2. **Test Production URLs**:
   ```bash
   curl https://vitalicesf.com/api/mindbody/required-fields
   ```
3. **Monitor Sentry** for production errors
4. **Check Vercel Logs** for API route execution

---

## Troubleshooting

### Error: "Invalid environment variables"

**Solution**:

- Check `.env.local` exists in project root
- Verify variable names are correct (`MBO_API_KEY`, `MBO_SITE_ID`)
- Restart dev server after adding env vars

### Error: "InvalidSiteId" or "InvalidSourceCredentials"

**Solution**:

- Verify Site ID: `5745503`
- Verify API Key: `a431330263df42b886bc5eb7fbcafbe7`
- Check API access has been granted

### Error: "MissingRequiredFields"

**Solution**:

- Call `GET /api/mindbody/required-fields` first
- Update forms to collect all required fields
- Check if `EmergContact` is required (needs all emergency contact fields)

### Error: Connection Refused

**Solution**:

- Ensure dev server is running (`pnpm dev`)
- Check correct port (usually 3000)
- Verify no firewall blocking localhost

### No Response / Timeout

**Solution**:

- Check Mindbody API status
- Verify network connection
- Check rate limits (2000 RPM max)
- Review retry logic in client implementation

---

## Related Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started quickly
- [Setup Guide](./SETUP.md) - Complete setup instructions
- [Add Client Tutorial](./TUTORIAL.md) - Detailed tutorial
- [Best Practices](./BEST_PRACTICES.md) - API usage guidelines

---

**Last Updated**: Testing guide for Site ID `5745503`

