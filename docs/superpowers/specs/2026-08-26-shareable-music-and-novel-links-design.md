# Shareable Music & Novel Links with Social Preview Cards

**Date:** 2026-08-26
**Status:** Approved (pending spec review)

## Problem

There is currently no way to share a direct link to a specific album, a specific track within an album, or a novel/audiobook. The `/music` page is fully client-rendered: it fetches album data via `useEffect` after mount and holds the "selected album" in local component state, so the URL never reflects what's being viewed or played. Social platforms (Instagram, Facebook, etc.) generate link previews by reading server-rendered `<meta>` tags at request time — they don't execute client JS — so even if a shareable URL existed today, no meaningful preview (song title, album title, artist) could be produced.

## Goals

- A user can share a URL that opens directly to a specific album, or a specific track within an album, on `/music`.
- A user can share a URL to a specific novel under `/books/novels`.
- Pasting these links into iMessage/Facebook/Instagram/etc. produces a rich preview card: for a track — track title (top), album title (smaller, underneath), cover art, "Dancing Salamanders" (bottom); for an album or novel — title (top), cover art, "Dancing Salamanders" (bottom).
- Opening a shared link cues the relevant track/album in the player, ready to play with a single tap (true autoplay is not attempted — browsers block audio autoplay on a page load that isn't itself a user gesture).
- The browser address bar updates automatically as the user browses/plays on `/music`, so whatever is currently open is always the correct link to share (in addition to explicit share buttons).
- Explicit share/copy-link buttons are available on albums, tracks, and novels (uses the Web Share API where available, falls back to clipboard copy).

## Non-Goals

- Deep-linking to a specific audiobook playback timestamp or a specific novel reading page in a shared URL. Existing per-device resume (`localStorage` for audiobook position, `?page=` for reading position) is untouched; a shared link always opens at the start of the book/track. This may be revisited later.
- Manga (`/books/manga`) and the general book page (`/books/[slug]`) are out of scope — only `/music` and `/books/novels/[slug]`.
- No custom brand font for the generated preview images in this pass — system-safe sans-serif is used initially.

## Architecture

### Routing

- `app/music/page.tsx` — becomes a server component. Calls `getAlbums()` from [lib/music.ts](../../../lib/music.ts) directly and renders a client component with the full album list, no album selected.
- `app/music/[albumSlug]/page.tsx` — new. `generateStaticParams()` from `getAlbums()`; `generateMetadata()` returns the album title; calls `getAlbumBySlug(slug)`, `notFound()` if missing. Renders the same client component with a `selectedAlbum` prop.
- `app/music/[albumSlug]/[trackNumber]/page.tsx` — new. Same as above, additionally validates `trackNumber` against `album.tracks`; `notFound()` if out of range. `generateMetadata()` returns `"${track.title} — ${album.title}"`. Renders the client component with `selectedAlbum` + `initialTrackNumber`.
- The existing `/api/music` route is left in place but is no longer used by the page itself.
- `app/books/novels/[slug]/page.tsx` is unchanged structurally (already has `generateStaticParams`/`generateMetadata`); only gets metadata/OG additions (see below).

### Player state hydration & cueing

- New context action in [lib/music-context.tsx](../../../lib/music-context.tsx): `cueTrack(album, trackIndex)` — mirrors `playTrack` (sets `audio.src`, calls `audio.load()`, updates `currentAlbum`/`currentTrackIndex`/`duration`, persists to `localStorage`) but never calls `audio.play()`, so `isPlaying` stays `false` and the player bar shows a ready-to-tap Play control.
- The client music component calls `cueTrack` once on mount if it received `initialTrackNumber` (or `trackIndex 0` if only `selectedAlbum` was provided), but only when nothing is already actively playing — it never interrupts existing playback from in-app navigation.
- User interactions keep the URL in sync via `router.push`:
  - Selecting an album → `/music/${album.slug}`.
  - Selecting a track → `/music/${album.slug}/${track.trackNumber}` + a real `playTrack` call (direct user gesture, so autoplay is allowed here).
  - Deselecting an album → `/music`.
- Back/forward browser buttons work naturally since each state is a real route.

### Social preview image generation

- Uses Next's `opengraph-image` file convention (`next/og`'s `ImageResponse`), which auto-injects `og:image`/`twitter:image` meta tags.
- Shared layout component (e.g. `lib/og-image.tsx`) renders: top text → cover image (center) → "Dancing Salamanders" (bottom) on a branded background, reused by all three image routes below.
- `app/music/[albumSlug]/opengraph-image.tsx` — top text: album title.
- `app/music/[albumSlug]/[trackNumber]/opengraph-image.tsx` — top text: track title, with album title as smaller text underneath.
- `app/books/novels/[slug]/opengraph-image.tsx` — top text: novel title, using `novel.meta.coverImage`.
- Cover art is read from the local filesystem (`fs.readFileSync` + base64), no network fetch needed.
- Standard 1200×630 OG size. If no cover art exists, renders text-only on the branded background.

### Share buttons

- New `components/shared/ShareButton.tsx`: icon-only button (lucide-react share icon) taking a `url` and optional `title`/`text`. Uses `navigator.share()` if available, falls back to `navigator.clipboard.writeText(url)` with a brief "Link copied" indicator.
- Placed on the album header and per-track rows in `AlbumDetail` (track buttons appear on hover, matching the existing Play-icon interaction), and in the novel page header.

### Novels/audiobooks

- `generateMetadata` in `app/books/novels/[slug]/page.tsx` gains `openGraph: { title: novel.meta.title, description: novel.meta.excerpt }` (image supplied automatically by the sibling `opengraph-image.tsx`).
- A `ShareButton` is added near the novel title.
- No changes to audiobook playback, reading-position resume, or routing.

## Error Handling

- Invalid album slug or out-of-range track number → `notFound()` → standard Next 404.
- Missing cover art → OG image falls back to text-only card.
- `navigator.share()` cancellation or `clipboard` failure → fails silently (not a real error).

## Testing

- Unit tests (Vitest, `tests/unit/`): track-number validation in the new dynamic route; `cueTrack` context action asserts `isPlaying` stays `false` and state updates correctly.
- Smoke test (`tests/smoke/`): `/music/[album]` and `/music/[album]/[track]` return 200 with expected `<title>` and `og:image` present in the HTML.
- Manual post-implementation check: validate real-world preview rendering via Facebook's Sharing Debugger and/or Twitter Card Validator (crawlers cache aggressively, so this is the only reliable way to confirm actual results).
