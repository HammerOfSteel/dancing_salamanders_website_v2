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
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Album folders may be prefixed with a 2-digit order number, e.g. "01_root_access".
// The prefix encodes display order directly in the folder name; it's stripped
// from the slug/title but the raw folder name is still used for the actual
// on-disk URL path (cover/track files live under the prefixed directory).
const ORDER_PREFIX_RE = /^(\d+)_(.+)$/;

function parseAlbumOrder(folderName: string): { order: number | null; displaySlug: string } {
  const match = folderName.match(ORDER_PREFIX_RE);
  if (!match) return { order: null, displaySlug: folderName };
  return { order: parseInt(match[1], 10), displaySlug: match[2] };
}

function parseTrackNumber(filename: string): number {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}

function parseTrackTitle(filename: string): string {
  // Remove extension
  const noExt = filename.replace(/\.[^.]+$/, "");
  // Remove leading track number and separator: "01_" or "01 - " or "01." or "03-"
  const withoutNumber = noExt
    .replace(/^\d+_/, "")
    .replace(/^\d+\s*[-–.]\s*/, "")
    .trim();
  // Replace underscores with spaces
  const withSpaces = withoutNumber.replace(/_/g, " ");
  // Remove artist prefix: "Dancing salamanders - " (case-insensitive, optional trailing 's')
  const withoutArtist = withSpaces
    .replace(/^dancing salamanders?\s*[-–]\s*/i, "")
    .trim();
  return withoutArtist || noExt;
}

export function getAlbums(): Album[] {
  dbg("MUSIC_DIR =", MUSIC_DIR);
  dbg("exists =", fs.existsSync(MUSIC_DIR));

  if (!fs.existsSync(MUSIC_DIR)) return [];

  const entries = fs.readdirSync(MUSIC_DIR, { withFileTypes: true });
  dbg("top-level entries =", entries.map((e) => e.name));
  const albums: (Album & { order: number | null })[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const folderName = entry.name;
    const { order, displaySlug } = parseAlbumOrder(folderName);
    const albumDir = path.join(MUSIC_DIR, folderName);
    const files = fs.readdirSync(albumDir);

    // Find cover art (always in the top-level album dir)
    const coverFile = COVER_NAMES.find((n) => files.includes(n));
    const coverArt = coverFile
      ? `/music/${folderName}/${coverFile}`
      : "/images/placeholder-cover.jpg";

    // Find audio tracks — flat structure: all tracks live directly in the album folder
    const urlBase = `/music/${folderName}`;
    const tracks: Track[] = files
      .filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .map((f) => ({
        title: parseTrackTitle(f),
        src: `${urlBase}/${f}`,
        trackNumber: parseTrackNumber(f),
      }))
      .sort((a, b) => a.trackNumber - b.trackNumber);

    dbg(`album="${displaySlug}" urlBase="${urlBase}" tracks=`, tracks.map((t) => t.src));

    albums.push({
      slug: displaySlug,
      title: slugToTitle(displaySlug),
      coverArt,
      tracks,
      order,
    });
  }

  // Album order: encoded directly in the folder name via a leading "NN_" prefix
  // (e.g. "01_root_access"). Albums without a numeric prefix sort after all
  // prefixed albums, alphabetically by title.
  albums.sort((a, b) => {
    if (a.order !== null && b.order !== null) return a.order - b.order;
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return a.title.localeCompare(b.title);
  });

  return albums.map(({ order: _order, ...album }) => album);
}

export function getAlbumBySlug(slug: string): Album | null {
  const albums = getAlbums();
  return albums.find((a) => a.slug === slug) ?? null;
}
