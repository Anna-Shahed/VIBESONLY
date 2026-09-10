"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ActiveVibe, LocalPlaylist, Recommendation, Track, VibeScan, VibeProfile } from "@/types";
import { DEMO_TRACKS } from "@/lib/music/data";
import { buildTheme, applyTheme, type ThemeTokens } from "@/lib/color/theme";
import { classifyVibe, type ColorAnalysis } from "@/lib/vibes/classifier";
import { rankTracks, type UserSignals } from "@/lib/recommendations/engine";
import { profileFromPreset, type ScenePreset } from "@/lib/vibes/presets";
import { trackFromUpload } from "@/lib/music/provider";

interface SongDetailState { track: Track; match?: number; reasons?: string[]; fromVibe?: string }

interface AppContextValue {
  tracks: Track[];
  savedIds: string[];
  likedIds: string[];
  playlists: LocalPlaylist[];
  scans: VibeScan[];
  activeVibe: ActiveVibe | null;
  theme: ThemeTokens;
  songDetail: SongDetailState | null;
  playlistModalTrackIds: string[] | null;
  toggleSave(trackId: string): void;
  toggleLike(trackId: string): void;
  isSaved(id: string): boolean;
  isLiked(id: string): boolean;
  createPlaylist(name: string, trackIds: string[]): void;
  addToPlaylist(playlistId: string, trackIds: string[]): void;
  removeFromPlaylist(playlistId: string, trackId: string): void;
  openSong(track: Track, opts?: { match?: number; reasons?: string[]; fromVibe?: string }): void;
  closeSong(): void;
  openPlaylistModal(trackIds: string[]): void;
  closePlaylistModal(): void;
  applyScan(profile: VibeProfile, recs: Recommendation[], source: "camera" | "sample"): void;
  runPreset(preset: ScenePreset): void;
  runAnalysis(analysis: ColorAnalysis, source: "camera" | "sample"): ActiveVibe;
  importTracks(metas: Array<{ title: string; artist?: string; album?: string; genre?: string }>): void;
  signals: UserSignals;
  restoreScan(scan: VibeScan): void;
}

const DEFAULT_PROFILE = classifyVibe({
  primary: [122, 63, 74], palette: [[122, 63, 74], [192, 138, 101], [224, 182, 138], [35, 28, 26], [74, 43, 47]],
  brightness: 0.22, saturation: 0.42, contrast: 0.55, temperature: 0.55, hue: 8
});

const DEFAULT_THEME = buildTheme(DEFAULT_PROFILE.primaryColor, DEFAULT_PROFILE.secondaryColors[0] ?? "#C08A65");

