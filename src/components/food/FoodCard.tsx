import { memo, useCallback } from 'react';
import type { FoodItem } from '../../types';
import { getHealthBadge } from '../../utils/nutrition';
import { GlassCard } from '../common';

interface Props {
  food: FoodItem;
  onLog: (food: FoodItem) => void;
}

/**
 * Interactive food item card with health score badge.
 * Memoized and keyboard-accessible.
 */
export const FoodCard = memo(function FoodCard({ food, onLog }: Props) {
  const badge = getHealthBadge(food.healthScore);
  const badgeClass = badge === 'healthy' ? 'badge-healthy' : badge === 'moderate' ? 'badge-moderate' : 'badge-avoid';

  const handleLog = useCallback(() => onLog(food), [food, onLog]);

  return (
    <GlassCard
      onClick={handleLog}
      style={{ padding: 16, cursor: 'pointer', position: 'relative' }}
      ariaLabel={`Log ${food.name}, ${food.calories} calories, health score ${food.healthScore}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--pink-50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {food.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', fontFamily: 'var(--font-display)' }}>{food.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.73rem' }}>{food.servingSize}</div>
        </div>
        <span className={`badge ${badgeClass}`} aria-label={`Health score: ${food.healthScore}`}>
          {food.healthScore}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 14, fontSize: '0.73rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        <span aria-label={`${food.calories} calories`}>🔥 {food.calories}</span>
        <span aria-label={`${food.protein}g protein`}>💪 {food.protein}g</span>
        <span aria-label={`${food.carbs}g carbs`}>🌾 {food.carbs}g</span>
        <span aria-label={`${food.fat}g fat`}>🧈 {food.fat}g</span>
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--pink-50)', color: 'var(--pink-500)', fontSize: '0.9rem', fontWeight: 700, opacity: 0.8,
        }}
      >
        +
      </div>
    </GlassCard>
  );
});
