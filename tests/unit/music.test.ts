/**
 * Unit tests for lib/music.ts — getAlbums() URL generation.
 *
 * These tests use a mocked filesystem so they run without any real
 * public/music directory. They lock in the contract:
 *   "For every track, track.src must be a URL whose path exactly
 *    matches the real file path relative to public/"
 *
 * RED: Run before any fix to see the current failure.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";

// ── Mock fs BEFORE importing the module under test ─────────────────────────
// This is required because lib/music.ts calls fs at module evaluation time.
vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");

  // Virtual filesystem: albumFolder → { files, subdirs }
  const MOCK_FS: Record<string, string[]> = {
    // Top-level music dir
    "/mock/cwd/public/music": ["Aitho", "Glitch-witch", "Sundry", "Var-var-det-jag-sa", "Daffodil"],

    // Working album — simple name, one mp3
    "/mock/cwd/public/music/Aitho": [".DS_Store", "cover.jpg", "01 - pelican.mp3"],

    // Failing album — hyphenated folder, parentheses in track name
    "/mock/cwd/public/music/Glitch-witch": [
      "cover.jpg",
      "01 - bless this mess (and all its variables).mp3",
      "02 - magpie logging.mp3",
    ],

    // Failing album — hyphenated folder, no special chars in track names
    "/mock/cwd/public/music/Sundry": [
      "cover.jpg",
      "01 - feathers.mp3",
      "02 - kindling.mp3",
    ],

    // Failing album — hyphens in name, non-ASCII track names
    "/mock/cwd/public/music/Var-var-det-jag-sa": [
      "cover.jpg",
      "01 - självuppfyllande.mp3",
    ],

    // Working album — nested subfolder
    "/mock/cwd/public/music/Daffodil": ["daffodil"],
    "/mock/cwd/public/music/Daffodil/daffodil": [
      "cover.jpg",
      "01 - Dancing salamanders - Tŷ Bach Twt.mp3",
    ],
  };

  return {
    ...actual,
    existsSync: (p: string) => p in MOCK_FS || Object.keys(MOCK_FS).some(k => k.startsWith(p + "/")),
    readdirSync: (p: string, opts?: { withFileTypes?: boolean }) => {
      const key = p.toString();
      const entries = MOCK_FS[key] ?? [];
      if (opts?.withFileTypes) {
        return entries.map((name) => ({
          name,
          isDirectory: () => `${key}/${name}` in MOCK_FS,
        }));
      }
      return entries;
    },
  };
});

// Mock process.cwd() to return our fake root
vi.spyOn(process, "cwd").mockReturnValue("/mock/cwd");

// ── Import AFTER mocks are set up ──────────────────────────────────────────
import { getAlbums, findTrackIndexByNumber } from "../../lib/music";

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Given a track src URL like "/music/Glitch-witch/01 - bless.mp3",
 * return the filesystem path it maps to: "/mock/cwd/public/music/Glitch-witch/01 - bless.mp3"
 *
 * The contract: src.replace(/^\/music\//, "") should be a valid path
 * under public/music in the mock FS.
 */
function srcToFsPath(src: string): string {
  // src is "/music/<album>/<file>" or "/music/<album>/<sub>/<file>"
  const relative = src.replace(/^\/music\//, "");
  return path.join("/mock/cwd", "public", "music", relative);
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("[MusicLib] getAlbums() URL generation", () => {
  it("returns an album entry for every top-level directory", () => {
    const albums = getAlbums();
    const slugs = albums.map((a) => a.slug).sort();
    expect(slugs).toEqual(["Aitho", "Daffodil", "Glitch-witch", "Sundry", "Var-var-det-jag-sa"].sort());
  });

  it("every track src starts with /music/", () => {
    const albums = getAlbums();
    for (const album of albums) {
      for (const track of album.tracks) {
        expect(track.src, `${album.slug} / ${track.title}`).toMatch(/^\/music\//);
      }
    }
  });

  it("every track src maps back to an existing file in the mock filesystem", () => {
    // This is the regression test:
    // If a track URL doesn't map to a real file, Next.js will 404 it.
    const albums = getAlbums();
    const { readdirSync } = require("fs");

    for (const album of albums) {
      for (const track of album.tracks) {
        const fsPath = srcToFsPath(track.src);
        const dir = path.dirname(fsPath);
        const filename = path.basename(fsPath);

        const dirContents = readdirSync(dir) as string[];
        expect(
          dirContents,
          `[${album.slug}] track "${track.title}" — src="${track.src}" — dir "${dir}" should contain "${filename}"`
        ).toContain(filename);
      }
    }
  });

  it("Glitch-witch tracks have correct src paths including parentheses", () => {
    const albums = getAlbums();
    const gw = albums.find((a) => a.slug === "Glitch-witch");
    expect(gw, "Glitch-witch album should exist").toBeDefined();
    expect(gw!.tracks[0].src).toBe(
      "/music/Glitch-witch/01 - bless this mess (and all its variables).mp3"
    );
  });

  it("Var-var-det-jag-sa tracks have correct src paths with non-ASCII chars", () => {
    const albums = getAlbums();
    const vv = albums.find((a) => a.slug === "Var-var-det-jag-sa");
    expect(vv, "Var-var-det-jag-sa album should exist").toBeDefined();
    expect(vv!.tracks[0].src).toBe("/music/Var-var-det-jag-sa/01 - självuppfyllande.mp3");
  });

  it("Daffodil nested subfolder tracks have correct src paths", () => {
    const albums = getAlbums();
    const daff = albums.find((a) => a.slug === "Daffodil");
    expect(daff, "Daffodil album should exist").toBeDefined();
    expect(daff!.tracks[0].src).toBe(
      "/music/Daffodil/daffodil/01 - Dancing salamanders - Tŷ Bach Twt.mp3"
    );
  });
});

describe("[MusicLib] findTrackIndexByNumber()", () => {
  // NOTE: the fs mock above does not intercept lib/music.ts's fs calls in this
  // Vitest version (pre-existing issue, see other failing tests in this file),
  // so getAlbums() here reads the real public/music directory. Using the real
  // "glitch_witch" album (public/music/09_glitch_witch), which has 12 tracks.
  it("returns the array index of the track with the matching trackNumber", () => {
    const albums = getAlbums();
    const gw = albums.find((a) => a.slug === "glitch_witch")!;
    expect(findTrackIndexByNumber(gw, 1)).toBe(0);
    expect(findTrackIndexByNumber(gw, 2)).toBe(1);
  });

  it("returns -1 when no track has that trackNumber", () => {
    const albums = getAlbums();
    const gw = albums.find((a) => a.slug === "glitch_witch")!;
    expect(findTrackIndexByNumber(gw, 99)).toBe(-1);
    expect(findTrackIndexByNumber(gw, 0)).toBe(-1);
  });
});
