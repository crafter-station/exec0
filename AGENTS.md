# AGENTS.md - Development Guidelines for Exec0

This guide is for agentic coding assistants working in the Exec0 repository.

## Project Overview

Exec0 is a monorepo containing:
- **apps/web**: Next.js 16+ frontend (React 19, TypeScript)
- **apps/api**: Hono-based Lambda API with OpenAPI docs
- **apps/functions**: AWS Lambda functions (TypeScript/JavaScript)
- **packages/**: Shared libraries (auth, database, keys, ui components)

## Build, Lint & Test Commands

### Root-level Commands
```bash
bun install                    # Install all dependencies (uses bun@1.3.4)
bun run dev                    # Start dev servers (turbo dev)
bun run format                 # Format all code with Biome
bun run lint                   # Lint & fix with Biome
```

### Per-Package Commands
- **Web app** (`apps/web`):
  ```bash
  cd apps/web && bun run dev   # Next.js dev server (port 3000)
  bun run build                # Build Next.js
  bun run lint                 # Check formatting
  ```

- **API** (`apps/api`):
  ```bash
  cd apps/api && bun run build # Build Lambda function with esbuild
  bun run deploy               # Deploy to AWS Lambda (requires aws-cli)
  ```

- **Other packages**: Use `bun run build` if available, or workspaces inherit root commands

**Note**: No dedicated test framework found; if tests are added, prefer Vitest over Jest.

## Code Style & Formatting

### Overview
- **Formatter**: Biome 2.3.8 (organized imports, double quotes, 2-space indent)
- **Linter**: Biome with recommended rules enabled
- **TypeScript**: Strict mode enabled (`strict: true`)
- **Module System**: ESNext with `moduleResolution: "bundler"`
- **Target**: ESNext (latest features)

### Imports
1. **Auto-organized**: Biome's `organizeImports` is enabled (on save)
2. **Grouping order**: Standard library → external deps → internal imports
3. **Quote style**: Double quotes required (`"`)
4. **Spacing**: 2 spaces (Biome enforces)
5. **Aliases**: Use `@/` for app roots, workspace package names (e.g., `@exec0/ui`, `@exec0/auth`)

Example import order:
```typescript
import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@exec0/ui/lib/utils";
import { Button } from "@exec0/ui/components/button";

import { useAuth } from "@/lib/auth";
import { Card } from "@/components/card";
```

### Formatting Rules
- **Line length**: No explicit limit (Biome default)
- **Indentation**: 2 spaces
- **Semicolons**: Always required (Biome enforced)
- **Trailing commas**: Allowed in multiline structures
- **Trailing whitespace**: Removed automatically

### TypeScript & Type Checking

**Compiler options** (from `tsconfig.json`):
- `strict: true` - All strict checks enabled
- `noUnusedLocals: true` - Unused variables cause errors
- `noUnusedParameters: true` - Unused parameters cause errors
- `noPropertyAccessFromIndexSignature: true` - Explicit typing required
- `strictNullChecks: true` - Null/undefined checked strictly
- `skipLibCheck: true` - Skip `.d.ts` validation
- `noFallthroughCasesInSwitch: true` - Require break/return in switch
- `noImplicitOverride: true` - Override keyword required in classes
- `verbatimModuleSyntax: true` - Preserve import syntax as written
- `allowImportingTsExtensions: true` - Allow .ts imports (bundler mode)

**Guidelines**:
- Always use explicit types (no implicit `any`)
- Use `type` for type aliases, `interface` for object contracts
- Prefer `readonly` for immutable data
- Use `as const` for literal types
- Type React components: `React.ComponentProps<T>`, `Readonly<{}>` for props

### Naming Conventions
- **Files**: Use kebab-case for files (`button.tsx`, `use-auth.ts`), PascalCase for components
- **Variables/Functions**: camelCase (`const userName = ...`, `function getUserById() {}`)
- **Constants**: UPPER_SNAKE_CASE for true constants (`const MAX_RETRIES = 3`)
- **Classes**: PascalCase
- **Private fields**: Prefix with `_` (`_internalState`)
- **React Hooks**: Prefix with `use` (`useAuth`, `useLocalStorage`)

### Error Handling
1. **Validation**: Use Zod for schema validation (already in project)
2. **Type safety**: Leverage TypeScript strict mode to catch errors early
3. **Try-catch**: Use sparingly; prefer explicit error types
4. **HTTP errors**: Hono API uses proper status codes (400, 401, 500, etc.)
5. **Logging**: Console methods or structured logging (follow existing patterns)
6. **User feedback**: Use `sonner` toast notifications in UI (already imported)

Example error handling:
```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

try {
  const data = userSchema.parse(input);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.errors);
  }
}
```

### React & Component Guidelines
- Use React 19+ features (Server Components in Next.js 16+)
- Prefer functional components with hooks
- Use Tailwind CSS + CVA (class-variance-authority) for styling
- Extract components to `@exec0/ui` package when reusable
- Export components via barrel files (`index.ts`)

### Next.js Specific
- Use App Router (not Pages Router)
- Use `@/` alias for app root imports
- Server components by default; use `"use client"` sparingly
- Route groups with parentheses: `(auth)`, `(app)`, `(marketing)`
- API routes via `route.ts` files

## File Structure
```
exec0/
├── apps/
│   ├── web/               # Next.js frontend
│   ├── api/               # Hono Lambda API
│   └── functions/         # AWS Lambda functions
├── packages/
│   ├── auth/              # Better-auth integration
│   ├── database/          # Prisma ORM
│   ├── keys/              # Key management
│   └── ui/                # Shadcn/ui + custom components
├── biome.json             # Shared linting/formatting config
├── tsconfig.json          # Shared TypeScript config
├── turbo.json             # Turborepo config
└── package.json           # Root workspace
```

## Quick Checklist Before Committing
- [ ] Run `bun run lint` (fixes issues automatically)
- [ ] Run `bun run format` (if needed separately)
- [ ] Check TypeScript: `bun tsc --noEmit` (at workspace root or per-package)
- [ ] Verify imports are organized (should be automatic)
- [ ] No unused variables or parameters
- [ ] All types explicitly defined (no implicit `any`)
- [ ] Error handling is proper (Zod validation where needed)

## Key Dependencies
- **Framework**: Next.js 16.1+, React 19, Hono
- **Styling**: Tailwind CSS 4, CVA, Shadcn/ui
- **Auth**: Better-auth 1.4.7
- **Database**: Prisma
- **Schema Validation**: Zod 4.2+
- **UI Utilities**: Lucide React, Sonner (toast)
- **Build**: Turbo, esbuild, Biome

## Resources
- [Biome Docs](https://biomejs.dev)
- [TypeScript Config](./tsconfig.json)
- [Biome Config](./biome.json)
- [Root Package.json](./package.json)
