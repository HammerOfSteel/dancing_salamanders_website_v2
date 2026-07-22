# Phase 4 — Blog System

**Status: done.** `lib/blog.ts`-equivalent helpers, listing page, post page, and 5
migrated posts all exist.

- [x] MDX helper functions (list/get by slug/tags) — `lib/blog.ts` present
- [x] `app/blog/page.tsx` — blog listing
- [x] `components/blog/BlogCard.tsx`
- [x] `app/blog/[slug]/page.tsx` — individual post page
- [x] V1 posts migrated to `content/blog/`: Hiraeth, Time in My Hands, Strength in
      Community, Support Grieving Parents, Supporting Those Closest in Loss (all 5
      present)
- [ ] `components/blog/PostHeader.tsx` / `components/blog/MDXComponents.tsx` as
      separate files — not confirmed to exist as standalone components; verify
      whether this logic lives inline in `[slug]/page.tsx` instead
- [ ] OpenGraph image generation for blog posts (`opengraph-image.tsx`) — not found
- [ ] Tag filter bar on the listing page — not verified
