/**
 * Unit tests for core nutrition utility functions.
 * Run: npx vitest run
 */

import { describe, it, expect } from 'vitest';
import {
  getHealthBadge,
  calculateXP,
  calculateLevel,
  calculateStreak,
  aggregateNutrients,
  generateAlerts,
  getContextMessage,
  averageHealthScore,
  countByCategory,
} from '../utils/nutrition';
import type { LoggedMeal, FoodItem } from '../types';

// ─── Test Fixtures ───
const mockFood = (overrides: Partial<FoodItem> = {}): FoodItem => ({
  id: '1', name: 'Test Food', emoji: '🍎', calories: 100, protein: 5,
  carbs: 20, fat: 3, fiber: 2, sugar: 10, healthScore: 75,
  category: 'fruit', servingSize: '1 unit', ...overrides,
});

const mockMeal = (overrides: Partial<LoggedMeal> = {}): LoggedMeal => ({
  id: 'meal-1', food: mockFood(), timestamp: Date.now(),
  mealType: 'lunch', badge: 'healthy', ...overrides,
});

// ─── getHealthBadge ───
describe('getHealthBadge', () => {
  it('returns "healthy" for scores >= 70', () => {
    expect(getHealthBadge(70)).toBe('healthy');
    expect(getHealthBadge(100)).toBe('healthy');
  });

  it('returns "moderate" for scores 40-69', () => {
    expect(getHealthBadge(40)).toBe('moderate');
    expect(getHealthBadge(69)).toBe('moderate');
  });

  it('returns "avoid" for scores < 40', () => {
    expect(getHealthBadge(0)).toBe('avoid');
    expect(getHealthBadge(39)).toBe('avoid');
  });
});

// ─── calculateXP ───
describe('calculateXP', () => {
  it('awards 15 XP for healthy foods (score >= 70)', () => {
    expect(calculateXP(70)).toBe(15);
    expect(calculateXP(95)).toBe(15);
  });

  it('awards 8 XP for moderate foods (score 40-69)', () => {
    expect(calculateXP(40)).toBe(8);
    expect(calculateXP(65)).toBe(8);
  });

  it('awards 3 XP for unhealthy foods (score < 40)', () => {
    expect(calculateXP(10)).toBe(3);
    expect(calculateXP(0)).toBe(3);
  });
});

// ─── calculateLevel ───
describe('calculateLevel', () => {
  it('starts at level 1 with 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('levels up every 100 XP', () => {
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(499)).toBe(5);
  });
});

// ─── calculateStreak ───
describe('calculateStreak', () => {
  it('returns current streak if already logged today', () => {
    const today = new Date().toDateString();
    expect(calculateStreak(5, today, today)).toBe(5);
  });

  it('increments streak if last log was yesterday', () => {
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    const today = new Date().toDateString();
    expect(calculateStreak(3, yesterday, today)).toBe(4);
  });

  it('resets streak to 1 if gap is more than one day', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toDateString();
    const today = new Date().toDateString();
    expect(calculateStreak(10, twoDaysAgo, today)).toBe(1);
  });

  it('starts at 1 if no previous log', () => {
    const today = new Date().toDateString();
    expect(calculateStreak(0, null, today)).toBe(1);
  });
});

// ─── aggregateNutrients ───
describe('aggregateNutrients', () => {
  it('returns zeros for empty meal list', () => {
    const result = aggregateNutrients([]);
    expect(result.calories).toBe(0);
    expect(result.protein).toBe(0);
  });

  it('sums nutrients across meals', () => {
    const meals = [
      mockMeal({ food: mockFood({ calories: 200, protein: 10 }) }),
      mockMeal({ food: mockFood({ calories: 300, protein: 20 }) }),
    ];
    const result = aggregateNutrients(meals);
    expect(result.calories).toBe(500);
    expect(result.protein).toBe(30);
  });
});

// ─── generateAlerts ───
describe('generateAlerts', () => {
  it('warns when sugar exceeds 50g', () => {
    const alerts = generateAlerts(
      { calories: 1000, protein: 50, carbs: 100, fat: 30, sugar: 55, fiber: 10 },
      { calories: 2200, protein: 130, carbs: 250, fat: 70 },
      12
    );
    expect(alerts.some(a => a.includes('sugar'))).toBe(true);
  });

  it('alerts when calories exceed goal', () => {
    const alerts = generateAlerts(
      { calories: 2500, protein: 100, carbs: 200, fat: 60, sugar: 30, fiber: 15 },
      { calories: 2200, protein: 130, carbs: 250, fat: 70 },
      12
    );
    expect(alerts.some(a => a.includes('exceeded'))).toBe(true);
  });

  it('returns empty array when all values are within limits', () => {
    const alerts = generateAlerts(
      { calories: 1000, protein: 80, carbs: 100, fat: 30, sugar: 20, fiber: 10 },
      { calories: 2200, protein: 130, carbs: 250, fat: 70 },
      12
    );
    expect(alerts).toHaveLength(0);
  });
});

// ─── getContextMessage ───
describe('getContextMessage', () => {
  it('returns morning message for 6-10 AM', () => {
    expect(getContextMessage(7)).toContain('morning');
  });

  it('returns lunch message for 12-14', () => {
    expect(getContextMessage(13)).toContain('Lunch');
  });

  it('returns late night message for 22+', () => {
    expect(getContextMessage(23)).toContain('Late night');
  });
});

// ─── averageHealthScore ───
describe('averageHealthScore', () => {
  it('returns 0 for empty meals', () => {
    expect(averageHealthScore([])).toBe(0);
  });

  it('calculates correct average', () => {
    const meals = [
      mockMeal({ food: mockFood({ healthScore: 80 }) }),
      mockMeal({ food: mockFood({ healthScore: 60 }) }),
    ];
    expect(averageHealthScore(meals)).toBe(70);
  });
});

// ─── countByCategory ───
describe('countByCategory', () => {
  it('counts meals per category, sorted descending', () => {
    const meals = [
      mockMeal({ food: mockFood({ category: 'fruit' }) }),
      mockMeal({ food: mockFood({ category: 'fruit' }) }),
      mockMeal({ food: mockFood({ category: 'protein' }) }),
    ];
    const result = countByCategory(meals);
    expect(result[0]).toEqual(['fruit', 2]);
    expect(result[1]).toEqual(['protein', 1]);
  });
});
