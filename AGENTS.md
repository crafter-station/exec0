# AGENTS.md — Exec0 Monorepo

## Project Overview

Fullstack platform for AI-agent code execution. Monorepo with:
- **`apps/web`** — Next.js 16 (App Router) + React 19 + TailwindCSS v4
- **`apps/api`** — Hono.js REST API deployed on AWS Lambda
- **`apps/functions/`** — Per-language Lambda executors (JS, TS, Go)
- **`packages/`** — Shared packages (auth, database, schemas, ui, keys, usage, polar)
- **`infra/`** — SST v3 infrastructure as code (AWS Lambda, DynamoDB, API Gateway)

## Package Manager

**Always use `bun`**. Never use `npm` or `yarn`.

```bash
bun install          # Install dependencies
bun run <script>     # Run scripts
bunx <package>       # Execute packages
```

## Commands

### Root (Turborepo)
```bash
bun run dev          # Start all apps in dev mode (turbo dev)
bun run lint         # Lint + fix (biome check --fix)
bun run format       # Format all files (biome format --write)
```

### Web App (`apps/web`)
```bash
bun run dev          # Next.js dev server
bun run build        # Production build
bun run lint         # biome check
bun run format       # biome format --write
```

### API (`apps/api`)
```bash
bun run build        # esbuild bundle → dist/index.js
bun run deploy       # build + zip + AWS Lambda update
```

### Database (`packages/database`)
```bash
bun run db:generate  # prisma generate
bun run db:migrate   # prisma migrate dev --skip-generate
bun run db:deploy    # prisma migrate deploy
```

### Auth
```bash
bun run auth:generate  # Regenerate Prisma schema from Better-Auth config
```

## Testing

**No test suite exists.** No testing framework is configured. When adding tests, use Bun's built-in test runner:
```bash
bun test                        # Run all tests
bun test path/to/file.test.ts   # Run a single test file
bun test --watch                # Watch mode
```

## Code Style — Biome

Single tool for linting and formatting. Config in `biome.json` at root.

- **Indentation:** 2 spaces
- **Quotes:** Double quotes (`"`) in JS/TS
- **Import organizer:** Automatic (enabled via `assist.actions.source.organizeImports`)
- **Rules:** `recommended` enabled

Run before committing:
```bash
bun run lint    # from repo root
```

## TypeScript

Strict mode. Key settings from root `tsconfig.json`:
- `strict: true`, `strictNullChecks: true`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- `noUncheckedIndexedAccess: true` — array/object access returns `T | undefined`
- `noImplicitOverride: true`
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `moduleResolution: "bundler"`

Always use `import type` for type-only imports:
```ts
import type { ExecuteRequest } from "@exec0/schemas";
```

## Imports & Path Aliases

| Alias | Resolves to | Used in |
|-------|-------------|---------|
| `@/*` | `./src/*` | `apps/web`, `apps/api` |
| `@exec0/ui/*` | `packages/ui/src/*` | `apps/web` |
| `@exec0/*` | workspace packages | anywhere |

Rules:
1. Use `@/` alias within the same app (never `../../`)
2. Use `@exec0/*` for shared workspace packages
3. Use relative paths only within the same feature folder

```ts
// Correct
import { auth } from "@exec0/auth";
import { Button } from "@exec0/ui/button";
import { db } from "@/lib/db";
import { executeLambda } from "./service";  // same feature

// Wrong
import { db } from "../../lib/db";
```

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Files | kebab-case | `auth-client.ts`, `usage-chart.tsx` |
| Components | PascalCase | `UsageChart`, `KeysTable` |
| Functions/vars | camelCase | `createApiKey`, `recordUsage` |
| Hooks | camelCase `use` prefix | `useOrgSlug`, `useSaveOrgSlug` |
| Types/Interfaces | PascalCase | `ExecuteRequest`, `ApiKeyRecord` |
| Constants (config/env) | SCREAMING_SNAKE_CASE | `RAM_ALLOCATIONS`, `TTL_90_DAYS` |
| Zod schemas | camelCase `Schema` suffix | `executeRequestSchema` |
| Component props types | PascalCase `Props` suffix | `KeysTableProps` |
| Hono routers | camelCase `Router` suffix | `executeRouter`, `keysRouter` |

## Error Handling

### API (Hono)
```ts
// Return structured errors with semantic HTTP codes
return c.json({ error: "Unauthorized" }, 401);
return c.json({ error: "API key is disabled" }, 403);
return c.json({ error: "Internal server error" }, 500);

// Fire-and-forget for non-critical operations
trackUsage(data).catch(console.error);
```

### Server Actions (Next.js)
```ts
// Always return { success, error?, data? }
export async function createKey(input: unknown) {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = createKeySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  // ... do work
  revalidatePath("/[slug]/keys");
  return { success: true, data: result };
}
```

### Lambda Functions
```ts
try {
  // execution
} catch (err) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
    }),
  };
}
```

### Environment Variables
Validate with Zod at startup — fail fast:
```ts
const envSchema = z.object({ DATABASE_URL: z.string() });
export const env = envSchema.parse(process.env);
```

## Architecture Patterns

### Next.js App Router
- Route groups: `(app)` (authenticated dashboard), `(auth)`, `(docs)`, `(marketing)`
- Auth guard in `(app)/layout.tsx` — redirects to `/login` if no session
- Server-first: RSC by default, `"use client"` only where necessary
- Mutations via `"use server"` server actions + `revalidatePath()` for cache invalidation
- React Compiler enabled (`reactCompiler: true` in next.config)

### Feature Structure (API)
Each feature in `apps/api/src/features/<name>/` has:
- `routes.ts` — Hono router with `describeRoute()` for OpenAPI
- `service.ts` — business logic
- `schemas.ts` — Zod schemas (if needed)

### Shared Packages
Packages export directly from `src/` — no build step required. They're source-first via `"exports"` in `package.json` pointing to `./src/index.ts`.

### State Management
No global state library. Use:
- RSC + server actions as primary data layer
- `useState`/`useEffect` for local UI state only
- `localStorage` for persisting lightweight client preferences (e.g., active org slug)
- `authClient` from Better-Auth for session state on the client

### Validation
Use Zod v4 across all layers (API, server actions, env vars, schemas package). Prefer `z.object().parse()` for hard failures and `.safeParse()` when you want to handle validation errors gracefully.

## SST Infrastructure

Resources are referenced type-safely via `Resource.X.name` (from `sst-env.d.ts`). When adding new Lambda functions:
1. Define in `infra/functions.ts` with `new sst.aws.Function()`
2. Link required resources with `link: [table, ...]` — this auto-grants IAM permissions
3. Reference in runtime with `Resource.TableName.name`

## UI Components

UI primitives live in `packages/ui/src/`. Built on:
- Radix UI primitives for accessibility
- `class-variance-authority` (CVA) for variant-based component APIs
- `tailwind-merge` for conditional class merging

Use `cn()` utility from `@exec0/ui/cn` for conditional Tailwind classes:
```ts
import { cn } from "@exec0/ui/cn";
className={cn("base-class", isActive && "active-class")}
```
