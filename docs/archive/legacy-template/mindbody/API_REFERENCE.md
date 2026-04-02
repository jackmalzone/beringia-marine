# Mindbody API 6.0 - Complete Endpoint & Model Reference

This document contains a comprehensive reference of all Mindbody API 6.0 endpoints and models for backend integration.

## Base Configuration

- **Base URL**: `https://api.mindbodyonline.com/public/v6`
- **Authentication**: API-Key (required) or User Token (for staff operations)
- **Version**: 6.0
- **Content Type**: `application/json`

## API Endpoints by Category

### Appointment Endpoints

#### GET Endpoints

- `GET /appointment/activesessiontimes` - Get Active Session Times
- `GET /appointment/addons` - Get Add Ons
- `GET /appointment/appointmentoptions` - Get Appointment Options
- `GET /appointment/availabledates` - Get Available Dates
- `GET /appointment/bookableitems` - Get Bookable Items
- `GET /appointment/scheduleitems` - Get Schedule Items
- `GET /appointment/staffappointments` - Get Staff Appointments
- `GET /appointment/unavailabilities` - Get Unavailabilities

#### POST Endpoints

- `POST /appointment/addappointment` - Add Appointment
- `POST /appointment/addappointmentaddon` - Add Appointment Add On
- `POST /appointment/addmultipleappointments` - Add Multiple Appointments
- `POST /appointment/addavailabilities` - Add Availabilities

#### PUT Endpoints

- `PUT /appointment/updateavailability` - Update Availability

#### DELETE Endpoints

- `DELETE /appointment/removefromwaitlist` - Remove From Waitlist
- `DELETE /appointment/deleteavailability` - Delete Availability
- `DELETE /appointment/deleteappointmentaddon` - Delete Appointment Add On

### Class Endpoints

#### GET Endpoints

- `GET /class/classdescriptions` - Get Class Descriptions
- `GET /class/classes` - Get Classes
- `GET /class/classschedules` - Get Class Schedules
- `GET /class/classvisits` - Get Class Visits
- `GET /class/courses` - Get Courses
- `GET /class/semesters` - Get Semesters
- `GET /class/waitlistentries` - Get Waitlist Entries

#### POST Endpoints

- `POST /class/addclassschedule` - Add Class Schedule
- `POST /class/addclienttoclass` - Add Client to Class
- `POST /class/cancelsingleclass` - Cancel Single Class
- `POST /class/removeclientfromclass` - Remove Client From Class
- `POST /class/removeclientsfromclasses` - Remove Clients From Classes
- `POST /class/removefromwaitlist` - Remove From Waitlist
- `POST /class/substituteclassteacher` - Substitute Class Teacher
- `POST /class/updateclassschedule` - Update Class Schedule

#### PATCH Endpoints

- `PATCH /class/updateclassschedulenotes` - Update Class Schedule Notes

### Client Endpoints

#### GET Endpoints

- `GET /client/activeclientmemberships` - Get Active Client Memberships
- `GET /client/activeclientsmemberships` - Get Active Clients Memberships
- `GET /client/clientaccountbalances` - Get Client Account Balances
- `GET /client/clientcompleteinfo` - Get Client Complete Info
- `GET /client/clientcontracts` - Get Client Contracts
- `GET /client/directdebitinfo` - Get Direct Debit Info
- `GET /client/clientduplicates` - Get Client Duplicates
- `GET /client/clientformulanotes` - Get Client Formula Notes
- `GET /client/clientindexes` - Get Client Indexes
- `GET /client/clientpurchases` - Get Client Purchases
- `GET /client/clientreferraltypes` - Get Client Referral Types
- `GET /client/clientrewards` - Get Client Rewards
- `GET /client/clients` - Get Clients
- `GET /client/clientschedule` - Get Client Schedule
- `GET /client/clientservices` - Get Client Services
- `GET /client/clientvisits` - Get Client Visits
- `GET /client/contactlogs` - Get Contact Logs
- `GET /client/contactlogtypes` - Get Contact Log Types
- `GET /client/crossregionalclientassociations` - Get Cross Regional Client Associations
- `GET /client/customclientfields` - Get Custom Client Fields
- `GET /client/requiredclientfields` - Get Required Client Fields ⭐ **IMPORTANT FOR FORM VALIDATION**

