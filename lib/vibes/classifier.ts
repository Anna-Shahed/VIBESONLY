import type { ColorAnalysis, VibeProfile, BrightnessLabel, SaturationLabel, ContrastLabel, TemperatureLabel } from "@/types";
import { hexToRgb, rgbToHex, rgbToHsl } from "@/lib/color/utils";

export const brightnessLabel = (b: number): BrightnessLabel => (b < 0.3 ? "dark" : b < 0.55 ? "medium" : "light");
export const saturationLabel = (s: number): SaturationLabel => (s < 0.2 ? "muted" : s < 0.5 ? "medium" : "vivid");
export const contrastLabel = (c: number): ContrastLabel => (c < 0.3 ? "soft" : c < 0.6 ? "medium" : "high");
export const temperatureLabel = (t: number): TemperatureLabel => (t > 0.25 ? "warm" : t < -0.25 ? "cool" : "neutral");
