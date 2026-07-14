"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface Track {
  title: string;
  src: string;
  trackNumber: number;
  duration?: number;
}

export interface Album {
  slug: string;
  title: string;
  coverArt: string;
  tracks: Track[];
}

interface PlayerState {
  currentAlbum: Album | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;      // 0–1
  currentTime: number;   // seconds
  duration: number;      // seconds
  volume: number;        // 0–1
}

interface PlayerActions {
  playAlbum: (album: Album, trackIndex?: number) => void;
  playTrack: (album: Album, trackIndex: number) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
}

const MusicPlayerContext = createContext<(PlayerState & PlayerActions) | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return ctx;
}

const VOLUME_KEY = "ds_player_volume";
const LAST_PLAYED_KEY = "ds_player_last";

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  // Initialise audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    // Restore volume
    const savedVol = localStorage.getItem(VOLUME_KEY);
    const v = savedVol ? parseFloat(savedVol) : 0.8;
    audio.volume = v;
    setVolumeState(v);

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      // Auto-advance
      setCurrentTrackIndex((i) => {
        const album = currentAlbumRef.current;
        if (!album) return i;
        const next = i + 1;
        if (next < album.tracks.length) {
          loadAndPlay(album, next);
          return next;
        }
        return i;
      });
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep a ref to currentAlbum so the ended handler can access it without stale closure
  const currentAlbumRef = useRef<Album | null>(null);
  useEffect(() => { currentAlbumRef.current = currentAlbum; }, [currentAlbum]);

  const loadAndPlay = useCallback((album: Album, trackIndex: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = album.tracks[trackIndex];
    if (!track) return;

    audio.src = track.src;
    audio.load();
    audio.play().catch(() => {/* autoplay policy — user gesture required */});

    setCurrentAlbum(album);
    setCurrentTrackIndex(trackIndex);

    localStorage.setItem(
      LAST_PLAYED_KEY,
      JSON.stringify({ albumSlug: album.slug, trackIndex })
    );
  }, []);

  const playAlbum = useCallback(
    (album: Album, trackIndex = 0) => loadAndPlay(album, trackIndex),
    [loadAndPlay]
  );

  const playTrack = useCallback(
    (album: Album, trackIndex: number) => loadAndPlay(album, trackIndex),
    [loadAndPlay]
  );

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const resume = useCallback(() => audioRef.current?.play().catch(() => {}), []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
  }, [isPlaying]);

  const next = useCallback(() => {
    if (!currentAlbum) return;
    const nextIdx = currentTrackIndex + 1;
    if (nextIdx < currentAlbum.tracks.length) loadAndPlay(currentAlbum, nextIdx);
  }, [currentAlbum, currentTrackIndex, loadAndPlay]);

  const prev = useCallback(() => {
    if (!currentAlbum) return;
    // If >3s into track, restart; otherwise go to previous
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prevIdx = currentTrackIndex - 1;
    if (prevIdx >= 0) loadAndPlay(currentAlbum, prevIdx);
  }, [currentAlbum, currentTrackIndex, loadAndPlay]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
    setProgress(audio.duration ? time / audio.duration : 0);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (audioRef.current) audioRef.current.volume = clamped;
    setVolumeState(clamped);
    localStorage.setItem(VOLUME_KEY, String(clamped));
  }, []);

  const value: PlayerState & PlayerActions = {
    currentAlbum,
    currentTrackIndex,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    playAlbum,
    playTrack,
    pause,
    resume,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}