#### POST Endpoints

- `POST /client/addarrival` - Add Arrival
- `POST /client/addclient` - Add Client ⭐ **PRIMARY ENDPOINT FOR LEADS/PROSPECTS** (see detailed documentation below)
- `POST /client/addclientdirectdebitinfo` - Add Client Direct Debit Info
- `POST /client/addformulanote` - Add Formula Note
- `POST /client/addcontactlog` - Add Contact Log
- `POST /client/mergeclient` - Merge Client
- `POST /client/sendautoemail` - Send Auto Email
- `POST /client/sendpasswordresetemail` - Send Password Reset Email
- `POST /client/suspendcontract` - Suspend Contract
- `POST /client/terminatecontract` - Terminate Contract
- `POST /client/updateclient` - Update Client
- `POST /client/updateclientcontractautopays` - Update Client Contract Autopays
- `POST /client/updateclientservice` - Update Client Service
- `POST /client/updateclientvisit` - Update Client Visit
- `POST /client/updatecontactlog` - Update Contact Log
- `POST /client/uploadclientdocument` - Upload Client Document
- `POST /client/uploadclientphoto` - Upload Client Photo
- `POST /client/updateclientrewards` - Update Client Rewards

#### DELETE Endpoints

- `DELETE /client/deletedirectdebitinfo` - Delete Direct Debit Info
- `DELETE /client/deleteclientformulanote` - Delete Client Formula Note
- `DELETE /client/deletecontactlog` - Delete Contact Log

#### Add Client Endpoint (Detailed)

**POST /client/addclient** - Add Client ⭐ **PRIMARY ENDPOINT FOR LEADS/PROSPECTS**

Creates a new client record at the specified business. Starting the week of May 11th, 2020, all versions of the Public API will no longer allow duplicate clients to be created. A duplicate client is created when two profiles have the same first name, last name and email.

**Important Notes:**

- Passing a User Token as Authorization will create a client and respect Business Mode required fields
- Omitting the token will create a client and respect Consumer Mode required fields
- To make sure you are collecting all required pieces of information, first run `GET /client/requiredclientfields`
- If you have purchased an Ultimate tier then this endpoint will automatically start showing new opportunity on Sales Pipeline

**Request Body (`AddClientRequest`):**

**Required Fields:**

- `FirstName` (String, **Required**) - The client's first name. You must specify a first name when you add a client.
- `LastName` (String, **Required**) - The client's last name. You must specify a last name when you add a client.

**Important Optional Fields:**

- `Email` (String) - The client's email address
- `MobilePhone` (String) - The client's mobile phone number
- `HomePhone` (String) - The client's home phone number
- `WorkPhone` (String) - The client's work phone number
- `AddressLine1` (String) - The first line of the client's street address
- `AddressLine2` (String) - The second line of the client's street address, if needed
- `City` (String) - The client's city
- `State` (String) - The client's state
- `PostalCode` (String) - The client's postal code
- `Country` (String) - The country in which the client is located
- `BirthDate` (DateTime) - The client's date of birth
- `Gender` (String) - The client's gender
- `IsProspect` (Boolean) - When true, indicates that the client should be marked as a prospect for the business. When false, indicates that the client should not be marked as a prospect. ⭐ **IMPORTANT FOR LEADS**
- `ProspectStage` (ProspectStage) - Contains information about the client prospect stage
- `LeadChannelId` (Number) - The ID of the LeadChannel from LeadManagement. This parameter is required by LeadManagement to track the LeadChannel from where the new client is added. If this value is not supplied then it won't save anything.
- `ReferredBy` (String) - Specifies how the client was referred to the business. You can get a list of possible strings using the GET ClientReferralTypes endpoint
- `Notes` (String) - Any notes entered on the client's account by staff members. This value should never be shown to clients unless the business owner has a specific reason for showing them
- `SendScheduleEmails` (Boolean) - When true, indicates that the client opts to receive schedule emails. Default: false
- `SendAccountEmails` (Boolean) - When true, indicates that the client opts to receive account emails. Default: false
- `SendPromotionalEmails` (Boolean) - When true, indicates that the client opts to receive promotional emails. Default: false
- `SendScheduleTexts` (Boolean) - When true, indicates that the client opts to receive schedule texts
- `SendAccountTexts` (Boolean) - When true, indicates that the client opts to receive account texts
- `SendPromotionalTexts` (Boolean) - When true, indicates that the client opts to receive promotional texts
- `LiabilityRelease` (Boolean) - When true, sets the client's liability information (IsReleased: true, AgreementDate: current time, ReleasedBy: null/0/staff ID)
- `Liability` (Liability) - Contains the client's liability agreement information for the business
- `HomeLocation` (Location) - Sets the client's home location to the passed location, based on its ID
- `CustomClientFields` (array<CustomClientFieldValue>) - Contains information about the custom fields used for clients in the business
- `ClientIndexes` (array<AssignedClientIndex>) - Contains a list of the indexes and client index values to be assigned to the client
- `ClientRelationships` (array<ClientRelationship>) - Contains information about client relationships that were added or updated for the client
- `Test` (Boolean) - When true, indicates that test mode is enabled. The method is validated, but no client data is added or updated. Default: false

