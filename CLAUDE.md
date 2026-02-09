# BookLedger

Personal book collection management app. Frontend-only with landing page and auth UI.

## Tech Stack

- **React 19** + **React Router 7** (SPA, no SSR) — JSX only, no TypeScript
- **Tailwind CSS 4** — inline `@theme` config in `src/index.css`, OKLch colors
- **shadcn/ui** (new-york, JSX, Lucide icons) — add via `npx shadcn@latest add <component>` from `Frontend/`
- **Framer Motion** for animations
- **Vite** via `rolldown-vite` (intentional alias, do not change)
- No backend or global state management yet

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui primitives (button, card, input, checkbox, etc.)
│   │   ├── layout/      # Navbar, Footer, ScrollProgress
│   │   ├── landing/     # Landing page sections (Hero, Features, Pricing, etc.)
│   │   └── auth/        # Auth components (FloatingShape, IconInput, PasswordInput, PasswordStrengthMeter)
│   ├── layouts/          # Route layouts (AuthLayout)
│   ├── pages/            # Landing, LoginPage, SignupPage, VerifyEmailPage
│   ├── routes/           # Router.jsx — React Router config
│   ├── lib/              # utils.js (cn helper)
│   ├── hooks/            # use-mobile.js
│   ├── index.css         # Tailwind v4 theme + custom CSS utilities
│   └── main.jsx
├── components.json       # shadcn/ui config
├── vite.config.js        # Vite + Tailwind plugin + @ alias
└── package.json
```

## Routes

- `/` — Landing page
- `/auth/login` — Login page
- `/auth/signup` — Signup page
- `/auth/verify-email` — Email verification (OTP input)

Auth pages share `AuthLayout` (gradient bg, floating shapes, logo link to home).

## Commands

Run from `Frontend/`:

```sh
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Code Conventions

- `@/` import alias maps to `./src`
- Named exports for components; default export for pages and layouts
- Arrow function components
- `cn()` from `@/lib/utils` for class merging (clsx + tailwind-merge)

## Styling

- **Primary**: `oklch(0.488 0.243 264)` (indigo/blue) — dark mode via `.dark` class
- **Fonts**: Inter (headings), Roboto (body), JetBrains Mono (code)
- **Key CSS classes**: `.gradient-text`, `.animated-gradient`, `.glass` / `.glass-card`, `.animate-float`
- Framer Motion entrance animations: `initial={{ opacity: 0, y: 20 }}`, `duration: 0.5`, `ease: "easeOut"`
- `prefers-reduced-motion` disables animations globally
