import type { ThemeTokens } from "@/lib/store/themeTypes";
import { hexToRgb, hslCss, rgbToHsl } from "./utils";

export interface ThemeTokens {
  bg: string; surface: string; surface2: string;
  accent: string; accent2: string;
  text: string; muted: string; border: string; highlight: string;
}

export const THEME_VARS = [
  "bg", "surface", "surface2", "accent", "accent2", "text", "muted", "border", "highlight"
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

  return {
    bg: hslCss(ph, ps * 0.4, 0.05),
    surface: hslCss(ph, ps * 0.32, 0.095),
    surface2: hslCss(ph, ps * 0.28, 0.15),
    accent,
    accent2,
    text: hslCss(ph, 0.22, 0.93),
    muted: hslCss(ph, 0.14, 0.62),
    border: hslCss(ph, ps * 0.18, 0.23),
    highlight: accent2
  };
}

export function applyTheme(tokens: ThemeTokens) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const key of THEME_VARS) root.style.setProperty(`--vo-${key}`, tokens[key]);
}
