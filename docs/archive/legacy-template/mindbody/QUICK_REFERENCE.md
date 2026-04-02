# Mindbody API Endpoints - Quick Reference

## Required for Phase 1 (Current Implementation)

### Primary Endpoint

**POST /client/addclient**

- **Purpose**: Create prospects/leads from form submissions
- **Used by**: Contact form, Waitlist form, Membership inquiry form
- **Status**: ✅ Fully implemented and ready

**What we need:**

1. API Key (`MBO_API_KEY`)
2. Site ID (`MBO_SITE_ID`)
3. Request/response examples for `POST /client/addclient`
4. Error response format (especially duplicate client errors)

---

### Supporting Endpoints (Implemented, Optional Usage)

**GET /client/requiredclientfields**

- Get required fields before form submission
- ✅ Implemented

**GET /site/prospectstages**

- Get prospect stages for sales pipeline
- ✅ Implemented (can be used later)

**GET /site/memberships**

- Get membership tiers
- ✅ Implemented (can be used later)

**GET /site/liabilitywaiver**

- Get waiver information
- ✅ Implemented (for future waiver handling)

---

## What to Provide

### 1. API Credentials

```bash
MBO_API_KEY=your_key_here
MBO_SITE_ID=your_site_id_here
```

### 2. POST /client/addclient Documentation

- Complete request body schema
- Required field list
- Response structure
- Error codes (especially duplicate client: 409?)
- Example successful request
- Example error responses

### 3. Optional Configuration

- LeadChannelId values (if using LeadManagement)
- ProspectStage IDs (if using sales pipeline)
- Membership tier names

---

## Implementation Files

- **API Client**: `packages/mindbody-sdk/src/client.ts`
- **Types**: `packages/mindbody-sdk/src/types.ts`
- **API Routes**: `apps/web/src/app/api/mindbody/*/route.ts`
- **Forms**: `packages/ui/src/forms/*`

All code is ready - just needs API credentials and endpoint details to test!

## Related Documentation

- [Main Documentation Index](./README.md)
- [Setup Guide](./SETUP.md) - Environment variables and configuration
- [Endpoints by Form](./ENDPOINTS_BY_FORM.md) - Detailed endpoint mapping
- [Complete API Reference](./API_REFERENCE.md) - Full endpoint documentation
- [Add Client Tutorial](./TUTORIAL.md) - Step-by-step guide
