import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { averageHealthScore, countByCategory } from '../utils/nutrition';
import { CATEGORY_COLORS } from '../utils/constants';
import { GlassCard } from '../components/common';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const { getWeekData, getTodayTotals, meals } = useStore();
  const week = useMemo(() => getWeekData(), [getWeekData]);
  const totals = useMemo(() => getTodayTotals(), [getTodayTotals]);
  const avg = useMemo(() => averageHealthScore(meals), [meals]);
  const categories = useMemo(() => countByCategory(meals), [meals]);
  const total = meals.length;

  const insights = useMemo(() => [
    total > 5 && avg >= 70 ? '🟢 Your eating habits are on track — nice work.' : null,
    total > 5 && avg < 50 ? '🟡 Adding more fruits and vegetables could raise your score.' : null,
    categories.some(([c, n]) => c === 'fast-food' && n > 3) ? '🔴 Consider swapping fast food for grilled or baked options.' : null,
    categories.some(([c, n]) => c === 'vegetable' && n > 3) ? '✓ Great vegetable intake this week.' : null,
    totals.sugar > 40 ? '⚠️ Today\'s sugar is elevated — whole fruits are a good swap.' : null,
    '💡 Including protein with each meal supports sustained energy.',
    '💡 Drinking water before meals can help with portion awareness.',
  ].filter(Boolean), [total, avg, categories, totals.sugar]);

  return (
    <div className="page-container" style={{ paddingTop: 82, paddingBottom: 40, position: 'relative', zIndex: 1 }}>
      <h1 className="section-title animate-fade-in-up">Insights</h1>
      <p className="section-subtitle animate-fade-in-up stagger-1">Analysis of your nutrition habits</p>

      {/* Summary cards */}
      <section aria-label="Summary statistics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { e: '📊', l: 'Health Score', v: `${avg}`, c: avg >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' },
          { e: '🍽️', l: 'Total Meals', v: `${total}`, c: 'var(--accent-blue)' },
          { e: '🏆', l: 'Top Category', v: categories[0]?.[0] ?? '—', c: 'var(--pink-500)' },
        ].map((s, i) => (
          <GlassCard key={i} className="animate-fade-in-up" style={{ padding: 22, textAlign: 'center', animationDelay: `${i * 0.08}s` }}>
            <div aria-hidden="true" style={{ fontSize: '1.4rem', marginBottom: 8 }}>{s.e}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: s.c, textTransform: 'capitalize' }}>{s.v}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>{s.l}</div>
          </GlassCard>
        ))}
      </section>

      {/* Calorie trend */}
      <GlassCard className="animate-fade-in-up stagger-2" style={{ padding: 24, marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 14, fontSize: '1rem', fontWeight: 700 }}>Calorie Trend</h2>
        {week.some(d => d.calories > 0) ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={week} aria-label="Weekly calorie trend chart">
              <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5B8DEF" stopOpacity={0.15} /><stop offset="95%" stopColor="#5B8DEF" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="day" tick={{ fill: '#9A9AB0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#FFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
              <Area type="monotone" dataKey="calories" stroke="#5B8DEF" fill="url(#g2)" strokeWidth={2} dot={{ fill: '#5B8DEF', r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <p className="empty-state-text">Not enough data yet</p>
            <p className="empty-state-hint">Log a few meals to see your trend</p>
          </div>
        )}
      </GlassCard>

      {/* Category breakdown */}
      <GlassCard className="animate-fade-in-up stagger-3" style={{ padding: 24, marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 14, fontSize: '1rem', fontWeight: 700 }}>Categories</h2>
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍕</div>
            <p className="empty-state-text">No category data</p>
            <p className="empty-state-hint">Log meals to see your food breakdown</p>
          </div>
        ) : categories.map(([cat, count]) => {
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.82rem' }}>
                <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{cat}</span>
                <span style={{ color: 'var(--text-muted)' }}>{count} ({pct.toFixed(0)}%)</span>
              </div>
              <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${cat}: ${pct.toFixed(0)}%`}
                style={{ height: 6, background: 'rgba(0,0,0,0.03)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: CATEGORY_COLORS[cat] ?? '#9A9AB0', borderRadius: 99, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          );
        })}
      </GlassCard>

      {/* Tips */}
      <GlassCard className="animate-fade-in-up stagger-4" style={{ padding: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 14, fontSize: '1rem', fontWeight: 700 }}>Tips</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {insights.map((tip, i) => (
            <li key={i} style={{ padding: '11px 16px', background: 'rgba(0,0,0,0.015)', borderRadius: 12, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {tip}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
