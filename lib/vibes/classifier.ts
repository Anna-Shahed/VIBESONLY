import type { ColorAnalysis, VibeProfile, BrightnessLabel, SaturationLabel, ContrastLabel, TemperatureLabel } from "@/types";
import { hexToRgb, rgbToHex, rgbToHsl } from "@/lib/color/utils";

export const brightnessLabel = (b: number): BrightnessLabel => (b < 0.3 ? "dark" : b < 0.55 ? "medium" : "light");
