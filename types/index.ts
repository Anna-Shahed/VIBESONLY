export interface VibeProfile {
  primaryColor: string;
  secondaryColors: string[];
  brightness: number;
  saturation: number;
  contrast: number;
  temperature: 'Warm' | 'Cool' | 'Neutral';
  visualMood: string;
  confidence: number;
  palette: string[];
}

export interface Track {
  export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  dominantArtworkColor: string;
  artworkPalette: string[];
  genre: string;
  mood: string;
  energy: number;
  popularity: number;
  previewUrl?: string;
}

export interface RecommendationResult {
  track: Track;
  matchScore: number;
  explanation: string;
}
