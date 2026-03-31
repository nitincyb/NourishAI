/**
 * USDA FoodData Central API service.
 * Fetches real nutritional data; falls back to local database on failure.
 *
 * API docs: https://fdc.nal.usda.gov/api-guide
 */

import type { FoodItem, FoodCategory } from '../types';

const API_BASE = 'https://api.nal.usda.gov/fdc/v1';
const API_KEY = import.meta.env.VITE_USDA_API_KEY ?? '';

/** Whether the USDA API key is configured */
export const isUSDAConfigured = API_KEY.length > 0;

/** Raw USDA nutrient IDs we care about */
const NUTRIENT_IDS = {
  ENERGY: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
  FIBER: 1079,
  SUGAR: 2000,
} as const;

interface USDAFood {
  fdcId: number;
  description: string;
  foodNutrients: { nutrientId: number; value: number }[];
  foodCategory?: string;
}

interface USDASearchResponse {
  foods: USDAFood[];
  totalHits: number;
}

/**
 * Extracts a nutrient value from a USDA food item by nutrient ID.
 */
function getNutrient(food: USDAFood, nutrientId: number): number {
  return food.foodNutrients.find(n => n.nutrientId === nutrientId)?.value ?? 0;
}

/**
 * Maps a USDA category string to our internal FoodCategory type.
 */
function mapCategory(usdaCategory?: string): FoodCategory {
  if (!usdaCategory) return 'snack';
  const lower = usdaCategory.toLowerCase();
  if (lower.includes('fruit')) return 'fruit';
  if (lower.includes('vegetable') || lower.includes('legume')) return 'vegetable';
  if (lower.includes('grain') || lower.includes('cereal') || lower.includes('bread')) return 'grain';
  if (lower.includes('meat') || lower.includes('poultry') || lower.includes('fish') || lower.includes('egg')) return 'protein';
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('cheese')) return 'dairy';
  if (lower.includes('beverage')) return 'beverage';
  if (lower.includes('fast') || lower.includes('restaurant')) return 'fast-food';
  return 'snack';
}

/**
 * Calculates a health score (0–100) based on macronutrient profile.
 * Higher protein/fiber and lower sugar/fat = higher score.
 */
function calculateHealthScore(food: USDAFood): number {
  const protein = getNutrient(food, NUTRIENT_IDS.PROTEIN);
  const fiber = getNutrient(food, NUTRIENT_IDS.FIBER);
  const sugar = getNutrient(food, NUTRIENT_IDS.SUGAR);
  const fat = getNutrient(food, NUTRIENT_IDS.FAT);
  const calories = getNutrient(food, NUTRIENT_IDS.ENERGY);

  let score = 50;
  score += Math.min(protein * 1.5, 20);
  score += Math.min(fiber * 2, 15);
  score -= Math.min(sugar * 0.5, 20);
  score -= Math.min(fat * 0.3, 15);
  if (calories > 400) score -= 10;
  if (calories < 150 && protein > 5) score += 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Food emoji lookup by category */
const CATEGORY_EMOJI: Record<FoodCategory, string> = {
  fruit: '🍎',
  vegetable: '🥦',
  grain: '🌾',
  protein: '🍗',
  dairy: '🥛',
  snack: '🍿',
  beverage: '🥤',
  'fast-food': '🍔',
};

/**
 * Transforms a USDA food item into our internal FoodItem shape.
 */
function transformUSDAFood(food: USDAFood): FoodItem {
  const category = mapCategory(food.foodCategory);
  return {
    id: `usda-${food.fdcId}`,
    name: food.description.split(',')[0].trim(),
    emoji: CATEGORY_EMOJI[category],
    calories: Math.round(getNutrient(food, NUTRIENT_IDS.ENERGY)),
    protein: Math.round(getNutrient(food, NUTRIENT_IDS.PROTEIN) * 10) / 10,
    carbs: Math.round(getNutrient(food, NUTRIENT_IDS.CARBS) * 10) / 10,
    fat: Math.round(getNutrient(food, NUTRIENT_IDS.FAT) * 10) / 10,
    fiber: Math.round(getNutrient(food, NUTRIENT_IDS.FIBER) * 10) / 10,
    sugar: Math.round(getNutrient(food, NUTRIENT_IDS.SUGAR) * 10) / 10,
    healthScore: calculateHealthScore(food),
    category,
    servingSize: '100g',
  };
}

/**
 * Searches USDA FoodData Central for foods matching a query.
 * Returns transformed FoodItem array or null on error.
 */
export async function searchUSDAFoods(query: string, pageSize = 10): Promise<FoodItem[] | null> {
  if (!isUSDAConfigured || !query.trim()) return null;

  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      query: query.trim(),
      pageSize: String(pageSize),
      dataType: 'Foundation,SR Legacy',
    });

    const response = await fetch(`${API_BASE}/foods/search?${params}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn(`[USDA API] ${response.status}: ${response.statusText}`);
      return null;
    }

    const data: USDASearchResponse = await response.json();
    return data.foods.map(transformUSDAFood);
  } catch (error) {
    console.warn('[USDA API] Search failed:', error);
    return null;
  }
}
