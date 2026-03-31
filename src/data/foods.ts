/**
 * Food nutrition database with 30 items covering all categories.
 * Data sourced from USDA FoodData Central reference values.
 */

import type { FoodItem } from '../types';
import { getTimeSuggestionIds } from '../utils/nutrition';

export const foodDatabase: readonly FoodItem[] = [
  { id: '1', name: 'Banana', emoji: '🍌', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, healthScore: 78, category: 'fruit', servingSize: '1 medium' },
  { id: '2', name: 'Apple', emoji: '🍎', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, healthScore: 82, category: 'fruit', servingSize: '1 medium' },
  { id: '3', name: 'Grilled Chicken Breast', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, healthScore: 90, category: 'protein', servingSize: '100g' },
  { id: '4', name: 'Brown Rice', emoji: '🍚', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, healthScore: 75, category: 'grain', servingSize: '1 cup cooked' },
  { id: '5', name: 'Broccoli', emoji: '🥦', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.6, healthScore: 95, category: 'vegetable', servingSize: '1 cup' },
  { id: '6', name: 'Salmon Fillet', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, healthScore: 92, category: 'protein', servingSize: '100g' },
  { id: '7', name: 'Greek Yogurt', emoji: '🥛', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 6, healthScore: 85, category: 'dairy', servingSize: '170g' },
  { id: '8', name: 'Avocado', emoji: '🥑', calories: 234, protein: 2.9, carbs: 12, fat: 21, fiber: 10, sugar: 1, healthScore: 88, category: 'fruit', servingSize: '1 whole' },
  { id: '9', name: 'Oatmeal', emoji: '🥣', calories: 154, protein: 5, carbs: 27, fat: 2.6, fiber: 4, sugar: 1, healthScore: 83, category: 'grain', servingSize: '1 cup cooked' },
  { id: '10', name: 'Eggs (2)', emoji: '🥚', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0, sugar: 0.4, healthScore: 84, category: 'protein', servingSize: '2 large' },
  { id: '11', name: 'Spinach Salad', emoji: '🥗', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, healthScore: 96, category: 'vegetable', servingSize: '100g' },
  { id: '12', name: 'Almonds', emoji: '🥜', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, healthScore: 80, category: 'snack', servingSize: '28g' },
  { id: '13', name: 'Sweet Potato', emoji: '🍠', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, sugar: 7.4, healthScore: 86, category: 'vegetable', servingSize: '1 medium' },
  { id: '14', name: 'Quinoa', emoji: '🌾', calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, sugar: 1.6, healthScore: 87, category: 'grain', servingSize: '1 cup cooked' },
  { id: '15', name: 'Blueberries', emoji: '🫐', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15, healthScore: 90, category: 'fruit', servingSize: '1 cup' },
  { id: '16', name: 'Whole Wheat Toast', emoji: '🍞', calories: 128, protein: 5.4, carbs: 23, fat: 2, fiber: 3.4, sugar: 3, healthScore: 70, category: 'grain', servingSize: '2 slices' },
  { id: '17', name: 'Cheeseburger', emoji: '🍔', calories: 540, protein: 25, carbs: 40, fat: 29, fiber: 2, sugar: 8, healthScore: 25, category: 'fast-food', servingSize: '1 burger' },
  { id: '18', name: 'French Fries', emoji: '🍟', calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4, sugar: 0.3, healthScore: 18, category: 'fast-food', servingSize: 'medium' },
  { id: '19', name: 'Pizza Slice', emoji: '🍕', calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2.5, sugar: 3.6, healthScore: 30, category: 'fast-food', servingSize: '1 slice' },
  { id: '20', name: 'Soda', emoji: '🥤', calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39, healthScore: 5, category: 'beverage', servingSize: '355ml' },
  { id: '21', name: 'Green Tea', emoji: '🍵', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, healthScore: 95, category: 'beverage', servingSize: '1 cup' },
  { id: '22', name: 'Dark Chocolate', emoji: '🍫', calories: 170, protein: 2.2, carbs: 13, fat: 12, fiber: 3.1, sugar: 7, healthScore: 55, category: 'snack', servingSize: '28g' },
  { id: '23', name: 'Cottage Cheese', emoji: '🧀', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, sugar: 2.7, healthScore: 78, category: 'dairy', servingSize: '100g' },
  { id: '24', name: 'Lentil Soup', emoji: '🍲', calories: 180, protein: 12, carbs: 30, fat: 2, fiber: 8, sugar: 3, healthScore: 88, category: 'protein', servingSize: '1 bowl' },
  { id: '25', name: 'Orange', emoji: '🍊', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, healthScore: 85, category: 'fruit', servingSize: '1 medium' },
  { id: '26', name: 'Protein Shake', emoji: '🥤', calories: 160, protein: 25, carbs: 8, fat: 3, fiber: 1, sugar: 4, healthScore: 75, category: 'beverage', servingSize: '1 scoop + water' },
  { id: '27', name: 'Fried Chicken', emoji: '🍗', calories: 320, protein: 22, carbs: 12, fat: 20, fiber: 0.5, sugar: 0.3, healthScore: 28, category: 'fast-food', servingSize: '2 pieces' },
  { id: '28', name: 'Caesar Salad', emoji: '🥗', calories: 180, protein: 8, carbs: 10, fat: 12, fiber: 2, sugar: 2, healthScore: 65, category: 'vegetable', servingSize: '1 bowl' },
  { id: '29', name: 'Mango', emoji: '🥭', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23, healthScore: 76, category: 'fruit', servingSize: '1 cup' },
  { id: '30', name: 'Tofu Stir Fry', emoji: '🍳', calories: 190, protein: 14, carbs: 15, fat: 9, fiber: 3, sugar: 4, healthScore: 82, category: 'protein', servingSize: '1 serving' },
] as const;

/**
 * Returns time-appropriate food suggestions from the database.
 */
export function getTimeBasedSuggestions(): FoodItem[] {
  const hour = new Date().getHours();
  const ids = getTimeSuggestionIds(hour);
  return foodDatabase.filter(f => ids.includes(f.id));
}
