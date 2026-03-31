import { useState, useCallback, useId, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { foodDatabase, getTimeBasedSuggestions } from '../data/foods';
import { searchUSDAFoods, isUSDAConfigured } from '../services';
import { sanitizeText } from '../utils/sanitize';
import { useDebounce } from '../hooks/useDebounce';
import { FoodCard } from '../components/food';
import { GlassCard } from '../components/common';
import type { FoodItem, MealType } from '../types';

const MEAL_TYPES: { type: MealType; emoji: string }[] = [
  { type: 'breakfast', emoji: '☀️' },
  { type: 'lunch', emoji: '🌞' },
  { type: 'dinner', emoji: '🌙' },
  { type: 'snack', emoji: '🍿' },
];

export default function MealLogger() {
  const { logMeal } = useStore();
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [logged, setLogged] = useState<FoodItem | null>(null);
  const [usdaResults, setUsdaResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchId = useId();
  const resultCountId = useId();

  const debouncedSearch = useDebounce(search, 300);
  const sanitized = useMemo(() => sanitizeText(debouncedSearch), [debouncedSearch]);
  const suggestions = useMemo(() => getTimeBasedSuggestions(), []);

  // Local database filter
  const localResults = useMemo(
    () => sanitized
      ? foodDatabase.filter(f => f.name.toLowerCase().includes(sanitized.toLowerCase()))
      : [],
    [sanitized]
  );

  // USDA API search (triggered on debounced input change)
  useMemo(() => {
    if (!sanitized || !isUSDAConfigured) {
      setUsdaResults([]);
      return;
    }
    setIsSearching(true);
    searchUSDAFoods(sanitized, 8).then(results => {
      setUsdaResults(results ?? []);
      setIsSearching(false);
    });
  }, [sanitized]);

  // Merge local + USDA results, local first, deduplicate by name
  const allResults = useMemo(() => {
    const seen = new Set<string>();
    const merged: FoodItem[] = [];
    for (const f of [...localResults, ...usdaResults]) {
      const key = f.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(f);
      }
    }
    return merged;
  }, [localResults, usdaResults]);

  const handleLog = useCallback((food: FoodItem) => {
    logMeal(food, mealType);
    setLogged(food);
    setSearch('');
    setTimeout(() => setLogged(null), 2200);
  }, [logMeal, mealType]);

  return (
    <div className="page-container" style={{ paddingTop: 82, paddingBottom: 40, position: 'relative', zIndex: 1 }}>
      <h1 className="section-title animate-fade-in-up">Log a Meal</h1>
      <p className="section-subtitle animate-fade-in-up stagger-1">Search or pick from smart suggestions</p>

      {/* Success toast */}
      {logged && (
        <GlassCard className="animate-fade-in-up" role="status" aria-live="polite" style={{ padding: 20, marginBottom: 20, textAlign: 'center', borderLeft: '3px solid var(--accent-green)', background: 'var(--accent-green-bg)' }}>
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>✓ Logged {logged.emoji} {logged.name}</span>
          <span style={{ color: 'var(--accent-green)', marginLeft: 8, fontWeight: 600 }}>+{logged.healthScore >= 70 ? 15 : 8} XP</span>
        </GlassCard>
      )}

      {/* Meal type selector */}
      <fieldset className="animate-fade-in-up stagger-1" style={{ border: 'none', display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', padding: 0 }}>
        <legend className="sr-only">Select meal type</legend>
        {MEAL_TYPES.map(({ type, emoji }) => (
          <button key={type} onClick={() => setMealType(type)}
            aria-pressed={mealType === type}
            style={{
              padding: '9px 22px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600, fontSize: '0.83rem', textTransform: 'capitalize', transition: 'all 0.25s', fontFamily: 'var(--font-display)',
              border: `1.5px solid ${mealType === type ? 'var(--pink-400)' : 'var(--border-light)'}`,
              background: mealType === type ? 'rgba(255,77,141,0.06)' : 'transparent',
              color: mealType === type ? 'var(--pink-500)' : 'var(--text-secondary)',
            }}>
            <span aria-hidden="true">{emoji}</span> {type}
          </button>
        ))}
      </fieldset>

      {/* Search input */}
      <GlassCard className="animate-fade-in-up stagger-2" style={{ padding: 4, marginBottom: 22, display: 'flex', alignItems: 'center' }}>
        <label htmlFor={searchId} className="sr-only">Search foods</label>
        <span style={{ padding: '0 14px', fontSize: '1.1rem', opacity: 0.5 }} aria-hidden="true">🔍</span>
        <input
          id={searchId}
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={isUSDAConfigured ? 'Search USDA database...' : 'Search foods (banana, chicken, salad...)'}
          autoComplete="off"
          maxLength={100}
          aria-describedby={resultCountId}
          style={{ flex: 1, padding: '13px 8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', fontFamily: 'var(--font-body)' }}
        />
        {isSearching && <div className="spinner" style={{ marginRight: 12 }} aria-label="Searching..." role="status" />}
      </GlassCard>

      {/* Results */}
      {sanitized ? (
        <section aria-label="Search results">
          <p id={resultCountId} className="sr-only" role="status" aria-live="polite">
            {allResults.length} result{allResults.length !== 1 ? 's' : ''} found
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12, marginBottom: 28 }}>
            {allResults.length ? allResults.map(f => <FoodCard key={f.id} food={f} onLog={handleLog} />) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p className="empty-state-text">No results for "{sanitized}"</p>
                <p className="empty-state-hint">Try a different search term</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          <section aria-label="Suggested foods">
            <h2 className="animate-fade-in-up stagger-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>Suggested for You</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12, marginBottom: 28 }}>
              {suggestions.map(f => <FoodCard key={f.id} food={f} onLog={handleLog} />)}
            </div>
          </section>
          <section aria-label="All foods">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>All Foods</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12 }}>
              {foodDatabase.map(f => <FoodCard key={f.id} food={f} onLog={handleLog} />)}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
