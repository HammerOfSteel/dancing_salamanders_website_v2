import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// [MusicDebug] Only active when DEBUG_MUSIC=true env var is set.
// Hit GET /api/debug/music on the live server to see exactly what
// the server-side filesystem looks like: cwd, MUSIC_DIR, album dirs,
// and the constructed track URLs.
export async function GET() {
  if (process.env.DEBUG_MUSIC !== "true") {
    return NextResponse.json({ error: "Debug endpoint disabled" }, { status: 403 });
  }

  const cwd = process.cwd();
  const musicDir = path.join(cwd, "public", "music");
  const AUDIO_EXTENSIONS = new Set([".mp3", ".flac", ".wav", ".ogg", ".m4a"]);

  const report: {
    cwd: string;
    musicDir: string;
    musicDirExists: boolean;
    albums: Array<{
      folderName: string;
      coverFound: boolean;
      tracks: Array<{ url: string; fileExists: boolean }>;
    }>;
  } = {
    cwd,
    musicDir,
    musicDirExists: fs.existsSync(musicDir),
    albums: [],
  };

  if (!report.musicDirExists) {
    return NextResponse.json(report);
  }

  const entries = fs.readdirSync(musicDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const albumDir = path.join(musicDir, entry.name);
    const files = fs.readdirSync(albumDir);

    const coverFile = ["cover.jpg", "cover.png", "cover.webp", "cover.jpeg"].find(
      (n) => files.includes(n)
    );

    // Check direct audio files
    const directTracks = files.filter((f) =>
      AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase())
    );

    let trackDir = albumDir;
    let urlBase = `/music/${entry.name}`;

    if (directTracks.length === 0) {
      // Look one level deeper
      for (const sub of fs.readdirSync(albumDir, { withFileTypes: true })) {
        if (!sub.isDirectory()) continue;
        const subDir = path.join(albumDir, sub.name);
        const subFiles = fs
          .readdirSync(subDir)
          .filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()));
        if (subFiles.length > 0) {
          trackDir = subDir;
          urlBase = `/music/${entry.name}/${sub.name}`;
          break;
        }
      }
    }

    const trackFiles = fs
      .readdirSync(trackDir)
      .filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()));

    report.albums.push({
      folderName: entry.name,
      coverFound: !!coverFile,
      tracks: trackFiles.map((f) => ({
        url: `${urlBase}/${f}`,
        fileExists: fs.existsSync(path.join(trackDir, f)),
      })),
    });
  }

  return NextResponse.json(report, { status: 200 });
}
