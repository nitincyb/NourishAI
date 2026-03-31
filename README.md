# NourishAI — Nutrition Tracking App

A clean, fast nutrition tracker built with React, TypeScript, and Vite. Tracks meals, monitors macros, and provides practical health insights.

## Tech Stack

- **Frontend**: React 19 + TypeScript, Vite 8
- **State**: Zustand with localStorage persistence
- **Charts**: Recharts for weekly trends
- **API**: USDA FoodData Central (optional, with API key)
- **Backend**: Supabase (optional, for cloud persistence)
- **Testing**: Vitest + React Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Environment Variables (Optional)

Copy `.env.example` to `.env` and fill in:

```bash
VITE_USDA_API_KEY=       # Free key from fdc.nal.usda.gov
VITE_SUPABASE_URL=       # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=  # Your Supabase anon key
```

The app works fully without these — it uses a built-in food database and localStorage.

## Project Structure

```
src/
├── __tests__/          # Unit tests (Vitest)
├── components/
│   ├── common/         # GlassCard, ProgressRing, MacroBar, FloatingBackground
│   ├── food/           # FoodCard
│   └── layout/         # Navbar, SkipLink
├── data/               # Static food database (USDA reference values)
├── hooks/              # Custom React hooks (useDebounce)
├── pages/              # Route pages (Hero, Dashboard, MealLogger, Insights, Rewards)
├── services/           # External API clients (USDA, Supabase)
├── store/              # Zustand state management
├── types/              # Shared TypeScript interfaces
├── utils/              # Pure utility functions (nutrition, sanitize, constants)
├── App.tsx             # Root component with lazy loading
├── main.tsx            # Entry point
└── index.css           # Design system tokens and global styles
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run all unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Architecture Decisions

- **Pure utility functions** — All business logic (scoring, XP, alerts) lives in `utils/` as pure functions, making them trivially testable.
- **Lazy-loaded pages** — Each page is a separate chunk, loaded on demand for fast initial load.
- **Barrel exports** — Components are re-exported from `index.ts` files for clean imports.
- **Memoization** — Components and derived data use `memo()` and `useMemo()` appropriately.
- **Accessibility** — Skip links, ARIA attributes, semantic HTML, keyboard navigation, reduced motion support.
- **Security** — Input sanitization, HTML escaping, CSP-ready headers, env-based secrets.

## Deployment

Configured for Vercel out of the box. Push to GitHub and connect to Vercel, or:

```bash
npx vercel
```

## License

MIT
