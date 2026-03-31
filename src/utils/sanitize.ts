/**
 * Input sanitization utilities to prevent XSS and injection attacks.
 * Applied to all user-facing text inputs before processing.
 */

/** Maximum allowed search query length */
const MAX_SEARCH_LENGTH = 100;

/** HTML entity map for escaping dangerous characters */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escapes HTML special characters to prevent XSS when rendering
 * user-provided text in the DOM.
 */
export function escapeHTML(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);
}

/**
 * Strips HTML tags and trims whitespace from user input.
 * Prevents stored XSS when rendering user-provided text.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')     // Remove HTML tags
    .replace(/[<>"'&]/g, '')     // Remove special chars
    .trim()
    .slice(0, MAX_SEARCH_LENGTH); // Enforce max length
}

/**
 * Validates that a string is a safe search query.
 * Only allows alphanumeric characters, spaces, and common food chars.
 */
export function isValidSearchQuery(input: string): boolean {
  if (input.length === 0) return true;
  if (input.length > MAX_SEARCH_LENGTH) return false;
  return /^[a-zA-Z0-9\s\-'.(),]+$/.test(input);
}

/**
 * Safely parses JSON from localStorage with fallback.
 * Prevents corrupted data from crashing the app.
 */
export function safeJSONParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn('[NourishAI] Corrupted localStorage data — resetting.');
    return fallback;
  }
}

/**
 * Validates a localStorage key name to prevent injection.
 */
export function sanitizeStorageKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9\-_]/g, '');
}
