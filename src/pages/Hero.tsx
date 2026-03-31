import { memo } from 'react';

interface Props { onStart: () => void }

const FLOAT_EMOJIS = ['🍎', '🥑', '🥦', '🍌', '🫐', '🥕', '🍊', '🥬', '🍇', '🥣'] as const;
const STATS = [{ n: '30+', l: 'Foods' }, { n: '95%', l: 'Accuracy' }, { n: '4.9★', l: 'Rating' }] as const;

const Hero = memo(function Hero({ onStart }: Props) {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'var(--gradient-hero)' }}
    >
      {/* Decorative floating food */}
      {FLOAT_EMOJIS.map((emoji, i) => (
        <div key={i} className="animate-float" aria-hidden="true" style={{
          position: 'absolute', fontSize: `${1.4 + (i % 4) * 0.4}rem`,
          top: `${10 + i * 8}%`, left: `${5 + (i * 9) % 85}%`,
          animationDelay: `${i * 0.35}s`, animationDuration: `${4 + (i % 3)}s`, opacity: 0.15 + (i % 3) * 0.03,
        }}>{emoji}</div>
      ))}

      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: 640, padding: '0 24px' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', padding: '7px 18px', background: 'rgba(255,77,141,0.06)', color: 'var(--pink-500)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, gap: 6, fontFamily: 'var(--font-display)', border: '1px solid rgba(255,77,141,0.1)' }}>
            Smart Nutrition Tracking
          </span>
        </div>
        <h1 id="hero-heading" className="animate-fade-in-up stagger-1 hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: 18, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Eat Smarter,<br />
          <span style={{ background: 'var(--gradient-pink)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Live Better</span>
        </h1>
        <p className="animate-fade-in-up stagger-2" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.65 }}>
          Track your meals, understand your habits, and get practical nutrition insights — all in one place.
        </p>
        <div className="animate-fade-in-up stagger-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onStart} style={{ fontSize: '1rem', padding: '15px 36px' }}>Get Started Free →</button>
          <button className="btn-ghost" onClick={onStart}>View Demo</button>
        </div>
        <div className="animate-fade-in-up stagger-4" style={{ marginTop: 44, display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 800, background: 'var(--gradient-pink)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Hero;
