# Mindbody API Best Practices & Additional Information

## Base URL

**Base URL**: `https://api.mindbodyonline.com/public/v6/`

**Note**: The trailing slash is included in the official base URL.

## Pagination

Most GET endpoints support pagination to handle larger amounts of data.

### Query Parameters

| Name     | Type   | Description                                        | Default | Maximum |
| -------- | ------ | -------------------------------------------------- | ------- | ------- |
| `limit`  | number | The number of results to include                   | 100     | 200     |
| `offset` | number | Number of records to skip before returning results | 0       | -       |

### Example Request

```bash
curl -X GET \
  'https://api.mindbodyonline.com/public/v6/class/classes?limit=10&offset=20' \
  -H 'Api-Key: {yourApiKey}' \
  -H 'authorization: {staffUserToken}' \
  -H 'SiteId: {yourSiteId}' \
  -A 'Vital-Ice'
```

### Response Structure

```json
{
  "PaginationResponse": {
    "RequestedLimit": 10,
    "RequestedOffset": 20,
    "PageSize": 10,
    "TotalResults": 128
  },
  "Classes": [
    // ... results
  ]
}
```

### Implementation Notes

- If you don't explicitly set a limit, requests default to **100 results** and **no offset**
- Maximum limit is **200 results** per request
- Use pagination for endpoints that return lists (classes, clients, appointments, etc.)

## Dates and Times

### Format

- **Format**: `YYYY-MM-DDTHH:mm:ss` (ISO 8601 / RFC 3339)
- **Time Zone**: All dates and times are in the **business owner's local time**
- **Best Practice**: Pass times **without UTC designation**

### Example

```json
{
  "StartDateTime": "2025-01-15T10:00:00",
  "BirthDate": "1990-05-20T00:00:00"
}
```

### Important Notes

