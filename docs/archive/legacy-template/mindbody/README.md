# Mindbody Integration Documentation

Complete documentation for the Mindbody API 6.0 integration with Vital Ice.

## 📚 Documentation Index

### 🚀 Getting Started

1. **[Quick Start Guide](./QUICK_START.md)** - ⚡ **START HERE** - Get up and running fast
   - Environment variables setup
   - Quick testing steps
   - Testing checklist
   - Troubleshooting

2. **[Setup Guide](./SETUP.md)** - Initial setup, environment variables, and configuration
   - API credentials setup
   - Environment variable configuration
   - Implementation status
   - Next steps

3. **[Add Client Tutorial](./TUTORIAL.md)** - Step-by-step guide for adding clients
   - Complete workflow
   - Request/response examples
   - Error handling
   - Best practices

### 📋 API Reference

4. **[API Endpoints by Form](./ENDPOINTS_BY_FORM.md)** - Endpoint mapping for each form type
   - Contact form endpoints
   - Waitlist form endpoints
   - Membership inquiry endpoints
   - Required vs optional endpoints

5. **[Quick Reference](./QUICK_REFERENCE.md)** - Quick endpoint summary and status

6. **[Complete API Reference](./API_REFERENCE.md)** - Full Mindbody API 6.0 endpoint reference
   - All available endpoints
   - Request/response models
   - Authentication requirements
   - Important notes

7. **[Models & Structures Reference](./MODELS.md)** - Complete data models reference
   - Client models
   - Appointment models
   - Class models
   - Site models
   - All API structures

### 🎯 Implementation

8. **[Forms Implementation](./FORMS_IMPLEMENTATION.md)** - ⭐ **NEW** - Complete guide to form implementation strategy
   - Implementation strategy for all forms
   - Contact log configuration
   - Staff assignment
   - Error handling patterns
   - Best practices

9. **[Contact Log Notifications](./CONTACT_LOG_NOTIFICATIONS.md)** - How contact logs work for staff notifications
   - Contact log creation
   - Email notification setup
   - Staff assignment
   - Message handling

10. **[Membership Inquiry Endpoints](./MEMBERSHIP_INQUIRY_ENDPOINTS.md)** - Detailed endpoint usage for membership form
    - Endpoint flow
    - Request/response examples
    - Contact log implementation

11. **[Implementation Status](./IMPLEMENTATION.md)** - Current implementation status
    - Completed features
    - Ready for testing
    - Future enhancements
    - What's needed from you

12. **[Best Practices](./BEST_PRACTICES.md)** - API usage best practices
    - Pagination
    - Date/time handling
    - Error handling
    - Rate limiting
    - Request deduplication
    - Testing strategies

### 🎨 Widget Integration

13. **[Widget Reference](./WIDGETS.md)** - Mindbody Healcode widget reference

- Widget code snippets
- Widget IDs
- Technical notes
- Known issues

### 🧪 Testing

14. **[Testing Guide](./TESTING.md)** - Complete testing guide

- Multiple testing methods (curl, browser, HTTP clients)
- Test scenarios and checklists
- Debugging tips
- Troubleshooting common issues

### 🔧 Troubleshooting

15. **[Troubleshooting Guide](../troubleshooting/MINDBODY_WIDGET_TROUBLESHOOTING.md)** - Common issues and solutions
16. **[Support Diagnostic Report](../troubleshooting/MINDBODY_SUPPORT_DIAGNOSTIC_REPORT.md)** - Diagnostic information

## Quick Links

### For Developers

- **Quick Start**: [Quick Start Guide](./QUICK_START.md) ⚡ **START HERE**
- **Starting Integration**: [Setup Guide](./SETUP.md)
- **Adding Clients**: [Tutorial](./TUTORIAL.md)
- **API Reference**: [Endpoints by Form](./ENDPOINTS_BY_FORM.md)
- **Data Models**: [Models Reference](./MODELS.md)

### For Reference

- **All Endpoints**: [API Reference](./API_REFERENCE.md)
- **Best Practices**: [Best Practices](./BEST_PRACTICES.md)
- **Widgets**: [Widget Reference](./WIDGETS.md)

## Current Status

✅ **Completed**:

- Monorepo structure with Mindbody SDK package
- API client with retry logic and error handling
- TypeScript types for all endpoints
- API routes for all form types with contact log notifications
- Form components with validation
- Environment variable validation
- Duplicate client handling (check existing clients first)
- Contact log creation with email notifications
- Staff assignment for contact logs
- Client search functionality

✅ **Ready for Testing**:

- [x] Site ID: `5745503`
- [x] API access granted
- [ ] Add to environment variables (`.env.local` and Vercel)
- [ ] Test form submissions end-to-end
- [ ] Verify required fields from Mindbody

📋 **Future Enhancements**:

- Dynamic membership dropdown
- Prospect stages integration
- LeadManagement tracking

## API Configuration

**App Name**: Vital-Ice  
**API Key**: `a431330263df42b886bc5eb7fbcafbe7`  
**Site ID**: `5745503` ✅  
**Base URL**: `https://api.mindbodyonline.com/public/v6/`  
**API Version**: 6  
**Status**: ✅ Access granted and activated

## Forms & Endpoints

| Form               | Endpoint                                | Status         |
| ------------------ | --------------------------------------- | -------------- |
| Contact            | `POST /api/mindbody/contact`            | ✅ Implemented |
| Waitlist           | `POST /api/mindbody/waitlist`           | ✅ Implemented |
| Membership Inquiry | `POST /api/mindbody/membership-inquiry` | ✅ Implemented |
| Required Fields    | `GET /api/mindbody/required-fields`     | ✅ Implemented |

## Related Documentation

- [Main API Documentation](../api/README.md)
- [Troubleshooting](../troubleshooting/README.md)
- [Monorepo Setup](../MONOREPO_SETUP.md)

---

**Last Updated**: Based on Mindbody API 6.0 documentation and current implementation