**Emergency Contact Fields (Required if `GetRequiredClientFields` returns `EmergContact`):**

- `EmergencyContactInfoEmail` (String) - The email address of the client's emergency contact
- `EmergencyContactInfoName` (String) - The name of the client's emergency contact
- `EmergencyContactInfoPhone` (String) - The phone number of the client's emergency contact
- `EmergencyContactInfoRelationship` (String) - The client's relationship with the emergency contact, for example, mother or spouse

**Other Optional Fields:**

- `AccountBalance` (Decimal) - The client's current account balance
- `Active` (Boolean) - When true, indicates that the client is active at the site
- `ApptGenderPrefMale` (Boolean) - Gender preference for service providers
- `IsCompany` (Boolean) - When true, indicates that the client should be marked as a company
- `MiddleName` (String) - The client's middle name
- `MobileProvider` (Number) - The client's mobile provider
- `NewId` (String) - The new RSSID to be used for the client (must be unique)
- `PhotoUrl` (String) - The URL for the client's photo
- `RedAlert` (String) - Contains any red alert information entered by the business owner
- `YellowAlert` (String) - Contains any yellow alert information entered by the business owner
- `SalesReps` (array<SalesRep>) - Contains information about the sales representatives to be assigned
- `LockerNumber` (String) - The client's locker number
- `ReactivateInactiveClient` (Boolean) - When true, indicates that the client opts to reactivate existing Inactive client

**Response:** `AddClientResponse` with the created `Client` object and optional `Message`

**Duplicate Prevention:**

- Starting May 11, 2020: All API versions no longer allow duplicate clients
- A duplicate is defined as two profiles with the same First Name, Last Name, AND Email
- If a duplicate is detected, the API will return an error (typically HTTP 400 with "InvalidClientCreation" or similar)
- **Recommended**: Use `GET /client/clientduplicates` to check for existing clients before attempting to create a new one

**GET /client/clientduplicates** - Get Client Duplicates ⭐ **RECOMMENDED FOR REGISTRATION DUPLICATE CHECKING**

This endpoint gets client records that would be considered duplicates based on case-insensitive matching of the client's first name, last name, and email. For there to be results, all three parameters must match a client record. This endpoint requires staff user credentials (authorization header).

**Why use this endpoint:**

- Specifically designed for duplicate detection
- Case-insensitive matching (handles "John@Email.com" vs "john@email.com")
- More reliable than searching with `GET /client/clients`
- Returns exact duplicates based on Mindbody's duplicate definition

**Query Parameters:**

- `request.email` (String, **Required**) - The client email to match on when searching for duplicates
- `request.firstName` (String, **Required**) - The client first name to match on when searching for duplicates
- `request.lastName` (String, **Required**) - The client last name to match on when searching for duplicates
- `request.limit` (Number, Optional) - Number of results to include. Default: 100
- `request.offset` (Number, Optional) - Page offset. Default: 0

**Response:** `GetClientDuplicatesResponse` with `ClientDuplicates` array

**Response Interpretation:**

- **Empty array (`ClientDuplicates: []`)**: No duplicates found - safe to create new client
- **One client returned**: Not a duplicate itself, but indicates that no other client record can be created or updated with this first name, last name, and email combination
- **Multiple clients returned**: These clients are duplicates of each other. Businesses should use the Merge Duplicate Clients tool in Core Business Mode to resolve duplicates

