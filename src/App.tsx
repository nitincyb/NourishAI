/**
 * NourishAI — Root Application Component
 *
 * Architecture:
 * - Pages are lazy-loaded for code splitting
 * - Common components are imported from barrel exports
 * - Business logic lives in /utils (pure functions)
 * - State management in /store (Zustand with persistence)
 * - External services in /services (USDA API, Supabase)
 */

import { useState, useCallback, lazy, Suspense } from 'react';
import { FloatingBackground } from './components/common';
import { Navbar, SkipLink } from './components/layout';
import './index.css';

// Lazy-loaded pages for bundle optimization
const Hero = lazy(() => import('./pages/Hero'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MealLogger = lazy(() => import('./pages/MealLogger'));
const Insights = lazy(() => import('./pages/Insights'));
const Rewards = lazy(() => import('./pages/Rewards'));

/** Loading fallback for lazy-loaded pages */
function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', color: 'var(--text-muted)', fontFamily: 'var(--font-display)',
        gap: 12,
      }}
    >
      <div className="spinner" />
      <span>Loading…</span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');

  const setTab = useCallback((tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStart = useCallback(() => setTab('dashboard'), [setTab]);

  return (
    <>
      <SkipLink />
      <FloatingBackground />
      {activeTab !== 'hero' && <Navbar activeTab={activeTab} setTab={setTab} />}
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          {activeTab === 'hero' && <Hero onStart={handleStart} />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'log' && <MealLogger />}
          {activeTab === 'insights' && <Insights />}
          {activeTab === 'rewards' && <Rewards />}
        </Suspense>
      </main>
    </>
  );
}
