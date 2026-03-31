import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LoggedMeal, UserProfile, Achievement, MealType } from '../types';
import type { FoodItem } from '../types';
import { getHealthBadge, calculateXP, calculateLevel, calculateStreak, aggregateNutrients, generateAlerts, generateWeekData } from '../utils/nutrition';
import { GOAL_PRESETS, DEFAULT_ACHIEVEMENTS, STORE_KEY, XP_PER_LEVEL } from '../utils/constants';

interface AppState {
  user: UserProfile;
  meals: LoggedMeal[];
  streak: number;
  lastLogDate: string | null;
  xp: number;
  level: number;
  waterGlasses: number;
  achievements: Achievement[];

  logMeal: (food: FoodItem, mealType: MealType) => void;
  removeMeal: (id: string) => void;
  addWater: () => void;
  setGoal: (goal: UserProfile['goal']) => void;
  getTodayMeals: () => LoggedMeal[];
  getTodayTotals: () => ReturnType<typeof aggregateNutrients>;
  getWeekData: () => ReturnType<typeof generateWeekData>;
  getAlerts: () => string[];
}

/**
 * Global application state with safe localStorage persistence.
 * Business logic is delegated to pure utility functions for testability.
 */
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: { name: 'User', goal: 'balanced', dailyGoals: GOAL_PRESETS['balanced'] },
      meals: [],
      streak: 0,
      lastLogDate: null,
      xp: 0,
      level: 1,
      waterGlasses: 0,
      achievements: [...DEFAULT_ACHIEVEMENTS.map(a => ({ ...a }))],

      logMeal: (food, mealType) => {
        const meal: LoggedMeal = {
          id: `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
          food,
          timestamp: Date.now(),
          mealType,
          badge: getHealthBadge(food.healthScore),
        };

        const today = new Date().toDateString();
        const { lastLogDate, streak, xp, level, achievements } = get();

        const newStreak = calculateStreak(streak, lastLogDate, today);
        const earnedXP = calculateXP(food.healthScore);
        const newXP = xp + earnedXP;
        const newLevel = calculateLevel(newXP);

        // Check achievement unlocks
        const updated = achievements.map(a => ({ ...a }));
        const unlock = (id: string) => {
          const ach = updated.find(a => a.id === id);
          if (ach && !ach.unlocked) {
            ach.unlocked = true;
            ach.unlockedAt = Date.now();
          }
        };

        unlock('first-log');
        if (newStreak >= 3) unlock('streak-3');
        if (newStreak >= 7) unlock('streak-7');
        if (newLevel >= 5) unlock('level-5');

        set(state => ({
          meals: [...state.meals, meal],
          streak: newStreak,
          lastLogDate: today,
          xp: newXP,
          level: newLevel,
          achievements: updated,
        }));
      },

      removeMeal: (id) =>
        set(state => ({ meals: state.meals.filter(m => m.id !== id) })),

      addWater: () => {
        const { waterGlasses, achievements } = get();
        const updated = achievements.map(a => ({ ...a }));
        if (waterGlasses + 1 >= 8) {
          const ach = updated.find(a => a.id === 'hydrated');
          if (ach && !ach.unlocked) { ach.unlocked = true; ach.unlockedAt = Date.now(); }
        }
        set({ waterGlasses: waterGlasses + 1, achievements: updated });
      },

      setGoal: (goal) =>
        set({ user: { ...get().user, goal, dailyGoals: GOAL_PRESETS[goal] } }),

      getTodayMeals: () => {
        const today = new Date().toDateString();
        return get().meals.filter(m => new Date(m.timestamp).toDateString() === today);
      },

      getTodayTotals: () => aggregateNutrients(get().getTodayMeals()),

      getWeekData: () => generateWeekData(get().meals),

      getAlerts: () => generateAlerts(
        get().getTodayTotals(),
        get().user.dailyGoals,
        new Date().getHours()
      ),
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
