# BookLedger

Personal book collection management app with Express/MongoDB backend and React frontend.

## Tech Stack

### Frontend (`Frontend/`)
- **React 19** + **React Router 7** (SPA, no SSR) — JSX only, no TypeScript
- **Tailwind CSS 4** — inline `@theme` config in `src/index.css`, OKLch colors
- **shadcn/ui** (new-york, JSX, Lucide icons) — add via `npx shadcn@latest add <component>` from `Frontend/`
- **Framer Motion** for animations
- **Zustand** for state management (auth store)
- **Axios** for API calls (`src/lib/axios.js`, baseURL: `http://localhost:4000/api`)
- **Vite** via `rolldown-vite` (intentional alias, do not change)

### Backend (`Backend/`)
- **Express 5** + **Mongoose 9** (MongoDB)
- **JWT auth** (24h expiry, Bearer token in Authorization header)
- **Brevo** for transactional emails (verification, password reset)
- **bcryptjs** for password hashing

## Project Structure

```
Frontend/src/
├── components/
│   ├── ui/          # shadcn/ui primitives
│   ├── layout/      # Navbar, Footer, ScrollProgress
│   ├── landing/     # Landing page sections
│   └── auth/        # FloatingShape, IconInput, PasswordInput, PasswordStrengthMeter, ProtectedRoute
├── layouts/          # AuthLayout
├── pages/            # Landing, LoginPage, VerifyEmailPage, DashboardPage
├── routes/           # Router.jsx
├── store/            # authStore.js (Zustand)
├── lib/              # utils.js, axios.js
├── hooks/            # use-mobile.js
└── index.css         # Tailwind v4 theme

Backend/
├── controller/       # userController, bookController, etc.
├── routes/           # userRoutes, bookRoutes, etc.
├── models/           # userModel, bookModel, etc.
├── services/         # authService, auditService, etc.
├── middlewares/       # authMiddleware, errorMiddleware
├── Brevo/            # Brevo email config and templates
├── Database/         # db.js (MongoDB connection)
├── config/           # config.env
├── script/           # Test scripts
├── app.js            # Express app setup
└── server.js         # Server entry point
```

## Routes

- `/` — Landing page
- `/auth/login` — Login page
- `/auth/verify-email` — Email verification (6-digit OTP)
- `/dashboard` — Protected dashboard (requires auth)

Auth pages share `AuthLayout`. Signup is Admin-only (no public signup page).

## Auth Flow

1. Login → `POST /api/users/login` → JWT token stored in localStorage
2. If unverified (403) → redirect to `/auth/verify-email` → `POST /api/users/verify-email`
3. On success → redirect to `/dashboard`
4. Page refresh → `App.jsx` calls `checkAuth()` → `GET /api/users/me` rehydrates user from token
5. `ProtectedRoute` guards `/dashboard` (shows spinner while checking, redirects if unauthenticated)

## Commands

```sh
# Frontend (from Frontend/)
npm run dev      # Dev server (port 5173)
npm run build    # Production build

# Backend (from Backend/)
npm run dev      # Dev server with nodemon (port 4000)
npm start        # Production server
```

## Code Conventions

- `@/` import alias maps to `./src` (frontend)
- Named exports for components; default export for pages and layouts
- Arrow function components
- `cn()` from `@/lib/utils` for class merging (clsx + tailwind-merge)
- ES Modules throughout (both frontend and backend)

## Styling

- **Primary**: `oklch(0.488 0.243 264)` (indigo/blue) — dark mode via `.dark` class
- **Fonts**: Inter (headings), Roboto (body), JetBrains Mono (code)
- **Key CSS classes**: `.gradient-text`, `.animated-gradient`, `.glass` / `.glass-card`, `.animate-float`
- Framer Motion entrance animations: `initial={{ opacity: 0, y: 20 }}`, `duration: 0.5`, `ease: "easeOut"`
- `prefers-reduced-motion` disables animations globally
