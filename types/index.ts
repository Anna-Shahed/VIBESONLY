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
