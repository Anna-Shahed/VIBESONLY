import { mulberry32 } from "@/lib/color/utils";
export function artworkFromPalette(palette: string[], seed: number, size = 600): string {
const [c0, c1, c2, c3, c4] = palette;
const rng = mulberry32(seed);
const colors = [c0, c1 ?? c0, c2 ?? c0, c3 ?? c0, c4 ?? c0];

const shapes: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cx = Math.round(50 + rng() * (size - 100));
    const cy = Math.round(50 + rng() * (size - 100));
    const r = Math.round(60 + rng() * size * 0.32);
    const fill = colors[Math.floor(rng() * colors.length)];
    const op = (0.35 + rng() * 0.5).toFixed(2);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${op}"/>`);
  }
  for (let i = 0; i < 3; i++) {
    const x1 = Math.round(rng() * size), y1 = Math.round(rng() * size);
    const x2 = Math.round(rng() * size), y2 = Math.round(rng() * size);
    const fill = colors[Math.floor(rng() * colors.length)];
    shapes.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${fill}" stroke-width="${(2 + rng() * 8).toFixed(1)}" opacity="0.5"/>`);
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c2 ?? c1}"/></linearGradient></defs>` +
    `<rect width="${size}" height="${size}" fill="url(#g)"/>` +
    shapes.join("") +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function seedFromId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function artworkFor(id: string, palette: string[]): string {
  return artworkFromPalette(palette, seedFromId(id));
}
lib/music/data.ts


import type { Track } from "@/types";
import { artworkFor } from "./artwork";

type Palette = [string, string, string, string, string];

function def(
  id: number, title: string, artist: string, album: string, genre: string,
  palette: Palette, mood: string[], energy: number, popularity: number, duration: number
): Track {
  return {
    id: `t${id}`, title, artist, album, genre,
    artwork: artworkFor(`t${id}`, palette),
    dominantArtworkColor: palette[0],
    artworkPalette: [...palette],
    mood, energy, popularity, duration
  };
}

