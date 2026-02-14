# Agent Instructions for Clinteia App

This is a Next.js 16 application with TypeScript and Tailwind CSS v4.

## Build Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint              # Run ESLint
pnpm lint --fix        # Run ESLint with auto-fix

# Storybook
pnpm storybook         # Run Storybook dev server (port 6006)
pnpm build-storybook   # Build Storybook for production
```

## Test Commands

**Note: No test framework is currently configured.** To run tests, you would need to install a testing library like Jest or Vitest. When tests are added:

```bash
# Run all tests (once configured)
pnpm test

# Run single test file (once configured)
pnpm test -- path/to/test.tsx

# Run tests in watch mode (once configured)
pnpm test -- --watch
```

## Code Style Guidelines

### TypeScript

- **Target**: ES2017 with strict mode enabled
- **Module**: ESNext with bundler resolution
- **JSX**: Use `react-jsx` transform
- Always define explicit types for function parameters and returns
- Use `type` over `interface` for type definitions
- Enable strict null checks and no implicit any

### Imports

- Use absolute imports with `@/*` alias for project root
- Import order: React/Next → third-party → local modules
- Use named imports where possible
- Place type imports first: `import type { Metadata } from "next"`

### Formatting

- No explicit formatter configured (consider adding Prettier)
- Follow existing code patterns
- Use semicolons
- Use double quotes for strings
- 2-space indentation

### Naming Conventions

- **Components**: PascalCase (e.g., `MyComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utils/Libs**: camelCase (e.g., `helpers.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserData`)
- **Constants**: UPPER_SNAKE_CASE for true constants

### Component Patterns

- Use default exports for page components
- Use functional components with explicit return types
- Props interface: `ComponentNameProps`
- Prefer destructured props in component parameters

### Styling

- Use Tailwind CSS v4 with `@import "tailwindcss"` syntax
- Use CSS variables for theming (light/dark mode support)
- Prefer Tailwind utility classes over custom CSS
- Follow mobile-first responsive design

### Error Handling

- Use try/catch for async operations
- Handle errors at component boundaries
- Use Next.js error boundaries for fatal errors
- Log errors appropriately for debugging

### Environment

- Never commit `.env*` files
- Use `process.env` with NEXT_PUBLIC_ prefix for client-side env vars
- Validate environment variables at startup

### Git

- Do not commit secrets or API keys
- Follow conventional commit messages
- Run `pnpm lint` before committing

## Project Structure

```
app/           # Next.js App Router pages
  layout.tsx   # Root layout with fonts
  page.tsx     # Home page
  globals.css  # Global styles + Tailwind
components/    # React components
  ui/          # shadcn/ui components
  providers/   # Context providers (theme, etc.)
lib/           # Utility functions and helpers
  api/         # API functions
  admin/       # Admin-related code
stories/       # Storybook stories
  ui/          # Component stories
  mocks/       # MSW handlers for stories
public/        # Static assets
scripts/       # Build/utility scripts
.storybook/    # Storybook configuration
```

## Dependencies

- **Framework**: Next.js 16.1.6 with React 19.2.3
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript 5.x
- **Linting**: ESLint 9.x with Next.js config
- **Testing**: Storybook 8.x with MSW
- **Package Manager**: pnpm
