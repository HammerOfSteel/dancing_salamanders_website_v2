# Phase 3 — Music System (Self-Hosted Player)

**Status: mostly done.** The core scanner, context, API route, and player UI all
exist. `public/music/` only has the README placeholder so far — no real albums have
been dropped in yet (see Phase 11).

## 3a — Filesystem Scanner (Back-end)

- [x] `lib/music.ts` — album/track scanner
- [x] `app/api/music/route.ts` — GET endpoint returning albums as JSON
- [ ] Unit tests for the album scanner — no `tests/` directory exists in the repo

## 3b — Player State

- [x] `lib/music-context.tsx` — `MusicPlayerContext` (play/pause/seek/volume, etc.)
- [x] `app/layout.tsx` wrapped with the music provider

## 3c — Player UI

- [x] `components/music/PlayerBar.tsx`
- [ ] `components/music/MiniPlayer.tsx` — **not found**; only `PlayerBar` and
      `AlbumCard`/`AlbumDetail` exist. Decide if a separate mini variant is still
      wanted or if `AlbumCard`'s own hover/play affordance already covers this.

## 3d — Music Page

- [x] `app/music/page.tsx`
- [x] `components/music/AlbumCard.tsx`
- [x] `components/music/AlbumDetail.tsx`
- [ ] `components/music/TrackList.tsx` as a separate component — not found as its own
      file; track listing appears to live inline inside `AlbumDetail.tsx`. Fine as-is
      unless it needs to be reused elsewhere.
- [ ] End-to-end play-flow test (select album → play → navigate away → player
      persists → come back) — not verified
- [ ] Mobile UX pass on the music page — not verified
