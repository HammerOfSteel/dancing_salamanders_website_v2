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

---

## Chunk 2: Share buttons, novels, and testing

### Task 9: Add `getAbsoluteUrl` helper and `ShareButton` component

**Files:**
- Modify: `lib/utils.ts`
- Create: `components/shared/ShareButton.tsx`

- [ ] **Step 1: Add `getAbsoluteUrl` to `lib/utils.ts`**

Append to the end of `lib/utils.ts` (keep the existing `cn` export as-is):

```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dancingsalamanders.com";

export function getAbsoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
```

- [ ] **Step 2: Create `components/shared/ShareButton.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  className?: string;
}

export function ShareButton({ url, title, text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled the share sheet, or the OS declined it — not an error.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write blocked (e.g. permissions) — not an error, fail silently.
    }
  };

  return (
    <Button
      type="button"
      onClick={handleShare}
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      aria-label={copied ? "Link copied" : "Share"}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
    </Button>
  );
}
```

Note: `type="button"` is set explicitly since this component will sometimes be rendered as a sibling of other interactive elements inside forms/rows — without it, a `<button>` defaults to `type="submit"` which could trigger unrelated form submissions.

- [ ] **Step 3: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: No new type errors.

- [ ] **Step 4: Commit**

```bash
git add lib/utils.ts components/shared/ShareButton.tsx
git commit -m "feat(shared): add ShareButton component and getAbsoluteUrl helper"
```

---

### Task 10: Wire `ShareButton` into `AlbumDetail`

**Files:**
- Modify: `components/music/AlbumDetail.tsx`

The current track row markup is a single `<button>` wrapping the entire row (number/indicator + title). Adding a `ShareButton` (itself a `<button>`) inside would create an invalid nested-button. This task restructures each track row into a flex container with two sibling buttons: the existing play/pause button (now `flex-1` instead of `w-full`) and the new `ShareButton`.

- [ ] **Step 1: Add imports**

At the top of `components/music/AlbumDetail.tsx`, add:

```tsx
import { ShareButton } from "@/components/shared/ShareButton";
import { getAbsoluteUrl } from "@/lib/utils";
```

- [ ] **Step 2: Add a `ShareButton` to the album header**

Change:

```tsx
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                <ListMusic className="h-3 w-3" /> Album
              </p>
              <h2 className="font-serif text-2xl font-semibold text-foreground leading-tight">
                {album.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}
              </p>
            </div>
```

to:

```tsx
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                <ListMusic className="h-3 w-3" /> Album
              </p>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-semibold text-foreground leading-tight">
                  {album.title}
                </h2>
                <ShareButton
                  url={getAbsoluteUrl(`/music/${album.slug}`)}
                  title={album.title}
                  text={`${album.title} — Dancing Salamanders`}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}
              </p>
            </div>
```

- [ ] **Step 3: Restructure each track row to add a `ShareButton` alongside the play button**

Change the `<li>` body from:

```tsx
                  <li key={track.src}>
                    <button
                      onClick={() => {
                        if (isTrackActive) togglePlay();
                        else {
                          playTrack(album, idx);
                          onTrackSelect?.(album, idx);
                        }
                      }}
                      className={cn(
                        "group w-full flex items-center gap-3 px-2 py-2 rounded-md text-left",
                        "transition-colors hover:bg-muted/60",
                        isTrackActive && "bg-muted/40"
                      )}
                      aria-label={`${isTrackPlaying ? "Pause" : "Play"} ${track.title}`}
                    >
```

to:

```tsx
                  <li key={track.src} className="group flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (isTrackActive) togglePlay();
                        else {
                          playTrack(album, idx);
                          onTrackSelect?.(album, idx);
                        }
                      }}
                      className={cn(
                        "flex-1 min-w-0 flex items-center gap-3 px-2 py-2 rounded-md text-left",
                        "transition-colors hover:bg-muted/60",
                        isTrackActive && "bg-muted/40"
                      )}
                      aria-label={`${isTrackPlaying ? "Pause" : "Play"} ${track.title}`}
                    >
```

