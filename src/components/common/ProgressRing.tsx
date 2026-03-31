import { memo } from 'react';

interface Props {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

/**
 * Animated SVG circular progress indicator.
 * Uses semantic visuals with accessible value description.
 */
export const ProgressRing = memo(function ProgressRing({
  value,
  max,
  size = 170,
  stroke = 10,
  color = '#FF4D8D',
  label,
  sublabel,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;

  return (
    <figure
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ? `${label}: ${value} of ${max}` : `${value} of ${max}`}
      style={{ position: 'relative', width: size, height: size }}
    >
      <svg className="progress-ring" width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <figcaption style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.19, fontWeight: 800, color: 'var(--text-primary)' }}>
          {value}
        </span>
        {sublabel && <span style={{ fontSize: size * 0.07, color: 'var(--text-muted)', fontWeight: 500 }}>{sublabel}</span>}
        {label && <span style={{ fontSize: size * 0.075, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>{label}</span>}
      </figcaption>
    </figure>
  );
});
