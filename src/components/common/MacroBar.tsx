import { memo } from 'react';

interface Props {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

/**
 * Animated horizontal bar showing macro progress.
 * Accessible with ARIA progressbar semantics.
 */
export const MacroBar = memo(function MacroBar({ label, value, max, color, unit = 'g' }: Props) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div style={{ marginBottom: 18 }} role="group" aria-label={`${label} progress`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '0.84rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
          {Math.round(value)}{unit}{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {max}{unit}</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${Math.round(value)} of ${max} ${unit}`}
        style={{ height: 8, background: 'rgba(255,77,141,0.06)', borderRadius: 99, overflow: 'hidden' }}
      >
        <div style={{
          height: '100%', width: `${pct}%`, background: color, borderRadius: 99,
          transition: 'width 1s cubic-bezier(0.25,0.46,0.45,0.94)',
        }} />
      </div>
    </div>
  );
});
