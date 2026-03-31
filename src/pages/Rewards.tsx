import { useStore } from '../store/useStore';
import { XP_PER_LEVEL } from '../utils/constants';
import { GlassCard, ProgressRing } from '../components/common';

export default function Rewards() {
  const { streak, xp, level, achievements } = useStore();
  const xpInLevel = xp % XP_PER_LEVEL;

  return (
    <div className="page-container" style={{ paddingTop: 82, paddingBottom: 40, position: 'relative', zIndex: 1 }}>
      <h1 className="section-title animate-fade-in-up">Rewards</h1>
      <p className="section-subtitle animate-fade-in-up stagger-1">Streaks, levels & achievements</p>

      {/* Streak + Level ring */}
      <section aria-label="Streak and level" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 28 }}>
        <GlassCard className="animate-fade-in-up stagger-1" style={{ padding: 28, textAlign: 'center' }}>
          <div aria-hidden="true" style={{ fontSize: '2.8rem', marginBottom: 6, animation: 'flame-flicker 1.2s ease-in-out infinite' }}>🔥</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{streak}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Day Streak</div>
        </GlassCard>
        <GlassCard className="animate-fade-in-up stagger-2" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ProgressRing value={xpInLevel} max={XP_PER_LEVEL} size={130} color="#A855F7" label={`Level ${level}`} sublabel={`${xpInLevel}/${XP_PER_LEVEL} XP`} />
        </GlassCard>
      </section>

      {/* XP progress bar */}
      <GlassCard className="animate-fade-in-up stagger-3" style={{ padding: 22, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>Level {level}</span>
          <span style={{ color: 'var(--text-muted)' }}>{xp} total XP</span>
        </div>
        <div role="progressbar" aria-valuenow={xpInLevel} aria-valuemin={0} aria-valuemax={XP_PER_LEVEL} aria-label={`Level progress: ${xpInLevel} of ${XP_PER_LEVEL} XP`}
          style={{ height: 10, background: 'rgba(168,85,247,0.06)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${xpInLevel}%`, background: 'linear-gradient(90deg, #A855F7, #FF4D8D)', borderRadius: 99, transition: 'width 0.8s ease' }} />
        </div>
      </GlassCard>

      {/* Achievements grid */}
      <section aria-label="Achievements">
        <h2 className="animate-fade-in-up stagger-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>Achievements</h2>
        {achievements.every(a => !a.unlocked) ? (
          <GlassCard style={{ padding: 24 }}>
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <p className="empty-state-text">No achievements yet</p>
              <p className="empty-state-hint">Log meals and stay consistent to unlock achievements</p>
            </div>
          </GlassCard>
        ) : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {achievements.map((a, i) => (
            <GlassCard key={a.id} className="animate-fade-in-up" ariaLabel={`${a.title}: ${a.description}${a.unlocked ? ' — Unlocked' : ' — Locked'}`}
              style={{ padding: 20, textAlign: 'center', opacity: a.unlocked ? 1 : 0.45, animationDelay: `${i * 0.05}s`, position: 'relative', overflow: 'hidden' }}>
              {a.unlocked && <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-pink)' }} />}
              <div aria-hidden="true" style={{ fontSize: '1.8rem', marginBottom: 8 }}>{a.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', fontFamily: 'var(--font-display)', marginBottom: 4 }}>{a.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{a.description}</div>
              {a.unlocked && <span className="badge badge-healthy" style={{ marginTop: 10, display: 'inline-flex' }}>✓ Unlocked</span>}
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
