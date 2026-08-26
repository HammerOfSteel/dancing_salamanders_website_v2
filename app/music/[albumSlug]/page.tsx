import { notFound } from "next/navigation";
import { getAlbums, getAlbumBySlug } from "@/lib/music";
import { MusicPageClient } from "@/components/music/MusicPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ albumSlug: string }>;
}

export async function generateStaticParams() {
  return getAlbums().map((a) => ({ albumSlug: a.slug }));
}

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
