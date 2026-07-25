#!/usr/bin/env node
// [MusicSmoke] Live-server smoke test.
// For every track the server reports via /api/debug/music, request the real URL
// with a Range header and record the HTTP status. Cross-references the debug
// endpoint's filesystem view (fsCheck / staticPathCheck) against the actual
// HTTP result, so we can see exactly WHERE a track breaks:
//   - server says file missing        -> filesystem / rename problem
//   - server says file present but 404 -> static-serving / routing problem
//   - 206                              -> OK
//
// Usage: node tests/smoke/music-http.mjs [baseUrl]
//   baseUrl defaults to https://dancingsalamanders.com

const BASE = process.argv[2] || "https://dancingsalamanders.com";
const DEBUG_URL = `${BASE}/api/debug/music`;

function encodeUrlPath(urlPath) {
  // Encode each path segment but keep the slashes.
  return urlPath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

async function main() {
  const res = await fetch(DEBUG_URL);
  if (!res.ok) {
    console.error(`[FATAL] debug endpoint returned ${res.status} — is DEBUG_MUSIC=true set on the server?`);
    process.exit(2);
  }
  const data = await res.json();

  console.log("=== SERVER PROCESS ===");
  console.log(JSON.stringify(data.process, null, 2));
  console.log("=== PATHS ===");
  console.log("publicDir:", data.paths.publicDir, data.paths.publicDirCheck);
  console.log("musicDir: ", data.paths.musicDir, data.paths.musicDirCheck);
  console.log("");

  // An album folder with zero playable tracks is a failure: it appears in the
  // music page but nothing can be played. Catches nested-folder + orphan-folder bugs.
  const emptyAlbums = data.albums.filter((a) => a.tracks.length === 0);

  const results = [];
  for (const album of data.albums) {
    for (const track of album.tracks) {
      const encoded = encodeUrlPath(track.url);
      const url = `${BASE}${encoded}`;
      let status = 0;
      let contentType = "";
      let acceptRanges = "";
      try {
        const r = await fetch(url, { headers: { Range: "bytes=0-1023" } });
        status = r.status;
        contentType = r.headers.get("content-type") || "";
        acceptRanges = r.headers.get("accept-ranges") || "";
      } catch (e) {
        status = -1;
        contentType = String(e);
      }
      results.push({
        album: album.folderName,
        url: track.url,
        encoded,
        httpStatus: status,
        contentType,
        acceptRanges,
        serverFsExists: track.fsCheck?.exists ?? null,
        serverFsReadable: track.fsCheck?.readable ?? null,
        serverStaticExists: track.staticPathCheck?.exists ?? null,
        urlMatchesStaticPath: track.urlMatchesStaticPath ?? null,
      });
    }
  }

  // Report failures grouped by category
  const ok = results.filter((r) => r.httpStatus === 206 || r.httpStatus === 200);
  const notFound = results.filter((r) => r.httpStatus === 404);
  const other = results.filter((r) => ![200, 206, 404].includes(r.httpStatus));

  console.log(`=== SUMMARY ===`);
  console.log(`total albums: ${data.albums.length}`);
  console.log(`empty albums (0 tracks): ${emptyAlbums.length}`);
  console.log(`total tracks: ${results.length}`);
  console.log(`OK (200/206): ${ok.length}`);
  console.log(`404:          ${notFound.length}`);
  console.log(`other:        ${other.length}`);
  console.log("");

  if (emptyAlbums.length) {
    console.log("=== EMPTY ALBUMS (0 playable tracks — FAIL) ===");
    for (const a of emptyAlbums) {
      console.log(`EMPTY  album=${a.folderName}  dir=${a.albumDirPath}`);
    }
    console.log("");
  }

  if (notFound.length) {
    console.log("=== 404s (server-side file state shown) ===");
    for (const r of notFound) {
      console.log(
        `404  album=${r.album}\n` +
        `     url=${r.url}\n` +
        `     serverFsExists=${r.serverFsExists} readable=${r.serverFsReadable} ` +
        `staticExists=${r.serverStaticExists} pathsMatch=${r.urlMatchesStaticPath}`
      );
    }
    console.log("");
  }

  if (other.length) {
    console.log("=== OTHER (non-200/206/404) ===");
    for (const r of other) {
      console.log(`${r.httpStatus}  ${r.album}  ${r.url}  ${r.contentType}`);
    }
    console.log("");
  }

  // Per-album pass/fail rollup
  console.log("=== PER-ALBUM ROLLUP ===");
  const byAlbum = {};
  for (const r of results) {
    byAlbum[r.album] ??= { ok: 0, fail: 0 };
    if (r.httpStatus === 206 || r.httpStatus === 200) byAlbum[r.album].ok++;
    else byAlbum[r.album].fail++;
  }
  for (const [album, c] of Object.entries(byAlbum)) {
    const mark = c.fail === 0 ? "PASS" : "FAIL";
    console.log(`${mark}  ${album}  (ok=${c.ok} fail=${c.fail})`);
  }

  // Exit non-zero if any track is not servable OR any album has zero tracks
  const failed = notFound.length + other.length + emptyAlbums.length;
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("[FATAL]", e);
  process.exit(2);
});
