"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { AlbumCard } from "@/components/music/AlbumCard";
import { AlbumDetail } from "@/components/music/AlbumDetail";
import { FadeInView } from "@/components/shared/FadeInView";
import type { Album } from "@/lib/music-context";

export default function MusicPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selected, setSelected] = useState<Album | null>(null);

  useEffect(() => {
    fetch("/api/music")
      .then((r) => r.json())
      .then(setAlbums)
      .catch(console.error);
  }, []);

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
            <AlbumDetail album={selected} />
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
                  <AlbumCard
                    album={album}
                    onSelect={(a) => setSelected((prev) => (prev?.slug === a.slug ? null : a))}
                  />
                </FadeInView>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
