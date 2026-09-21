export type RGB = [number, number, number];


export type BrightnessLabel = "dark" | "medium" | "light";
export type SaturationLabel = "muted" | "medium" | "vivid";
export type ContrastLabel = "soft" | "medium" | "high";
export type TemperatureLabel = "warm" | "cool" | "neutral";


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


}

  addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void>;
}
