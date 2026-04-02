# Mindbody API 6.0 - Complete Models & Structures Reference

This document contains a comprehensive reference of all models and structures used in the Mindbody API 6.0.

## Client Models

### Client

The Client model represents a client in the system.

**Key Fields**:

- `Id` (String) - Client's ID (barcode ID if assigned)
- `UniqueId` (Long) - System-generated unique ID
- `FirstName` (String) - Client's first name
- `LastName` (String) - Client's last name
- `Email` (String) - Client's email address
- `MobilePhone` (String) - Mobile phone number
- `HomePhone` (String) - Home phone number
- `WorkPhone` (String) - Work phone number
- `BirthDate` (DateTime) - Date of birth
- `Gender` (String) - Client's gender
- `IsProspect` (Boolean) - Whether client is a prospect
- `IsCompany` (Boolean) - Whether client is a company
- `Active` (Boolean) - Whether client is active
- `Status` (String) - Client status (Active, Declined, Non-Member, Expired, Suspended, Terminated)
- `AddressLine1`, `AddressLine2`, `City`, `State`, `PostalCode`, `Country` - Address fields
- `ProspectStage` (ProspectStage) - Prospect stage information
- `ClientType` (ClientType) - Assigned client type
- `CustomClientFields` (array) - Custom field values
- `ClientIndexes` (array) - Assigned client indexes
- `ClientRelationships` (array) - Client relationships
- `Liability` (Liability) - Liability agreement information
- `Notes` (String) - Staff notes
- `AccountBalance` (Decimal) - Current account balance
- `SendScheduleEmails`, `SendAccountEmails`, `SendPromotionalEmails` (Boolean) - Email preferences
- `SendScheduleTexts`, `SendAccountTexts`, `SendPromotionalTexts` (Boolean) - Text preferences
- `EmergencyContactInfoName`, `EmergencyContactInfoEmail`, `EmergencyContactInfoPhone`, `EmergencyContactInfoRelationship` - Emergency contact
- `CreationDate` (DateTime) - When client was created
- `LastModifiedDateTime` (DateTime) - Last modification time
- `FirstAppointmentDate` (DateTime) - First booked appointment date
- `FirstClassDate` (DateTime) - First booked class date

### Add Client Request

Request model for creating a new client.

**Required Fields**:

- `FirstName` (String) - **REQUIRED**
- `LastName` (String) - **REQUIRED**

**Important Optional Fields**:

- `Email` (String)
- `MobilePhone` (String)
- `IsProspect` (Boolean) - Mark as prospect
- `ProspectStage` (ProspectStage) - Prospect stage
- `LeadChannelId` (Number) - For LeadManagement tracking
- `Test` (Boolean) - Test mode (default: false)
- All address fields, emergency contact fields, etc. (may be required based on business configuration)

### Add Client Response

Response model after creating a client.

**Fields**:

- `Client` (Client) - Created client object
- `Message` (String) - Response message

### Prospect Stage

Represents a prospect stage for lead tracking.

**Fields**:

- `Id` (Number) - Prospect stage ID
- `Name` (String) - Stage name
- `Description` (String) - Stage description
- `Active` (Boolean) - Whether stage is active

### Client Type

Represents a client's type classification.

**Fields**:

- `Id` (Number) - Unique identifier
- `Name` (String) - Display name

### Client Duplicate

A client record considered a duplicate (matching FirstName, LastName, AND Email).

**Fields**:

- `Id` (String) - Client ID
- `UniqueId` (Long) - Unique ID
- `FirstName` (String)
- `LastName` (String)
- `Email` (String)

### Client Membership

Information about a client's membership.

**Fields**:

- `Id` (Long) - Unique ID for this purchase
- `ProductId` (Number) - Membership product ID
- `MembershipId` (Number) - Membership ID
- `Name` (String) - Membership name
- `ActiveDate` (DateTime) - When membership became active
- `ExpirationDate` (DateTime) - When membership expires
- `Count` (Number) - Number of sessions when purchased
- `Remaining` (Number) - Sessions remaining
- `Current` (Boolean) - Whether can be used for current session
- `RestrictedLocations` (array<Location>) - Location restrictions
- `IconCode` (String) - Icon code
- `PaymentDate` (DateTime) - Payment date
- `Program` (Program) - Service category

### Custom Client Field

A custom field for clients.

**Fields**:

- `Id` (Number) - Field ID
- `Name` (String) - Field name
- `DataType` (String) - Data type

### Custom Client Field Value

Value for a custom client field.

**Fields**:

- `Id` (Number/String) - Field ID
- `Value` (String) - Field value
- `DataType` (String) - Data type
- `Name` (String) - Field name

### Assigned Client Index

Client index assignment.

**Fields**:

- `Id` (Number) - Index ID
- `ValueId` (Number) - Value ID (optional)
- `Value` (String) - Value (optional)

### Client Relationship

Relationship between two clients.

**Fields**:

- `RelatedClientId` (String) - Related client ID
- `Relationship` (String) - Relationship type

### Liability

Liability agreement information.

**Fields**:

- `IsReleased` (Boolean) - Whether released
- `AgreementDate` (DateTime) - Agreement date
- `ReleasedBy` (String) - Who released (null, 0, or staff ID)

## Appointment Models

### Appointment

Represents an appointment.

**Fields**:

- `Id` (Number) - Appointment ID
- `Client` (Client) - Client information
- `Staff` (Staff) - Staff member
- `SessionType` (SessionType) - Session type
- `StartDateTime` (DateTime) - Start time
- `EndDateTime` (DateTime) - End time
- `Location` (Location) - Location
- `Status` (String) - Appointment status
- `Notes` (String) - Notes

### Add Appointment Request

Request to create an appointment.

### Add Appointment Response

Response after creating appointment.

### Update Appointment Request

Request to update an appointment.

### Update Appointment Response

Response after updating appointment.

## Class Models

### Class

Represents a class.

**Fields**:

- `Id` (Number) - Class ID
- `ClassDescription` (ClassDescription) - Class description
- `StartDateTime` (DateTime) - Start time
- `EndDateTime` (DateTime) - End time
- `Staff` (Staff) - Instructor
- `Location` (Location) - Location
- `MaxCapacity` (Number) - Maximum capacity
- `TotalBooked` (Number) - Total booked
- `TotalBookedWaitlist` (Number) - Waitlist count
- `IsAvailable` (Boolean) - Whether available

### Class Description

Description of a class type.

**Fields**:

- `Id` (Number) - Description ID
- `Name` (String) - Class name
- `Description` (String) - Description

### Class Schedule

Schedule for a class.

**Fields**:

- `Id` (Number) - Schedule ID
- `ClassDescription` (ClassDescription) - Class description
- `DaySunday`, `DayMonday`, etc. (Boolean) - Days of week
- `StartTime` (String) - Start time
- `EndTime` (String) - End time
- `Staff` (Staff) - Instructor
- `Location` (Location) - Location

### Visit

Represents a class visit.

**Fields**:

- `Id` (Number) - Visit ID
- `ClassId` (Number) - Class ID
- `Client` (Client) - Client
- `StartDateTime` (DateTime) - Start time
- `EndDateTime` (DateTime) - End time
- `LastModifiedDateTime` (DateTime) - Last modified

## Site Models

### Location

Represents a business location.

**Fields**:

- `Id` (Number) - Location ID
- `Name` (String) - Location name
- `Address` (String) - Address
- `Address2` (String) - Address line 2
- `City` (String) - City
- `State` (String) - State
- `PostalCode` (String) - Postal code
- `Phone` (String) - Phone number
- `Latitude` (Number) - Latitude
- `Longitude` (Number) - Longitude

### Site

Represents a site/business.

**Fields**:

- `Id` (Number) - Site ID
- `Name` (String) - Site name
- `Description` (String) - Description
- `LogoUrl` (String) - Logo URL

### Membership

Represents a membership option.

**Fields**:

- `Id` (Number) - Membership ID
- `Name` (String) - Membership name
- `Description` (String) - Description
- `ShortDescription` (String) - Short description
- `Price` (Decimal) - Price
- `OnlinePrice` (Decimal) - Online price
- `Program` (Program) - Program
- `MembershipTypeRestrictions` (array) - Restrictions

### Program

Represents a program/service category.

**Fields**:

- `Id` (Number) - Program ID
- `Name` (String) - Program name
- `ScheduleType` (String) - Schedule type

### Session Type

Represents a session type.

**Fields**:

- `Id` (Number) - Session type ID
- `Name` (String) - Session type name
- `Description` (String) - Description
- `Program` (Program) - Program

### Staff

Represents a staff member.

**Fields**:

- `Id` (Number) - Staff ID
- `FirstName` (String) - First name
- `LastName` (String) - Last name
- `Email` (String) - Email
- `MobilePhone` (String) - Mobile phone
- `IsIndependentContractor` (Boolean) - Independent contractor status
- `AlwaysAllowDoubleBooking` (Boolean) - Double booking allowed
- `ImageUrl` (String) - Image URL