**Example Request:**

```
GET /public/v6/client/clientduplicates?request.email=john.doe@example.com&request.firstName=John&request.lastName=Doe
```

**Example Response (No Duplicates):**

```json
{
  "ClientDuplicates": []
}
```

**Example Response (Duplicate Found):**

```json
{
  "ClientDuplicates": [
    {
      "Id": "12345",
      "UniqueId": "67890",
      "FirstName": "John",
      "LastName": "Doe",
      "Email": "john.doe@example.com"
    }
  ]
}
```

**Best Practice for Registration:**

1. Call `GET /client/clientduplicates` before attempting to create a client
2. If duplicates are found, return a friendly message to the user
3. If no duplicates found, proceed with `POST /client/addclient`
4. If `addclient` still returns a duplicate error (race condition), retry the duplicate check and handle gracefully

**Example Request:**

```json
{
  "FirstName": "Jane",
  "LastName": "Doe",
  "Email": "jane.doe@example.com",
  "MobilePhone": "555-123-4567",
  "IsProspect": true,
  "ProspectStage": { "Id": 1 },
  "ReferredBy": "Website Contact Form",
  "LeadChannelId": 4,
  "Notes": "Membership inquiry - Tier: Founding Member\nInterested in cold plunge therapy",
  "SendAccountEmails": false,
  "SendPromotionalEmails": false,
  "SendScheduleEmails": false
}
```

#### Contact Log Endpoints (Detailed)

**GET /client/contactlogs** - Get Contact Logs ⭐ **FOR VIEWING INQUIRIES**

Retrieves contact logs for a client with various filtering options.

**Query Parameters:**

- `request.clientId` (String, **Required**) - The ID of the client whose contact logs are being requested
- `request.startDate` (DateTime, Optional) - Filters results to contact logs created on or after this date. Default: current date
- `request.endDate` (DateTime, Optional) - Filters results to contact logs created before this date. Default: the start date
- `request.limit` (Number, Optional) - Number of results to include. Default: 100
- `request.offset` (Number, Optional) - Page offset. Default: 0
- `request.showSystemGenerated` (Boolean, Optional) - When true, system-generated contact logs are returned. Default: false
- `request.staffIds[]` (array<Long>, Optional) - Filters results to contact logs assigned to one or more staff IDs
- `request.typeIds[]` (array<Number>, Optional) - Filters results to contact logs assigned one or more of these type IDs
- `request.subtypeIds[]` (array<Number>, Optional) - Filters results to contact logs assigned one or more of these subtype IDs

**Response:** `GetContactLogsResponse` with array of `ContactLog` objects

**GET /client/contactlogtypes** - Get Contact Log Types

Retrieves available contact log types for tagging contact logs.

**Query Parameters:**

- `request.contactLogTypeId` (Number, Optional) - The requested ContactLogType ID. Default: all IDs that the authenticated user's access level allows
- `request.limit` (Number, Optional) - Number of results to include. Default: 100
- `request.offset` (Number, Optional) - Page offset. Default: 0

**Response:** `GetContactLogTypesResponse` with array of `ContactLogType` objects

**POST /client/addcontactlog** - Add Contact Log ⭐ **FOR INQUIRY NOTIFICATIONS**

Adds a contact log entry to a client's account. This is the primary method for notifying staff about new inquiries.

**Request Body (`AddContactLogRequest`):**

- `ClientId` (String, **Required**) - The ID of the client whose contact log is being added
- `Text` (String, **Required**) - The body of the contact log (inquiry message/details)
- `ContactMethod` (String, **Required**) - How the client wants to be contacted (e.g., "Email", "Phone", "Text")
- `AssignedToStaffId` (Long, Optional) - The ID of the staff member to whom the contact log is assigned
- `ContactName` (String, Optional) - The name of the person to be contacted by the assigned staff member
- `FollowupByDate` (DateTime, Optional) - The date by which the assigned staff member should complete this contact log
- `IsComplete` (Boolean, Optional) - When true, indicates that the contact log is complete. When false, indicates the contact log isn't complete. Default: false
- `Types` (array<AddContactLogType>, Optional) - The contact log types used to tag this contact log
- `Comments` (array<String>, Optional) - Any comments on the contact log
- `Test` (Boolean, Optional) - When true, indicates that this is a test request and no data is inserted. Default: false

