import { mulberry32 } from "@/lib/color/utils";
export function artworkFromPalette(palette: string[], seed: number, size = 600): string {
  const [c0, c1, c2, c3, c4] = palette;