## Sale Models

### Sale

Represents a sale/transaction.

**Fields**:

- `Id` (Number) - Sale ID
- `SaleDate` (DateTime) - Sale date
- `SaleTime` (DateTime) - Sale time
- `Client` (Client) - Client
- `PurchasedItems` (array) - Purchased items
- `Payments` (array) - Payments
- `TotalAmount` (Decimal) - Total amount

### Product

Represents a product.

**Fields**:

- `Id` (Number) - Product ID
- `Name` (String) - Product name
- `Description` (String) - Description
- `Price` (Decimal) - Price
- `OnlinePrice` (Decimal) - Online price

### Service

Represents a service.

**Fields**:

- `Id` (Number) - Service ID
- `Name` (String) - Service name
- `Description` (String) - Description
- `Price` (Decimal) - Price
- `OnlinePrice` (Decimal) - Online price
- `Program` (Program) - Program

### Package

Represents a package.

**Fields**:

- `Id` (Number) - Package ID
- `Name` (String) - Package name
- `Description` (String) - Description
- `Price` (Decimal) - Price
- `OnlinePrice` (Decimal) - Online price
- `Count` (Number) - Number of sessions

## Common Models

### Pagination Response

Standard pagination structure.

**Fields**:

- `RequestedLimit` (Number) - Requested limit
- `RequestedOffset` (Number) - Requested offset
- `PageSize` (Number) - Results returned
- `TotalResults` (Number) - Total available results

### Api Error

Standard error response.

**Fields**:

- `Error` (object):
  - `Code` (String) - Error code
  - `Message` (String) - Error message

### Gender Option

Gender option.

**Fields**:

- `Name` (String) - Gender name
- `Id` (Number) - Gender ID

### Payment Type

Payment type option.

**Fields**:

- `Id` (Number) - Payment type ID
- `Name` (String) - Payment type name

### Relationship

Relationship type.

**Fields**:

- `Id` (Number) - Relationship ID
- `Name` (String) - Relationship name

### Mobile Provider

Mobile provider option.

**Fields**:

- `Id` (Number) - Provider ID
- `Name` (String) - Provider name

## Response Models

### Get Required Client Fields Response

Response for required fields.

**Fields**:

- `RequiredClientFields` (array<String>) - List of required field names
  - Examples: `["AddressLine1", "City", "State", "PostalCode", "BirthDate", "EmergContact"]`

### Get Memberships Response

Response for memberships.

**Fields**:

- `Memberships` (array<Membership>) - List of memberships

### Get Prospect Stages Response

Response for prospect stages.

**Fields**:

- `ProspectStages` (array<ProspectStage>) - List of prospect stages

### Get Liability Waiver Response

Response for liability waiver.

**Fields**:

- `LiabilityRelease` (object):
  - `Id` (Number) - Waiver ID
  - `Name` (String) - Waiver name
  - `Description` (String) - Description
  - `IsReleased` (Boolean) - Whether released

### Get Client Duplicates Response

Response for duplicate clients.

**Fields**:

- `PaginationResponse` (PaginationResponse) - Pagination info
- `ClientDuplicates` (array<ClientDuplicate>) - Duplicate clients

## Request/Response Wrappers

### Add Multiple Appointments Request

Request to add multiple appointments.

### Add Multiple Appointments Response

Response after adding multiple appointments.

### Get Available Dates Response

Response for available appointment dates.

### Get Bookable Items Response

Response for bookable items.

### Get Schedule Items Response

Response for schedule items.

### Get Staff Appointments Response

Response for staff appointments.

### Get Classes Response

Response for classes.

### Get Clients Response

Response for clients.

### Get Client Schedule Response

Response for client schedule.

### Get Client Visits Response

Response for client visits.

### Get Active Client Memberships Response

Response for active client memberships.

### Get Client Account Balances Response

Response for client account balances.

### Get Client Purchases Response

Response for client purchases.

### Get Sales Response

Response for sales.

### Get Products Response

Response for products.

### Get Services Response

Response for services.

### Get Packages Response

Response for packages.

### Get Locations Response

Response for locations.

### Get Staff Response

Response for staff members.

### Get Session Types Response

Response for session types.

### Get Programs Response

Response for programs.

### Get Sites Response

Response for sites.

## Additional Models

### Contact Log

Contact log entry used to track interactions and inquiries with clients.

**Fields**:

