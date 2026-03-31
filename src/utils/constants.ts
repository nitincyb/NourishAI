/**
 * Application-wide constants and configuration.
 * Centralizes magic numbers and strings for maintainability.
 */

import type { DailyGoals, DietaryGoal, Achievement } from '../types';

/** Goal presets mapping dietary goals to daily macro targets */
export const GOAL_PRESETS: Readonly<Record<DietaryGoal, DailyGoals>> = {
  'weight-loss': { calories: 1800, protein: 120, carbs: 150, fat: 55 },
  'muscle-gain': { calories: 2800, protein: 180, carbs: 300, fat: 80 },
  balanced: { calories: 2200, protein: 130, carbs: 250, fat: 70 },
} as const;

/** Default achievement definitions */
export const DEFAULT_ACHIEVEMENTS: readonly Achievement[] = [
  { id: 'first-log', title: 'First Bite', description: 'Log your first meal', emoji: '🎯', unlocked: false },
  { id: 'streak-3', title: 'Hat Trick', description: '3-day logging streak', emoji: '🔥', unlocked: false },
  { id: 'streak-7', title: 'Week Warrior', description: '7-day logging streak', emoji: '⚡', unlocked: false },
  { id: 'healthy-5', title: 'Green Machine', description: 'Log 5 healthy meals in a day', emoji: '🥬', unlocked: false },
  { id: 'protein-pro', title: 'Protein Pro', description: 'Hit protein goal 3 days in a row', emoji: '💪', unlocked: false },
  { id: 'hydrated', title: 'Hydration Hero', description: 'Drink 8 glasses of water', emoji: '💧', unlocked: false },
  { id: 'level-5', title: 'Rising Star', description: 'Reach level 5', emoji: '⭐', unlocked: false },
  { id: 'no-junk', title: 'Clean Eater', description: 'Go a full day without fast food', emoji: '🏆', unlocked: false },
] as const;

/** Category color mapping for charts */
export const CATEGORY_COLORS: Readonly<Record<string, string>> = {
  fruit: '#22C97A',
  vegetable: '#5B8DEF',
  protein: '#A855F7',
  grain: '#FFB347',
  dairy: '#FF4D8D',
  snack: '#9A9AB0',
  beverage: '#5B8DEF',
  'fast-food': '#FF5C72',
} as const;

/** Navigation tabs configuration */
export const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'log', label: 'Log Meal', emoji: '🍽️' },
  { id: 'insights', label: 'Insights', emoji: '📈' },
  { id: 'rewards', label: 'Rewards', emoji: '🏆' },
] as const;

/** Maximum hydration glasses per day */
export const MAX_WATER_GLASSES = 8;

/** XP required per level */
export const XP_PER_LEVEL = 100;

/** Store persistence key */
export const STORE_KEY = 'nourish-ai-store';