**Response:** `ContactLog` object with the created contact log entry

**POST /client/updatecontactlog** - Update Contact Log

Updates an existing contact log entry on a client's account.

**Request Body (`UpdateContactLogRequest`):**

- `Id` (Number, **Required**) - The ID of the contact log being updated
- `Text` (String, Optional) - The contact log's new text
- `ContactMethod` (String, Optional) - The new method by which the client wants to be contacted
- `AssignedToStaffId` (Long, Optional) - The ID of the staff member to whom the contact log is now being assigned
- `ContactName` (String, Optional) - The name of the new person to be contacted by the assigned staff member
- `FollowupByDate` (DateTime, Optional) - The new date by which the assigned staff member should complete this contact log
- `IsComplete` (Boolean, Optional) - When true, indicates that the contact log is complete. When false, indicates the contact log isn't complete
- `Types` (array<UpdateContactLogType>, Optional) - Contains information about the contact log types being assigned to the contact log, in addition to the contact log types that are already assigned
- `Comments` (array<UpdateContactLogComment>, Optional) - Contains information about the comments being updated or added to the contact log. Comments that have an ID of 0 are added to the contact log
- `Test` (Boolean, Optional) - When true, indicates that this is a test request and no data is inserted. Default: false

**Response:** Updated `ContactLog` object

**DELETE /client/deletecontactlog** - Delete Contact Log

Deletes a contact log entry from a client's account.

**Request:** Contact log ID

**Response:** Success confirmation

### Cross Site Enrollment Endpoints

#### GET Endpoints

- `GET /crosssiteenrollment/enrollments` - Get Enrollments

#### POST Endpoints

- `POST /crosssiteenrollment/addclienttoenrollment` - Add Client to Enrollment
- `POST /crosssiteenrollment/addenrollmentschedule` - Add Enrollment Schedule
- `POST /crosssiteenrollment/updateenrollmentschedule` - Update Enrollment Schedule

### Payroll Endpoints

#### GET Endpoints

- `GET /payroll/commissions` - Get Commissions
- `GET /payroll/scheduledserviceearnings` - Get Scheduled Service Earnings
- `GET /payroll/timecards` - Get Time Cards
- `GET /payroll/tips` - Get Tips

### Pick a Spot Endpoints

#### GET Endpoints

- `GET /pickaspot/classlist` - Get Class List
- `GET /pickaspot/class` - Get Class

#### PUT Endpoints

- `PUT /pickaspot/updatereservation` - Update Reservation

#### POST Endpoints

- `POST /pickaspot/createreservation` - Create Reservation

#### DELETE Endpoints

- `DELETE /pickaspot/deletereservation` - Delete Reservation

### Sale Endpoints

#### GET Endpoints

- `GET /sale/acceptedcardtypes` - Get Accepted Card Types
- `GET /sale/alternativepaymentmethods` - Get Alternative Payment Methods
- `GET /sale/contracts` - Get Contracts
- `GET /sale/custompaymentmethods` - Get Custom Payment Methods
- `GET /sale/giftcardbalance` - Get Gift Card Balance
- `GET /sale/giftcards` - Get Gift Cards
- `GET /sale/packages` - Get Packages
- `GET /sale/products` - Get Products
- `GET /sale/productsinventory` - Get Products Inventory
- `GET /sale/purchasecontractstatus` - Get Purchase Contract Status
- `GET /sale/sales` - Get Sales
- `GET /sale/services` - Get Services
- `GET /sale/transactions` - Get Transactions

#### POST Endpoints

- `POST /sale/checkoutshoppingcart` - Checkout Shopping Cart
- `POST /sale/completecheckoutshoppingcartusingalternativepayments` - Complete Checkout Shopping Cart Using Alternative Payments
- `POST /sale/initiatecheckoutshoppingcartusingalternativepayments` - Initiate Checkout Shopping Cart Using Alternative Payments
- `POST /sale/initiatepurchasecontractusingalternativepayments` - Initiate Purchase Contract Using Alternative Payments
- `POST /sale/purchaseaccountcredit` - Purchase Account Credit
- `POST /sale/purchasecontract` - Purchase Contract
- `POST /sale/purchasegiftcard` - Purchase Gift Card
- `POST /sale/returnsale` - Return Sale

