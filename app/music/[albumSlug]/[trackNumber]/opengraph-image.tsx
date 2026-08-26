import { getAlbumBySlug, findTrackIndexByNumber } from "@/lib/music";
import { renderPreviewCard } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ albumSlug: string; trackNumber: string }>;
}) {
  const { albumSlug, trackNumber } = await params;
  const album = getAlbumBySlug(albumSlug);
  const track = album ? album.tracks[findTrackIndexByNumber(album, Number(trackNumber))] : undefined;
  return renderPreviewCard({
    topText: track?.title ?? "Dancing Salamanders",
    subText: album?.title,
    coverPath: album?.coverArt,
  });
}
