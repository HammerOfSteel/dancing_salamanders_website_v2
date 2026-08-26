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

- `app/music/page.tsx` — becomes a server component. Calls `getAlbums()` from [lib/music.ts](../../../lib/music.ts) directly and renders `<MusicPageClient albums={albums} />`.
- `app/music/[albumSlug]/page.tsx` — new. `generateStaticParams()` from `getAlbums()`; calls `getAlbumBySlug(slug)`, `notFound()` if missing. `generateMetadata()` returns `{ title: album.title, description: "An album by Dancing Salamanders", openGraph: { title: album.title, type: "music.album" } }` (the `og:image` itself comes from the sibling `opengraph-image.tsx`, not from this object). Renders `<MusicPageClient albums={albums} selectedAlbum={album} />`.
- `app/music/[albumSlug]/[trackNumber]/page.tsx` — new. Same as above. The `trackNumber` route param is matched against each track's `Track.trackNumber` field (not its array index — track numbers already start at 1 and may have gaps, per the parsing logic in `lib/music.ts`); `notFound()` if no track has a matching `trackNumber`. `generateMetadata()` returns `{ title: "${track.title} — ${album.title}", description: "An album by Dancing Salamanders", openGraph: { title: track.title, type: "music.song" } }`. Renders `<MusicPageClient albums={albums} selectedAlbum={album} initialTrackIndex={album.tracks.findIndex(t => t.trackNumber === urlTrackNumber)} />` — the array index is computed here, server-side, once; nothing downstream ever has to reconcile track numbers vs. array indices again.
- The existing `/api/music` route is left in place but is no longer used by the page itself.
- `app/books/novels/[slug]/page.tsx` is unchanged structurally (already has `generateStaticParams`/`generateMetadata`); only gets metadata/OG additions (see below).

**New client component:** `components/music/MusicPageClient.tsx` (replaces the current inline logic in `app/music/page.tsx`). Props: `{ albums: Album[]; selectedAlbum?: Album; initialTrackIndex?: number }`. Holds the existing `selected` state (initialized from `selectedAlbum` instead of `null`), renders `PageHero` + `AlbumDetail` + the album grid exactly as today, and owns the `router.push` calls and the mount-time `cueTrack` effect described below.

### Player state hydration & cueing

