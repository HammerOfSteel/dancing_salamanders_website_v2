import fs from "fs";
import path from "path";

// [MusicLib] Structured debug logging — only active when DEBUG_MUSIC=true.
// Set this env var on the server or in .env.production to trace album discovery.
const DEBUG = process.env.DEBUG_MUSIC === "true";
function dbg(...args: unknown[]) {
  if (DEBUG) console.debug("[MusicLib]", ...args);
}

export interface Track {
  title: string;
  src: string;
  trackNumber: number;
}

export interface Album {
  slug: string;
  title: string;
  coverArt: string;
  tracks: Track[];
}

const MUSIC_DIR = path.join(process.cwd(), "public", "music");
const AUDIO_EXTENSIONS = new Set([".mp3", ".flac", ".wav", ".ogg", ".m4a"]);
const COVER_NAMES = ["cover.jpg", "cover.png", "cover.webp", "cover.jpeg"];

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseTrackNumber(filename: string): number {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}

function parseTrackTitle(filename: string): string {
  // Remove extension
  const noExt = filename.replace(/\.[^.]+$/, "");
  // Remove leading track number: "01 - " or "01." or "03-"
  const withoutNumber = noExt.replace(/^\d+\s*[-–.]\s*/, "").trim();
  // Remove artist prefix: "Dancing salamanders - " (case-insensitive, optional trailing 's')
  const withoutArtist = withoutNumber
    .replace(/^dancing salamanders?\s*[-–]\s*/i, "")
    .trim();
  return withoutArtist || noExt;
}

/** If an album dir has no audio directly, look one level deeper (e.g. Daffodil/daffodil/). */
function findTrackDir(albumDir: string): { trackDir: string; urlBase: string } {
  const albumDirName = path.basename(albumDir);
  const parentDirName = path.basename(path.dirname(albumDir));

  const direct = fs
    .readdirSync(albumDir)
    .filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()));

  if (direct.length > 0) {
    return { trackDir: albumDir, urlBase: `/music/${albumDirName}` };
  }

  // Search one subdir level
  for (const entry of fs.readdirSync(albumDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const subDir = path.join(albumDir, entry.name);
    const subFiles = fs
      .readdirSync(subDir)
      .filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()));
    if (subFiles.length > 0) {
      return {
        trackDir: subDir,
        urlBase: `/music/${albumDirName}/${entry.name}`,
      };
    }
  }

  return { trackDir: albumDir, urlBase: `/music/${albumDirName}` };
}

export function getAlbums(): Album[] {
  dbg("MUSIC_DIR =", MUSIC_DIR);
  dbg("exists =", fs.existsSync(MUSIC_DIR));

  if (!fs.existsSync(MUSIC_DIR)) return [];

  const entries = fs.readdirSync(MUSIC_DIR, { withFileTypes: true });
  dbg("top-level entries =", entries.map((e) => e.name));
  const albums: Album[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const albumSlug = entry.name;
    const albumDir = path.join(MUSIC_DIR, albumSlug);
    const files = fs.readdirSync(albumDir);

    // Find cover art (always in the top-level album dir)
    const coverFile = COVER_NAMES.find((n) => files.includes(n));
    const coverArt = coverFile
      ? `/music/${albumSlug}/${coverFile}`
      : "/images/placeholder-cover.jpg";

    // Find audio tracks — handles one-level-deep nesting (e.g. Daffodil/daffodil/)
    const { trackDir, urlBase } = findTrackDir(albumDir);
    const trackFiles = fs.readdirSync(trackDir);

    const tracks: Track[] = trackFiles
      .filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .map((f) => ({
        title: parseTrackTitle(f),
        src: `${urlBase}/${f}`,
        trackNumber: parseTrackNumber(f),
      }))
      .sort((a, b) => a.trackNumber - b.trackNumber);

    dbg(`album="${albumSlug}" trackDir="${trackDir}" urlBase="${urlBase}" tracks=`, tracks.map((t) => t.src));

    albums.push({
      slug: albumSlug,
      title: slugToTitle(albumSlug),
      coverArt,
      tracks,
    });
  }

  // Sort albums alphabetically (can be changed to date-based with metadata later)
  return albums.sort((a, b) => a.title.localeCompare(b.title));
}

export function getAlbumBySlug(slug: string): Album | null {
  const albums = getAlbums();
  return albums.find((a) => a.slug === slug) ?? null;
}
