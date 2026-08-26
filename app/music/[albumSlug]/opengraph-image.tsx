import { getAlbumBySlug } from "@/lib/music";
import { renderPreviewCard } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ albumSlug: string }> }) {
  const { albumSlug } = await params;
  const album = getAlbumBySlug(albumSlug);
  return renderPreviewCard({
    topText: album?.title ?? "Dancing Salamanders",
    coverPath: album?.coverArt,
  });
}
