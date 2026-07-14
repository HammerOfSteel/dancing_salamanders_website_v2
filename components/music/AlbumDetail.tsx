"use client";

import Image from "next/image";
import { Play, Pause, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMusicPlayer } from "@/lib/music-context";
import type { Album } from "@/lib/music-context";
import { cn } from "@/lib/utils";

interface AlbumDetailProps {
  album: Album;
}

export function AlbumDetail({ album }: AlbumDetailProps) {
  const { currentAlbum, currentTrackIndex, isPlaying, playAlbum, playTrack, togglePlay } =
    useMusicPlayer();

  const isThisAlbumActive = currentAlbum?.slug === album.slug;

  const handlePlayAll = () => {
    if (isThisAlbumActive) {
      togglePlay();
    } else {
      playAlbum(album, 0);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex flex-col md:flex-row gap-0">
        {/* Cover art */}
        <div className="relative md:w-64 lg:w-72 flex-shrink-0">
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-48 bg-muted">
            <Image
              src={album.coverArt}
              alt={`${album.title} cover art`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 288px"
            />
          </div>
        </div>

        {/* Tracks */}
        <div className="flex-1 min-w-0 p-5 flex flex-col">
          {/* Album header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                <ListMusic className="h-3 w-3" /> Album
              </p>
              <h2 className="font-serif text-2xl font-semibold text-foreground leading-tight">
                {album.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              onClick={handlePlayAll}
              className="flex-shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isThisAlbumActive && isPlaying ? (
                <><Pause className="h-4 w-4" /> Pause</>
              ) : (
                <><Play className="h-4 w-4" /> Play All</>
              )}
            </Button>
          </div>

          <Separator className="bg-border mb-2" />

          {/* Track list */}
          <div className="flex-1 overflow-y-auto max-h-72">
            <ol className="space-y-0.5">
              {album.tracks.map((track, idx) => {
                const isTrackActive = isThisAlbumActive && currentTrackIndex === idx;
                const isTrackPlaying = isTrackActive && isPlaying;

                return (
                  <li key={track.src}>
                    <button
                      onClick={() => {
                        if (isTrackActive) togglePlay();
                        else playTrack(album, idx);
                      }}
                      className={cn(
                        "group w-full flex items-center gap-3 px-2 py-2 rounded-md text-left",
                        "transition-colors hover:bg-muted/60",
                        isTrackActive && "bg-muted/40"
                      )}
                      aria-label={`${isTrackPlaying ? "Pause" : "Play"} ${track.title}`}
                    >
                      {/* Track number / playing indicator */}
                      <span className="w-6 flex-shrink-0 text-center">
                        {isTrackPlaying ? (
                          <span className="flex gap-0.5 items-end h-3 justify-center">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="w-0.5 bg-primary rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]"
                                style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
                              />
                            ))}
                          </span>
                        ) : isTrackActive ? (
                          <Pause className="h-3 w-3 text-primary mx-auto" />
                        ) : (
                          <>
                            <span className="text-xs text-muted-foreground group-hover:hidden">
                              {track.trackNumber}
                            </span>
                            <Play className="h-3 w-3 text-primary mx-auto hidden group-hover:block" />
                          </>
                        )}
                      </span>

                      {/* Title */}
                      <span
                        className={cn(
                          "flex-1 min-w-0 text-sm truncate",
                          isTrackActive
                            ? "text-primary font-medium"
                            : "text-foreground group-hover:text-primary"
                        )}
                      >
                        {track.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
