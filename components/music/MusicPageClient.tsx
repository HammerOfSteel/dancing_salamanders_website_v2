"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { AlbumCard } from "@/components/music/AlbumCard";
import { AlbumDetail } from "@/components/music/AlbumDetail";
import { FadeInView } from "@/components/shared/FadeInView";
import { useMusicPlayer } from "@/lib/music-context";
import type { Album } from "@/lib/music-context";

interface MusicPageClientProps {
  albums: Album[];
  selectedAlbum?: Album;
  initialTrackIndex?: number;
}

export function MusicPageClient({ albums, selectedAlbum, initialTrackIndex }: MusicPageClientProps) {
  const router = useRouter();
  const { currentAlbum, cueTrack } = useMusicPlayer();
  const [selected, setSelected] = useState<Album | null>(selectedAlbum ?? null);

  // Cue the shared track/album on first load, without stealing focus from
  // whatever might already be playing (e.g. carried over via in-app navigation).
  const hasCued = useRef(false);
  useEffect(() => {
    if (hasCued.current) return;
    hasCued.current = true;
    if (!selectedAlbum) return;
    if (currentAlbum?.slug === selectedAlbum.slug) return;
    cueTrack(selectedAlbum, initialTrackIndex ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAlbum = (album: Album) => {
    if (selected?.slug === album.slug) {
      setSelected(null);
      router.push("/music");
    } else {
      setSelected(album);
      router.push(`/music/${album.slug}`);
    }
  };

  const handleSelectTrack = (album: Album, trackIndex: number) => {
    // Playback itself is already triggered by AlbumDetail's own click handler
    // (which calls playTrack directly before invoking this callback) — this
    // handler is only responsible for keeping the URL in sync.
    router.push(`/music/${album.slug}/${album.tracks[trackIndex].trackNumber}`);
  };

  return (
    <div className="pb-32">
      <PageHero
        title="Music"
        subtitle="All albums — self-hosted, streamed right from here."
        size="sm"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Selected album detail panel */}
        {selected && (
          <FadeInView className="mb-10">
            <AlbumDetail album={selected} onTrackSelect={handleSelectTrack} />
          </FadeInView>
        )}

        {/* Album grid */}
        {albums.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="font-serif text-xl mb-2">No albums yet</p>
            <p className="text-sm">
              Add albums to <code className="text-xs bg-muted px-1 rounded">public/music/</code> — see the README for the folder format.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              {albums.length} Album{albums.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album, i) => (
                <FadeInView key={album.slug} delay={i * 0.04}>
                  <AlbumCard album={album} onSelect={handleSelectAlbum} />
                </FadeInView>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
