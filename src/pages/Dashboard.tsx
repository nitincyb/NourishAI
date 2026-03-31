import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { getContextMessage } from '../utils/nutrition';
import { MAX_WATER_GLASSES } from '../utils/constants';
import { GlassCard, ProgressRing, MacroBar } from '../components/common';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const store = useStore();
  const totals = store.getTodayTotals();
  const meals = store.getTodayMeals();
  const alerts = store.getAlerts();
  const week = store.getWeekData();
  const { user, waterGlasses, addWater, streak, xp, level, removeMeal } = store;
  const context = useMemo(() => getContextMessage(new Date().getHours()), []);

  const calColor = useMemo(() => {
    if (totals.calories > user.dailyGoals.calories) return '#FF5C72';
    if (totals.calories > user.dailyGoals.calories * 0.8) return '#FFB347';
    return '#FF4D8D';
  }, [totals.calories, user.dailyGoals.calories]);

  const quickStats = useMemo(() => [
    { e: '🔥', l: 'Streak', v: `${streak}d`, c: 'var(--accent-amber)' },
    { e: '⚡', l: 'Level', v: `${level}`, c: 'var(--accent-purple)' },
    { e: '✨', l: 'XP', v: `${xp}`, c: 'var(--accent-blue)' },
    { e: '🍽️', l: 'Meals', v: `${meals.length}`, c: 'var(--pink-500)' },
  ], [streak, level, xp, meals.length]);

  return (
    <div className="page-container" style={{ paddingTop: 82, paddingBottom: 40, position: 'relative', zIndex: 1 }}>
      {/* Context banner */}
      <GlassCard className="animate-fade-in-up" style={{ padding: '14px 22px', marginBottom: 20, borderLeft: '3px solid var(--pink-400)', background: 'linear-gradient(90deg, rgba(255,77,141,0.03), transparent)' }}>
        <p>{context}</p>
      </GlassCard>

      {/* Smart alerts */}
      {alerts.length > 0 && (
        <section aria-label="Health alerts" aria-live="polite">
          {alerts.map((a, i) => (
            <GlassCard key={i} className="animate-slide-in" role="alert" style={{ padding: '11px 18px', marginBottom: 10, fontSize: '0.88rem', borderLeft: `3px solid ${a.includes('🔴') || a.includes('⚠️') ? 'var(--accent-red)' : a.includes('🎉') ? 'var(--accent-green)' : 'var(--accent-amber)'}`, animationDelay: `${i * 0.08}s` }}>
              {a}
            </GlassCard>
          ))}
        </section>
      )}

      {/* Quick stats */}
      <section aria-label="Quick statistics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 22 }}>
        {quickStats.map((s, i) => (
          <GlassCard key={i} className="animate-fade-in-up" style={{ padding: '18px 14px', textAlign: 'center', animationDelay: `${i * 0.08}s` }}>
            <div aria-hidden="true" style={{ fontSize: '1.3rem', marginBottom: 4 }}>{s.e}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 500 }}>{s.l}</div>
          </GlassCard>
        ))}
      </section>

      {/* Calorie ring + Macros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 22 }}>
        <GlassCard className="animate-fade-in-up stagger-1" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 18, width: '100%', fontSize: '1rem', fontWeight: 700 }}>Daily Calories</h2>
          <ProgressRing value={Math.round(totals.calories)} max={user.dailyGoals.calories} color={calColor} sublabel={`of ${user.dailyGoals.calories}`} label="calories" />
        </GlassCard>
        <GlassCard className="animate-fade-in-up stagger-2" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, fontSize: '1rem', fontWeight: 700 }}>Macronutrients</h2>
          <MacroBar label="Protein" value={totals.protein} max={user.dailyGoals.protein} color="var(--accent-blue)" />
          <MacroBar label="Carbs" value={totals.carbs} max={user.dailyGoals.carbs} color="var(--accent-amber)" />
          <MacroBar label="Fat" value={totals.fat} max={user.dailyGoals.fat} color="var(--pink-400)" />
          <MacroBar label="Fiber" value={totals.fiber} max={30} color="var(--accent-green)" />
        </GlassCard>
      </div>

      {/* Hydration + Week chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 22 }}>
        <GlassCard className="animate-fade-in-up stagger-3" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 14, fontSize: '1rem', fontWeight: 700 }}>💧 Hydration</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }} role="group" aria-label={`Water intake: ${waterGlasses} of ${MAX_WATER_GLASSES} glasses`}>
            {Array.from({ length: MAX_WATER_GLASSES }).map((_, i) => (
              <button key={i} onClick={() => i === waterGlasses && addWater()} disabled={i !== waterGlasses && i >= waterGlasses}
                aria-label={i < waterGlasses ? `Glass ${i + 1}: filled` : `Add glass ${i + 1}`}
                style={{
                  width: 38, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: 'none',
                  cursor: i === waterGlasses ? 'pointer' : 'default',
                  background: i < waterGlasses ? 'rgba(91,141,239,0.08)' : 'rgba(0,0,0,0.02)',
                  outline: `1.5px solid ${i < waterGlasses ? 'rgba(91,141,239,0.2)' : 'var(--border-light)'}`,
                  transition: 'all 0.3s', transform: i === waterGlasses ? 'scale(1.05)' : 'scale(1)',
                }}>{i < waterGlasses ? '💧' : '○'}</button>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500 }}>{waterGlasses}/{MAX_WATER_GLASSES} — {waterGlasses >= MAX_WATER_GLASSES ? 'Fully hydrated!' : 'Tap next to add'}</p>
        </GlassCard>
        <GlassCard className="animate-fade-in-up stagger-4" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 14, fontSize: '1rem', fontWeight: 700 }}>This Week</h2>
          {week.some(d => d.calories > 0) ? (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={week}>
                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF4D8D" stopOpacity={0.15} /><stop offset="95%" stopColor="#FF4D8D" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="day" tick={{ fill: '#9A9AB0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#FFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
                <Area type="monotone" dataKey="calories" stroke="#FF4D8D" fill="url(#pg)" strokeWidth={2} dot={{ fill: '#FF4D8D', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <p className="empty-state-text">No data yet</p>
              <p className="empty-state-hint">Log meals to see your weekly trend</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Today's meals */}
      <GlassCard className="animate-fade-in-up stagger-5" style={{ padding: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 14, fontSize: '1rem', fontWeight: 700 }}>Today's Meals</h2>
        {meals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <p className="empty-state-text">No meals logged yet</p>
            <p className="empty-state-hint">Head to Log Meal to start tracking</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {meals.map(m => (
              <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(0,0,0,0.01)', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.025)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.01)')}>
                <div aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--pink-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{m.food.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{m.food.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{m.mealType} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className={`badge ${m.badge === 'healthy' ? 'badge-healthy' : m.badge === 'moderate' ? 'badge-moderate' : 'badge-avoid'}`}>{m.food.healthScore}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>{m.food.calories}<span className="sr-only"> calories</span></span>
                <button onClick={() => removeMeal(m.id)} aria-label={`Remove ${m.food.name}`}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-red)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
