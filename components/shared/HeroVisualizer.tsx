"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const VISUALIZER_URL =
  process.env.NEXT_PUBLIC_VISUALIZER_URL ?? "https://music.dancingsalamanders.com";

// Equaliser bars icon – five bars at different heights
function WaveformIcon() {
  return (
    <svg
      viewBox="0 0 24 20"
      fill="none"
      aria-hidden="true"
      className="w-5 h-5"
    >
      <rect x="1"  y="8"  width="3" height="12" rx="1.5" fill="currentColor" />
      <rect x="6"  y="2"  width="3" height="18" rx="1.5" fill="currentColor" />
      <rect x="11" y="6"  width="3" height="14" rx="1.5" fill="currentColor" />
      <rect x="16" y="0"  width="3" height="20" rx="1.5" fill="currentColor" />
      <rect x="21" y="5"  width="3" height="15" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="w-5 h-5"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function HeroVisualizer() {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  // Once mounted, never unmount so the audio keeps playing when re-hidden
  const [iframeMounted, setIframeMounted] = useState(false);

  function toggleVisualizer() {
    if (!iframeMounted) setIframeMounted(true);
    setShowVisualizer((v) => !v);
  }

  return (
    <section className="hero-visualizer-root relative w-full min-h-[90vh] flex items-center overflow-hidden">
      {/* ── Background image ─────────────────────────────────────────── */}
      <Image
        src="/images/hero/landing_top_bg.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Normal hero content ───────────────────────────────────────── */}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center transition-opacity duration-500",
          showVisualizer ? "opacity-0 pointer-events-none select-none" : "opacity-100"
        )}
      >
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight mb-4">
          Dancing Salamanders
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Echoes of Hope, Harmonies of Heart
        </p>
        <div className="mt-6 h-px w-24 bg-primary/60 mx-auto" />
      </div>

      {/* ── Visualizer iframe ─────────────────────────────────────────── */}
      <div
        className={cn(
          "absolute inset-0 z-20 transition-opacity duration-500",
          showVisualizer && iframeLoaded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {iframeMounted && (
          <iframe
            src={VISUALIZER_URL}
            className="w-full h-full border-0"
            allow="autoplay"
            title="Music Visualizer"
            onLoad={() => setIframeLoaded(true)}
          />
        )}
      </div>

      {/* Loading shimmer while iframe fetches */}
      {showVisualizer && !iframeLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-end gap-1 h-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-primary/60 animate-pulse"
                  style={{
                    height: `${[60, 90, 70, 100, 50][i - 1]}%`,
                    animationDelay: `${(i - 1) * 150}ms`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground/60 tracking-widest uppercase">
              Loading visualizer…
            </span>
          </div>
        </div>
      )}

      {/* ── Toggle button ─────────────────────────────────────────────── */}
      <button
        onClick={toggleVisualizer}
        data-active={showVisualizer ? "true" : "false"}
        className={cn(
          "hero-viz-toggle absolute bottom-7 right-7 z-30",
          "w-12 h-12 rounded-full",
          "flex items-center justify-center",
          "border transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          showVisualizer
            ? "bg-violet-950/90 border-violet-400/50 text-violet-200 hover:bg-violet-900/90 hover:border-violet-300/70 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            : "bg-background/80 backdrop-blur-md border-primary/50 text-primary hover:bg-background/90 hover:border-primary hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-105"
        )}
        aria-label={showVisualizer ? "Close visualizer" : "Open music visualizer"}
        title={showVisualizer ? "Close visualizer" : "Open music visualizer"}
      >
        {showVisualizer ? <CloseIcon /> : <WaveformIcon />}
      </button>
    </section>
  );
}
