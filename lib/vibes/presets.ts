export interface VibePreset {
  id: string;
  name: string;
  description: string;
  colors: string[];
}

export const vibePresets: VibePreset[] = [
  {
    id: "neon",
    name: "Neon Glow",
    description: "Vibrant pinks, purples, and electric blue aesthetics",
    colors: ["#ff7eb3", "#70a1ff", "#ff758c"]
  },
  {
    id: "ambient",
    name: "Submarine Dreams",
    description: "Deep oceanic blue gradients and calm floating hypertext",
    colors: ["#a1c4fd", "#c2e9fb", "#66a6ff"]
  }
];
