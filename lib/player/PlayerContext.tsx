"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "@/types";
import { previewEngine } from "./previewAudio";
import { seedFromId } from "@/lib/music/artwork";

interface PlayerContextValue {
  queue: Track[];
  index: number;
  current: Track | null;
  playing: boolean;
  progress: number;     // seconds
  duration: number;
  playQueue(tracks: Track[], startIndex?: number): void;
  playTrack(track: Track, queue?: Track[]): void;
  toggle(): void;
  next(): void;
  prev(): void;
  seekTo(seconds: number): void;
  stop(): void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = queue[index] ?? null;
  const duration = current?.duration ?? 0;

  const clearTicker = useCallback(() => {
    if (ticker.current) { clearInterval(ticker.current); ticker.current = null; }
  }, []);

  const startTicker = useCallback(() => {
    clearTicker();
    ticker.current = setInterval(() => {
      setProgress((p) => {
        const d = queue[index]?.duration ?? 0;
        if (p + 0.25 >= d) { setPlaying(false); previewEngine.stop(); return 0; }
        return p + 0.25;
      });
    }, 250);
  }, [clearTicker, queue, index]);

  const playAt = useCallback((q: Track[], i: number) => {
    setQueue(q);
    setIndex(i);
    setProgress(0);
    setPlaying(true);
    previewEngine.start(seedFromId(q[i]?.id ?? "x"));
    startTicker();
  }, [startTicker]);

  const playTrack = useCallback((track: Track, q?: Track[]) => {
    const list = q && q.length ? q : [track];
    const i = Math.max(0, list.findIndex((t) => t.id === track.id));
    playAt(list, i);
  }, [playAt]);

  const playQueue = useCallback((tracks: Track[], startIndex = 0) => {
    if (!tracks.length) return;
    playAt(tracks, startIndex);
  }, [playAt]);

  const toggle = useCallback(() => {
    if (!current) return;
    if (playing) {
      setPlaying(false);
      previewEngine.pause();
      clearTicker();
    } else {
      setPlaying(true);
      previewEngine.resume();
      startTicker();
    }
  }, [current, playing, clearTicker, startTicker]);

  const next = useCallback(() => {
    if (!queue.length) return;
    const i = (index + 1) % queue.length;
    playAt(queue, i);
  }, [queue, index, playAt]);

  const prev = useCallback(() => {
    if (!queue.length) return;
    if (progress > 3) { setProgress(0); return; }
    const i = (index - 1 + queue.length) % queue.length;
    playAt(queue, i);
  }, [queue, index, progress, playAt]);

  const seekTo = useCallback((seconds: number) => {
    setProgress(Math.max(0, Math.min(duration, seconds)));
  }, [duration]);

  const stop = useCallback(() => {
    clearTicker();
    previewEngine.stop();
    setPlaying(false);
    setProgress(0);
  }, [clearTicker]);

  useEffect(() => () => { clearTicker(); previewEngine.stop(); }, [clearTicker]);

  const value = useMemo<PlayerContextValue>(() => ({
    queue, index, current, playing, progress, duration,
    playQueue, playTrack, toggle, next, prev, seekTo, stop
  }), [queue, index, current, playing, progress, duration, playQueue, playTrack, toggle, next, prev, seekTo, stop]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
