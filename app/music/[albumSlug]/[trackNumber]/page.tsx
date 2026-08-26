import { notFound } from "next/navigation";
import { getAlbums, getAlbumBySlug, findTrackIndexByNumber } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ albumSlug: string; trackNumber: string }>;
}

export async function generateStaticParams() {
  return getAlbums().flatMap((a) =>
    a.tracks.map((t) => ({ albumSlug: a.slug, trackNumber: String(t.trackNumber) }))
  );
}

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
