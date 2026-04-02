# Mindbody API Setup - Vital-Ice

## Current Status

✅ **API Key**: `a431330263df42b886bc5eb7fbcafbe7`  
✅ **Site ID**: `5745503`  
✅ **Base URL**: `https://api.mindbodyonline.com/public/v6/`  
✅ **API Version**: 6  
✅ **App Name**: Vital-Ice
✅ **Access**: Granted and activated

## Environment Variables Needed

Add these to your `.env.local` or deployment environment:

```bash
# Required
MBO_API_KEY=a431330263df42b886bc5eb7fbcafbe7
MBO_SITE_ID=5745503

# Optional (defaults shown)
MBO_API_BASE_URL=https://api.mindbodyonline.com/public/v6/
MBO_AUTHORIZATION=[OPTIONAL_STAFF_TOKEN]

# Optional - Staff assignment for contact logs
# Find staff ID by running: node scripts/find-staff-id.js
# Or find manually in Mindbody dashboard
MBO_DEFAULT_STAFF_ID=[STAFF_ID_FOR_INFO_VITALICESF_COM]

# Optional - Email services
RESEND_API_KEY=[RESEND_API_KEY]
EMAIL_USER=[EMAIL_USER]
EMAIL_PASSWORD=[EMAIL_PASSWORD]
```

**✅ Access Status**: API access has been granted and activated. Ready for testing!

**Note**: The config package also supports `MINDBODY_API_KEY` and `MINDBODY_SITE_ID` as fallbacks.

## Implementation Status

### ✅ Completed

- [x] Monorepo structure with `@vital-ice/mindbody-sdk` package
- [x] API client with retry logic and error handling
- [x] TypeScript types for all endpoints
- [x] API routes for all form types:
  - `/api/mindbody/required-fields` (GET)
  - `/api/mindbody/contact` (POST)
  - `/api/mindbody/waitlist` (POST)
  - `/api/mindbody/membership-inquiry` (POST)
  - `/api/mindbody/lead` (POST - generic)
- [x] Form components with React Hook Form + Zod validation
- [x] Environment variable validation with Zod
- [x] Sentry error tracking integration
- [x] Duplicate client error handling (409 status)

### ✅ Ready for Testing

- [x] Site ID provided: `5745503`
- [x] API access granted and activated
- [ ] Add Site ID to environment variables (`.env.local` and Vercel)
- [ ] Test `GET /client/requiredclientfields` endpoint
- [ ] Test form submissions end-to-end
- [ ] Verify required fields from Mindbody match form fields

### 📋 Future Enhancements

- [ ] Implement `GET /site/memberships` to make membership dropdown dynamic
- [ ] Integrate `GET /site/prospectstages` for LeadManagement tracking
- [ ] Add `LeadChannelId` mapping if using LeadManagement
- [ ] Test with Business Mode vs Consumer Mode

## Endpoints by Form

See [mindbody-endpoints-by-form.md](./mindbody-endpoints-by-form.md) for detailed endpoint mapping.

### Quick Reference

| Form                   | Required Endpoints                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Contact**            | `GET /client/requiredclientfields`<br>`POST /client/addclient`                                             |
| **Waitlist**           | `GET /client/requiredclientfields`<br>`POST /client/addclient`                                             |
| **Membership Inquiry** | `GET /client/requiredclientfields`<br>`GET /site/memberships` (should be used)<br>`POST /client/addclient` |

## API Authentication

All endpoints require:

- **Header**: `Api-Key: a431330263df42b886bc5eb7fbcafbe7`
- **Header**: `SiteId: 5745503`
- **Header**: `Content-Type: application/json` (for POST)
- **Header**: `Accept: application/json`
- **Header**: `authorization: [OPTIONAL]` (staff token for Business Mode)
- **Header**: `User-Agent: Vital-Ice` (optional but recommended)

**Note**: Header names are case-sensitive. Use `Api-Key` and `SiteId` (capital letters).

## Important Notes

### Duplicate Prevention

⚠️ **Starting May 11, 2020**: All API versions no longer allow duplicate clients. A duplicate is defined as two profiles with the same:

- First Name
- Last Name
- Email

### Business Mode vs Consumer Mode

- **Business Mode**: When `authorization` header (User Token) is provided, API respects Business Mode required fields
- **Consumer Mode**: When `authorization` header is omitted, API respects Consumer Mode required fields
- **Always call `GET /client/requiredclientfields` first** to ensure you're collecting all required fields

### Testing

- Use `Test: true` parameter in `AddClientRequest` to validate without creating data
- Sandbox environment available for testing

## Next Steps

1. ✅ **Site ID obtained**: `5745503`
2. ✅ **API access granted**: Client has provided access
3. **Add to environment variables**:
   - Create/update `.env.local` for local development
   - Add to Vercel environment variables for production
4. **Test required fields endpoint**: `GET /api/mindbody/required-fields`
5. **Test form submissions** with test data (use `Test: true` parameter first)
6. **Verify duplicate handling** works correctly
7. **Implement dynamic memberships** (optional enhancement)

## Documentation

All Mindbody documentation is organized in the [`docs/mindbody/`](./README.md) directory:

- [Main Index](./README.md) - Complete documentation index
- [Endpoint Details by Form](./ENDPOINTS_BY_FORM.md)
- [Complete API Reference](./API_REFERENCE.md)
- [Implementation Status](./IMPLEMENTATION.md)
- [Best Practices & Additional Info](./BEST_PRACTICES.md) - Pagination, error handling, testing, request deduplication
- [Add Client Tutorial](./TUTORIAL.md) - Step-by-step guide for adding clients
- [Complete Models Reference](./MODELS.md) - All API models and structures
- [Widget Reference](./WIDGETS.md) - Mindbody widget integration

---

**Last Updated**: Based on official Mindbody API 6.0 documentation
