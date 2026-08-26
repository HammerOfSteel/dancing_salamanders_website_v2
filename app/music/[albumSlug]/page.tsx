import { notFound } from "next/navigation";
import { getAlbums, getAlbumBySlug } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ albumSlug: string }>;
}

// Real audio files are volume-mounted at runtime, not present in the Docker
// build context (see .dockerignore) — this must render per-request, not be
// statically generated, or it bakes in an empty track list forever.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) return {};
  return {
    title: album.title,
    description: "An album by Dancing Salamanders",
    openGraph: { title: album.title, type: "music.album" },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { albumSlug } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) notFound();

  const albums = getAlbums();
  return <MusicPageClient albums={albums} selectedAlbum={album} />;
}
