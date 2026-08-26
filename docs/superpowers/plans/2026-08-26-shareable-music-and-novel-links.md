# Shareable Music & Novel Links Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let people share direct links to a specific album, a specific track, or a novel, with rich social preview cards (title / cover art / "Dancing Salamanders"), and land on a page that's cued up ready to play.

**Architecture:** Convert `/music` from a fully client-rendered page into server components (`/music`, `/music/[albumSlug]`, `/music/[albumSlug]/[trackNumber]`) that use the existing `getAlbums()`/`getAlbumBySlug()` server-side data functions, paired with a new `MusicPageClient` component for the interactive parts. Social preview images are generated via Next's `opengraph-image` file convention (`next/og`). A new `cueTrack` player action loads a track without auto-playing it. A shared `ShareButton` component provides explicit share/copy-link affordances on music and novel pages.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Vitest, `next/og` (`ImageResponse`), Web Share API / Clipboard API.

**Spec:** [docs/superpowers/specs/2026-08-26-shareable-music-and-novel-links-design.md](../specs/2026-08-26-shareable-music-and-novel-links-design.md)

**Note on deviations from the spec:** The spec's Testing section named a hypothetical `tests/smoke/music-links.test.ts`. This repo's actual smoke-test convention (see `tests/smoke/music-http.mjs`) is a standalone Node script run manually against a live/deployed server, not a Vitest spec file (there's no local server to hit during `vitest run`). This plan follows that existing convention instead: `tests/smoke/music-links.mjs`. This is a naming/tooling detail only — it does not change scope or architecture.

---

## Chunk 1: Data layer, player action, and routing

### Task 1: Add `findTrackIndexByNumber` helper to `lib/music.ts`

**Files:**
- Modify: `lib/music.ts`
- Test: `tests/unit/music.test.ts`

- [ ] **Step 1: Write the failing test**

Add this `describe` block to the end of `tests/unit/music.test.ts` (inside the existing file, after the last test, before the final closing — the file already imports `getAlbums` from `"../../lib/music"` at the top; add `findTrackIndexByNumber` to that same import):

```ts
// Change the existing import line near the top of the file from:
//   import { getAlbums } from "../../lib/music";
// to:
import { getAlbums, findTrackIndexByNumber } from "../../lib/music";
```

```ts
describe("[MusicLib] findTrackIndexByNumber()", () => {
  it("returns the array index of the track with the matching trackNumber", () => {
    const albums = getAlbums();
    const gw = albums.find((a) => a.slug === "Glitch-witch")!;
    // Glitch-witch has two tracks: trackNumber 1 and 2, at array indices 0 and 1.
    expect(findTrackIndexByNumber(gw, 1)).toBe(0);
    expect(findTrackIndexByNumber(gw, 2)).toBe(1);
  });

  it("returns -1 when no track has that trackNumber", () => {
    const albums = getAlbums();
    const gw = albums.find((a) => a.slug === "Glitch-witch")!;
    expect(findTrackIndexByNumber(gw, 99)).toBe(-1);
    expect(findTrackIndexByNumber(gw, 0)).toBe(-1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/music.test.ts`
Expected: FAIL — `findTrackIndexByNumber is not exported from "../../lib/music"` (or a TypeScript compile error to that effect).

- [ ] **Step 3: Write minimal implementation**

In `lib/music.ts`, add this function directly below the existing `getAlbumBySlug` function (at the end of the file):

```ts
export function findTrackIndexByNumber(album: Album, trackNumber: number): number {
  return album.tracks.findIndex((t) => t.trackNumber === trackNumber);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/music.test.ts`
Expected: PASS (all tests in the file, including the two new ones)

- [ ] **Step 5: Commit**

```bash
git add lib/music.ts tests/unit/music.test.ts
git commit -m "feat(music): add findTrackIndexByNumber helper"
```

---

### Task 2: Add `cueTrack` player action to `lib/music-context.tsx`

**Files:**
- Modify: `lib/music-context.tsx`
- Test: `tests/unit/music-context.test.tsx` (new)

- [ ] **Step 1: Install test dependencies**

The project has no React component/hook testing tooling yet. Add it:

```bash
npm install -D @testing-library/react jsdom
```

- [ ] **Step 2: Write the failing test**

Create `tests/unit/music-context.test.tsx`:

```tsx
// @vitest-environment jsdom
//
// [MusicContext] Unit test for the cueTrack player action.
// Uses jsdom so `new Audio()` / localStorage are available; audio.play()/.load()
// are stubbed no-ops in jsdom (logged as "not implemented" but do not throw),
// which is fine here since cueTrack never calls .play().

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MusicPlayerProvider, useMusicPlayer } from "../../lib/music-context";
import type { Album } from "../../lib/music-context";

const album: Album = {
  slug: "test-album",
  title: "Test Album",
  coverArt: "/music/test-album/cover.jpg",
  tracks: [
    { title: "Track One", src: "/music/test-album/01.mp3", trackNumber: 1 },
    { title: "Track Two", src: "/music/test-album/02.mp3", trackNumber: 2 },
  ],
};

describe("useMusicPlayer().cueTrack", () => {
  it("loads the given track and updates state without playing it", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider,
    });

    act(() => {
      result.current.cueTrack(album, 1);
    });

    expect(result.current.currentAlbum?.slug).toBe("test-album");
    expect(result.current.currentTrackIndex).toBe(1);
    expect(result.current.isPlaying).toBe(false);
  });

  it("does nothing if the trackIndex is out of range", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider,
    });

    act(() => {
      result.current.cueTrack(album, 99);
    });

    expect(result.current.currentAlbum).toBeNull();
    expect(result.current.currentTrackIndex).toBe(0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- tests/unit/music-context.test.tsx`
Expected: FAIL — `result.current.cueTrack is not a function`

- [ ] **Step 4: Write minimal implementation**

In `lib/music-context.tsx`, add `cueTrack` to the `PlayerActions` interface:

```ts
interface PlayerActions {
  playAlbum: (album: Album, trackIndex?: number) => void;
  playTrack: (album: Album, trackIndex: number) => void;
  cueTrack: (album: Album, trackIndex: number) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
}
```

Add the implementation directly below the existing `playTrack` definition inside `MusicPlayerProvider`:

```ts
  const playTrack = useCallback(
    (album: Album, trackIndex: number) => loadAndPlay(album, trackIndex),
    [loadAndPlay]
  );

  const cueTrack = useCallback((album: Album, trackIndex: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = album.tracks[trackIndex];
    if (!track) return;

    audio.src = track.src;
    audio.load();

    setCurrentAlbum(album);
    setCurrentTrackIndex(trackIndex);

    localStorage.setItem(
      LAST_PLAYED_KEY,
      JSON.stringify({ albumSlug: album.slug, trackIndex })
    );
  }, []);
```

Add `cueTrack` to the `value` object returned by the provider:

```ts
  const value: PlayerState & PlayerActions = {
    currentAlbum,
    currentTrackIndex,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    playAlbum,
    playTrack,
    cueTrack,
    pause,
    resume,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
  };
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/unit/music-context.test.tsx`
Expected: PASS (both tests)

- [ ] **Step 6: Run the full test suite to check for regressions**

Run: `npm test`
Expected: PASS (all existing tests plus the two new test files)

- [ ] **Step 7: Commit**

```bash
git add lib/music-context.tsx tests/unit/music-context.test.tsx package.json package-lock.json
git commit -m "feat(music): add cueTrack player action for deep-link hydration"
```

---

### Task 3: Extract `MusicPageClient` from `app/music/page.tsx`

**Files:**
- Create: `components/music/MusicPageClient.tsx`
- Modify: `app/music/page.tsx`

This repo has no existing convention for testing React page/UI components (no `@testing-library/react` render tests, no Storybook) — `AlbumCard`, `AlbumDetail`, and the current `app/music/page.tsx` are all untested today. This task follows that existing convention: no new component-render tests are added here. Correctness is verified via `npm run build` (Step 3) and manually in the browser (Step 4), and end-to-end route behavior is covered by the smoke test in Task 8.

- [ ] **Step 1: Create `components/music/MusicPageClient.tsx`**

This is the current body of `app/music/page.tsx`, moved into its own client component, with `albums` as a prop instead of being fetched client-side, and `selected` initialized from a new `selectedAlbum` prop instead of always starting `null`:

```tsx
"use client";

import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { AlbumCard } from "@/components/music/AlbumCard";
import { AlbumDetail } from "@/components/music/AlbumDetail";
import { FadeInView } from "@/components/shared/FadeInView";
import type { Album } from "@/lib/music-context";

interface MusicPageClientProps {
  albums: Album[];
  selectedAlbum?: Album;
}

export function MusicPageClient({ albums, selectedAlbum }: MusicPageClientProps) {
  const [selected, setSelected] = useState<Album | null>(selectedAlbum ?? null);

  return (
    <div className="pb-32">
      <PageHero
        title="Music"
        subtitle="All albums — self-hosted, streamed right from here."
        size="sm"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Selected album detail panel */}
        {selected && (
          <FadeInView className="mb-10">
            <AlbumDetail album={selected} />
          </FadeInView>
        )}

        {/* Album grid */}
        {albums.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="font-serif text-xl mb-2">No albums yet</p>
            <p className="text-sm">
              Add albums to <code className="text-xs bg-muted px-1 rounded">public/music/</code> — see the README for the folder format.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              {albums.length} Album{albums.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album, i) => (
                <FadeInView key={album.slug} delay={i * 0.04}>
                  <AlbumCard
                    album={album}
                    onSelect={(a) => setSelected((prev) => (prev?.slug === a.slug ? null : a))}
                  />
                </FadeInView>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

(Note: this step alone is a like-for-like move — no `router.push` or `cueTrack` wiring yet. That's added in Task 5, once the dynamic routes it needs to push to actually exist.)

- [ ] **Step 2: Replace `app/music/page.tsx` with the server component**

```tsx
import { getAlbums } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";

export default function MusicPage() {
  const albums = getAlbums();
  return <MusicPageClient albums={albums} />;
}
```

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes with no type or compile errors, and `/music` is listed in the route output.

- [ ] **Step 4: Manually verify in the browser**

Run: `npm run dev`, open `http://localhost:3000/music`.
Expected: Page looks and behaves exactly as before this change — album grid renders, clicking an album shows/hides its `AlbumDetail`, playback still works.

- [ ] **Step 5: Commit**

```bash
git add app/music/page.tsx components/music/MusicPageClient.tsx
git commit -m "refactor(music): extract MusicPageClient, render /music as a server component"
```

---

### Task 4: Add `app/music/[albumSlug]/page.tsx`

**Files:**
- Create: `app/music/[albumSlug]/page.tsx`

- [ ] **Step 1: Create the route**

```tsx
import { notFound } from "next/navigation";
import { getAlbums, getAlbumBySlug } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ albumSlug: string }>;
}

export async function generateStaticParams() {
  return getAlbums().map((a) => ({ albumSlug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) return {};
  return {
    title: album.title,
    description: "An album by Dancing Salamanders",
    openGraph: { title: album.title, type: "music.album" },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { albumSlug } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) notFound();

  const albums = getAlbums();
  return <MusicPageClient albums={albums} selectedAlbum={album} />;
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes; `/music/[albumSlug]` is listed in the route output as a static/SSG route, with one generated path per album.

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`, open `http://localhost:3000/music/<a real album slug>` (check `public/music/` for real folder names, e.g. the ones in `tests/unit/music.test.ts` fixtures won't exist on disk — use whatever album folders actually exist under `public/music/` locally).
Expected: Page loads with that album's `AlbumDetail` already expanded/shown; visiting `http://localhost:3000/music/not-a-real-album` returns the standard Next 404 page.

- [ ] **Step 4: Commit**

```bash
git add app/music/[albumSlug]/page.tsx
git commit -m "feat(music): add /music/[albumSlug] route with static params and metadata"
```

---

### Task 5: Add `app/music/[albumSlug]/[trackNumber]/page.tsx` and wire up URL sync + cueing in `MusicPageClient`

**Files:**
- Create: `app/music/[albumSlug]/[trackNumber]/page.tsx`
- Modify: `components/music/MusicPageClient.tsx`

- [ ] **Step 1: Create the track route**

```tsx
import { notFound } from "next/navigation";
import { getAlbums, getAlbumBySlug, findTrackIndexByNumber } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ albumSlug: string; trackNumber: string }>;
}

export async function generateStaticParams() {
  return getAlbums().flatMap((a) =>
    a.tracks.map((t) => ({ albumSlug: a.slug, trackNumber: String(t.trackNumber) }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug, trackNumber } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) return {};
  const trackIndex = findTrackIndexByNumber(album, Number(trackNumber));
  const track = album.tracks[trackIndex];
  if (!track) return {};
  return {
    title: `${track.title} — ${album.title}`,
    description: "An album by Dancing Salamanders",
    openGraph: { title: track.title, type: "music.song" },
  };
}

export default async function TrackPage({ params }: Props) {
  const { albumSlug, trackNumber } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) notFound();

  const trackIndex = findTrackIndexByNumber(album, Number(trackNumber));
  if (trackIndex === -1) notFound();

  const albums = getAlbums();
  return <MusicPageClient albums={albums} selectedAlbum={album} initialTrackIndex={trackIndex} />;
}
```

- [ ] **Step 2: Wire up `router.push` and mount-time `cueTrack` in `MusicPageClient`**

Replace the full contents of `components/music/MusicPageClient.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { AlbumCard } from "@/components/music/AlbumCard";
import { AlbumDetail } from "@/components/music/AlbumDetail";
import { FadeInView } from "@/components/shared/FadeInView";
import { useMusicPlayer } from "@/lib/music-context";
import type { Album } from "@/lib/music-context";

interface MusicPageClientProps {
  albums: Album[];
  selectedAlbum?: Album;
  initialTrackIndex?: number;
}

export function MusicPageClient({ albums, selectedAlbum, initialTrackIndex }: MusicPageClientProps) {
  const router = useRouter();
  const { currentAlbum, cueTrack } = useMusicPlayer();
  const [selected, setSelected] = useState<Album | null>(selectedAlbum ?? null);

  // Cue the shared track/album on first load, without stealing focus from
  // whatever might already be playing (e.g. carried over via in-app navigation).
  const hasCued = useRef(false);
  useEffect(() => {
    if (hasCued.current) return;
    hasCued.current = true;
    if (!selectedAlbum) return;
    if (currentAlbum?.slug === selectedAlbum.slug) return;
    cueTrack(selectedAlbum, initialTrackIndex ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAlbum = (album: Album) => {
    if (selected?.slug === album.slug) {
      setSelected(null);
      router.push("/music");
    } else {
      setSelected(album);
      router.push(`/music/${album.slug}`);
    }
  };

  const handleSelectTrack = (album: Album, trackIndex: number) => {
    // Playback itself is already triggered by AlbumDetail's own click handler
    // (which calls playTrack directly before invoking this callback) — this
    // handler is only responsible for keeping the URL in sync.
    router.push(`/music/${album.slug}/${album.tracks[trackIndex].trackNumber}`);
  };

  return (
    <div className="pb-32">
      <PageHero
        title="Music"
        subtitle="All albums — self-hosted, streamed right from here."
        size="sm"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Selected album detail panel */}
        {selected && (
          <FadeInView className="mb-10">
            <AlbumDetail album={selected} onTrackSelect={handleSelectTrack} />
          </FadeInView>
        )}

        {/* Album grid */}
        {albums.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="font-serif text-xl mb-2">No albums yet</p>
            <p className="text-sm">
              Add albums to <code className="text-xs bg-muted px-1 rounded">public/music/</code> — see the README for the folder format.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              {albums.length} Album{albums.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album, i) => (
                <FadeInView key={album.slug} delay={i * 0.04}>
                  <AlbumCard album={album} onSelect={handleSelectAlbum} />
                </FadeInView>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

Note: `AlbumCard`'s existing `onSelect` callback already fires on every click (it also calls `playAlbum`/`togglePlay` internally via its own `useMusicPlayer()` call) — `handleSelectAlbum` here only needs to manage the URL/selection-state side, which is what it does above. `AlbumDetail` gains a new `onTrackSelect` prop, wired in Task 6.

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: Build fails at this exact point with a TypeScript error on `<AlbumDetail album={selected} onTrackSelect={handleSelectTrack} />` — `onTrackSelect` doesn't exist on `AlbumDetail`'s props yet. This is expected; Task 6 adds it. Do not treat this as a regression — proceed directly to Task 6 before attempting to verify the build again.

- [ ] **Step 4: Commit**

```bash
git add app/music/[albumSlug]/[trackNumber]/page.tsx components/music/MusicPageClient.tsx
git commit -m "feat(music): add /music/[albumSlug]/[trackNumber] route, wire URL sync + cueing"
```

---

### Task 6: Add `onTrackSelect` prop to `AlbumDetail` and `ShareButton` placeholders

**Files:**
- Modify: `components/music/AlbumDetail.tsx`

This task only wires the new callback prop through so the app builds again; the actual `ShareButton` UI is added in Chunk 2 (Task 9/10), once the `ShareButton` component itself exists.

- [ ] **Step 1: Add the prop and call it from the track button's click handler**

In `components/music/AlbumDetail.tsx`, change the props interface:

```tsx
interface AlbumDetailProps {
  album: Album;
  onTrackSelect?: (album: Album, trackIndex: number) => void;
}

export function AlbumDetail({ album, onTrackSelect }: AlbumDetailProps) {
```

In the track `<button onClick={...}>` handler, call the new callback alongside the existing playback logic:

```tsx
                    <button
                      onClick={() => {
                        if (isTrackActive) togglePlay();
                        else {
                          playTrack(album, idx);
                          onTrackSelect?.(album, idx);
                        }
                      }}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes with no errors, `/music`, `/music/[albumSlug]`, and `/music/[albumSlug]/[trackNumber]` all listed in the route output.

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`.
- Open `http://localhost:3000/music`, click an album → address bar updates to `/music/<slug>`.
- Click a track → it plays, address bar updates to `/music/<slug>/<trackNumber>`.
- Click browser Back → returns to `/music/<slug>` (album view, still selected).
- Open `http://localhost:3000/music/<slug>/<trackNumber>` directly (fresh load, nothing playing) → that track is cued in the player bar (visible, ready to play) but NOT auto-playing.
- While a track is playing, navigate back to `/music` and open a *different* track's URL by pasting it into the address bar and hitting Enter (full reload) → confirm the newly-opened track is now cued (this is a fresh page load each time, so `hasCued` always starts `false` — the "don't steal focus" guard only matters for client-side navigations within the same page session, which don't happen here since routes are always full pages).

- [ ] **Step 4: Commit**

```bash
git add components/music/AlbumDetail.tsx
git commit -m "feat(music): wire onTrackSelect callback through AlbumDetail"
```

---

### Task 7: Add `lib/og-image.tsx` shared preview-card renderer

**Files:**
- Create: `lib/og-image.tsx`

- [ ] **Step 1: Create the helper**

```tsx
import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Approximate hex equivalents of the oklch brand colors in app/globals.css
// (satori, which ImageResponse uses to render, does not support oklch()).
const BG_COLOR = "#141b10"; // deep forest night
const TEXT_COLOR = "#f2ecdd"; // warm cream
const ACCENT_COLOR = "#c98a4b"; // amber ember

function coverArtDataUri(coverPath: string): string | null {
  try {
    // coverPath is a public/-relative URL like "/music/01_ordain/cover.jpg" —
    // strip the leading slash before joining, or path.join would discard
    // the preceding segments and return coverPath unchanged.
    const relativePath = coverPath.replace(/^\//, "");
    const absolutePath = path.join(process.cwd(), "public", relativePath);
    if (!fs.existsSync(absolutePath)) return null;
    const ext = path.extname(absolutePath).slice(1) || "jpeg";
    const mime = ext === "jpg" ? "jpeg" : ext;
    const bytes = fs.readFileSync(absolutePath);
    return `data:image/${mime};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

interface PreviewCardOptions {
  topText: string;
  subText?: string;
  coverPath?: string;
}

export function renderPreviewCard({ topText, subText, coverPath }: PreviewCardOptions): ImageResponse {
  const coverDataUri = coverPath ? coverArtDataUri(coverPath) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          backgroundColor: BG_COLOR,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", fontSize: 56, fontWeight: 600, color: TEXT_COLOR }}>
            {topText}
          </div>
          {subText && (
            <div style={{ display: "flex", fontSize: 32, color: ACCENT_COLOR }}>{subText}</div>
          )}
        </div>

        {coverDataUri && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverDataUri}
            width={280}
            height={280}
            style={{ borderRadius: 12, objectFit: "cover" }}
          />
        )}

        <div style={{ display: "flex", fontSize: 28, color: ACCENT_COLOR }}>Dancing Salamanders</div>
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: No new type errors introduced by this file.

- [ ] **Step 3: Commit**

```bash
git add lib/og-image.tsx
git commit -m "feat(og): add shared renderPreviewCard helper for social preview images"
```

---

### Task 8: Add `opengraph-image.tsx` routes for music albums and tracks

**Files:**
- Create: `app/music/[albumSlug]/opengraph-image.tsx`
- Create: `app/music/[albumSlug]/[trackNumber]/opengraph-image.tsx`

- [ ] **Step 1: Create the album-level OG image route**

```tsx
import { getAlbumBySlug } from "@/lib/music";
import { renderPreviewCard } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ albumSlug: string }> }) {
  const { albumSlug } = await params;
  const album = getAlbumBySlug(albumSlug);
  return renderPreviewCard({
    topText: album?.title ?? "Dancing Salamanders",
    coverPath: album?.coverArt,
  });
}
```

- [ ] **Step 2: Create the track-level OG image route**

```tsx
import { getAlbumBySlug, findTrackIndexByNumber } from "@/lib/music";
import { renderPreviewCard } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ albumSlug: string; trackNumber: string }>;
}) {
  const { albumSlug, trackNumber } = await params;
  const album = getAlbumBySlug(albumSlug);
  const track = album ? album.tracks[findTrackIndexByNumber(album, Number(trackNumber))] : undefined;
  return renderPreviewCard({
    topText: track?.title ?? "Dancing Salamanders",
    subText: album?.title,
    coverPath: album?.coverArt,
  });
}
```

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes; no new errors.

- [ ] **Step 4: Manually verify the images render**

Run: `npm run dev`, then open in a browser:
- `http://localhost:3000/music/<a real album slug>/opengraph-image`
- `http://localhost:3000/music/<a real album slug>/<a real track number>/opengraph-image`

Expected: Both return a 1200×630 PNG showing the branded background, title(s), cover art, and "Dancing Salamanders".

- [ ] **Step 5: Commit**

```bash
git add "app/music/[albumSlug]/opengraph-image.tsx" "app/music/[albumSlug]/[trackNumber]/opengraph-image.tsx"
git commit -m "feat(og): generate social preview images for album and track routes"
```

**End of Chunk 1.**
