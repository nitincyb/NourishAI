/**
 * Unit tests for the Zustand application store.
 * Tests state mutations, derived computations, and achievement unlock logic.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';
import type { FoodItem } from '../types';

const mockFood: FoodItem = {
  id: 'test-1',
  name: 'Test Apple',
  emoji: '🍎',
  calories: 95,
  protein: 0.5,
  carbs: 25,
  fat: 0.3,
  fiber: 4.4,
  sugar: 19,
  healthScore: 82,
  category: 'fruit',
  servingSize: '1 medium',
};

const unhealthyFood: FoodItem = {
  id: 'test-2',
  name: 'Test Burger',
  emoji: '🍔',
  calories: 540,
  protein: 25,
  carbs: 40,
  fat: 29,
  fiber: 2,
  sugar: 8,
  healthScore: 25,
  category: 'fast-food',
  servingSize: '1 burger',
};

// Reset store before each test
beforeEach(() => {
  useStore.setState({
    meals: [],
    streak: 0,
    lastLogDate: null,
    xp: 0,
    level: 1,
    waterGlasses: 0,
    user: { name: 'User', goal: 'balanced', dailyGoals: { calories: 2200, protein: 130, carbs: 250, fat: 70 } },
    achievements: [
      { id: 'first-log', title: 'First Bite', description: 'Log your first meal', emoji: '🎯', unlocked: false },
      { id: 'streak-3', title: 'Hat Trick', description: '3-day streak', emoji: '🔥', unlocked: false },
      { id: 'streak-7', title: 'Week Warrior', description: '7-day streak', emoji: '⚡', unlocked: false },
      { id: 'hydrated', title: 'Hydration Hero', description: 'Drink 8 glasses', emoji: '💧', unlocked: false },
      { id: 'level-5', title: 'Rising Star', description: 'Reach level 5', emoji: '⭐', unlocked: false },
    ],
  });
});

// ─── logMeal ───
describe('logMeal', () => {
  it('adds a meal to the store', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    expect(useStore.getState().meals).toHaveLength(1);
    expect(useStore.getState().meals[0].food.name).toBe('Test Apple');
  });

  it('assigns correct meal type', () => {
    useStore.getState().logMeal(mockFood, 'breakfast');
    expect(useStore.getState().meals[0].mealType).toBe('breakfast');
  });

  it('generates a unique ID for each meal', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    useStore.getState().logMeal(mockFood, 'dinner');
    const ids = useStore.getState().meals.map(m => m.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('awards XP based on health score (healthy food = 15 XP)', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    expect(useStore.getState().xp).toBe(15);
  });

  it('awards less XP for unhealthy food (3 XP)', () => {
    useStore.getState().logMeal(unhealthyFood, 'lunch');
    expect(useStore.getState().xp).toBe(3);
  });

  it('unlocks first-log achievement', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    const ach = useStore.getState().achievements.find(a => a.id === 'first-log');
    expect(ach?.unlocked).toBe(true);
  });

  it('assigns correct health badge', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    expect(useStore.getState().meals[0].badge).toBe('healthy');

    useStore.getState().logMeal(unhealthyFood, 'dinner');
    expect(useStore.getState().meals[1].badge).toBe('avoid');
  });
});

// ─── removeMeal ───
describe('removeMeal', () => {
  it('removes a meal by ID', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    const id = useStore.getState().meals[0].id;
    useStore.getState().removeMeal(id);
    expect(useStore.getState().meals).toHaveLength(0);
  });

  it('does not affect other meals', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    useStore.getState().logMeal(unhealthyFood, 'dinner');
    const firstId = useStore.getState().meals[0].id;
    useStore.getState().removeMeal(firstId);
    expect(useStore.getState().meals).toHaveLength(1);
    expect(useStore.getState().meals[0].food.name).toBe('Test Burger');
  });
});

// ─── addWater ───
describe('addWater', () => {
  it('increments water glass count', () => {
    useStore.getState().addWater();
    expect(useStore.getState().waterGlasses).toBe(1);
  });

  it('unlocks hydrated achievement at 8 glasses', () => {
    for (let i = 0; i < 8; i++) {
      useStore.getState().addWater();
    }
    const ach = useStore.getState().achievements.find(a => a.id === 'hydrated');
    expect(ach?.unlocked).toBe(true);
  });

  it('does not unlock hydrated at 7 glasses', () => {
    for (let i = 0; i < 7; i++) {
      useStore.getState().addWater();
    }
    const ach = useStore.getState().achievements.find(a => a.id === 'hydrated');
    expect(ach?.unlocked).toBe(false);
  });
});

// ─── setGoal ───
describe('setGoal', () => {
  it('updates user goal', () => {
    useStore.getState().setGoal('muscle-gain');
    expect(useStore.getState().user.goal).toBe('muscle-gain');
  });

  it('updates daily goals to match preset', () => {
    useStore.getState().setGoal('weight-loss');
    expect(useStore.getState().user.dailyGoals.calories).toBe(1800);
  });
});

// ─── getTodayMeals ───
describe('getTodayMeals', () => {
  it('returns only meals from today', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    expect(useStore.getState().getTodayMeals()).toHaveLength(1);
  });

  it('excludes meals from other days', () => {
    // Add a meal with yesterday's timestamp
    useStore.setState({
      meals: [{
        id: 'old-1',
        food: mockFood,
        timestamp: Date.now() - 86_400_000 * 2,
        mealType: 'lunch',
        badge: 'healthy',
      }],
    });
    expect(useStore.getState().getTodayMeals()).toHaveLength(0);
  });
});

// ─── getTodayTotals ───
describe('getTodayTotals', () => {
  it('returns zeros when no meals logged', () => {
    const totals = useStore.getState().getTodayTotals();
    expect(totals.calories).toBe(0);
    expect(totals.protein).toBe(0);
  });

  it('aggregates nutrients from today meals', () => {
    useStore.getState().logMeal(mockFood, 'lunch');
    useStore.getState().logMeal(mockFood, 'dinner');
    const totals = useStore.getState().getTodayTotals();
    expect(totals.calories).toBe(190);
    expect(totals.protein).toBe(1);
  });
});
