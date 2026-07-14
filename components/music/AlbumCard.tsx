"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useMusicPlayer } from "@/lib/music-context";
import type { Album } from "@/lib/music-context";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
  album: Album;
  onSelect?: (album: Album) => void;
}

export function AlbumCard({ album, onSelect }: AlbumCardProps) {
  const { currentAlbum, isPlaying, playAlbum, togglePlay } = useMusicPlayer();
  const isActive = currentAlbum?.slug === album.slug;

  const handleClick = () => {
    if (isActive) {
      togglePlay();
    } else {
      playAlbum(album, 0);
    }
    onSelect?.(album);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative w-full text-left rounded-lg overflow-hidden",
        "bg-card border border-border hover:border-primary/50",
        "transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
        "hover:-translate-y-0.5",
        isActive && "border-primary/60 shadow-md shadow-primary/15"
      )}
      aria-label={`${isActive && isPlaying ? "Pause" : "Play"} ${album.title}`}
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={album.coverArt}
          alt={`${album.title} cover art`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Play overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-background/50 backdrop-blur-sm",
            "transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl">
            {isActive && isPlaying ? (
              <span className="flex gap-0.5 items-end h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 bg-current rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]"
                    style={{
                      height: "100%",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </span>
            ) : (
              <Play className="h-6 w-6 translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Active indicator badge */}
        {isActive && (
          <div className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            {isPlaying ? "Playing" : "Paused"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-serif text-base font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {album.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
}
