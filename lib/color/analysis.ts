import type { ColorAnalysis, RGB } from "@/types";
import { clamp01, mulberry32, relativeLuminance, rgbToHsl } from "./utils";

function sqDist(a: RGB, b: RGB): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

export function kmeans(
  samples: RGB[],
  k = 5,
  iterations = 8,
  rng: () => number = Math.random
): { centers: RGB[]; counts: number[] } {
  if (samples.length === 0) return { centers: [], counts: [] };
  const centers: RGB[] = [];
  const used = new Set<number>();
  let guard = 0;
  while (centers.length < k && guard < samples.length * 3) {
    const i = Math.floor(rng() * samples.length);
    if (!used.has(i)) { used.add(i); centers.push([...samples[i]]); }
    guard++;
  }
