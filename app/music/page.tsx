import { getAlbums } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";

// Real audio files are volume-mounted at runtime, not present in the Docker
// build context (see .dockerignore) — this must render per-request, not be
// statically generated, or it bakes in an empty track list forever.
export const dynamic = "force-dynamic";

export default function MusicPage() {
  const albums = getAlbums();
  return <MusicPageClient albums={albums} />;
}
