/**
 * User-friendly error messages for form submissions
 * Vital Ice themed - calm, encouraging, slightly humorous
 */

/**
 * Get a user-friendly error message for technical errors
 * Returns a friendly message that hides technical details from users
 */
export function getUserFriendlyErrorMessage(errorCode: string): string {
  // Array of friendly messages - we'll randomly pick one to keep it fresh
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

  // Use error code to deterministically pick a message (so same error shows same message)
  const index = errorCode.charCodeAt(0) % friendlyMessages.length;
  return friendlyMessages[index];
}

/**
 * Get a user-friendly error message for network errors
 */
export function getNetworkErrorMessage(): string {
  const messages = [
    "Looks like we lost connection for a moment. Check your internet and try again!",
    "Connection got a bit frosty there. Warm it up and try once more.",
    "We couldn't reach our servers. Make sure you're connected and give it another shot.",
  ];
  
  // Pick based on current time to vary the message
  const index = Math.floor(Date.now() / 1000) % messages.length;
  return messages[index];
}

/**
 * Get a user-friendly error message for validation errors
 * These are user-facing, so we keep the original message
 */
export function getValidationErrorMessage(originalMessage: string): string {
  return originalMessage;
}

