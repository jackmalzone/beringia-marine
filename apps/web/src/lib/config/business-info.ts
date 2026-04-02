/**
 * Compatibility layer - will be removed in a future cleanup.
 * Canonical identity defaults now live in @vital-ice/config.
 */

import { TEMPLATE_BUSINESS, type BusinessInfo } from '@vital-ice/config';

export { TEMPLATE_BUSINESS,
  BusinessInfoHelpers,
  type BusinessInfo,
  type BusinessAddress,
  type BusinessCoordinates,
  type BusinessHours,
} from '@vital-ice/config';

/** @deprecated Use TEMPLATE_BUSINESS directly from @vital-ice/config. */
export function getBusinessInfoForEnvironment() {
  return TEMPLATE_BUSINESS;
}

/** @deprecated Prefer centralized package-level validation if needed. */
export function validateBusinessInfo(businessInfo: BusinessInfo): {
  isValid: boolean;
  missingFields: string[];
  placeholderFields: string[];
} {
  const missingFields: string[] = [];
  if (!businessInfo.name) missingFields.push('name');
  if (!businessInfo.email) missingFields.push('email');
  if (!businessInfo.address.street) missingFields.push('address.street');
  if (!businessInfo.address.zipCode) missingFields.push('address.zipCode');
  return {
    isValid: missingFields.length === 0,
    missingFields,
    placeholderFields: [],
  };
}

export default TEMPLATE_BUSINESS;
