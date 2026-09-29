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
  cinematic: "Midnight Cinema",
  neon: "Neon Night",
  midnight: "After Hours",
  moody: "Low Light",
  minimal: "Clean Slate",
  dreamy: "Blue Hour",
  airy: "Open Sky",
  fresh: "Cold Water",
  golden: "Golden Hour",
  earthy: "Warm Earth",
  sunlit: "Late Sun",
  soft: "Soft Focus",
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
    if (matches) {
      mood = label;
      break;
    }
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