- New context action, added to the `PlayerActions` interface and provider in [lib/music-context.tsx](../../../lib/music-context.tsx) (does not exist today — this is net-new): `cueTrack(album: Album, trackIndex: number)` — mirrors `playTrack` (sets `audio.src`, calls `audio.load()`, updates `currentAlbum`/`currentTrackIndex`/`duration`, persists to `localStorage` under the existing `ds_player_last` key) but never calls `audio.play()`, so `isPlaying` stays `false` and the player bar shows a ready-to-tap Play control. `trackIndex` here is the array index into `album.tracks`, consistent with the other existing actions like `playTrack` — it is always an array index everywhere in this feature, never a raw `Track.trackNumber` value (see Routing above for where the URL's track number is converted).
- `MusicPageClient` calls `cueTrack(selectedAlbum, initialTrackIndex ?? 0)` once on mount, in a `useEffect` guarded by a `useRef` so it never re-fires on re-render, only when `selectedAlbum` is defined (skipped entirely on the base `/music` route) and `currentAlbum?.slug !== selectedAlbum.slug` (i.e. nothing from this album is already loaded/playing) — it never interrupts existing playback carried over from in-app navigation.
- User interactions keep the URL in sync via `router.push`:
  - Selecting an album → `/music/${album.slug}`.
  - Selecting a track → `/music/${album.slug}/${track.trackNumber}` + a real `playTrack(album, index)` call (direct user gesture, so autoplay is allowed here).
  - Deselecting an album → `/music`.
- Back/forward browser buttons work naturally since each state is a real route.

### Social preview image generation

- Uses Next's `opengraph-image` file convention (`next/og`'s `ImageResponse`), which auto-injects `og:image`/`twitter:image` meta tags.
- Shared helper `lib/og-image.tsx` exports `renderPreviewCard({ topText, subText, coverPath }: { topText: string; subText?: string; coverPath?: string }): ImageResponse`. It resolves `coverPath` (a `public/`-relative path like `/music/01_ordain/cover.jpg`) to an absolute filesystem path, reads it via `fs.readFileSync` + base64-encodes it to a data URI (skipped entirely if `coverPath` is undefined or the file doesn't exist), and returns a 1200×630 `ImageResponse` laid out as: `topText` (large, top) → `subText` if provided (smaller, directly under `topText`) → cover image (center, or nothing if unavailable) → "Dancing Salamanders" (bottom), on the site's dark brand background color (from `globals.css`), all in a default system sans-serif font.
- `app/music/[albumSlug]/opengraph-image.tsx` — calls `renderPreviewCard({ topText: album.title, coverPath: album.coverArt })`.
- `app/music/[albumSlug]/[trackNumber]/opengraph-image.tsx` — calls `renderPreviewCard({ topText: track.title, subText: album.title, coverPath: album.coverArt })`.
- `app/books/novels/[slug]/opengraph-image.tsx` — calls `renderPreviewCard({ topText: novel.meta.title, coverPath: novel.meta.coverImage })`.
- Standard 1200×630 OG size, exported `size`/`contentType` per the Next convention.

### Share buttons

- New `components/shared/ShareButton.tsx`: icon-only button (lucide-react `Share2` icon, same size/style as the existing icon buttons in `AlbumDetail`) taking props `{ url: string; title?: string; text?: string }`, where `url` is always passed in by the caller as a full absolute URL, e.g. `` url={`${process.env.NEXT_PUBLIC_SITE_URL}/music/${album.slug}`} ``. Uses `navigator.share({ title, text, url })` if available. Falls back to `navigator.clipboard.writeText(url)`, on success swapping the `Share2` icon for a `Check` icon (lucide-react) for 2 seconds (via local `useState` + `setTimeout`) as the "copied" confirmation, then reverting — no separate tooltip element needed. Reuses the existing `Button` component from `components/ui/button.tsx` with `variant="ghost"`, `size="icon"`.
- In `AlbumDetail`, one `ShareButton` is added next to the album title in the header (shares `/music/${album.slug}`). A second `ShareButton` is added inside each track `<li>`, positioned after the track title, sharing `/music/${album.slug}/${track.trackNumber}`. It follows the same visibility rule as the existing Play icon on inactive rows: hidden by default, shown on row hover (and always visible for the currently-active track, matching how the Pause/equalizer icon is always visible there).
- In `app/books/novels/[slug]/page.tsx`, one `ShareButton` is added next to the novel title in the `grimoire-title-block`, sharing `/books/novels/${slug}`.

### Novels/audiobooks

- `generateMetadata` in `app/books/novels/[slug]/page.tsx` currently returns only top-level `title`/`description` (used for the `<title>` tag and generic description meta tag). This is left as-is; an `openGraph: { title: novel.meta.title, description: novel.meta.excerpt }` object is added alongside it in the same returned object (OG tags are independent of the top-level fields, so this is additive, not a restructure). The `og:image` tag itself comes automatically from the sibling `opengraph-image.tsx` — no manual `images` field needed.
- A `ShareButton` is added near the novel title (see Share Buttons section above).
- No changes to audiobook playback, reading-position resume, or routing.

## Error Handling

- Invalid album slug or out-of-range track number → `notFound()` → standard Next 404.
- Missing cover art → OG image falls back to text-only card.
- `navigator.share()` cancellation or `clipboard` failure → fails silently (not a real error).

## Testing

- `tests/unit/music.test.ts` (existing file) gains cases for: `Track.trackNumber` → array-index resolution used by the `[trackNumber]` route (matching number found / not found), and the new `cueTrack` context action asserting `isPlaying` stays `false` while `currentAlbum`/`currentTrackIndex` update correctly.
- New `tests/smoke/music-links.test.ts`: requests `/music/[a real album slug]` and `/music/[album]/[a real track number]` (using `getAlbums()` to pick a real fixture rather than hardcoding), asserts HTTP 200 and that the response HTML contains the expected `<title>` and an `og:image` meta tag.
- Manual post-implementation check: validate real-world preview rendering via Facebook's Sharing Debugger and/or Twitter Card Validator (crawlers cache aggressively, so this is the only reliable way to confirm actual results).
