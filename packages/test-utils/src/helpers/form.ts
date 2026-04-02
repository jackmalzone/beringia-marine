/**
 * Form Testing Helpers
 */

import { waitFor } from '@testing-library/react';

/**
 * Wait for form submission to complete
 */
export async function waitForFormSubmission() {
  return waitFor(
    () => {
      // Check for success or error messages
      const successMessage = document.querySelector('[role="alert"]');
      const errorMessage = document.querySelector('.errorMessage');
      if (successMessage || errorMessage) {
        return true;
      }
      throw new Error('Form submission not complete');
    },
    { timeout: 5000 }
  );
}

/**
 * Fill form fields
 */
export function fillFormField(
  container: HTMLElement,
  fieldName: string,
  value: string
) {
  const field = container.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
  if (field) {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
