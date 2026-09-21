import { hexToRgb, hslCss, rgbToHsl } from "./utils";

export interface ThemeTokens {
  bg: string; surface: string; surface2: string;
  accent: string; accent2: string;
  text: string; muted: string; border: string; highlight: string;
  glass: string; glow: string;
}

export const THEME_VARS = [
  "bg", "surface", "surface2", "accent", "accent2", "text", "muted", "border", "highlight", "glass", "glow"
] as const;

export function buildTheme(primaryHex: string, secondaryHex: string): ThemeTokens {
  const p = hexToRgb(primaryHex);
  const s = hexToRgb(secondaryHex);
  const [ph, ps, pl] = rgbToHsl(p);
  const [sh, ss] = rgbToHsl(s);

  let accentL = pl;
  if (pl < 0.35) accentL = Math.min(0.62, pl + 0.32);
  if (pl > 0.72) accentL = 0.68;
  const accent = hslCss(ph, Math.max(0.45, ps), accentL);
  const accent2 = hslCss(sh, Math.max(0.4, ss), 0.72);