(Note: `group` moved from the inner `<button>` to the `<li>`. The `group-hover:hidden`/`group-hover:block` classes further down, on the track-number/Play-icon swap, still work unchanged since they're still descendants of the element carrying `group` — hovering anywhere on the row, including over the new share button, now reveals the Play icon too, which is a harmless, arguably nicer, side effect.)

Then, immediately after the closing `</button>` of that track button (i.e. right before the existing `</li>`), add the `ShareButton`:

```tsx
                    </button>
                    <ShareButton
                      url={getAbsoluteUrl(`/music/${album.slug}/${track.trackNumber}`)}
                      title={track.title}
                      text={`${track.title} — ${album.title} — Dancing Salamanders`}
                      className={cn(
                        "flex-shrink-0 mr-1 transition-opacity",
                        isTrackActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    />
                  </li>
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes with no errors.

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev`, open `http://localhost:3000/music`, select an album.
- Hover the album title → a share icon appears next to it; click it (on desktop, without Web Share API support) → clipboard receives `https://www.dancingsalamanders.com/music/<slug>` (or your `NEXT_PUBLIC_SITE_URL`), icon briefly shows a checkmark.
- Hover a track row → a share icon fades in on the right; click it → clipboard receives the track URL.
- Confirm the currently-playing track's share icon is visible even without hovering.
- Confirm no browser console errors about nested `<button>` elements (React/DOM validation warnings).

- [ ] **Step 6: Commit**

```bash
git add components/music/AlbumDetail.tsx
git commit -m "feat(music): add share buttons to album header and track rows"
```

---

### Task 11: Add social preview image, metadata, and share button to novel pages

**Files:**
- Create: `app/books/novels/[slug]/opengraph-image.tsx`
- Modify: `app/books/novels/[slug]/page.tsx`

- [ ] **Step 1: Create the novel OG image route**

```tsx
import { getNovelBySlug } from "@/lib/novels";
import { renderPreviewCard } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);
  return renderPreviewCard({
    topText: novel?.meta.title ?? "Dancing Salamanders",
    coverPath: novel?.meta.coverImage,
  });
}
```

- [ ] **Step 2: Add `openGraph` fields to `generateMetadata` in `app/books/novels/[slug]/page.tsx`**

Change:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);
  if (!novel) return {};
  return {
    title: `${novel.meta.title} — ${novel.meta.collection}`,
    description: novel.meta.excerpt,
  };
}
```

to:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);
  if (!novel) return {};
  return {
    title: `${novel.meta.title} — ${novel.meta.collection}`,
    description: novel.meta.excerpt,
    openGraph: {
      title: novel.meta.title,
      description: novel.meta.excerpt,
    },
  };
}
```

- [ ] **Step 3: Add a `ShareButton` next to the novel title**

Add the import near the top of `app/books/novels/[slug]/page.tsx`:

```tsx
import { ShareButton } from "@/components/shared/ShareButton";
import { getAbsoluteUrl } from "@/lib/utils";
```

Change the title block from:

```tsx
            <div className="grimoire-ornament">✦ ✦ ✦</div>
            <h1 className="grimoire-title">{meta.title}</h1>
            {meta.year && <p className="grimoire-year">{meta.year}</p>}
```

to:

```tsx
            <div className="grimoire-ornament">✦ ✦ ✦</div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="grimoire-title">{meta.title}</h1>
              <ShareButton
                url={getAbsoluteUrl(`/books/novels/${slug}`)}
                title={meta.title}
                text={`${meta.title} — Dancing Salamanders`}
              />
            </div>
            {meta.year && <p className="grimoire-year">{meta.year}</p>}
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes with no errors; `app/books/novels/[slug]/opengraph-image` listed in route output.

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev`.
- Open `http://localhost:3000/books/novels/<a real novel slug>` → a share icon appears next to the title on page 1 (it's inside the `currentPage === 1` block, so it won't show on later pages — this matches the existing behavior where the title block itself only renders on page 1).
- Open `http://localhost:3000/books/novels/<slug>/opengraph-image` → confirm it renders a 1200×630 PNG with the novel title, cover, and "Dancing Salamanders".

- [ ] **Step 6: Commit**

