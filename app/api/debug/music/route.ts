import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// [MusicDebug] Only active when DEBUG_MUSIC=true env var is set.
export async function GET() {
  if (process.env.DEBUG_MUSIC !== "true") {
    return NextResponse.json({ error: "Debug endpoint disabled" }, { status: 403 });
  }

  const AUDIO_EXTENSIONS = new Set([".mp3", ".flac", ".wav", ".ogg", ".m4a"]);

  function checkPath(p: string) {
    let exists = false;
    let readable = false;
    let size: number | null = null;
    let mode: string | null = null;
    let uid: number | null = null;
    try {
      const st = fs.statSync(p);
      exists = true;
      size = st.size;
      mode = "0" + (st.mode & 0o777).toString(8);
      uid = st.uid;
    } catch { /* not found */ }
    if (exists) {
      try { fs.accessSync(p, fs.constants.R_OK); readable = true; } catch { /* not readable */ }
    }
    return { exists, readable, size, mode, uid };
  }

  const cwd = process.cwd();
  const publicDir = path.join(cwd, "public");
  const musicDir = path.join(publicDir, "music");

  const report = {
    process: {
      cwd,
      uid: process.getuid?.() ?? "n/a",
      gid: process.getgid?.() ?? "n/a",
      nodeVersion: process.version,
      platform: process.platform,
    },
    paths: {
      publicDir,
      publicDirCheck: checkPath(publicDir),
      musicDir,
      musicDirCheck: checkPath(musicDir),
    },
    albums: [] as Array<{
      folderName: string;
      albumDirPath: string;
      albumDirCheck: ReturnType<typeof checkPath>;
      tracks: Array<{
        filename: string;
        url: string;
        absolutePath: string;
        staticResolvePath: string;
        fsCheck: ReturnType<typeof checkPath>;
        staticPathCheck: ReturnType<typeof checkPath>;
        urlMatchesStaticPath: boolean;
      }>;
    }>,
  };

  if (!report.paths.musicDirCheck.exists) {
    return NextResponse.json(report);
  }

  const entries = fs.readdirSync(musicDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const albumDirPath = path.join(musicDir, entry.name);
    const albumDirCheck = checkPath(albumDirPath);
    const files = fs.readdirSync(albumDirPath);
    const urlBase = `/music/${entry.name}`;

    const trackFiles = files.filter((f) =>
      AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase())
    );

    // The path Next.js static file server resolves for a URL /music/foo/bar.mp3
    // is: path.join(cwd, "public", "music", folderName, filename)
    const tracks = trackFiles.map((f) => {
      const absolutePath = path.join(albumDirPath, f);
      const url = `${urlBase}/${f}`;
      // Strip leading slash, then join with public dir — this is exactly what
      // Next.js standalone static handler does
      const staticResolvePath = path.join(publicDir, url);
      const fsCheck = checkPath(absolutePath);
      const staticPathCheck = checkPath(staticResolvePath);
      return {
        filename: f,
        url,
        absolutePath,
        staticResolvePath,
        fsCheck,
        staticPathCheck,
        urlMatchesStaticPath: absolutePath === staticResolvePath,
      };
    });

    report.albums.push({ folderName: entry.name, albumDirPath, albumDirCheck, tracks });
  }

  return NextResponse.json(report, { status: 200 });
}
