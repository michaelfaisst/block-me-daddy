# Agent Guidelines for Block-Me-Daddy

## Build/Test Commands

- `bun run build` - TypeScript check + Vite build
- `bun run test` - Run all tests with Vitest
- `bun run test src/lib/blocking.test.ts` - Run single test file
- `bun run test:ui` - Run tests with UI
- `bun run prettify` - Format code with Prettier

## Code Style

- **Imports**: Three groups separated by blank lines: (1) third-party, (2) `@/` paths, (3) relative. Auto-sorted by Prettier plugin.
- **Formatting**: 4-space tabs, no trailing commas, double quotes for strings
- **TypeScript**: Strict mode enabled. Use Zod schemas for validation (see `src/dto/index.ts`)
- **React**: Functional components with hooks. Use `react-hook-form` + Zod for forms
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files
- **State**: Chrome storage via `useChromeStorageLocal` hook for persistence
- **UI Components**: Import from `@/components/ui` (shadcn-based)
- **Validation**: Check for duplicates before adding/editing sites (see `add-site.tsx:52-61`)
- **Error Handling**: Use `form.setError()` for validation errors in forms

## Project Structure

- Chrome extension built with Vite + React + TypeScript
- Main logic: `src/lib/blocking.ts` (site matching, schedule checking)
- Components: `src/components/` (blocked-sites, schedule, ui)
- Test coverage required for core blocking logic
