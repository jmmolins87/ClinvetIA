# Agent Instructions for Clinvetia App

This repository is a Next.js (App Router) app using React 19, TypeScript (strict), Tailwind CSS v4, and Storybook.

## Commands (Build / Lint / Typecheck / Storybook)

```bash
# Install deps
pnpm install

# Dev server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint entire repo (ESLint 9 + eslint-config-next)
pnpm lint

# Lint with auto-fix (pnpm requires "--" to pass args)
pnpm lint -- --fix

# Lint a single file
pnpm lint -- app/page.tsx

# Typecheck (no emit)
pnpm exec tsc --noEmit

# Storybook (port 6006)
pnpm storybook

# Build Storybook
pnpm build-storybook
```

## Tests

Unit tests are run with Vitest (jsdom + Testing Library).

- Run all tests once: `pnpm test`
- Watch mode: `pnpm test:watch`
- Coverage (strict; thresholds are configured in `vitest.config.mjs`): `pnpm test:coverage`
- Run a single test file / a single test by name:

```bash
pnpm test -- components/ui/button.test.tsx
pnpm test -- components/ui/button.test.tsx -t "renders"
```

- Closest “CI-like” smoke check: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`.

## Repo-Specific Notes

- Package manager: use `pnpm` (lockfile is `pnpm-lock.yaml`).
- Module alias: `@/*` maps to the repo root via `tsconfig.json`.
- Tailwind v4 is configured via CSS (`app/globals.css` uses `@import "tailwindcss"`).
- Storybook uses Vite and provides Next.js module mocks/aliases in `.storybook/main.js`.
- `.gitignore` currently ignores `.storybook/`. If you need to commit Storybook config changes, fix the ignore first.

## Project Structure (High Level)

```
app/                 # Next.js App Router (server components by default)
  layout.tsx         # Root layout + fonts + globals
  page.tsx           # Home page
  globals.css        # Tailwind v4 + theme tokens + utilities
components/
  providers/         # Client providers (theme, loaders)
  ui/                # Reusable UI primitives (Radix/shadcn-style)
lib/
  api/               # Client-side API wrappers with typed results
  admin/             # Demo/admin helpers
  utils.ts           # `cn()` helper for Tailwind class merging
stories/             # Storybook stories + MSW handlers
styles/              # Storybook-specific CSS
public/              # Static assets
scripts/             # Utility scripts
```

## Code Style Guidelines

### TypeScript

- `tsconfig.json` is `strict: true`; avoid `any` and prefer narrow, explicit types at module boundaries.
- Use `type` for unions/utility types and `interface` for object shapes that benefit from declaration merging/extension.
- Prefer typed result objects over throwing for expected failures (see `lib/api/bookings.ts`).
- Keep client-only code behind `"use client"`; default to Server Components in `app/` when possible.

### Imports

- Prefer absolute imports from `@/` over deep relative paths.
- Group imports with blank lines: (1) type-only, (2) React/Next, (3) third-party, (4) `@/` local.
- Use type-only imports where helpful: `import type { Metadata } from "next"`.
- In mixed imports, inline type modifiers are fine: `import { clsx, type ClassValue } from "clsx"`.

### Icons

- Use `Icon` from `components/ui/icon.tsx` instead of importing from `lucide-react` directly.
- Prefer base icon names (e.g. `name="X"`, `name="ChevronRight"`) over `*Icon` aliases.

### Formatting

- No Prettier/EditorConfig is configured; match existing style.
- 2-space indentation, semicolons, double quotes.
- Prefer readable multiline props/objects over dense one-liners when it improves clarity.

### Naming

- Components: `PascalCase` (files and exports).
- Hooks: `camelCase` with `use` prefix.
- Types: `PascalCase`; enums are used in `lib/` where appropriate.
- Constants: `UPPER_SNAKE_CASE` for true constants.
- Tailwind utility helpers: use `cn()` from `lib/utils.ts` for conditional class merging.

### React / Next.js Patterns

- `app/` pages/layouts: default-export the component; keep `export const metadata` typed as `Metadata` when used.
- Only add `"use client"` when the file uses hooks, browser-only APIs, or client-side providers.
- Prefer Radix primitives (in `components/ui/`) for accessibility; add `aria-label` for icon-only controls.

### Styling (Tailwind v4)

- Prefer Tailwind utilities over new custom CSS.
- Use design tokens / CSS variables defined in `app/globals.css` (background/foreground, gradients, radius).
- Avoid inline styles unless there is no reasonable Tailwind/CSS-variable alternative.

### Error Handling

- For network/API calls in `lib/api/*`, prefer typed return unions (e.g., `ApiResult<T>`) and normalize parse errors.
- Use `try/catch` around JSON parsing and any code that can throw; return a stable error shape.
- For UI errors, use Next.js `error.tsx` boundaries when/if introduced; avoid swallowing exceptions silently.

### Environment & Secrets

- Never commit `.env*` files (ignored by `.gitignore`).
- Only expose client-safe values via `NEXT_PUBLIC_*` env vars; treat all others as server-only.
- Validate env vars at startup in a single place if/when env usage grows.

### Git / Workspace Hygiene

- Don’t commit secrets, API keys, credentials, or large build outputs (`.next/`, `out/`, `build/`).
- Prefer small, focused changes; avoid drive-by formatting across unrelated files.
- If you touch `.storybook/`, remember it’s currently ignored and may not be included in commits.

### Storybook

- Stories live under `stories/` and should use CSF3 (`satisfies Meta<typeof Component>`).
- Prefer real variants used by the app (sizes, states, disabled, loading).
- MSW handlers are defined in `stories/mocks/handlers.ts` and wired in `.storybook/preview.tsx`.

## Cursor / Copilot Rules

No Cursor rules found (`.cursor/rules/`, `.cursorrules`).
No GitHub Copilot instructions found (`.github/copilot-instructions.md`).