export const DEMO_TRACKS: Track[] = [
  def(1, "Midnight Cinema", "Nocta", "After Hours", "ambient", ["#7A3F4A", "#C08A65", "#231C1A", "#3B1F26", "#E0B68A"], ["cinematic", "midnight", "moody"], 0.3, 0.72, 268),
  def(2, "Velvet Room", "Iva Rey", "Velvet Room", "downtempo", ["#5A2A3E", "#B06A55", "#201420", "#8A4A4E", "#D9A05B"], ["cinematic", "moody"], 0.35, 0.68, 243),
  def(3, "Burgundy Static", "Marlow", "Low Light", "electronic", ["#8E3B46", "#D28B6A", "#231C1A", "#4A1E26", "#E5C3A0"], ["cinematic", "midnight", "neon"], 0.5, 0.8, 215),
  def(4, "Cold Water", "Slow Coast", "Tide", "dream pop", ["#2E9BB8", "#1B6C8C", "#0A2436", "#7FCBE4", "#EAF6F8"], ["dreamy", "fresh", "airy"], 0.45, 0.74, 231),
  def(5, "Blue Hour", "Cassiel", "Blue Hour", "shoegaze", ["#3A5A8C", "#7FA8D0", "#16233F", "#A9C6E8", "#2B4466"], ["dreamy", "midnight", "airy"], 0.4, 0.71, 289),
  def(6, "Open Sky", "Vera Strand", "Open Sky", "ambient", ["#9AA7B4", "#5B6C7C", "#E6EBEF", "#2B3440", "#C8D2DA"], ["airy", "fresh", "minimal"], 0.2, 0.6, 312),
  def(7, "Golden Hour", "Owen Hale", "Golden Hour", "indie folk", ["#E8B04B", "#F7D08A", "#B0592E", "#5C3A1E", "#FFE9C4"], ["golden", "sunlit", "earthy"], 0.55, 0.85, 204),
  def(8, "Late Sun", "June Meridian", "Late Sun", "soul", ["#F2A65A", "#E86A5E", "#7E3B6E", "#F7D08A", "#2B1B3D"], ["golden", "sunlit", "cinematic"], 0.6, 0.82, 227),
  def(9, "Neon Night Drive", "Temps", "Afterglow", "synthwave", ["#D14BD6", "#27E0D4", "#2A1B54", "#1A1030", "#F26BFF"], ["neon", "midnight", "cinematic"], 0.75, 0.88, 251),
  def(10, "Violet Circuit", "Lumo", "Circuit", "techno", ["#6A2FA8", "#B06AF0", "#170A26", "#E0B6FF", "#2A1B54"], ["neon", "midnight"], 0.85, 0.79, 342),
  def(11, "Warm Earth", "Ana Field", "Roots", "neo-soul", ["#8A5A3A", "#C08A5A", "#3A2418", "#E0B68A", "#5C3A1E"], ["earthy", "warm", "sunlit"], 0.5, 0.76, 218),
  def(12, "Soft Focus", "Mira Lo", "Soft Focus", "jazz", ["#C9C2B8", "#8A847C", "#4A4642", "#E8E4DE", "#6E6A64"], ["soft", "minimal"], 0.3, 0.62, 195),
  def(13, "Ember", "Wildfire Club", "Ember", "electronic", ["#E86A5E", "#F2A65A", "#7E1E1E", "#2B0A0A", "#FFC9A0"], ["golden", "cinematic", "sunlit"], 0.7, 0.81, 236),
  def(14, "Tide Pool", "Slow Coast", "Tide", "dream pop", ["#1B8C9E", "#7FCBE4", "#0E4A5E", "#D6F2F8", "#0A2436"], ["dreamy", "fresh"], 0.4, 0.7, 247),
  def(15, "Charcoal", "Nocta", "After Hours", "ambient", ["#2A2A2E", "#4A4A50", "#141416", "#8A8A90", "#1C1C1F"], ["moody", "midnight", "minimal"], 0.25, 0.64, 289),
  def(16, "Pale Blue Morning", "Vera Strand", "Open Sky", "classical", ["#A9C6E8", "#7FA8D0", "#EAF2FB", "#3A5A8C", "#D6E4F4"], ["airy", "fresh", "soft"], 0.15, 0.58, 334),
  def(17, "City Rain", "Marlow", "Low Light", "lo-fi", ["#5B6C7C", "#3A4654", "#9AA7B4", "#2B3440", "#C8D2DA"], ["moody", "airy", "midnight"], 0.35, 0.73, 176),
  def(18, "Sun Bleach", "June Meridian", "Late Sun", "indie folk", ["#FFE9C4", "#E8B04B", "#F7D08A", "#7E5A2A", "#FFF6E8"], ["sunlit", "golden", "earthy"], 0.5, 0.77, 213),
  def(19, "After Hours", "Temps", "Afterglow", "synthwave", ["#2A1B54", "#5A3AA8", "#8A5AE0", "#1A1030", "#C0A8F0"], ["midnight", "neon"], 0.65, 0.75, 264),
  def(20, "Rosewater", "Iva Rey", "Velvet Room", "r&b", ["#D96A8A", "#8A3A5A", "#F0C0D0", "#3A1420", "#F8E0E8"], ["moody", "warm"], 0.55, 0.83, 199),
  def(21, "Glasshouse", "Ana Field", "Roots", "neo-soul", ["#7A9E6A", "#B8D8A8", "#2E4A26", "#E8F0DC", "#4A6E3A"], ["earthy", "fresh"], 0.45, 0.69, 222),
  def(22, "Static Bloom", "Lumo", "Circuit", "electronic", ["#27E0D4", "#D14BD6", "#0A2436", "#1A1030", "#7FF0EA"], ["neon", "dreamy"], 0.8, 0.78, 258),
  def(23, "Low Tide", "Wildfire Club", "Ember", "indie", ["#3A5A6A", "#7FA8BC", "#1E3440", "#B8D8E4", "#0E2430"], ["fresh", "airy", "moody"], 0.4, 0.66, 241),
  def(24, "First Light", "Cassiel", "Blue Hour", "dream pop", ["#E8C8A0", "#F0E0C8", "#B08A5A", "#FFF6E8", "#7E5A2A"], ["golden", "sunlit", "soft"], 0.35, 0.72, 206),
  def(25, "Concrete Sunset", "Owen Hale", "Golden Hour", "indie folk", ["#C0703A", "#F2A65A", "#4A2A12", "#E0B080", "#241208"], ["sunlit", "earthy", "golden"], 0.5, 0.7, 228),
  def(26, "Ivory", "Mira Lo", "Soft Focus", "jazz", ["#E8E4DE", "#C9C2B8", "#F8F6F2", "#8A847C", "#FFFDFA"], ["soft", "minimal", "airy"], 0.25, 0.61, 254),
  def(27, "Deep Field", "Nocta", "After Hours", "ambient", ["#16233F", "#2B4466", "#0A1020", "#3A5A8C", "#0E1830"], ["midnight", "cinematic", "airy"], 0.2, 0.63, 401),
  def(28, "Salt & Stone", "Slow Coast", "Tide", "indie", ["#4A6E6A", "#7FA8A0", "#1E3432", "#B8D8D0", "#0E2422"], ["fresh", "earthy"], 0.45, 0.67, 233),
  def(29, "Red Room", "Iva Rey", "Velvet Room", "downtempo", ["#8E1E2E", "#D28B6A", "#2B0A12", "#F0C0A8", "#4A0E18"], ["cinematic", "moody", "warm"], 0.4, 0.74, 258),
  def(30, "Night Bus", "Marlow", "Low Light", "lo-fi", ["#1A2440", "#3A4A70", "#0E1424", "#5A6E9E", "#C8D2EA"], ["midnight", "moody"], 0.3, 0.76, 182),
  def(31, "Honey", "June Meridian", "Late Sun", "soul", ["#E0A030", "#F7D08A", "#8A5A12", "#3A2408", "#FFE9B0"], ["golden", "sunlit", "earthy"], 0.6, 0.8, 215),
  def(32, "Fog", "Vera Strand", "Open Sky", "ambient", ["#9AA0A8", "#C8CCD2", "#5A6068", "#E8EAEC", "#34383E"], ["airy", "minimal", "soft"], 0.15, 0.55, 386),
  def(33, "Laser Hearts", "Temps", "Afterglow", "synthwave", ["#FF3A6E", "#27E0D4", "#2A0A1E", "#0E2430", "#FF9EC0"], ["neon", "midnight"], 0.85, 0.86, 247),
  def(34, "Orchard", "Ana Field", "Roots", "indie folk", ["#6A8E3A", "#A8C86A", "#2E4A12", "#E0EEC0", "#1E3008"], ["earthy", "fresh", "sunlit"], 0.45, 0.65, 219),
  def(35, "Mercury", "Lumo", "Circuit", "techno", ["#C0C8D0", "#7A8490", "#34383E", "#E8EAEC", "#101418"], ["minimal", "neon"], 0.9, 0.71, 356),
  def(36, "Plume", "Cassiel", "Blue Hour", "shoegaze", ["#B06A8A", "#F0C0D8", "#4A2436", "#8A3A5A", "#F8E0F0"], ["dreamy", "moody"], 0.5, 0.68, 274),
  def(37, "Amarillo", "Wildfire Club", "Ember", "funk", ["#F0D020", "#FFE9A0", "#B0800A", "#4A3808", "#FFF6D0"], ["sunlit", "golden"], 0.8, 0.75, 198),
  def(38, "Snowfall", "Vera Strand", "Open Sky", "classical", ["#EAF0F4", "#C8D6DE", "#FFFFFF", "#9AAAB4", "#DEE8EE"], ["airy", "soft", "minimal"], 0.1, 0.59, 421),
  def(39, "Saffron", "Owen Hale", "Golden Hour", "soul", ["#E8A030", "#C0703A", "#5A2A08", "#FFE0A0", "#2A1204"], ["golden", "earthy", "warm"], 0.55, 0.73, 226),
  def(40, "Monochrome", "Nocta", "After Hours", "electronic", ["#141416", "#4A4A50", "#8A8A90", "#1C1C1F", "#B0B0B8"], ["minimal", "moody", "midnight"], 0.5, 0.7, 243)
];

export function getLibraryTracks(): Track[] {
  return DEMO_TRACKS;
}
