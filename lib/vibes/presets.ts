import type { ColorAnalysis, VibeProfile } from "@/types";
import { classifyVibe } from "./classifier";

export interface ScenePreset {
  id: string;
  name: string;
  description: string;
  colors: string[];
}

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: "neon",
    name: "Neon Night",
    description: "Vibrant high-contrast city lights and dark aesthetics",
    colors: ["#120024", "#ff007f", "#7928ca", "#00dfd8"]
  },
  {
    id: "sunset",
    name: "Golden Sunset",
    description: "Warm glowing oranges, soft yellows, and cozy light",
    colors: ["#2b1000", "#ff7a00", "#ffb800", "#ff4d4d"]
  },
  {
    id: "minimal",
    name: "Clean Slate",
    description: "Muted tones, soft bright space, minimalist white and grey",
    colors: ["#f8f9fa", "#e9ecef", "#ced4da", "#6c757d"]
  }
];

export function profileFromPreset(preset: ScenePreset): VibeProfile {
  // Convert preset colors to a mock ColorAnalysis structure for classifier
  const mockAnalysis: ColorAnalysis = {
    primary: [255, 0, 127],
    palette: preset.colors.map(c => [100, 100, 100]),
    brightness: 0.4,
    saturation: 0.8,
    contrast: 0.7,
    temperature: 0.2
  };
  return classifyVibe(mockAnalysis);
}
