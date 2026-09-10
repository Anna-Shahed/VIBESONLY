import { describe, expect, it } from "vitest";
import type { RGB } from "@/types";
import { analyzePixels, kmeans } from "./analysis";
import { hexToRgb, rgbToHex, relativeLuminance } from "./utils";
import { classifyVibe } from "@/lib/vibes/classifier";

const solid = (rgb: RGB, n = 1000): RGB[] => Array.from({ length: n }, () => rgb);

describe("color analysis", () => {
  it("extracts a dominant colour from a solid red image", () => {
    const a = analyzePixels(solid([200, 40, 40]), { rng: () => 0.5 });
    const [r, g, b] = a.primary;
    expect(r).toBeGreaterThan(150);
    expect(g).toBeLessThan(100);
    expect(b).toBeLessThan(100);
    expect(a.palette).toHaveLength(5);
    expect(rgbToHex(a.primary)).toBe("#c82828");
  });

  it("is deterministic with a seeded rng", () => {
    const pixels = Array.from({ length: 500 }, (_, i) => [i % 255, (i * 7) % 255, (i * 13) % 255] as RGB);
    const a = analyzePixels(pixels, { rng: () => 0.42 });
    const b = analyzePixels(pixels, { rng: () => 0.42 });
    expect(a).toEqual(b);
  });

  it("classifies a bright blue image as light, cool and vivid", () => {
    const a = analyzePixels(solid([30, 120, 220]), { rng: () => 0.5 });
    expect(a.brightness).toBeGreaterThan(0.4);
    expect(a.temperature).toBeLessThan(-0.5);
    const p = classifyVibe(a);
    expect(p.temperature).toBe("cool");
    expect(p.brightness).toBe("light");
    expect(p.saturation).toBe("vivid");
  });

  it("detects low brightness in a dark image and warm temperature in red", () => {
    const dark = analyzePixels(solid([15, 10, 12]), { rng: () => 0.5 });
    expect(dark.brightness).toBeLessThan(0.1);
    const warm = analyzePixels(solid([180, 60, 30]), { rng: () => 0.5 });
    expect(warm.temperature).toBeGreaterThan(0.5);
  });

  it("handles grayscale without NaN", () => {
    const a = analyzePixels(solid([128, 128, 128]), { rng: () => 0.5 });
    expect(a.hue).toBe(0);
    expect(Number.isNaN(a.temperature)).toBe(false);
  });

  it("kmeans returns the requested number of clusters", () => {
    const { centers } = kmeans(solid([1, 2, 3], 50).concat(solid([250, 240, 230], 50)), 5, 6, () => 0.25);
    expect(centers).toHaveLength(5);
  });

  it("computes luminance in 0..1", () => {
    expect(relativeLuminance([255, 255, 255])).toBeGreaterThan(0.9);
    expect(relativeLuminance([0, 0, 0])).toBe(0);
  });

  it("hex round-trips", () => {
    expect(rgbToHex(hexToRgb("#7a3f4a"))).toBe("#7a3f4a");
    expect(hexToRgb("#abc")).toEqual([170, 187, 204]);
  });
});
