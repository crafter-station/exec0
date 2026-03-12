---
name: nextjs-cache-components
description: Guide for implementing Cache Components (Partial Prerendering / PPR) in Next.js 16+. Use this skill whenever the user mentions Cache Components, Partial Prerendering, PPR, `use cache`, `cacheLife`, `cacheTag`, `updateTag`, `revalidateTag`, mixing static and dynamic content in Next.js, or asks about prerendering strategies, static shells, or streaming dynamic content in the App Router. Also trigger when the user is migrating from route segment configs like `dynamic`, `revalidate`, or `fetchCache` to the new caching model, or when they ask about `cacheComponents` in next.config.
---

# Next.js Cache Components (Partial Prerendering)

Cache Components is an opt-in feature in Next.js 16+ that lets you mix static, cached, and dynamic content in a single route. It eliminates the traditional tradeoff between static pages (fast but stale) and dynamic pages (fresh but slow).

When enabled, Next.js prerenders routes into a **static HTML shell** served instantly, with dynamic content streaming in as it becomes ready.

## Enabling

Set `cacheComponents: true` in your Next config:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

When enabled:
- `GET` Route Handlers follow the same prerendering model as pages.
- Client-side navigation uses React `<Activity>` to preserve component state between routes.
- The Edge Runtime is **not supported** — Node.js runtime is required.

## How Prerendering Works

At build time, Next.js walks the component tree:

1. **Automatically static**: Components that only do synchronous I/O, module imports, or pure computations go straight into the static shell.
2. **Dynamic content**: Components that do network requests, DB queries, async file reads, or timeouts — wrap them in `<Suspense>` with a fallback.
3. **Cached content**: Components marked with `'use cache'` — their output is included in the static shell and revalidated on a schedule or on demand.

If a component can't complete during prerendering and isn't wrapped in `<Suspense>` or marked with `'use cache'`, Next.js throws an `Uncached data was accessed outside of <Suspense>` error.

## The Three Content Types

### 1. Static Content (automatic)

No special handling needed. Synchronous ops, imports, pure computation — all automatically part of the static shell.

```tsx
// This entire page is automatically static
import fs from 'node:fs'

export default async function Page() {
  const config = fs.readFileSync('./config.json', 'utf-8')
  const data = JSON.parse(config)
  return <h1>{data.title}</h1>
}
```

### 2. Dynamic Content (wrap in Suspense)

For data that must be fresh on every request: network requests, DB queries, or anything async that hits external systems. Place `<Suspense>` as close to the dynamic component as possible to maximize the static shell.

```tsx
import { Suspense } from 'react'

async function LiveFeed() {
  const data = await fetch('https://api.example.com/feed')
  const feed = await data.json()
  return <ul>{feed.map(item => <li key={item.id}>{item.text}</li>)}</ul>
}

export default function Page() {
  return (
    <>
      <h1>Part of the static shell</h1>
      <Suspense fallback={<p>Loading feed...</p>}>
        <LiveFeed />
      </Suspense>
    </>
  )
}
```

The fallback becomes part of the static shell. The actual content streams at request time.

### 3. Cached Content (use cache)

For dynamic data that doesn't need to be fresh on every single request. The `'use cache'` directive caches the return value and includes it in the static shell during prerendering.

```tsx
import { cacheLife } from 'next/cache'

async function BlogPosts() {
  'use cache'
  cacheLife('hours')

  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}
```

Arguments and closed-over values automatically become part of the cache key — different inputs produce separate cache entries.

## Runtime Data

These APIs require request context and **cannot** be used with `'use cache'` in the same scope:

- `cookies()` — user cookies
- `headers()` — request headers
- `searchParams` — URL query parameters
- `params` — dynamic route parameters (unless `generateStaticParams` provides samples)

Always wrap components using runtime data in `<Suspense>`:

```tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

async function UserGreeting() {
  const name = (await cookies()).get('name')?.value || 'Guest'
  return <p>Hello, {name}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserGreeting />
    </Suspense>
  )
}
```

**Workaround**: Extract values from runtime APIs and pass them as arguments to a cached function:

```tsx
async function ProfileContent() {
  const session = (await cookies()).get('session')?.value
  return <CachedProfile sessionId={session} />
}

async function CachedProfile({ sessionId }: { sessionId: string }) {
  'use cache'
  const data = await fetchUserData(sessionId)
  return <div>{data.name}</div>
}
```

