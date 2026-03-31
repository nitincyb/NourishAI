/**
 * Pure utility functions for nutritional analysis and scoring.
 * All functions are stateless and side-effect-free for easy testing.
 */

import type { HealthBadge, NutrientTotals, LoggedMeal, DailyGoals, WeekDataPoint } from '../types';

/** Score thresholds for health classification */
const HEALTHY_THRESHOLD = 70;
const MODERATE_THRESHOLD = 40;

/** Daily sugar limit in grams (WHO recommendation) */
export const SUGAR_DAILY_LIMIT = 50;

/** Recommended daily fiber intake in grams */
export const FIBER_DAILY_TARGET = 30;

/**
 * Classifies a food item's health score into a badge category.
 * @param score - Health score between 0-100
 * @returns Health badge classification
 */
export function getHealthBadge(score: number): HealthBadge {
  if (score >= HEALTHY_THRESHOLD) return 'healthy';
  if (score >= MODERATE_THRESHOLD) return 'moderate';
  return 'avoid';
}

/**
 * Returns a human-readable label for a health badge.
 */
export function getBadgeLabel(badge: HealthBadge): string {
  const labels: Record<HealthBadge, string> = {
    healthy: '🟢 Healthy',
    moderate: '🟡 Moderate',
    avoid: '🔴 Avoid',
  };
  return labels[badge];
}

/**
 * Calculates XP earned from logging a food item.
 * Healthier choices earn more XP to incentivize good habits.
 */
export function calculateXP(healthScore: number): number {
  if (healthScore >= HEALTHY_THRESHOLD) return 15;
  if (healthScore >= MODERATE_THRESHOLD) return 8;
  return 3;
}

/**
 * Determines the level from total XP (100 XP per level).
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

/**
 * Aggregates nutritional totals from a list of logged meals.
 * Uses reduce for a clean, functional approach.
 */
export function aggregateNutrients(meals: readonly LoggedMeal[]): NutrientTotals {
  return meals.reduce<NutrientTotals>(
    (totals, meal) => ({
      calories: totals.calories + meal.food.calories,
      protein: totals.protein + meal.food.protein,
      carbs: totals.carbs + meal.food.carbs,
      fat: totals.fat + meal.food.fat,
      sugar: totals.sugar + meal.food.sugar,
      fiber: totals.fiber + meal.food.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0 }
  );
}

/**
 * Generates smart health alerts based on current intake vs goals.
 * @returns Array of alert message strings
 */
export function generateAlerts(totals: NutrientTotals, goals: DailyGoals, currentHour: number): string[] {
  const alerts: string[] = [];

  if (totals.sugar > SUGAR_DAILY_LIMIT) {
    alerts.push(`⚠️ You've had too much sugar today (${totals.sugar.toFixed(0)}g)`);
  }
  if (totals.calories > goals.calories) {
    alerts.push('🔴 You\'ve exceeded your calorie goal!');
  } else if (totals.calories > goals.calories * 0.8) {
    alerts.push('🟡 You\'re close to your calorie limit');
  }
  if (totals.protein < goals.protein * 0.3 && currentHour > 15) {
    alerts.push('💪 Your protein intake is low — add some protein!');
  }
  if (totals.fiber >= FIBER_DAILY_TARGET) {
    alerts.push('🎉 Great fiber intake today!');
  }

  return alerts;
}

/**
 * Returns a context-aware greeting and suggestion based on time of day.
 */
export function getContextMessage(hour: number): string {
  if (hour >= 6 && hour < 10) return '☀️ Good morning! Start with a protein-rich breakfast';
  if (hour >= 10 && hour < 12) return '🌤️ Mid-morning — a healthy snack can boost focus';
  if (hour >= 12 && hour < 14) return '🌞 Lunchtime! Go for a balanced meal';
  if (hour >= 14 && hour < 17) return '🌅 Afternoon — stay hydrated, light snack if needed';
  if (hour >= 17 && hour < 20) return '🌆 Dinner time — keep it balanced and light';
  if (hour >= 20 && hour < 22) return '🌙 Evening — avoid heavy meals before bed';
  return '🌃 Late night — try herbal tea or light yogurt';
}

/**
 * Returns time-based food suggestion IDs for the current hour.
 */
export function getTimeSuggestionIds(hour: number): string[] {
  if (hour >= 6 && hour < 10) return ['9', '10', '16', '7', '1'];
  if (hour >= 12 && hour < 14) return ['3', '4', '11', '14', '28'];
  if (hour >= 18 && hour < 21) return ['6', '5', '30', '24', '13'];
  return ['21', '12', '23', '7'];
}

/**
 * Filters meals to only those logged on a specific date.
 */
export function filterMealsByDate(meals: readonly LoggedMeal[], date: Date): LoggedMeal[] {
  const dateStr = date.toDateString();
  return meals.filter((m) => new Date(m.timestamp).toDateString() === dateStr);
}

/**
 * Generates weekly calorie and score data for charts.
 */
export function generateWeekData(meals: readonly LoggedMeal[]): WeekDataPoint[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: WeekDataPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86_400_000);
    const dayMeals = filterMealsByDate(meals, date);
    const totalCals = dayMeals.reduce((sum, m) => sum + m.food.calories, 0);
    const avgScore = dayMeals.length
      ? dayMeals.reduce((sum, m) => sum + m.food.healthScore, 0) / dayMeals.length
      : 0;

    result.push({
      day: dayNames[date.getDay()],
      calories: totalCals,
      score: Math.round(avgScore),
    });
  }

  return result;
}

/**
 * Calculates the average health score across all meals.
 */
export function averageHealthScore(meals: readonly LoggedMeal[]): number {
  if (meals.length === 0) return 0;
  return Math.round(
    meals.reduce((sum, m) => sum + m.food.healthScore, 0) / meals.length
  );
}

/**
 * Counts meals by food category.
 * @returns Sorted entries [category, count] descending by count
 */
export function countByCategory(meals: readonly LoggedMeal[]): [string, number][] {
  const counts: Record<string, number> = {};
  for (const meal of meals) {
    const cat = meal.food.category;
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

/**
 * Calculates streak continuation logic.
 * @returns New streak count
 */
export function calculateStreak(
  currentStreak: number,
  lastLogDate: string | null,
  todayStr: string
): number {
  if (lastLogDate === todayStr) return currentStreak;
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();
  return lastLogDate === yesterday ? currentStreak + 1 : 1;
}
