/**
 * Core type definitions for the NourishAI application.
 * Centralizes all shared types to ensure consistency across modules.
 */

/** Supported food categories in the nutrition database */
export type FoodCategory =
  | 'fruit'
  | 'vegetable'
  | 'grain'
  | 'protein'
  | 'dairy'
  | 'snack'
  | 'beverage'
  | 'fast-food';

/** Health classification based on nutritional score */
export type HealthBadge = 'healthy' | 'moderate' | 'avoid';

/** Supported meal time slots */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** User dietary goals */
export type DietaryGoal = 'weight-loss' | 'muscle-gain' | 'balanced';

/** Nutritional information for a single food item */
export interface FoodItem {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
  readonly fiber: number;
  readonly sugar: number;
  readonly healthScore: number;
  readonly category: FoodCategory;
  readonly servingSize: string;
}

/** A logged meal entry with metadata */
export interface LoggedMeal {
  readonly id: string;
  readonly food: FoodItem;
  readonly timestamp: number;
  readonly mealType: MealType;
  readonly badge: HealthBadge;
}

/** Daily macronutrient targets */
export interface DailyGoals {
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** User profile with preferences */
export interface UserProfile {
  readonly name: string;
  readonly goal: DietaryGoal;
  readonly dailyGoals: DailyGoals;
}

/** Gamification: unlockable achievement */
export interface Achievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
}

/** Aggregated nutritional totals */
export interface NutrientTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
}

/** Weekly data point for charts */
export interface WeekDataPoint {
  readonly day: string;
  readonly calories: number;
  readonly score: number;
}