- Dates are returned as strings (JSON doesn't have built-in date format)
- Always use ISO 8601 format to avoid errors
- The API considers the business's local time zone

## Error Handling

### Rate Limiting (429)

**Error Code**: `429 Too Many Requests`

- Rate limit has been reached
- **Recommended**: Keep requests to **2000 RPM or lower** for optimal performance
- Mindbody does not currently charge for calls that result in 429 errors
- **Our Implementation**: Already handles 429 with retry logic and exponential backoff

### Error Response Structure

```json
{
  "Error": {
    "Message": "Client 11123123874 does not exist.",
    "Code": "ClientNotFound"
  }
}
```

### Common Error Codes

| Error Code                 | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| `ClientNotFound`           | The client in the request does not exist                  |
| `InvalidClientCreation`    | Client creation cannot result in duplicate client records |
| `InvalidClientUpdate`      | Client update cannot result in duplicate client records   |
| `MissingRequiredFields`    | One or more required fields are missing                   |
| `TooManyRequests`          | Rate limit has been reached (429)                         |
| `InvalidParameter`         | A parameter used in the request is not valid              |
| `InvalidSiteId`            | The site ID used in the request is not valid              |
| `InvalidSourceCredentials` | The source credentials used in the request are not valid  |
| `Unknown`                  | The cause of this error is not known                      |

### Error Handling Best Practices

1. **Always check HTTP status codes** (200, 400, 401, 403, 404, 429, 500, etc.)
2. **Parse error response JSON** to get specific error code and message
3. **Retry on 429** with exponential backoff (already implemented)
4. **Retry on 500** (internal server errors) - try request again first
5. **Don't retry on 4xx** client errors (except 429)
6. **Log errors** with full context for debugging

### Our Implementation

✅ **Already Implemented**:

- Retry logic with exponential backoff
- Rate limit handling (429)
- Error parsing and custom error classes
- Sentry error tracking
- Duplicate client detection (409)

## Testing Your Integration

### Sandbox Environment

Before implementing with live data, test in the Mindbody sandbox:

**Sandbox Credentials**:

| Name      | Value         |
| --------- | ------------- |
| Studio ID | `-99`         |
| Username  | `Siteowner`   |
| Password  | `apitest1234` |

**Important Notes**:

- Sandbox is refreshed **nightly** to clear changes
- You **cannot** use it to test live credit card sales
- Your source name can access this account immediately (no activation needed)

### Test Parameter

Use the `Test` parameter to validate requests without affecting the database:

```json
{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john@example.com",
  "Test": true
}
```

**Behavior**:

- `Test: true`: Validates request but **does not** affect business database
- `Test: false`: Request performs normally and **does** affect live data
- Default: `false`

**Example**:

```bash
curl -X POST \
  https://api.mindbodyonline.com/public/v6/class/addclienttoclass \
  -H 'Content-Type: application/json' \
  -H 'Api-Key: {yourApiKey}' \
  -H 'authorization: {staffUserToken}' \
  -H 'SiteId: {yourSiteId}' \
  -A 'Vital-Ice' \
  -d '{
    "ClientId": "{someClientId}",
    "ClassId": {someClassId},
    "Test": true
  }'
```

## Request Deduplication

### Overview

Request deduplication is a safety feature in Mindbody Public API V6 that prevents accidental duplicate operations from network retries, timeouts, or other client-side issues.

**Key Benefits**:

- Prevents duplicate bookings when network issues cause request retries
- Improves reliability during network instability
- Reduces support overhead from cleaning up duplicate data

### Supported Endpoints

Currently available for:

- `POST /appointment/addappointment`
- `POST /class/addclienttoclass`

**Note**: `POST /client/addclient` is **not** currently listed as supported, but duplicate prevention is handled via the API's duplicate client detection (same FirstName, LastName, Email).

### Time Window

Deduplication applies only while the original request is in progress and ends at the **earlier of**:

- When the request completes, OR
- **2 minutes** after the first request is received

**Example**:

- Request finishes in 600ms → deduplication lasts ~600ms
- Request runs 90s → deduplication lasts 90s
- Request runs 4 min → deduplication stops at 2 min

### How It Works

1. **Request Analysis**: API creates unique fingerprint based on:
   - API credentials and site context
   - Specific endpoint being called
   - Exact request payload (all data fields)

2. **Duplicate Detection**: Checks if identical request made recently (within 2-minute window)

3. **Smart Response**:
   - **First time**: Processes normally (200 OK)
   - **Duplicate while processing**: Returns 409 Conflict with message "Identical request is still in progress"
   - **Duplicate after completion**: Treated as new request

### Disabling Deduplication

If you need to bypass deduplication for testing:

**Header**: `X-RequestDeduplication-Skip: true`

**Use Cases**:

- Integration testing where you need actual duplicates
- Special business scenarios requiring forced duplication
- Troubleshooting deduplication behavior

### Example Scenarios

#### Scenario 1: Successful Request (First Time)

```http
POST /public/v6/appointment/addappointment
{
  "ClientId": 12345,
  "SessionTypeId": 67890,
  "StartDateTime": "2025-01-15T10:00:00"
}

Response: 200 OK
{
  "AppointmentId": 99887,
  "Status": "Booked"
}
```

#### Scenario 2: Duplicate While Processing

If identical requests sent at nearly the same time:

- **First Request**: Status 200 OK (processes normally)
- **Second Request**: Status 409 Conflict - "Identical request is still in progress"

**What to do**: Wait a moment and retry. The second request will get the completed response once the first finishes.

#### Scenario 3: Duplicate After Completion

If client retries exact same request after original has completed (due to network issues):

- Request is treated as **new request** (deduplication window has expired)

## Headers Reference

### Required Headers

| Header         | Value                              | Required    | Notes                |
| -------------- | ---------------------------------- | ----------- | -------------------- |
| `Api-Key`      | `a431330263df42b886bc5eb7fbcafbe7` | Yes         | API authentication   |
| `SiteId`       | `5745503`                          | Yes         | Site identifier      |
| `Content-Type` | `application/json`                 | Yes (POST)  | Request content type |
| `Accept`       | `application/json`                 | Recommended | Response format      |

### Optional Headers

| Header                        | Value              | Purpose                          |
| ----------------------------- | ------------------ | -------------------------------- |
| `authorization`               | `{staffUserToken}` | Business Mode operations         |
| `-A` / `User-Agent`           | `Vital-Ice`        | App name identification          |
| `X-RequestDeduplication-Skip` | `true`             | Bypass deduplication for testing |

## Best Practices Summary

1. ✅ **Always use pagination** for list endpoints (limit/offset)
2. ✅ **Use ISO 8601 date format** (`YYYY-MM-DDTHH:mm:ss`)
3. ✅ **Handle 429 rate limits** with retry logic (already implemented)
4. ✅ **Use Test parameter** during development
5. ✅ **Test in sandbox** before going live
6. ✅ **Include App Name** in User-Agent header
7. ✅ **Handle duplicate requests** gracefully (409 conflicts)
8. ✅ **Log errors** with full context for debugging
9. ✅ **Respect rate limits** (2000 RPM recommended)
10. ✅ **Call GetRequiredClientFields first** before creating clients

## Implementation Status

### ✅ Already Implemented

- [x] Retry logic with exponential backoff
- [x] Rate limit handling (429)
- [x] Error parsing and custom error classes
- [x] Sentry error tracking
- [x] Duplicate client detection (409)
- [x] Request caching (5-minute TTL for GET requests)
- [x] Proper header configuration

### 📋 To Consider

- [ ] Add pagination support for list endpoints (if needed)
- [ ] Add User-Agent header with "Vital-Ice"
- [ ] Add Test parameter support for development
- [ ] Consider request deduplication for future booking endpoints

## Related Documentation

- [Main Documentation Index](./README.md)
- [Setup Guide](./SETUP.md)
- [Add Client Tutorial](./TUTORIAL.md)
- [Endpoints by Form](./ENDPOINTS_BY_FORM.md)

---

**Last Updated**: Based on official Mindbody API 6.0 documentation and best practices