- `Id` (Number) - Log ID
- `Client` (Client) - Client object with basic information (UniqueId, Id, FirstName, LastName, Email, MobilePhone)
- `ContactName` (String, Optional) - Contact name
- `ContactDate` (DateTime) - Contact date (automatically set when created)
- `ContactType` (ContactLogType, Optional) - Contact type
- `Text` (String) - Log text (the inquiry message/details)
- `Comments` (array<String>, Optional) - Additional comments

### Add Contact Log Request

Request model for creating a new contact log entry. ⭐ **USED FOR INQUIRY NOTIFICATIONS**

**Required Fields**:

- `ClientId` (String) - **REQUIRED** - The ID of the client whose contact log is being added
- `Text` (String) - **REQUIRED** - The body of the contact log (inquiry message/details)
- `ContactMethod` (String) - **REQUIRED** - How the client wants to be contacted (e.g., "Email", "Phone", "Text")

**Optional Fields**:

- `AssignedToStaffId` (Long) - The ID of the staff member to whom the contact log is assigned
- `ContactName` (String) - The name of the person to be contacted by the assigned staff member
- `FollowupByDate` (DateTime) - The date by which the assigned staff member should complete this contact log (ISO date string)
- `IsComplete` (Boolean) - When true, indicates that the contact log is complete. When false, indicates the contact log isn't complete. Default: false
- `Types` (array<AddContactLogType>) - The contact log types used to tag this contact log
- `Comments` (array<String>) - Any comments on the contact log
- `Test` (Boolean) - When true, indicates that this is a test request and no data is inserted. Default: false

**Example for Membership Inquiry**:

```typescript
{
  ClientId: "12345",
  Text: "New Membership Inquiry\n\nName: John Doe\nEmail: john@example.com\nPhone: 555-1234\nMembership Tier: Founding Member\nAdditional Info: Interested in cold plunge",
  ContactMethod: "Email",
  ContactName: "John Doe",
  IsComplete: false
}
```

### Add Contact Log Type

Type tag for a contact log.

**Fields**:

- `Id` (Number) - Type ID
- `Name` (String, Optional) - Type name

### Contact Log Type

Type of contact log available in the system.

**Fields**:

- `Id` (Number) - Type ID
- `Name` (String) - Type name

### Get Contact Logs Request

Request model for retrieving contact logs.

**Required Fields**:

- `clientId` (String) - **REQUIRED** - The ID of the client whose contact logs are being requested

**Optional Fields**:

- `startDate` (String) - Filters results to contact logs created on or after this date (ISO date string). Default: current date
- `endDate` (String) - Filters results to contact logs created before this date (ISO date string). Default: the start date
- `limit` (Number) - Number of results to include. Default: 100
- `offset` (Number) - Page offset. Default: 0
- `showSystemGenerated` (Boolean) - When true, system-generated contact logs are returned. Default: false
- `staffIds` (array<Number>) - Filters results to contact logs assigned to one or more staff IDs
- `typeIds` (array<Number>) - Filters results to contact logs assigned one or more of these type IDs
- `subtypeIds` (array<Number>) - Filters results to contact logs assigned one or more of these subtype IDs

### Get Contact Logs Response

Response model after retrieving contact logs.

**Fields**:

- `ContactLogs` (array<ContactLog>) - Array of contact log entries
- `PaginationResponse` (PaginationResponse, Optional) - Pagination information

### Get Contact Log Types Response

Response model after retrieving contact log types.

**Fields**:

- `ContactLogTypes` (array<ContactLogType>) - Array of available contact log types
- `PaginationResponse` (PaginationResponse, Optional) - Pagination information

### Update Contact Log Request

Request model for updating an existing contact log entry.

**Required Fields**:

- `Id` (Number) - **REQUIRED** - The ID of the contact log being updated

**Optional Fields**:

- `Text` (String) - The contact log's new text
- `ContactMethod` (String) - The new method by which the client wants to be contacted
- `AssignedToStaffId` (Long) - The ID of the staff member to whom the contact log is now being assigned
- `ContactName` (String) - The name of the new person to be contacted by the assigned staff member
- `FollowupByDate` (DateTime) - The new date by which the assigned staff member should complete this contact log (ISO date string)
- `IsComplete` (Boolean) - When true, indicates that the contact log is complete. When false, indicates the contact log isn't complete
- `Types` (array<UpdateContactLogType>) - Contains information about the contact log types being assigned to the contact log, in addition to the contact log types that are already assigned
- `Comments` (array<UpdateContactLogComment>) - Contains information about the comments being updated or added to the contact log. Comments that have an ID of 0 are added to the contact log
- `Test` (Boolean) - When true, indicates that this is a test request and no data is inserted. Default: false

### Update Contact Log Type

Type information for updating a contact log type assignment.

