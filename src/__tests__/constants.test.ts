/**
 * Unit tests for application constants and configuration.
 * Validates structural integrity and consistency of shared data.
 */

import { describe, it, expect } from 'vitest';
import { GOAL_PRESETS, DEFAULT_ACHIEVEMENTS, NAV_TABS, CATEGORY_COLORS, MAX_WATER_GLASSES, XP_PER_LEVEL, STORE_KEY } from '../utils/constants';

// ─── GOAL_PRESETS ───
describe('GOAL_PRESETS', () => {
  it('contains all three dietary goals', () => {
    expect(Object.keys(GOAL_PRESETS)).toEqual(['weight-loss', 'muscle-gain', 'balanced']);
  });

  it('each goal has positive calorie, protein, carbs, fat values', () => {
    for (const [, goals] of Object.entries(GOAL_PRESETS)) {
      expect(goals.calories).toBeGreaterThan(0);
      expect(goals.protein).toBeGreaterThan(0);
      expect(goals.carbs).toBeGreaterThan(0);
      expect(goals.fat).toBeGreaterThan(0);
    }
  });

  it('weight-loss has fewer calories than muscle-gain', () => {
    expect(GOAL_PRESETS['weight-loss'].calories).toBeLessThan(GOAL_PRESETS['muscle-gain'].calories);
  });

  it('muscle-gain has highest protein target', () => {
    expect(GOAL_PRESETS['muscle-gain'].protein).toBeGreaterThan(GOAL_PRESETS['balanced'].protein);
    expect(GOAL_PRESETS['muscle-gain'].protein).toBeGreaterThan(GOAL_PRESETS['weight-loss'].protein);
  });
});

// ─── DEFAULT_ACHIEVEMENTS ───
describe('DEFAULT_ACHIEVEMENTS', () => {
  it('has no duplicate IDs', () => {
    const ids = DEFAULT_ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all achievements start unlocked: false', () => {
    for (const ach of DEFAULT_ACHIEVEMENTS) {
      expect(ach.unlocked).toBe(false);
    }
  });

  it('each achievement has required fields', () => {
    for (const ach of DEFAULT_ACHIEVEMENTS) {
      expect(ach.id).toBeTruthy();
      expect(ach.title).toBeTruthy();
      expect(ach.description).toBeTruthy();
      expect(ach.emoji).toBeTruthy();
    }
  });

  it('contains at least 5 achievements', () => {
    expect(DEFAULT_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(5);
  });
});

// ─── NAV_TABS ───
describe('NAV_TABS', () => {
  it('has no duplicate IDs', () => {
    const ids = NAV_TABS.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each tab has id, label, and emoji', () => {
    for (const tab of NAV_TABS) {
      expect(tab.id).toBeTruthy();
      expect(tab.label).toBeTruthy();
      expect(tab.emoji).toBeTruthy();
    }
  });

  it('includes dashboard and log tabs', () => {
    const ids = NAV_TABS.map(t => t.id);
    expect(ids).toContain('dashboard');
    expect(ids).toContain('log');
  });
});

// ─── CATEGORY_COLORS ───
describe('CATEGORY_COLORS', () => {
  it('has colors for all food categories', () => {
    const expected = ['fruit', 'vegetable', 'protein', 'grain', 'dairy', 'snack', 'beverage', 'fast-food'];
    for (const cat of expected) {
      expect(CATEGORY_COLORS[cat]).toBeTruthy();
    }
  });

  it('all values are valid hex colors', () => {
    for (const color of Object.values(CATEGORY_COLORS)) {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

// ─── Scalar constants ───
describe('Scalar constants', () => {
  it('MAX_WATER_GLASSES is a positive integer', () => {
    expect(MAX_WATER_GLASSES).toBeGreaterThan(0);
    expect(Number.isInteger(MAX_WATER_GLASSES)).toBe(true);
  });

  it('XP_PER_LEVEL is a positive integer', () => {
    expect(XP_PER_LEVEL).toBeGreaterThan(0);
    expect(Number.isInteger(XP_PER_LEVEL)).toBe(true);
  });

  it('STORE_KEY is a non-empty string', () => {
    expect(typeof STORE_KEY).toBe('string');
    expect(STORE_KEY.length).toBeGreaterThan(0);
  });
});
