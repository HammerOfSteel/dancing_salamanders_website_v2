"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  src: string;
  title: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudiobookPlayer({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [available, setAvailable] = useState(true);
  const lastSaveRef = useRef(0);
  const storageKey = `audiobook:${src}`;

  // Keep audio volume in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [playing]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    // Save progress every 5 seconds
    const now = Date.now();
    if (now - lastSaveRef.current > 5000) {
      localStorage.setItem(storageKey, String(audio.currentTime));
      lastSaveRef.current = now;
    }
  }, [storageKey]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
    // Restore saved position (but not if within last 10s — likely finished)
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const t = parseFloat(saved);
      if (!isNaN(t) && t > 2 && t < audio.duration - 10) {
        audio.currentTime = t;
        setCurrentTime(t);
      }
    }
  }, [storageKey]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    // Clear saved position when finished
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const handlePause = useCallback(() => {
    // Save immediately on pause
    const audio = audioRef.current;
    if (audio) localStorage.setItem(storageKey, String(audio.currentTime));
  }, [storageKey]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    setMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const skipBy = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + delta));
  }, [duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayVolume = muted ? 0 : volume;

  // Hide if the audio file failed to load (e.g. not yet uploaded to server)
  if (!available) return null;

  return (
    <div className="audiobook-player">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => { setPlaying(false); handlePause(); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setAvailable(false)}
      />

      {/* Header */}
      <div className="audiobook-header">
        <span className="audiobook-label">🎧 Audiobook</span>
        <span className="audiobook-title-text">{title}</span>
        {duration > 0 && (
          <span className="audiobook-duration">{formatTime(duration)}</span>
        )}
      </div>

      {/* Timeline */}
      <div className="audiobook-timeline-row">
        <span className="audiobook-time">{formatTime(currentTime)}</span>
        <div className="audiobook-scrubber-wrap">
          <div
            className="audiobook-scrubber-fill"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            className="audiobook-scrubber"
            min={0}
            max={duration || 0}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek"
          />
        </div>
        <span className="audiobook-time">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="audiobook-controls">
        {/* Skip back 30s */}
        <button
          onClick={() => skipBy(-30)}
          className="audiobook-skip-btn"
          aria-label="Skip back 30 seconds"
          title="−30s"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.63" />
          </svg>
          <span className="audiobook-skip-label">30</span>
        </button>

        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          className="audiobook-play-btn"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Skip forward 30s */}
        <button
          onClick={() => skipBy(30)}
          className="audiobook-skip-btn"
          aria-label="Skip forward 30 seconds"
          title="+30s"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-.49-3.63" />
          </svg>
          <span className="audiobook-skip-label">30</span>
        </button>

        {/* Spacer */}
        <div className="audiobook-spacer" />

        {/* Mute toggle + volume */}
        <button
          onClick={toggleMute}
          className="audiobook-mute-btn"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {displayVolume === 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : displayVolume < 0.5 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
        <div className="audiobook-volume-wrap">
          <div
            className="audiobook-volume-fill"
            style={{ width: `${displayVolume * 100}%` }}
          />
          <input
            type="range"
            className="audiobook-scrubber audiobook-volume-slider"
            min={0}
            max={1}
            step={0.02}
            value={displayVolume}
            onChange={handleVolumeChange}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