**Fields**:

- `Id` (Number) - Type ID
- `Name` (String, Optional) - Type name

### Update Contact Log Comment

Comment information for updating or adding to a contact log.

**Fields**:

- `Id` (Number) - Comment ID (0 for new comments to be added)
- `Text` (String) - Comment text

### Sales Rep

Sales representative.

**Fields**:

- `Id` (Number) - Sales rep ID
- `FirstName` (String) - First name
- `LastName` (String) - Last name
- `Email` (String) - Email

### Lead Channel

Lead channel for LeadManagement.

**Fields**:

- `Id` (Number) - Channel ID
- `Name` (String) - Channel name

### Amenity

Location amenity.

**Fields**:

- `Id` (Number) - Amenity ID
- `Name` (String) - Amenity name

### Resource

Resource (room, equipment, etc.).

**Fields**:

- `Id` (Number) - Resource ID
- `Name` (String) - Resource name
- `Description` (String) - Description

### Resource Availability

Resource availability.

**Fields**:

- `Resource` (Resource) - Resource
- `StartDateTime` (DateTime) - Start time
- `EndDateTime` (DateTime) - End time
- `Available` (Boolean) - Whether available

### Unavailability

Staff or resource unavailability.

**Fields**:

- `Id` (Number) - Unavailability ID
- `Staff` (Staff) - Staff member (optional)
- `Resource` (Resource) - Resource (optional)
- `StartDateTime` (DateTime) - Start time
- `EndDateTime` (DateTime) - End time
- `Description` (String) - Description

### Availability

Staff or resource availability.

**Fields**:

- `Id` (Number) - Availability ID
- `Staff` (Staff) - Staff member
- `StartDateTime` (DateTime) - Start time
- `EndDateTime` (DateTime) - End time
- `DaysOfWeek` (array) - Days of week

### Waitlist Entry

Waitlist entry for a class.

**Fields**:

- `Id` (Number) - Entry ID
- `Client` (Client) - Client
- `ClassId` (Number) - Class ID
- `RequestDateTime` (DateTime) - Request time
- `EnrollmentDateForward` (DateTime) - Enrollment date

### Gift Card

Gift card information.

**Fields**:

- `Id` (Number) - Gift card ID
- `Amount` (Decimal) - Amount
- `Balance` (Decimal) - Current balance
- `Client` (Client) - Purchaser
- `Code` (String) - Gift card code

### Contract

Contract information.

**Fields**:

- `Id` (Number) - Contract ID
- `Name` (String) - Contract name
- `Description` (String) - Description
- `Price` (Decimal) - Price
- `ContractItems` (array) - Contract items
- `AutopaySchedule` (AutopaySchedule) - Autopay schedule

### Transaction

Transaction information.

**Fields**:

- `Id` (Number) - Transaction ID
- `Type` (String) - Transaction type
- `Amount` (Decimal) - Amount
- `PaymentMethod` (String) - Payment method
- `Date` (DateTime) - Transaction date

### Category

Category for products/services.

**Fields**:

- `Id` (Number) - Category ID
- `Name` (String) - Category name
- `SubCategories` (array) - Subcategories

### Sub Category

Subcategory.

**Fields**:

- `Id` (Number) - Subcategory ID
- `Name` (String) - Subcategory name

### Semester

Semester for courses.

**Fields**:

- `Id` (Number) - Semester ID
- `Name` (String) - Semester name
- `StartDate` (DateTime) - Start date
- `EndDate` (DateTime) - End date

### Course

Course information.

**Fields**:

- `Id` (Number) - Course ID
- `Name` (String) - Course name
- `Description` (String) - Description
- `Semester` (Semester) - Semester

### Promo Code

Promotion code.

**Fields**:

- `Id` (Number) - Promo code ID
- `Code` (String) - Code string
- `Name` (String) - Name
- `Description` (String) - Description
- `Discount` (Discount) - Discount information
- `Active` (Boolean) - Whether active

### Discount

Discount information.

**Fields**:

- `Type` (String) - Discount type
- `Amount` (Decimal) - Discount amount
- `ApplicableItems` (array) - Applicable items

## Related Documentation

- [Main Documentation Index](./README.md)
- [Complete API Reference](./API_REFERENCE.md)
- [Add Client Tutorial](./TUTORIAL.md)
- [Endpoints by Form](./ENDPOINTS_BY_FORM.md)

---

**Last Updated**: Based on Mindbody API 6.0 documentation

**Note**: This is a comprehensive reference. For specific field types and constraints, refer to the official API documentation for each endpoint.
