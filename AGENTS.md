# Agent Instructions for Clinvetia App

This repository is a Next.js App Router app (Next 16, React 19) using TypeScript (strict), Tailwind CSS v4, Vitest + Testing Library, and Storybook.

## Commands (Build / Lint / Typecheck / Tests / Storybook)

```bash
# Install deps (pnpm)
pnpm install

# Dev server (http://localhost:3000)
pnpm dev

# Production build / start
pnpm build
pnpm start

# Lint (ESLint 9 + eslint-config-next; flat config in eslint.config.mjs)
pnpm lint
pnpm lint -- --fix
pnpm lint -- app/page.tsx

# Typecheck (no emit)
pnpm exec tsc --noEmit

# Tests (Vitest)
pnpm test            # vitest run
pnpm test:watch      # watch
pnpm test:coverage   # strict coverage

# Run a single test file
pnpm test -- components/ui/button.test.tsx

# Run a single test by name (optionally scoped to a file)
pnpm test -- -t "renders"
pnpm test -- components/ui/button.test.tsx -t "renders"

# Storybook (port 6006)
pnpm storybook
pnpm build-storybook

# Closest CI-like smoke check
pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build
```

## Repo-Specific Notes

- Package manager: use `pnpm` (lockfile: `pnpm-lock.yaml`).
- Module alias: `@/*` maps to repo root (`tsconfig.json` + Vitest alias in `vitest.config.mjs`).
- Tailwind v4 is configured via CSS (`app/globals.css` uses `@import "tailwindcss"`; PostCSS in `postcss.config.mjs`; no `tailwind.config.*` in this repo).
- TypeScript project excludes Storybook sources (`tsconfig.json` excludes `stories/` and `.storybook/`).
- ESLint uses flat config (`eslint.config.mjs`) and ignores build outputs and `.storybook/**`.
- Storybook config lives in `.storybook/` (tracked) and runs via Vite; `next/*` is aliased to `.storybook/mocks/*`.

## Project Structure (High Level)

```
app/                 # Next.js App Router (Server Components by default)
  layout.tsx         # Root layout + fonts + providers
  page.tsx           # Home (client component)
  globals.css        # Tailwind v4 + theme tokens
components/
  blocks/            # Page sections (header/footer/hero, etc.)
  providers/         # Client providers (theme, i18n, loaders)
  ui/                # UI primitives (Radix/shadcn-style)
lib/
  api/               # Client-side API wrappers with typed results
  utils.ts           # `cn()` helper (clsx + tailwind-merge)
stories/             # Storybook stories + MSW handlers
styles/              # Storybook-specific CSS
```

## Code Style Guidelines

### Formatting

- Match existing style (no Prettier configured): 2-space indentation, semicolons, double quotes.
- Avoid drive-by reformatting; keep diffs tight and intentional.
- Prefer readable multiline JSX/objects over dense one-liners.

### Imports

- Prefer `@/` absolute imports over deep relative paths.
- Group imports with blank lines: (1) type-only, (2) React/Next, (3) third-party, (4) `@/` locals.
- Use type-only imports where helpful: `import type { Metadata } from "next"`.
- Mixed imports may use inline type modifiers: `import { clsx, type ClassValue } from "clsx"`.

### TypeScript

- `strict: true`: avoid `any`; prefer `unknown` + narrowing/guards at boundaries.
- Use `type` for unions/utility types; use `interface` when extension/merging is useful.
- Prefer typed result objects/unions over throwing for expected failures (see `lib/api/bookings.ts`).
- Be explicit about client-only code: add `"use client"` when using hooks or browser APIs.
- Avoid importing browser-only modules into Server Components; some `lib/api/*` utilities rely on `window`.

### Naming

- Components/files: `PascalCase` for React components; exported components also `PascalCase`.
- Hooks: `camelCase` with `use*` prefix.
- Types: `PascalCase`; constants: `UPPER_SNAKE_CASE`.
- Tests: `*.test.ts` / `*.test.tsx` colocated near the code they cover.

### React / Next.js Patterns

- `app/` pages/layouts: default-export the component; type `export const metadata` as `Metadata` when used.
- Default to Server Components; only add `"use client"` when needed.
- Providers live in `components/providers/` and are composed in `app/layout.tsx`.

### Styling (Tailwind v4)

- Prefer Tailwind utilities and design tokens in `app/globals.css`.
- Use `cn()` from `lib/utils.ts` for conditional class merging.
- Avoid inline styles unless there is no reasonable Tailwind/CSS-variable alternative.

### Icons

- Use `Icon` from `components/ui/icon.tsx` (do not import lucide icons directly).
- Icon-only controls must have `aria-label`.

### Error Handling

- For API wrappers (`lib/api/*`), return typed unions and normalize parse/network errors.
- Wrap parsing and other throwy code in `try/catch`; keep error shapes stable.
- Avoid silently swallowing UI errors; use `error.tsx` boundaries when introduced.

### Testing

- Vitest + jsdom + Testing Library; global setup/mocks live in `vitest.setup.ts`.
- `vitest.setup.ts` mocks `next/link`, `next/image`, and `next/navigation` for component tests.
- Prefer queries by role/label/text; use `user-event` for interactions.
- Coverage is strict (100% thresholds in `vitest.config.mjs`) and targets `components/**/*.{ts,tsx}`.

### Storybook

- See `STORYBOOK.md` for repo-specific story conventions.
- Stories live under `stories/` (commonly `stories/ui/*.stories.tsx`); MSW handlers live in `stories/mocks/handlers.ts`.
- Use CSF3 (`satisfies Meta<typeof Component>`) and prefer real app variants.

### Environment & Secrets

- Never commit `.env*` (ignored by `.gitignore`).
- Only expose client-safe values via `NEXT_PUBLIC_*` env vars.

### Git / Workspace Hygiene

- Don’t commit secrets, credentials, or build outputs (`.next/`, `out/`, `build/`, `coverage/`).
- Keep changes focused; avoid touching unrelated files.

## Cursor / Copilot Rules

No Cursor rules found (`.cursor/rules/`, `.cursorrules`).
No GitHub Copilot instructions found (`.github/copilot-instructions.md`).
