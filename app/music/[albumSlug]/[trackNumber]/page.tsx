import { notFound } from "next/navigation";
import { getAlbums, getAlbumBySlug, findTrackIndexByNumber } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ albumSlug: string; trackNumber: string }>;
}

// Real audio files are volume-mounted at runtime, not present in the Docker
// build context (see .dockerignore) — this must render per-request, not be
// statically generated, or it bakes in an empty track list forever.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug, trackNumber } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) return {};
  const trackIndex = findTrackIndexByNumber(album, Number(trackNumber));
  const track = album.tracks[trackIndex];
  if (!track) return {};
  return {
    title: `${track.title} — ${album.title}`,
    description: "An album by Dancing Salamanders",
    openGraph: { title: track.title, type: "music.song" },
  };
}

export default async function TrackPage({ params }: Props) {
  const { albumSlug, trackNumber } = await params;
  const album = getAlbumBySlug(albumSlug);
  if (!album) notFound();

  const trackIndex = findTrackIndexByNumber(album, Number(trackNumber));
  if (trackIndex === -1) notFound();

  const albums = getAlbums();
  return <MusicPageClient albums={albums} selectedAlbum={album} initialTrackIndex={trackIndex} />;
}