const LS_KEYS = {
  saved: "vo.saved", liked: "vo.liked", playlists: "vo.playlists",
  scans: "vo.scans", uploads: "vo.uploads", active: "vo.active"
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(() => load(LS_KEYS.saved, []));
  const [likedIds, setLikedIds] = useState<string[]>(() => load(LS_KEYS.liked, []));
  const [playlists, setPlaylists] = useState<LocalPlaylist[]>(() => load(LS_KEYS.playlists, []));
  const [scans, setScans] = useState<VibeScan[]>(() => load(LS_KEYS.scans, []));
  const [uploads, setUploads] = useState<Track[]>(() => load(LS_KEYS.uploads, []));
  const [activeVibe, setActiveVibe] = useState<ActiveVibe | null>(() => load(LS_KEYS.active, null));
  const [theme, setTheme] = useState<ThemeTokens>(DEFAULT_THEME);
  const [songDetail, setSongDetail] = useState<SongDetailState | null>(null);
  const [playlistModalTrackIds, setPlaylistModalTrackIds] = useState<string[] | null>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tracks = useMemo(() => [...DEMO_TRACKS, ...uploads], [uploads]);

  const persist = (key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
    }, 150);
  };

  useEffect(() => { persist(LS_KEYS.saved, savedIds); }, [savedIds]);
  useEffect(() => { persist(LS_KEYS.liked, likedIds); }, [likedIds]);
  useEffect(() => { persist(LS_KEYS.playlists, playlists); }, [playlists]);
  useEffect(() => { persist(LS_KEYS.scans, scans); }, [scans]);
  useEffect(() => { persist(LS_KEYS.uploads, uploads); }, [uploads]);
  useEffect(() => { persist(LS_KEYS.active, activeVibe); }, [activeVibe]);

  useEffect(() => { applyTheme(theme); }, [theme]);

  const signals: UserSignals = useMemo(() => ({
    liked: new Set(likedIds), saved: new Set(savedIds), played: new Set(),
    playlistIds: new Set(playlists.flatMap((p) => p.trackIds))
  }), [likedIds, savedIds, playlists]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);
  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const createPlaylist = useCallback((name: string, trackIds: string[]) => {
    setPlaylists((prev) => [{ id: `pl-${Date.now()}`, name, trackIds, createdAt: Date.now() }, ...prev]);
  }, []);

  const addToPlaylist = useCallback((playlistId: string, trackIds: string[]) => {
    setPlaylists((prev) => prev.map((p) =>
      p.id === playlistId ? { ...p, trackIds: [...new Set([...p.trackIds, ...trackIds])] } : p
    ));
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) => prev.map((p) =>
      p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
    ));
  }, []);

  const openSong = useCallback((track: Track, opts?: SongDetailState) => {
    setSongDetail({ track, ...opts });
  }, []);
  const closeSong = useCallback(() => setSongDetail(null), []);
  const openPlaylistModal = useCallback((trackIds: string[]) => setPlaylistModalTrackIds(trackIds), []);
  const closePlaylistModal = useCallback(() => setPlaylistModalTrackIds(null), []);

  const runAnalysis = useCallback((analysis: ColorAnalysis, source: "camera" | "sample"): ActiveVibe => {
    const profile = classifyVibe(analysis);
    const recs = rankTracks(profile, DEMO_TRACKS, signals, 24);
    const scan: VibeScan = {
      id: `scan-${Date.now()}`, createdAt: Date.now(),
      palette: profile.palette, primaryColor: profile.primaryColor,
      temperature: profile.temperature, brightness: profile.brightness,
      saturation: profile.saturation, contrast: profile.contrast,
      mood: profile.visualMood, vibeName: profile.vibeName, confidence: profile.confidence,
      recommendationIds: recs.map((r) => r.track.id), source
    };
    const vibe: ActiveVibe = { profile, recommendations: recs, source, scanId: scan.id };
    setScans((prev) => [scan, ...prev].slice(0, 30));
    setActiveVibe(vibe);
    setTheme(buildTheme(profile.primaryColor, profile.secondaryColors[0] ?? profile.palette[1] ?? "#C08A65"));
    return vibe;
  }, [signals]);

  const applyScan = useCallback((profile: VibeProfile, recs: Recommendation[], source: "camera" | "sample") => {
    setActiveVibe({ profile, recommendations: recs, source });
    setTheme(buildTheme(profile.primaryColor, profile.secondaryColors[0] ?? profile.palette[1] ?? "#C08A65"));
  }, []);

  const runPreset = useCallback((preset: ScenePreset) => {
    const profile = profileFromPreset(preset);
    const recs = rankTracks(profile, DEMO_TRACKS, signals, 24);
    const scan: VibeScan = {
      id: `scan-${Date.now()}`, createdAt: Date.now(),
      palette: profile.palette, primaryColor: profile.primaryColor,
      temperature: profile.temperature, brightness: profile.brightness,
      saturation: profile.saturation, contrast: profile.contrast,
      mood: profile.visualMood, vibeName: profile.vibeName, confidence: profile.confidence,
      recommendationIds: recs.map((r) => r.track.id), source: "sample"
    };
    setScans((prev) => [scan, ...prev].slice(0, 30));
    setActiveVibe({ profile, recommendations: recs, source: "sample", scanId: scan.id });
    setTheme(buildTheme(profile.primaryColor, profile.secondaryColors[0] ?? "#C08A65"));
  }, [signals]);

  const restoreScan = useCallback((scan: VibeScan) => {
    const profile: VibeProfile = {
      primaryColor: scan.primaryColor, secondaryColors: scan.palette.slice(1, 3),
      palette: scan.palette, brightness: scan.brightness, saturation: scan.saturation,
      contrast: scan.contrast, temperature: scan.temperature, visualMood: scan.mood,
      vibeName: scan.vibeName, confidence: scan.confidence
    };
    const recs = scan.recommendationIds
      .map((id) => DEMO_TRACKS.find((t) => t.id === id))
      .filter((t): t is Track => Boolean(t))
      .map((track, i) => ({ track, score: Math.max(0.1, 1 - i * 0.02), reasons: [] }));
    setActiveVibe({ profile, recommendations: recs, source: scan.source, scanId: scan.id });
    setTheme(buildTheme(profile.primaryColor, profile.secondaryColors[0] ?? "#C08A65"));
  }, []);

  const importTracks = useCallback((metas: Array<{ title: string; artist?: string; album?: string; genre?: string }>) => {
    setUploads((prev) => {
      const next = metas.map((m, i) => trackFromUpload(m, prev.length + i));
      return [...prev, ...next];
    });
  }, []);

  const value: AppContextValue = {
    tracks, savedIds, likedIds, playlists, scans, activeVibe, theme, songDetail, playlistModalTrackIds,
    toggleSave, toggleLike, isSaved: (id) => savedIds.includes(id), isLiked: (id) => likedIds.includes(id),
    createPlaylist, addToPlaylist, removeFromPlaylist, openSong, closeSong,
    openPlaylistModal, closePlaylistModal, applyScan, runPreset, runAnalysis,
    importTracks, signals, restoreScan
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { DEFAULT_PROFILE, DEFAULT_THEME };
