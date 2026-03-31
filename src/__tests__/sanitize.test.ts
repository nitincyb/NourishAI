import { describe, it, expect, vi } from 'vitest';
import { sanitizeText, isValidSearchQuery, safeJSONParse, escapeHTML } from '../utils/sanitize';

describe('sanitizeText', () => {
  it('removes HTML tags', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert(xss)');
  });
  it('removes dangerous characters', () => {
    expect(sanitizeText('food & "drink"')).toBe('food  drink');
  });
  it('trims whitespace', () => {
    expect(sanitizeText('  banana  ')).toBe('banana');
  });
  it('enforces max length', () => {
    expect(sanitizeText('a'.repeat(200)).length).toBeLessThanOrEqual(100);
  });
  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('');
  });
  it('strips tags with attributes', () => {
    expect(sanitizeText('<div onmouseover="steal()">hi</div>')).toBe('hi');
  });
});

describe('isValidSearchQuery', () => {
  it('accepts empty string', () => { expect(isValidSearchQuery('')).toBe(true); });
  it('accepts alphanumeric', () => { expect(isValidSearchQuery('chicken breast')).toBe(true); });
  it('rejects too long', () => { expect(isValidSearchQuery('a'.repeat(101))).toBe(false); });
  it('rejects script tags', () => { expect(isValidSearchQuery('<script>')).toBe(false); });
});

describe('safeJSONParse', () => {
  it('parses valid JSON', () => { expect(safeJSONParse('{"a":1}', {})).toEqual({ a: 1 }); });
  it('returns fallback for null', () => { expect(safeJSONParse(null, { d: true })).toEqual({ d: true }); });
  it('returns fallback for bad JSON', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeJSONParse('bad{', [])).toEqual([]);
  });
});

describe('escapeHTML', () => {
  it('escapes ampersands', () => { expect(escapeHTML('a & b')).toBe('a &amp; b'); });
  it('escapes angle brackets', () => { expect(escapeHTML('<div>')).toBe('&lt;div&gt;'); });
  it('escapes quotes', () => { expect(escapeHTML('"hi"')).toBe('&quot;hi&quot;'); });
  it('returns empty for empty', () => { expect(escapeHTML('')).toBe(''); });
});
