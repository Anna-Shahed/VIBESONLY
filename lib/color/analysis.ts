import type { ColorAnalysis, RGB } from "@/types";
import { clamp01, mulberry32, relativeLuminance, rgbToHsl } from "./utils";

function sqDist(a: RGB, b: RGB): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

/** Deterministic k-means over RGB samples. */
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
  const { centers, counts } = kmeans(samples, 5, 8, rng);
  const order = centers.map((_, i) => i).sort((a, b) => counts[b] - counts[a]);
  const palette = order.map((i) => centers[i].map(Math.round) as RGB);

  let lumSum = 0, lumSq = 0, satSum = 0, warm = 0, cool = 0, n = 0;
  let sx = 0, sy = 0, sw = 0;
  for (const p of samples) {
    const [h, s, l] = rgbToHsl(p);
    const lum = relativeLuminance(p);
    lumSum += lum; lumSq += lum * lum; n++;
    satSum += s;
    warm += s * (0.5 + 0.5 * Math.cos(((h - 30) * Math.PI) / 180));
    cool += s * (0.5 + 0.5 * Math.cos(((h - 210) * Math.PI) / 180));
    if (s > 0.15) { sx += Math.cos((h * Math.PI) / 180) * s; sy += Math.sin((h * Math.PI) / 180) * s; sw += s; }
  }
  const meanLum = n ? lumSum / n : 0;
  const brightness = clamp01(meanLum);
  const contrast = clamp01(Math.sqrt(Math.max(0, lumSq / Math.max(1, n) - meanLum * meanLum)) * 2.8);
  const saturation = clamp01(n ? satSum / n : 0);
  const temperature = warm + cool > 1e-6 ? (warm - cool) / (warm + cool) : 0;
  const hue = sw > 0 ? (Math.atan2(sy, sx) * 180) / Math.PI : 0;
  const hueNorm = ((hue % 360) + 360) % 360;
  return {
    primary: palette[0] ?? [0, 0, 0],
    palette,
    brightness,
    saturation,
    contrast,
    temperature,
    hue: hueNorm
  };
}

/** Downsample an image source and analyze it. Canvas is forced to sRGB for consistency. */
export async function analyzeImage(
  image: HTMLImageElement | HTMLCanvasElement | VideoFrame,
  maxDim = 96
): Promise<ColorAnalysis> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" });
  if (!ctx) throw new Error("Canvas 2D not supported");
  const w = (image as HTMLImageElement).width, h = (image as HTMLImageElement).height;
  const scale = Math.min(1, maxDim / Math.max(1, Math.max(w, h)));
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  ctx.drawImage(image as CanvasImageSource, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixels: RGB[] = [];
  for (let i = 0; i < data.length; i += 4) pixels.push([data[i], data[i + 1], data[i + 2]]);
  return analyzePixels(pixels);
}
