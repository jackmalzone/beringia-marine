/**
 * API Error Messages
 * 
 * User-friendly error messages for API routes
 * Calm, encouraging, slightly humorous (template default)
 */

/**
 * Get a user-friendly error message for API errors
 */
export function getApiErrorMessage(errorCode: string): string {
  const friendlyMessages = [
    "Our forms are having a bit of a chill moment. Give it another try in a few seconds!",
    "Something's not quite right on our end. Take a deep breath and try again.",
    "We hit a small snag. Don't worry, we're on it - please try submitting again.",
    "Oops! Our system needs a quick refresh. Try again in a moment.",
    "We're experiencing a brief hiccup. Give it another go - you've got this!",
  ];

  // Handle empty string or invalid error codes
  if (!errorCode || errorCode.length === 0) {
    return friendlyMessages[0];
  }

  // Use error code to deterministically pick a message
  const index = errorCode.charCodeAt(0) % friendlyMessages.length;
  return friendlyMessages[index];
}

/**
 * Get a user-friendly error message for invalid request body
 */
export function getInvalidRequestMessage(): string {
  return "Something's not quite right with your submission. Please check your information and try again.";
}

