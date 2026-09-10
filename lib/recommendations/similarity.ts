import type { RGB } from "@/types";
import { clamp01 } from "@/lib/color/utils";

export function rgbToLab([r, g, b]: RGB): [number, number, number] {
  const f = (v: number) => { v /= 255; return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92; };
  const [R, G, B] = [f(r), f(g), f(b)].map((v) => v * 100);
  let x = R * 0.4124 + G * 0.3576 + B * 0.1805;
  let y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  let z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  x /= 95.047; y /= 100; z /= 108.883;
  const g2 = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [fx, fy, fz] = [g2(x), g2(y), g2(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function labDistance(a: RGB, b: RGB): number {
  const [l1, a1, b1] = rgbToLab(a);
  const [l2, a2, b2] = rgbToLab(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

export function colorSimilarity(a: RGB, b: RGB): number {
  return Math.max(0, clamp01(1 - labDistance(a, b) / 150));
}

export function paletteSimilarity(a: RGB[], b: RGB[]): number {
  if (!a.length || !b.length) return 0;
  const weights = [0.45, 0.25, 0.15, 0.1, 0.05];
  const used = new Array(b.length).fill(false);
  let sum = 0, wsum = 0;
  a.forEach((ca, i) => {
    let best = 0, bestIdx = -1;
    for (let j = 0; j < b.length; j++) {
      if (used[j]) continue;
      const sim = colorSimilarity(ca, b[j]);
      if (sim > best) { best = sim; bestIdx = j; }
    }
    if (bestIdx >= 0) used[bestIdx] = true;
    const w = weights[i] ?? 0.05;
    sum += best * w; wsum += w;
  });
  return clamp01(sum / Math.max(1e-6, wsum));
}

export function moodSimilarity(a: string[], b: string[]): number {
  if (!a.length && !b.length) return 0.5;
  const sa = new Set(a), sb = new Set(b);
  let inter = 0;
  for (const m of sa) if (sb.has(m)) inter++;
  const union = new Set([...sa, ...sb]).size;
  return union ? inter / union : 0.5;
}
