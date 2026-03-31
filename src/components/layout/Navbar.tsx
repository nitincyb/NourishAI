import { memo } from 'react';
import { NAV_TABS } from '../../utils/constants';

interface Props {
  activeTab: string;
  setTab: (tab: string) => void;
}

/**
 * Responsive navigation with desktop top bar and mobile bottom bar.
 * Uses semantic nav elements and proper ARIA attributes.
 */
export const Navbar = memo(function Navbar({ activeTab, setTab }: Props) {
  return (
    <>
      {/* Desktop navigation */}
      <nav className="navbar" aria-label="Main navigation">
        <button
          className="navbar-brand"
          onClick={() => setTab('hero')}
          aria-label="NourishAI home"
          style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
        >
          <div className="logo-icon" aria-hidden="true">🌿</div>
          Nourish<span style={{ color: 'var(--pink-500)' }}>AI</span>
        </button>
        <div className="navbar-links" role="tablist" aria-label="App sections">
          {NAV_TABS.map((t) => (
            <a
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              aria-current={activeTab === t.id ? 'page' : undefined}
              className={activeTab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(t.id); } }}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <span aria-hidden="true">{t.emoji}</span> {t.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_TABS.map((t) => (
          <a
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            aria-current={activeTab === t.id ? 'page' : undefined}
            className={activeTab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1.15rem' }} aria-hidden="true">{t.emoji}</span>
            {t.label}
          </a>
        ))}
      </nav>
    </>
  );
});
