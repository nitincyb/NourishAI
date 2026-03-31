/**
 * Unit tests for input sanitization utilities.
 * Validates XSS prevention, input validation, and safe JSON parsing.
 */

import { describe, it, expect, vi } from 'vitest';
import { sanitizeText, isValidSearchQuery, safeJSONParse, escapeHTML } from '../utils/sanitize';

// ─── sanitizeText ───
describe('sanitizeText', () => {
  it('removes HTML tags', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert(xss)');
  });

  it('removes dangerous characters', () => {
    expect(sanitizeText('food & "drink" <meal>')).toBe('food  drink');
  });

  it('trims whitespace', () => {
    expect(sanitizeText('  banana  ')).toBe('banana');
  });

  it('enforces maximum length of 100 characters', () => {
    const long = 'a'.repeat(200);
    expect(sanitizeText(long).length).toBeLessThanOrEqual(100);
  });

  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('handles mixed XSS payloads', () => {
    expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('');
  });

  it('strips event handler attributes in tags', () => {
    expect(sanitizeText('<div onmouseover="steal()">hi</div>')).toBe('hi');
  });
});

// ─── isValidSearchQuery ───
describe('isValidSearchQuery', () => {
  it('accepts empty string', () => {
    expect(isValidSearchQuery('')).toBe(true);
  });

  it('accepts alphanumeric with spaces', () => {
    expect(isValidSearchQuery('chicken breast')).toBe(true);
  });

  it('accepts food-related characters (hyphens, apostrophes)', () => {
    expect(isValidSearchQuery("mac 'n cheese")).toBe(true);
    expect(isValidSearchQuery('stir-fry')).toBe(true);
  });

  it('rejects strings exceeding max length', () => {
    expect(isValidSearchQuery('a'.repeat(101))).toBe(false);
  });

  it('rejects script injection attempts', () => {
    expect(isValidSearchQuery('<script>')).toBe(false);
  });

  it('rejects SQL injection patterns', () => {
    expect(isValidSearchQuery("'; DROP TABLE--")).toBe(false);
  });
});

// ─── safeJSONParse ───
describe('safeJSONParse', () => {
  it('parses valid JSON', () => {
    expect(safeJSONParse('{"a":1}', {})).toEqual({ a: 1 });
  });

  it('returns fallback for null input', () => {
    expect(safeJSONParse(null, { default: true })).toEqual({ default: true });
  });

  it('returns fallback for corrupted JSON', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeJSONParse('not-json{', [])).toEqual([]);
    spy.mockRestore();
  });

  it('returns fallback for empty string', () => {
    expect(safeJSONParse('', 42)).toBe(42);
  });
});

// ─── escapeHTML ───
describe('escapeHTML', () => {
  it('escapes ampersands', () => {
    expect(escapeHTML('a & b')).toBe('a &amp; b');
  });

  it('escapes angle brackets', () => {
    expect(escapeHTML('<div>')).toBe('&lt;div&gt;');
  });

  it('escapes quotes', () => {
    expect(escapeHTML('"hello" & \'world\'')).toBe('&quot;hello&quot; &amp; &#39;world&#39;');
  });

  it('returns empty string for empty input', () => {
    expect(escapeHTML('')).toBe('');
  });

  it('does not double-escape already escaped content', () => {
    expect(escapeHTML('&amp;')).toBe('&amp;amp;');
  });
});