```bash
git add "app/books/novels/[slug]/opengraph-image.tsx" "app/books/novels/[slug]/page.tsx"
git commit -m "feat(novels): add social preview image, OG metadata, and share button"
```

---

### Task 12: Add smoke test script for the new routes

**Files:**
- Create: `tests/smoke/music-links.mjs`

This follows the existing convention in `tests/smoke/music-http.mjs`: a standalone Node script run manually against a live/deployed server (not part of `npm test`), rather than a Vitest test (there's no running Next server during `vitest run`).

- [ ] **Step 1: Create the script**

```js
#!/usr/bin/env node
// [MusicSmoke] Deep-link smoke test.
// For each of a few real albums (and their first track), requests the
// album page, the track page, and both opengraph-image routes, checking
// for HTTP 200 and the expected <title>/og:image content.
//
// Usage: node tests/smoke/music-links.mjs [baseUrl]
//   baseUrl defaults to https://dancingsalamanders.com

const BASE = process.argv[2] || "https://dancingsalamanders.com";

async function checkPage(path, expectedTitleFragment) {
  const res = await fetch(`${BASE}${path}`);
  const body = await res.text();
  const ok = res.status === 200;
  const hasTitle = body.includes(expectedTitleFragment);
  const hasOgImage = /property="og:image"/.test(body);
  console.log(
    `${ok && hasTitle && hasOgImage ? "PASS" : "FAIL"} ${path} — status=${res.status} title=${hasTitle} og:image=${hasOgImage}`
  );
  return ok && hasTitle && hasOgImage;
}

async function main() {
  const res = await fetch(`${BASE}/api/music`);
  if (!res.ok) {
    console.error(`[FATAL] /api/music returned ${res.status}`);
    process.exit(2);
  }
  const albums = await res.json();
  if (albums.length === 0) {
    console.error("[FATAL] no albums returned by /api/music — nothing to test");
    process.exit(2);
  }

  const album = albums[0];
  const track = album.tracks[0];

  const results = await Promise.all([
    checkPage(`/music/${album.slug}`, album.title),
    checkPage(`/music/${album.slug}/${track.trackNumber}`, track.title),
  ]);

  const allPassed = results.every(Boolean);
  console.log(allPassed ? "\nAll checks passed." : "\nSome checks FAILED.");
  process.exit(allPassed ? 0 : 1);
}

main();
```

- [ ] **Step 2: Run it against a local dev server**

Run: `npm run dev` (in one terminal), then in another: `node tests/smoke/music-links.mjs http://localhost:3000`
Expected: Both checks print `PASS`, final line `All checks passed.`, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add tests/smoke/music-links.mjs
git commit -m "test(smoke): add deep-link smoke test for music album/track routes"
```

---

### Task 13: Full regression pass and manual social-preview verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: All tests pass, including `tests/unit/music.test.ts` and `tests/unit/music-context.test.tsx`.

- [ ] **Step 2: Run a full production build**

Run: `npm run build`
Expected: Build succeeds with no type errors; route output lists `/music`, `/music/[albumSlug]`, `/music/[albumSlug]/[trackNumber]`, their `opengraph-image` routes, and `/books/novels/[slug]/opengraph-image`.

- [ ] **Step 3: Manual end-to-end pass in the browser**

Run: `npm run dev`. Walk through:
- `/music` → select album → select track → confirm URL updates at each step and playback continues correctly.
- Copy a track URL, open it in a new private/incognito window → confirm the track is cued (not playing) and the player bar shows it ready to tap Play.
- Repeat for a novel page share link.

- [ ] **Step 4: Validate real-world social previews (post-deploy only)**

Once deployed, paste a `/music/<album>`, a `/music/<album>/<track>`, and a `/books/novels/<slug>` URL into:
- Facebook Sharing Debugger (`https://developers.facebook.com/tools/debug/`)
- Twitter/X Card Validator

Expected: Each shows the correct title/subtitle, cover art, and "Dancing Salamanders" in the preview. If a stale/missing preview appears, use the debugger's "Scrape Again" option — social platforms cache aggressively and may show an old or blank result until re-scraped.

This step can't be completed until the changes are deployed; note it as an open follow-up if closing out this plan before deploying.

**End of Chunk 2.**

