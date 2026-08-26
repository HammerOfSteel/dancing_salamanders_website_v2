#!/usr/bin/env node
// [MusicLinksSmoke] Live-server smoke test for shareable music deep links.
// Fetches /api/music, then for the first album and its first track checks
// that the album page and track page both:
//   - return HTTP 200
//   - contain the expected title text
//   - expose an og:image meta tag (social preview)
//
// Usage: node tests/smoke/music-links.mjs [baseUrl]
//   baseUrl defaults to http://localhost:3000

const BASE = process.argv[2] || "http://localhost:3000";

let failed = false;

function check(label, condition) {
  if (condition) {
    console.log(`PASS: ${label}`);
  } else {
    console.error(`FAIL: ${label}`);
    failed = true;
  }
}

async function main() {
  const albumsRes = await fetch(`${BASE}/api/music`);
  if (!albumsRes.ok) {
    console.error(`[FATAL] /api/music returned ${albumsRes.status}`);
    process.exit(2);
  }
  const albums = await albumsRes.json();
  const album = albums[0];
  if (!album || album.tracks.length === 0) {
    console.error("[FATAL] no albums/tracks returned from /api/music");
    process.exit(2);
  }
  const track = album.tracks[0];

  // Album page
  const albumUrl = `${BASE}/music/${album.slug}`;
  const albumRes = await fetch(albumUrl);
  const albumHtml = await albumRes.text();
  check(`${albumUrl} returns 200`, albumRes.status === 200);
  check(`${albumUrl} contains album title`, albumHtml.includes(album.title));
  check(`${albumUrl} has og:image meta tag`, albumHtml.includes('property="og:image"'));

  // Track page
  const trackUrl = `${BASE}/music/${album.slug}/${track.trackNumber}`;
  const trackRes = await fetch(trackUrl);
  const trackHtml = await trackRes.text();
  check(`${trackUrl} returns 200`, trackRes.status === 200);
  check(`${trackUrl} contains track title`, trackHtml.includes(track.title));
  check(`${trackUrl} has og:image meta tag`, trackHtml.includes('property="og:image"'));

  if (failed) {
    console.error("\nSMOKE TEST FAILED");
    process.exit(1);
  }
  console.log("\nSMOKE TEST PASSED");
}

main().catch((e) => {
  console.error("[FATAL]", e);
  process.exit(2);
});
