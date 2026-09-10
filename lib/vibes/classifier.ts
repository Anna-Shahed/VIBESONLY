import type { ColorAnalysis, VibeProfile, BrightnessLabel, SaturationLabel, ContrastLabel, TemperatureLabel } from "@/types";
import { hexToRgb, rgbToHex, rgbToHsl } from "@/lib/color/utils";

export const brightnessLabel = (b: number): BrightnessLabel => (b < 0.3 ? "dark" : b < 0.55 ? "medium" : "light");
export const saturationLabel = (s: number): SaturationLabel => (s < 0.2 ? "muted" : s < 0.5 ? "medium" : "vivid");
export const contrastLabel = (c: number): ContrastLabel => (c < 0.3 ? "soft" : c < 0.6 ? "medium" : "high");
export const temperatureLabel = (t: number): TemperatureLabel => (t > 0.25 ? "warm" : t < -0.25 ? "cool" : "neutral");

type Cond = Partial<Record<BrightnessLabel | SaturationLabel | ContrastLabel | TemperatureLabel, true>>;
const MOOD_RULES: Array<[Cond, string]> = [
  [{ dark: true, high: true, warm: true }, "cinematic"],
[{ dark: true, vivid: true, cool: true }, "neon"],
  [{ dark: true, cool: true }, "midnight"],
  [{ dark: true, vivid: true }, "neon"],
  [{ dark: true }, "moody"],
  [{ light: true, muted: true }, "minimal"],
  [{ vivid: true, cool: true }, "dreamy"],
  [{ cool: true, soft: true }, "airy"],
  [{ cool: true }, "fresh"],
  [{ light: true, vivid: true, warm: true }, "golden"],
  [{ muted: true, warm: true }, "earthy"],
  [{ warm: true }, "sunlit"],
  [{ muted: true, soft: true }, "soft"],
  [{ muted: true }, "minimal"],
  [{}, "balanced"]
];

const VIBE_NAMES: Record<string, string> = {
  cinematic: "Midnight Cinema", neon: "Neon Night", midnight: "After Hours", moody: "Low Light",
  minimal: "Clean Slate", dreamy: "Blue Hour", airy: "Open Sky", fresh: "Cold Water",
  golden: "Golden Hour", earthy: "Warm Earth", sunlit: "Late Sun", soft: "Soft Focus",
  balanced: "Clear Day"
};

export function classifyVibe(a: ColorAnalysis): VibeProfile {
  const b = brightnessLabel(a.brightness);
  const s = saturationLabel(a.saturation);
  const c = contrastLabel(a.contrast);
  const t = temperatureLabel(a.temperature);
  const state: Cond = { [b]: true, [s]: true, [c]: true, [t]: true };

  let mood = "balanced";
  for (const [cond, label] of MOOD_RULES) {
    const matches = Object.keys(cond).every((k) => state[k as keyof Cond]);
    if (matches) { mood = label; break; }
  }

  const dominance = a.palette.length ? 1 / a.palette.length : 0;
  const confidence = Math.max(0.4, Math.min(0.98, 0.35 + 0.65 * Math.min(1, dominance * 1.8)));

  return {
    primaryColor: rgbToHex(a.primary),
    secondaryColors: a.palette.slice(1, 3).map(rgbToHex),
    palette: a.palette.slice(0, 5).map(rgbToHex),
    brightness: b,
    saturation: s,
    contrast: c,
    temperature: t,
    visualMood: mood,
    vibeName: VIBE_NAMES[mood] ?? "Clear Day",
    confidence,
    raw: a
  };
}

export function colorName(hex: string): string {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  if (s < 0.12) return l < 0.3 ? "charcoal" : "silver";
  let base = "red";
  if (h < 15 || h >= 345) base = "red";
  else if (h < 40) base = "burnt orange";
  else if (h < 65) base = "gold";
  else if (h < 150) base = "green";
  else if (h < 200) base = "teal";
  else if (h < 260) base = "blue";
  else if (h < 290) base = "violet";
  else if (h < 340) base = "pink";
  return l < 0.3 ? `deep ${base}` : l > 0.72 ? `pale ${base}` : base;
}

