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
  const counts = new Array(k).fill(0);
  const assign = new Array(samples.length).fill(0);
  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < samples.length; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = sqDist(samples[i], centers[c]);
        if (d < bd) { bd = d; best = c; }
      }
      assign[i] = best;
    }
    const sums = centers.map(() => [0, 0, 0] as [number, number, number]);
    counts.fill(0);
    for (let i = 0; i < samples.length; i++) {
      const c = assign[i];
      counts[c]++;
      sums[c][0] += samples[i][0]; sums[c][1] += samples[i][1]; sums[c][2] += samples[i][2];
    }
    for (let c = 0; c < centers.length; c++) {
      if (counts[c] > 0) centers[c] = [sums[c][0] / counts[c], sums[c][1] / counts[c], sums[c][2] / counts[c]];
    }
  }
  return { centers, counts };
}

export interface AnalyzeOptions { rng?: () => number; maxSamples?: number }

/** Core analysis over raw RGB samples — the unit-testable heart of the pipeline. */
export function analyzePixels(pixels: RGB[], opts: AnalyzeOptions = {}): ColorAnalysis {
  const rng = opts.rng ?? mulberry32(42);
  const maxSamples = opts.maxSamples ?? 4000;
  let samples = pixels;
  if (pixels.length > maxSamples) {
    const step = Math.floor(pixels.length / maxSamples);
    samples = [];
    for (let i = 0; i < pixels.length; i += step) samples.push(pixels[i]);
  }