Use `connection()` from `next/server` to defer to request time without accessing any runtime API directly.

## Non-Deterministic Operations

`Math.random()`, `Date.now()`, `crypto.randomUUID()` etc. require explicit intent:

- **Unique per request**: call after `await connection()`, wrap in `<Suspense>`.
- **Same for all users**: put inside `'use cache'` — value is computed once and cached.

## Cache Lifetime with `cacheLife`

Control how long cached data stays valid:

```tsx
import { cacheLife } from 'next/cache'

async function Data() {
  'use cache'
  cacheLife('hours') // Named profile: 'hours', 'days', 'weeks', 'max'
  // ...
}
```

Or use a custom config object:

```tsx
cacheLife({
  stale: 3600,     // 1h until considered stale
  revalidate: 7200, // 2h until revalidated
  expire: 86400,    // 1d until expired
})
```

## Tagging and Revalidating

Tag cached data with `cacheTag`, then revalidate with either:

### `updateTag` — immediate refresh in the same request

```tsx
import { cacheTag, updateTag } from 'next/cache'

async function getCart() {
  'use cache'
  cacheTag('cart')
  // fetch cart data
}

async function updateCart(itemId: string) {
  'use server'
  // mutate data
  updateTag('cart')
}
```

### `revalidateTag` — stale-while-revalidate (eventual consistency)

```tsx
import { cacheTag, revalidateTag } from 'next/cache'

async function getPosts() {
  'use cache'
  cacheTag('posts')
  // fetch posts
}

async function createPost(post: FormData) {
  'use server'
  // write post
  revalidateTag('posts', 'max')
}
```

Use `updateTag` when the user needs to see the change immediately. Use `revalidateTag` for content that can tolerate a brief delay.

## Migration from Route Segment Configs

When `cacheComponents` is enabled, these configs are no longer needed:

| Old Config | Replacement |
|---|---|
| `dynamic = 'force-dynamic'` | Remove it. All pages are dynamic by default. |
| `dynamic = 'force-static'` | Use `'use cache'` with `cacheLife('max')` on the page/layout. Remove any runtime data access. |
| `revalidate = 3600` | Use `'use cache'` + `cacheLife('hours')` |
| `fetchCache = 'force-cache'` | Use `'use cache'` — all fetches within are automatically cached. |
| `runtime = 'edge'` | Not supported. Cache Components requires Node.js runtime. |

## Complete Example

Three content types on one page:

```tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      {/* Static — automatically in the shell */}
      <header>
        <h1>Our Blog</h1>
        <nav>
          <Link href="/">Home</Link> | <Link href="/about">About</Link>
        </nav>
      </header>

      {/* Cached — included in the shell, revalidated hourly */}
      <BlogPosts />

      {/* Dynamic — streams at request time */}
      <Suspense fallback={<p>Loading preferences...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  const res = await fetch('https://api.vercel.app/blog')
  const posts = await res.json()
  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </section>
  )
}

async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <aside>Your theme: {theme}</aside>
}
```

## Decision Flowchart

When deciding how to handle a component:

1. Does it only use sync I/O, imports, or pure computation? → **Static** (nothing to do).
2. Does it access `cookies()`, `headers()`, `searchParams`, or `params`? → **Wrap in `<Suspense>`**. Cannot use `'use cache'`.
3. Does it fetch data that must be fresh every request? → **Wrap in `<Suspense>`**.
4. Does it fetch data that can be cached for a period? → **Use `'use cache'` + `cacheLife`**.
5. Does it use non-deterministic ops (`Math.random()`, `Date.now()`)? → Either `'use cache'` (same for all) or `await connection()` + `<Suspense>` (unique per request).

## Key Rules

- `'use cache'` and runtime data APIs cannot coexist in the same scope. Extract runtime values first, pass as args to cached functions.
- Place `<Suspense>` as close as possible to the dynamic component to maximize the static shell.
- Multiple `<Suspense>` boundaries render in parallel — use them to avoid sequential blocking.
- `React.cache` operates in an isolated scope inside `'use cache'` boundaries.
- Metadata (`generateMetadata`) and Viewport (`generateViewport`) track dynamic data access separately from the page — if only metadata needs runtime data, handle it explicitly.
