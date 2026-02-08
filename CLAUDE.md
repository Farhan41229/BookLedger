# BookLedger

Personal book collection management app. Currently frontend-only with a completed landing page.

## Tech Stack

- **React 19** + **React Router 7** (SPA, no SSR)
- **Tailwind CSS 4** with inline `@theme` config in `src/index.css`
- **shadcn/ui** (new-york style, JSX, Lucide icons) — configured via `components.json`
- **Framer Motion** for animations, **react-countup** + **react-intersection-observer** for scroll-triggered counters
- **Vite** via `rolldown-vite` (see `package.json` overrides)
- No TypeScript — all files are `.jsx` / `.js`
- No backend or global state management yet

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui primitives (button, card, sheet, etc.)
│   │   ├── layout/      # Navbar, Footer, ScrollProgress
│   │   └── landing/     # Landing page sections (Hero, Features, Pricing, etc.)
│   ├── pages/           # Route-level pages (Landing.jsx)
│   ├── routes/          # Router.jsx — React Router config
│   ├── lib/             # utils.js (cn helper)
│   ├── hooks/           # Custom React hooks
│   ├── assets/          # Static assets
│   ├── index.css        # Tailwind v4 theme + custom CSS utilities
│   └── main.jsx         # App entrypoint
├── components.json      # shadcn/ui config
├── vite.config.js       # Vite + Tailwind plugin + @ alias
└── package.json
```

## Commands

Run all commands from the `Frontend/` directory:

```sh
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Code Conventions

- **JSX only** — no TypeScript, no `.tsx` files
- **Import alias**: `@/` maps to `./src` (e.g., `import { Button } from "@/components/ui/button"`)
- **Named exports** for components; default export for page-level components
- **Functional components** with arrow functions
- **Data as constants**: section data (features, testimonials, pricing, FAQ) defined as arrays/objects at the top of the component file, not inline

## Styling

- **Tailwind CSS 4** — config is inline in `src/index.css` using `@theme inline`, not a separate config file
- **OKLch color space** for all theme colors
- **Primary color**: `oklch(0.488 0.243 264)` (indigo/blue)
- **Dark mode**: class-based (`.dark` on root), defined with `@custom-variant dark (&:is(.dark *))`
- **Fonts**: Inter (headings), Roboto (body), JetBrains Mono (code)
- **Custom CSS classes** available in `index.css`:
  - `.gradient-text` — gradient text fill
  - `.animated-gradient` — animated background gradient
  - `.glass` / `.glass-card` — glassmorphism effects
  - `.animate-float`, `.animate-float-delayed`, `.animate-float-slow` — floating animation
  - `.animate-shimmer`, `.animate-glow-pulse`, `.animate-pulse-badge` — decorative effects
  - `.gradient-border` — animated gradient border via pseudo-element
  - `.accent-line` — underline accent via `::after`

## shadcn/ui

- Style: **new-york** | Icons: **lucide** | RSC: **false** | TSX: **false**
- Uses `cn()` utility from `@/lib/utils` (clsx + tailwind-merge)
- Components use **class-variance-authority (CVA)** for variants
- Add new components: `npx shadcn@latest add <component>` (run from `Frontend/`)

## Animation Patterns

- **Framer Motion** for entrance animations — use `motion.div` with `initial`, `whileInView`, `viewport={{ once: true }}`
- **Staggered children**: parent `motion.div` with `staggerChildren` in `transition`, children with shared variant objects
- **Scroll-triggered counters**: wrap `<CountUp>` with `useInView` from `react-intersection-observer`, start counting when `inView` is true
- Animation config typically: `duration: 0.5–0.8`, `ease: "easeOut"`, `y: 30–50` for slide-up reveals

## Important Notes

- The `@` import alias is configured in both `vite.config.js` and `components.json`
- Vite is aliased to `rolldown-vite` — this is intentional, do not change
- `tw-animate-css` is imported in `index.css` for shadcn animation support
- Accessibility: `prefers-reduced-motion` media query disables animations globally
- Smooth scroll is enabled with `scroll-behavior: smooth` on `html` and `scroll-margin-top: 5rem` on sections