#### PUT Endpoints

- `PUT /sale/updateproducts` - Update Products
- `PUT /sale/updateservices` - Update Services
- `PUT /sale/updatesaledate` - Update Sale Date

### Site Endpoints

#### GET Endpoints

- `GET /site/activationcode` - Get Activation Code
- `GET /site/categories` - Get Categories
- `GET /site/genders` - Get Genders
- `GET /site/liabilitywaiver` - Get Liability Waiver ⭐ **IMPORTANT FOR WAIVER HANDLING**
- `GET /site/locations` - Get Locations
- `GET /site/memberships` - Get Memberships ⭐ **IMPORTANT FOR MEMBERSHIP INQUIRIES**
- `GET /site/mobileproviders` - Get Mobile Providers
- `GET /site/paymenttypes` - Get Payment Types
- `GET /site/programs` - Get Programs
- `GET /site/promocodes` - Get Promo Codes
- `GET /site/prospectstages` - Get Prospect Stages ⭐ **IMPORTANT FOR LEAD TRACKING**
- `GET /site/relationships` - Get Relationships
- `GET /site/resourceavailabilities` - Get Resource Availabilities
- `GET /site/resources` - Get Resources
- `GET /site/sessiontypes` - Get Session Types
- `GET /site/sites` - Get Sites

#### POST Endpoints

- `POST /site/addclientindex` - Add Client Index
- `POST /site/addpromocode` - Add Promo Code
- `POST /site/deactivatepromocode` - Deactivate Promo Code
- `POST /site/updateclientindex` - Update Client Index

### Staff Endpoints

#### GET Endpoints

- `GET /staff/staffimageurl` - Get Staff Image URL
- `GET /staff/salesreps` - Get Sales Reps
- `GET /staff/staffsessiontypes` - Get Staff Session Types
- `GET /staff/staff` - Get Staff
- `GET /staff/staffpermissions` - Get Staff Permissions

#### POST Endpoints

- `POST /staff/addstaff` - Add Staff
- `POST /staff/assignstaffsessiontype` - Assign Staff Session Type
- `POST /staff/addstaffavailability` - Add Staff Availability
- `POST /staff/updatestaff` - Update Staff
- `POST /staff/updatestaffpermissions` - Update Staff Permissions

### User Token Endpoints

#### POST Endpoints

- `POST /usertoken/issuetoken` - Issue Token
- `POST /usertoken/renewtoken` - Renew Token

#### DELETE Endpoints

- `DELETE /usertoken/revoketoken` - Revoke Token

## Key Models & Structures

### Client Models

#### AddClientRequest

**Required Fields:**

- `FirstName` (String) - Always required
- `LastName` (String) - Always required

**Important Optional Fields:**

- `Email` (String) - Client's email address
- `MobilePhone` (String) - Mobile phone number
- `HomePhone` (String) - Home phone number
- `AddressLine1` (String) - First line of address
- `AddressLine2` (String) - Second line of address
- `City` (String) - City
- `State` (String) - State
- `PostalCode` (String) - Postal code
- `Country` (String) - Country
- `BirthDate` (DateTime) - Date of birth
- `Gender` (String) - Client's gender
- `IsProspect` (Boolean) - Mark as prospect ⭐ **IMPORTANT FOR LEADS**
- `ProspectStage` (ProspectStage) - Prospect stage information
- `LeadChannelId` (Number) - Lead channel ID for LeadManagement tracking
- `CustomClientFields` (Array<CustomClientFieldValue>) - Custom field values
- `ClientIndexes` (Array<AssignedClientIndex>) - Client index assignments
- `ClientRelationships` (Array<ClientRelationship>) - Client relationships
- `LiabilityRelease` (Boolean) - Liability release agreement
- `Liability` (Liability) - Liability agreement information
- `Notes` (String) - Staff notes (not shown to clients)
- `SendScheduleEmails` (Boolean) - Opt-in for schedule emails
- `SendAccountEmails` (Boolean) - Opt-in for account emails
- `SendPromotionalEmails` (Boolean) - Opt-in for promotional emails
- `SendScheduleTexts` (Boolean) - Opt-in for schedule texts
- `SendAccountTexts` (Boolean) - Opt-in for account texts
- `SendPromotionalTexts` (Boolean) - Opt-in for promotional texts

