import fs from "fs";
import path from "path";

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
  // Remove leading "01 - " or "01." prefix and extension
  const noExt = filename.replace(/\.[^.]+$/, "");
  const cleaned = noExt.replace(/^\d+\s*[-–.]\s*/, "").trim();
  return cleaned || noExt;
}

export function getAlbums(): Album[] {
  if (!fs.existsSync(MUSIC_DIR)) return [];

  const entries = fs.readdirSync(MUSIC_DIR, { withFileTypes: true });
  const albums: Album[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const albumSlug = entry.name;
    const albumDir = path.join(MUSIC_DIR, albumSlug);
    const files = fs.readdirSync(albumDir);

    // Find cover art
    const coverFile = COVER_NAMES.find((n) => files.includes(n));
    const coverArt = coverFile
      ? `/music/${albumSlug}/${coverFile}`
      : "/images/placeholder-cover.jpg";

    // Find audio tracks
    const tracks: Track[] = files
      .filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .map((f) => ({
        title: parseTrackTitle(f),
        src: `/music/${albumSlug}/${f}`,
        trackNumber: parseTrackNumber(f),
      }))
      .sort((a, b) => a.trackNumber - b.trackNumber);

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
