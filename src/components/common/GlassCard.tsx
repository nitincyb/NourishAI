import { memo } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}

/**
 * Reusable glassmorphic card component with accessibility support.
 * Memoized to prevent unnecessary re-renders in lists.
 */
export const GlassCard = memo(function GlassCard({
  children,
  className = '',
  style,
  onClick,
  role,
  ariaLabel,
}: Props) {
  return (
    <div
      className={`glass-card ${className}`}
      style={style}
      onClick={onClick}
      role={role ?? (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {children}
    </div>
  );
});
