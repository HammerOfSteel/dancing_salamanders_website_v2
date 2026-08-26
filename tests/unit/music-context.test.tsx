// @vitest-environment jsdom
//
// [MusicContext] Unit test for the cueTrack player action.
// Uses jsdom so `new Audio()` / localStorage are available; audio.play()/.load()
// are stubbed no-ops in jsdom (logged as "not implemented" but do not throw),
// which is fine here since cueTrack never calls .play().
// `npm test`/`npm test:watch` require NODE_OPTIONS=--no-experimental-webstorage
// (set in package.json scripts) to avoid a Node v26 vs jsdom localStorage conflict.

import { describe, it, expect, vi } from "vitest";
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
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider,
    });

    act(() => {
      result.current.cueTrack(album, 1);
    });

    expect(result.current.currentAlbum?.slug).toBe("test-album");
    expect(result.current.currentTrackIndex).toBe(1);
    expect(result.current.isPlaying).toBe(false);
    expect(playSpy).not.toHaveBeenCalled();

    playSpy.mockRestore();
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
