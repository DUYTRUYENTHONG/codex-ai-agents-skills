---
name: next-best-practices
description: "Use for Next.js 15+ architecture decisions around App Router, data boundaries, metadata, streaming, server/client boundaries, and production performance/SEO. Trigger on: Next.js, App Router, RSC, Server Actions, middleware, metadata, route segments."
license: MIT
metadata:
  domain: frontend
  role: specialist
  scope: architecture
  output-format: code
  related-skills: nextjs-developer
---

# Next.js Best Practices

Use this when a page/action needs strong performance and SEO outcomes. Prefer server-first rendering and minimal client footprint.

## Architectural Rules
- Use `app/` router only. Avoid `pages/` unless migration constraints require it.
- Default components to Server Components; add `'use client'` only where interaction exists.
- Fetch data in server context; pass serializable props to client components.
- Boundaries: every async route segment should define loading/error UX (loading.tsx, error.tsx).
- Keep mutation and revalidation logic inside Server Actions unless it causes hard operational constraints.

## Caching Strategy
- Use explicit cache/revalidate options per fetch.
- Prefer `revalidate` for stable catalog pages and smaller stale windows for pricing-sensitive views.
- Keep sensitive request-specific queries in server-side routes, not cached globally.

## Metadata and SEO
- Every canonical public marketing page should define metadata via `metadata` export or `generateMetadata`.
- Avoid duplicated `<title>` and manual meta insertion in page components.
- Add OG image, description, and canonical strategy for campaign/sale landing pages.

## Streaming and UX
- Use `Suspense` where data fanout causes long tail latency.
- Keep fallback UI meaningful: skeleton or shimmer, not spinner-only.
- Keep the most conversion-relevant block above the fold for campaign pages.

## Performance Checklist
- Use optimized image pipeline; never ship unoptimized hero/product images.
- Audit bundle size of client components; split heavy components by route.
- Avoid render-blocking third-party scripts on above-the-fold path.
- Keep CSS/JS critical path minimal for mobile first paint.

## Security and Routing
- Validate server inputs at boundary and never trust client query params as source of truth.
- Keep auth/session checks in middleware or server actions where needed.
- Ensure redirect and rewrite behavior does not hide 404s from indexable campaign paths.

## Deployment Readiness
- Run production build and route smoke checks before release.
- Verify no hydration mismatches between server/client trees on sale page and cart flows.
