/**
 * Mindbody API 6.0 TypeScript Types
 * Based on Mindbody API 6.0 documentation
 */

// Base API Configuration
export interface MindbodyApiConfig {
  apiKey: string;
  siteId: string;
  baseUrl?: string;
  authorization?: string; // Optional staff user token
}

// Request/Response Base Types
export interface ApiError {
  Error: {
    Code: string;
    Message: string;
  };
}

export interface PaginationResponse {
  RequestedLimit: number;
  RequestedOffset: number;
  PageSize: number;
  TotalResults: number;
}

// Client Types
export interface AddClientRequest {
  FirstName: string; // Required
  LastName: string; // Required
  Email?: string;
  MobilePhone?: string;
  HomePhone?: string;
  WorkPhone?: string;
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  State?: string;
  PostalCode?: string;
  Country?: string;
  BirthDate?: string; // ISO date string
  Gender?: string;
  IsProspect?: boolean;
  ProspectStage?: ProspectStage;
  LeadChannelId?: number;
  CustomClientFields?: CustomClientFieldValue[];
  ClientIndexes?: AssignedClientIndex[];
  ClientRelationships?: ClientRelationship[];
  LiabilityRelease?: boolean;
  Liability?: Liability;
  Notes?: string;
  SendScheduleEmails?: boolean;
  SendAccountEmails?: boolean;
  SendPromotionalEmails?: boolean;
  SendScheduleTexts?: boolean;
  SendAccountTexts?: boolean;
  SendPromotionalTexts?: boolean;
  EmergencyContactInfoEmail?: string;
  EmergencyContactInfoName?: string;
  EmergencyContactInfoPhone?: string;
  EmergencyContactInfoRelationship?: string;
  Test?: boolean;
}

export interface ProspectStage {
  Id: number;
  Name: string;
}

export interface CustomClientFieldValue {
  Id: string;
  Value: string;
}

export interface AssignedClientIndex {
  Id: number;
  ValueId?: number;
  Value?: string;
}

export interface ClientRelationship {
  RelatedClientId: string;
  Relationship: string;
}

export interface Liability {
  IsReleased: boolean;
  AgreementDate?: string;
  ReleasedBy?: string;
}

export interface AddClientResponse {
  Client: {
    UniqueId: string;
    Id: string;
    FirstName: string;
    LastName: string;
    Email?: string;
    MobilePhone?: string;
    IsProspect?: boolean;
  };
  Message?: string;
}

export interface GetRequiredClientFieldsResponse {
  RequiredFields: string[];
}

// Site Types
export interface GetMembershipsResponse {
  Memberships: Membership[];
}

export interface Membership {
  Id: number;
  Name: string;
  Description?: string;
  ShortDescription?: string;
  Price?: number;
  OnlinePrice?: number;
  Program?: Program;
  MembershipTypeRestrictions?: MembershipTypeRestriction[];
}

export interface Program {
  Id: number;
  Name: string;
  ScheduleType: string;
}

export interface MembershipTypeRestriction {
  Id: number;
  Name: string;
}

export interface GetProspectStagesResponse {
  ProspectStages: ProspectStage[];
}

export interface GetLiabilityWaiverResponse {
  LiabilityRelease: {
    Id: number;
    Name: string;
    Description?: string;
    IsReleased: boolean;
  };
}

// Form Submission Types (for our API routes)
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface WaitlistFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interestAreas?: string[];
}

export interface MembershipInquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipTier?: string;
  additionalInfo?: string;
}

// API Route Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface LeadSubmissionResponse {
  clientId: string;
  uniqueId: string;
  message?: string;
}