export function describeVibe(p: VibeProfile): string {
  return [colorName(p.primaryColor), p.temperature, p.contrast === "high" ? "high contrast" : p.contrast, p.visualMood].join(" · ");
}
lib/vibes/presets.ts


import type { ColorAnalysis } from "@/types";
import { hexToRgb } from "@/lib/color/utils";
import { classifyVibe, type VibeProfile } from "./classifier";

export interface ScenePreset {
  id: string;
  name: string;
  tagline: string;
  scene: string;               // SVG data URI
  palette: string[];
  stats: Omit<ColorAnalysis, "primary" | "palette"> & { palette: string[] };
}

const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const scenes: Record<string, string> = {
  midnightRoom: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <rect width="640" height="800" fill="#160E11"/><circle cx="520" cy="180" r="150" fill="#7A3F4A" opacity="0.55"/>
    <rect x="120" y="140" width="220" height="300" rx="6" fill="#0E090B" stroke="#2A1418" stroke-width="6"/>
    <rect x="140" y="170" width="80" height="90" fill="#3A2A24" opacity="0.8"/>
    <rect x="240" y="170" width="80" height="90" fill="#3A2A24" opacity="0.5"/>
    <circle cx="310" cy="520" r="90" fill="#C08A65" opacity="0.35"/>
    <rect x="0" y="640" width="640" height="160" fill="#0B0708"/>
  </svg>`),
  summerAfternoon: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9C4"/><stop offset="1" stop-color="#A9D8B0"/></linearGradient></defs>
    <rect width="640" height="800" fill="url(#sky)"/><circle cx="480" cy="180" r="70" fill="#FFD9A0"/>
    <path d="M0 560 L160 440 L320 560 L480 470 L640 560 L640 800 L0 800 Z" fill="#7EC8A0"/>
    <path d="M0 660 L200 560 L380 680 L640 590 L640 800 L0 800 Z" fill="#4F9D6E"/>
  </svg>`),
  rainyWindow: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <rect width="640" height="800" fill="#2B3440"/><rect x="60" y="60" width="520" height="680" rx="10" fill="#3A4654"/>
    <rect x="100" y="110" width="200" height="260" fill="#5B6C7C" opacity="0.7"/>
    <rect x="340" y="110" width="200" height="260" fill="#5B6C7C" opacity="0.5"/>
    <rect x="100" y="420" width="200" height="260" fill="#5B6C7C" opacity="0.55"/>
    <rect x="340" y="420" width="200" height="260" fill="#5B6C7C" opacity="0.8"/>
    <g stroke="#9AA7B4" stroke-width="2" opacity="0.5">${Array.from({ length: 18 }, (_, i) => `<line x1="${40 + i * 35}" y1="${80 + (i % 5) * 40}" x2="${20 + i * 35}" y2="${160 + (i % 5) * 40}"/>`).join("")}</g>
  </svg>`),
  ocean: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E9BB8"/><stop offset="1" stop-color="#0A2436"/></linearGradient></defs>
    <rect width="640" height="800" fill="url(#sea)"/>
    <circle cx="320" cy="220" r="60" fill="#BFE8F2" opacity="0.9"/>
    <path d="M0 360 Q160 330 320 360 T640 360" stroke="#7FCBE4" stroke-width="4" fill="none" opacity="0.6"/>
    <path d="M0 460 Q160 430 320 460 T640 460" stroke="#7FCBE4" stroke-width="3" fill="none" opacity="0.4"/>
    <path d="M0 580 Q160 550 320 580 T640 580" stroke="#1B6C8C" stroke-width="4" fill="none" opacity="0.5"/>
  </svg>`),
  sunset: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <defs><linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B1B3D"/><stop offset="0.5" stop-color="#7E3B6E"/><stop offset="1" stop-color="#F2A65A"/></linearGradient></defs>
    <rect width="640" height="800" fill="url(#sunset)"/>
    <circle cx="320" cy="480" r="90" fill="#F7D08A"/>
    <rect x="0" y="640" width="640" height="160" fill="#1A0F26"/>
    <circle cx="150" cy="620" r="6" fill="#F7D08A" opacity="0.7"/><circle cx="480" cy="640" r="5" fill="#F7D08A" opacity="0.6"/><circle cx="360" cy="655" r="4" fill="#F7D08A" opacity="0.7"/>
  </svg>`),
  neonNight: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <rect width="640" height="800" fill="#120A22"/>
    <rect x="80" y="120" width="480" height="8" rx="4" fill="#D14BD6"/><rect x="60" y="200" width="520" height="8" rx="4" fill="#27E0D4"/>
    <circle cx="500" cy="380" r="70" fill="none" stroke="#27E0D4" stroke-width="6"/><circle cx="150" cy="480" r="50" fill="none" stroke="#D14BD6" stroke-width="6"/>
    <path d="M0 620 L640 500" stroke="#6A2FA8" stroke-width="4" opacity="0.8"/>
    <rect x="240" y="660" width="160" height="90" fill="#2A1B54"/>
  </svg>`)
};

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: "midnight-room", name: "Midnight Room", tagline: "burgundy · warm · cinematic", scene: scenes.midnightRoom,
    palette: ["#7A3F4A", "#C08A65", "#3B1F26", "#160E11", "#2A1418"],
    stats: { palette: ["#7A3F4A", "#C08A65", "#3B1F26", "#160E11", "#2A1418"], brightness: 0.16, saturation: 0.42, contrast: 0.58, temperature: 0.55, hue: 8 }
  },
  {
    id: "summer-afternoon", name: "Summer Afternoon", tagline: "golden · light · sunlit", scene: scenes.summerAfternoon,
    palette: ["#FFD9A0", "#7EC8A0", "#E8B04B", "#F7EFE4", "#4F9D6E"],
    stats: { palette: ["#FFD9A0", "#7EC8A0", "#E8B04B", "#F7EFE4", "#4F9D6E"], brightness: 0.72, saturation: 0.5, contrast: 0.35, temperature: 0.4, hue: 40 }
  },
  {
    id: "rainy-window", name: "Rainy Window", tagline: "slate · cool · airy", scene: scenes.rainyWindow,
    palette: ["#5B6C7C", "#9AA7B4", "#3A4654", "#6E7E8E", "#2B3440"],
    stats: { palette: ["#5B6C7C", "#9AA7B4", "#3A4654", "#6E7E8E", "#2B3440"], brightness: 0.42, saturation: 0.16, contrast: 0.3, temperature: -0.5, hue: 210 }
  },
  {
    id: "ocean", name: "Ocean", tagline: "ocean blue · cool · dreamy", scene: scenes.ocean,
    palette: ["#2E9BB8", "#1B6C8C", "#0E3A52", "#7FCBE4", "#0A2436"],
    stats: { palette: ["#2E9BB8", "#1B6C8C", "#0E3A52", "#7FCBE4", "#0A2436"], brightness: 0.4, saturation: 0.62, contrast: 0.42, temperature: -0.75, hue: 205 }
  },
  {
    id: "sunset", name: "Sunset", tagline: "ember · warm · golden", scene: scenes.sunset,
    palette: ["#F2A65A", "#E86A5E", "#7E3B6E", "#2B1B3D", "#F7D08A"],
    stats: { palette: ["#F2A65A", "#E86A5E", "#7E3B6E", "#2B1B3D", "#F7D08A"], brightness: 0.5, saturation: 0.7, contrast: 0.55, temperature: 0.65, hue: 22 }
  },
  {
    id: "neon-night", name: "Neon Night", tagline: "violet · vivid · neon", scene: scenes.neonNight,
    palette: ["#2A1B54", "#D14BD6", "#27E0D4", "#1A1030", "#6A2FA8"],
    stats: { palette: ["#2A1B54", "#D14BD6", "#27E0D4", "#1A1030", "#6A2FA8"], brightness: 0.28, saturation: 0.72, contrast: 0.6, temperature: 0.05, hue: 285 }
  }
];

export function analysisFromPreset(p: ScenePreset): ColorAnalysis {
  const palette = p.stats.palette.map(hexToRgb);
  return { primary: palette[0], palette, brightness: p.stats.brightness, saturation: p.stats.saturation, contrast: p.stats.contrast, temperature: p.stats.temperature, hue: p.stats.hue };
}

export function profileFromPreset(p: ScenePreset): VibeProfile {
  return classifyVibe(analysisFromPreset(p));
}
