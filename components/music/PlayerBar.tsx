"use client";

import { useMusicPlayer } from "@/lib/music-context";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const {
    currentAlbum,
    currentTrackIndex,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
  } = useMusicPlayer();

  const [collapsed, setCollapsed] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  // Nothing loaded — don't render
  if (!currentAlbum) return null;

  const track = currentAlbum.tracks[currentTrackIndex];
  if (!track) return null;

  const hasPrev = currentTrackIndex > 0;
  const hasNext = currentTrackIndex < currentAlbum.tracks.length - 1;

  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setCollapsed(false)}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90"
          aria-label="Open player"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-2xl">
      {/* Progress bar — full width, above everything */}
      <div
        className="h-1 w-full bg-muted cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seek(pct * duration);
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Track progress"
      >
        <div
          className="h-full bg-primary transition-all duration-100 group-hover:bg-primary/80"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          {/* Album art + track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-muted">
              <Image
                src={currentAlbum.coverArt}
                alt={currentAlbum.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-tight">
                {track.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentAlbum.title}
              </p>
            </div>
          </div>

          {/* Controls — centre on desktop, compact on mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              disabled={!hasPrev}
              className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label="Previous track"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlay}
              className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              disabled={!hasNext}
              className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label="Next track"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Time — desktop only */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground tabular-nums flex-shrink-0">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume — desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setShowVolume((v) => !v)}
              aria-label="Volume"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div
              className={cn(
                "transition-all overflow-hidden",
                showVolume ? "w-24 opacity-100" : "w-0 opacity-0"
              )}
            >
              <Slider
                value={[volume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  setVolume(val / 100);
                }}
                className="cursor-pointer"
                aria-label="Volume control"
              />
            </div>
          </div>

          {/* Collapse button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground ml-auto"
            aria-label="Minimise player"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