**Emergency Contact Fields** (Required if `GetRequiredClientFields` returns `EmergContact`):

- `EmergencyContactInfoEmail` (String)
- `EmergencyContactInfoName` (String)
- `EmergencyContactInfoPhone` (String)
- `EmergencyContactInfoRelationship` (String)

#### GetRequiredClientFieldsResponse

Returns list of required fields for client creation. **Always call this first** before creating a client to ensure all required fields are collected.

#### ProspectStage

- Contains information about client prospect stage
- Used for lead tracking and sales pipeline

#### CustomClientFieldValue

- Custom field ID and value
- Used for business-specific data collection

### Site Models

#### GetMembershipsResponse

- Returns available memberships at the site
- Includes membership details, pricing, restrictions

#### GetProspectStagesResponse

- Returns available prospect stages
- Used for lead tracking and sales pipeline

#### GetLiabilityWaiverResponse

- Returns liability waiver information
- Used for waiver consent tracking

### Response Models

#### PaginationResponse

- Standard pagination structure for list endpoints
- Includes `RequestedLimit`, `RequestedOffset`, `PageSize`, `TotalResults`

#### ApiError

- Standard error response structure
- Includes `Error` object with `Code` and `Message`

## Important Notes

### Duplicate Prevention

⚠️ **Starting May 11, 2020**: All API versions no longer allow duplicate clients. A duplicate is defined as two profiles with the same:

- First Name
- Last Name
- Email

This applies to both `AddClient` and `UpdateClient` endpoints.

### Required Fields

- Always call `GET /client/requiredclientfields` first
- Required fields vary by business configuration
- Business Mode vs Consumer Mode may have different requirements
- If `EmergContact` is in required fields, all emergency contact fields become required

### Authentication

- **API-Key**: Required for all endpoints (header: `api-key`)
- **User Token**: Optional, used for staff operations (header: `authorization`)
- **Site ID**: Required for all endpoints (header: `siteId`)

### Lead Management

- `LeadChannelId` parameter tracks where leads come from
- If not supplied, LeadManagement won't track the lead channel
- `IsProspect` and `ProspectStage` are used for sales pipeline tracking

### Request Deduplication

- Mindbody API requires request deduplication
- Implement idempotency keys for POST requests
- Handle rate limits gracefully

### Testing

- Use `Test: true` parameter in requests to validate without creating data
- Sandbox environment available for testing

## Priority Endpoints for Phase 1 (Leads/Prospects)

1. **`GET /client/requiredclientfields`** - Get required fields
2. **`POST /client/addclient`** - Create prospect/lead
3. **`GET /site/prospectstages`** - Get prospect stages (for lead tracking)
4. **`GET /site/memberships`** - Get memberships (for membership inquiries)
5. **`GET /site/liabilitywaiver`** - Get waiver info (for consent tracking)

## Next Phase Endpoints (Booking/Appointments)

1. **`GET /appointment/availabledates`** - Get available dates
2. **`GET /appointment/bookableitems`** - Get bookable items
3. **`GET /appointment/scheduleitems`** - Get schedule items
4. **`POST /appointment/addappointment`** - Book appointment
5. **`POST /class/addclienttoclass`** - Book class
6. **`GET /class/classes`** - Get classes
7. **`GET /class/classschedules`** - Get class schedules

## Enumerations

### Action

- `Added`
- `Updated`
- `Deleted`

### AppointmentStatus

- Various appointment status values

### BookingStatus

- Various booking status values

### Gender

- Gender options from `GET /site/genders`

### PaymentMethod

- Payment method options

### Status

- Various status enumerations

## Related Documentation

- [Main Documentation Index](./README.md)
- [Endpoints by Form](./ENDPOINTS_BY_FORM.md)
- [Add Client Tutorial](./TUTORIAL.md)
- [Models Reference](./MODELS.md)
- [Best Practices](./BEST_PRACTICES.md)
- [Setup Guide](./SETUP.md)

---

**Last Updated**: Based on Mindbody API 6.0 documentation
**Reference**: [Mindbody Developer Documentation](https://developers.mindbodyonline.com/)
