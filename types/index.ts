export type RGB = [number, number, number];

export interface ColorAnalysis {
  primary: RGB;
  palette: RGB[];
  brightness: number;   // 0..1
  saturation: number;   // 0..1
  contrast: number;     // 0..1
  temperature: number;  // -1 cool .. +1 warm
  hue: number;          // 0..360
}

export type BrightnessLabel = "dark" | "medium" | "light";
export type SaturationLabel = "muted" | "medium" | "vivid";
export type ContrastLabel = "soft" | "medium" | "high";
export type TemperatureLabel = "warm" | "cool" | "neutral";

export interface VibeProfile {
  primaryColor: string;
  secondaryColors: string[];
  palette: string[];
  brightness: BrightnessLabel;
  saturation: SaturationLabel;
  contrast: ContrastLabel;
  temperature: TemperatureLabel;
  visualMood: string;
  vibeName: string;
  confidence: number;
  raw?: ColorAnalysis;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  artwork: string;               // data URI (procedural SVG from palette)
  dominantArtworkColor: string;
  artworkPalette: string[];
  mood: string[];
  energy: number;                // 0..1
  popularity: number;            // 0..1
  duration: number;              // seconds
  uploaded?: boolean;
}

export interface Recommendation {
  track: Track;
  score: number;                 // 0..1
  reasons: string[];
}

export interface LocalPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}

export interface VibeScan {
  id: string;
  createdAt: number;
  palette: string[];
  primaryColor: string;
  temperature: TemperatureLabel;
  brightness: BrightnessLabel;
  saturation: SaturationLabel;
  contrast: ContrastLabel;
  mood: string;
  vibeName: string;
  confidence: number;
  recommendationIds: string[];
  source: "camera" | "sample";
}

export interface ActiveVibe {
  profile: VibeProfile;
  recommendations: Recommendation[];
  source: "camera" | "sample";
  scanId?: string;
}

export interface MusicProvider {
  id: string;
  name: string;
  getTracks(): Promise<Track[]>;
  searchTracks(query: string): Promise<Track[]>;
  getArtwork(trackId: string): Promise<string | null>;
  createPlaylist(name: string): Promise<{ id: string; name: string }>;
  addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void>;
}
