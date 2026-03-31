/**
 * Accessible skip-to-content link for keyboard navigation.
 * Visually hidden until focused, allowing keyboard users to bypass navigation.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        background: 'var(--gradient-pink)',
        color: '#FFF',
        borderRadius: 'var(--radius-full)',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        zIndex: 9999,
        textDecoration: 'none',
        transition: 'top 0.2s ease',
        boxShadow: '0 4px 20px rgba(255,77,141,0.3)',
      }}
      onFocus={(e) => { e.currentTarget.style.top = '12px'; }}
      onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
    >
      Skip to main content
    </a>
  );
}
