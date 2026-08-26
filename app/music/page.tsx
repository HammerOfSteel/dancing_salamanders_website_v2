import { getAlbums } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";

export default function MusicPage() {
  const albums = getAlbums();
  return <MusicPageClient albums={albums} />;
}
