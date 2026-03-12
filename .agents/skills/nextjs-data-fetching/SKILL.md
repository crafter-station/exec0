---
name: nextjs-data-fetching
description: Data fetching patterns in Next.js App Router. Use whenever the user needs to fetch data in Server Components, implement Suspense streaming, handle multiple concurrent requests, or optimize data loading. Covers fetch API, ORM integration, parallel/sequential data patterns, and streaming UI. Only use Suspense boundaries directly - never use loading.tsx pattern.
---

# Next.js Data Fetching with Server Components & Suspense

Best practices for data fetching in Next.js App Router using Server Components and Suspense boundaries.

## Single Request Pattern

**Server Component with Suspense**

```typescript
// app/blog/page.tsx
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogSkeleton from '@/components/BlogSkeleton'

export default function Page() {
  return (
    <div>
      <h1>Blog</h1>
      <Suspense fallback={<BlogSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  )
}
```

```typescript
// components/BlogList.tsx
async function BlogList() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // Dynamic data
  })
  const posts = await res.json()

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default BlogList
```

```typescript
// components/BlogSkeleton.tsx
export default function BlogSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  )
}
```

## Multiple Concurrent Requests

**Separate Suspense boundaries (recommended)**

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'
import Posts from '@/components/Posts'
import Comments from '@/components/Comments'
import PostsSkeleton from '@/components/PostsSkeleton'
import CommentsSkeleton from '@/components/CommentsSkeleton'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  )
}
```

**Using Promise.all in same component**

```typescript
// components/Dashboard.tsx
async function Dashboard() {
  const [posts, comments] = await Promise.all([
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json())
  ])

  return (
    <div>
      <Posts posts={posts} />
      <Comments comments={comments} />
    </div>
  )
}

export default Dashboard
```

## Cache Configuration

```typescript
// Dynamic data - fetch on every request
const res = await fetch(url, { cache: 'no-store' })

// Static data - cache indefinitely (rebuild on revalidate)
const res = await fetch(url, { cache: 'force-cache' })

// ISR - cache with revalidation
const res = await fetch(url, { 
  next: { revalidate: 3600 } // 1 hour
})
```

## With ORM/Database

```typescript
// components/Articles.tsx
import { db, articles } from '@/lib/db'

async function Articles() {
  const allArticles = await db.select().from(articles)

  return (
    <ul>
      {allArticles.map(article => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  )
}

export default Articles
```

## Sequential with Preloading

```typescript
// app/item/[id]/page.tsx
import { getItem, checkIsAvailable } from '@/lib/data'

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Start loading early
  preload(id)
  
  // Do other work
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}

const preload = (id: string) => {
  void getItem(id)
}

async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  return <div>{result.name}</div>
}
```

## Request Deduplication

Next.js automatically deduplicates identical fetch requests in a single render pass:

```typescript
// Both calls return same result, only one HTTP request made
const user1 = await fetch('https://api.example.com/user/1')
const user2 = await fetch('https://api.example.com/user/1')
```

Use `React.cache()` for non-fetch data sources:

```typescript
// lib/data.ts
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  const res = await fetch(`https://api.example.com/user/${id}`)
  return res.json()
})
```

## Key Patterns

| Pattern | Use Case | Benefit |
|---------|----------|---------|
| Multiple `<Suspense>` | Independent data loads | Load in parallel, show each when ready |
| `Promise.all()` | Dependent data | Simple, single await |
| Preload | Sequential with prep work | Optimize loading time |
| `cache()` | Deduplicate ORM queries | Avoid duplicate database calls |

## Types

```typescript
type Post = {
  id: string
  title: string
  content: string
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}
```

## Error Handling

```typescript
async function BlogList() {
  try {
    const res = await fetch('https://api.example.com/posts')
    if (!res.ok) throw new Error('Failed to fetch')
    const posts = await res.json()
    return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
  } catch (error) {
    return <div>Error loading posts</div>
  }
}
```

## ⚠️ FORBIDDEN: loading.tsx

**DO NOT USE** Next.js `loading.tsx` pattern. Use `<Suspense>` directly in your components only.

```typescript
// ❌ DON'T DO THIS
// app/blog/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}

// ✅ DO THIS INSTEAD
// app/blog/page.tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogList />
    </Suspense>
  )
}
```

`loading.tsx` is automatic but inflexible. `<Suspense>` gives you full control.

## Quick Reference

- **Always use Server Components** by default for data fetching
- **One data fetch per component** to keep logic isolated
- **Use Suspense boundaries** for granular loading states (NO loading.tsx)
- **Separate Suspense** for independent data = better UX
- **Promise.all** for data that must load together
- **cache: 'no-store'** for dynamic, **cache: 'force-cache'** for static
