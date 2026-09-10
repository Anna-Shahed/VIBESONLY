import type { Recommendation, Track, VibeProfile } from "@/types";
import { hexToRgb, rgbToHex, rgbToHsl } from "@/lib/color/utils";
import { colorName } from "@/lib/vibes/classifier";
import { colorSimilarity, moodSimilarity, paletteSimilarity } from "./similarity";

export interface UserSignals {
  liked: Set<string>;
  saved: Set<string>;
  played: Set<string>;
  playlistIds: Set<string>;
}

const GENRE_BY_MOOD: Record<string, string[]> = {
  cinematic: ["ambient", "downtempo", "electronic", "synthwave", "indie"],
  midnight: ["lo-fi", "r&b", "downtempo", "hip-hop"],
  neon: ["synthwave", "electronic", "techno", "house"],
  moody: ["shoegaze", "dream pop", "indie", "lo-fi"],
  dreamy: ["dream pop", "shoegaze", "ambient", "electronic"],
  airy: ["ambient", "classical", "indie folk", "lo-fi"],
  fresh: ["indie", "dream pop", "electronic", "funk"],
  golden: ["soul", "indie folk", "r&b", "jazz"],
  earthy: ["neo-soul", "jazz", "indie folk", "r&b"],
  sunlit: ["indie folk", "pop", "soul", "funk"],
  minimal: ["ambient", "classical", "jazz", "techno"],
  soft: ["jazz", "classical", "lo-fi", "ambient"],
  balanced: ["indie", "pop", "electronic"]
};

export function genreAffinity(mood: string, genre: string): number {
  const list = GENRE_BY_MOOD[mood] ?? [];
  return list.includes(genre) ? 1 : list.length ? 0.4 : 0.5;
}

export function energyFromProfile(p: VibeProfile): number {
  const sat = p.saturation === "vivid" ? 1 : p.saturation === "medium" ? 0.55 : 0.25;
  const con = p.contrast === "high" ? 1 : p.contrast === "medium" ? 0.55 : 0.3;
  return Math.max(0.05, Math.min(1, 0.2 + sat * 0.4 + con * 0.4));
}

export function profileFromTrack(track: Track): VibeProfile {
  return {
    primaryColor: track.dominantArtworkColor,
    secondaryColors: track.artworkPalette.slice(1, 3),
    palette: track.artworkPalette,
    brightness: "medium",
    saturation: "medium",
    contrast: "medium",
    temperature: "neutral",
    visualMood: track.mood[0] ?? "balanced",
    vibeName: track.mood[0] ?? "Clear Day",
    confidence: 0.6
  };
}

export function rankTracks(
  profile: VibeProfile,
  tracks: Track[],
  signals: UserSignals,
  limit = 40
): Recommendation[] {
  const profileRgb = profile.palette.map(hexToRgb);
  const primaryRgb = hexToRgb(profile.primaryColor);
  const profileMood = [profile.visualMood];
  const vibeEnergy = energyFromProfile(profile);

  const scored = tracks.map((track) => {
    const artRgb = track.artworkPalette.map(hexToRgb);
    const primaryScore = colorSimilarity(primaryRgb, hexToRgb(track.dominantArtworkColor));
    const palScore = paletteSimilarity(profileRgb, artRgb);
    const moodScore = moodSimilarity(profileMood, track.mood);
    const genreScore = genreAffinity(profile.visualMood, track.genre);
    const energyScore = Math.max(0, 1 - Math.abs(vibeEnergy - track.energy));
    const affinity = signals.liked.has(track.id) ? 1
      : signals.saved.has(track.id) ? 0.8
      : signals.played.has(track.id) ? 0.6
      : signals.playlistIds.has(track.id) ? 0.5 : 0;

    const score = Math.max(0, Math.min(1,
      0.3 * primaryScore + 0.2 * palScore + 0.15 * moodScore +
      0.1 * genreScore + 0.1 * energyScore + 0.15 * affinity
    ));

    const reasons: string[] = [];
    if (primaryScore >= 0.7 || palScore >= 0.7) {
      const c2 = track.artworkPalette[1] ? colorName(track.artworkPalette[1]) : colorName(track.dominantArtworkColor);
      reasons.push(`The artwork shares the ${colorName(profile.primaryColor)} and ${c2} palette from your scan.`);
    }
    if (moodScore >= 0.5) reasons.push(`It sits naturally in the ${profile.visualMood} mood of your space.`);
    if (genreScore >= 1) reasons.push(`Its ${track.genre} sound fits the ${profile.visualMood} atmosphere.`);
    if (energyScore >= 0.7) reasons.push(`The energy matches the moment.`);
    if (affinity > 0) reasons.push(`You've engaged with this one before.`);

    return { track, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score || a.track.title.localeCompare(b.track.title));
  return scored.slice(0, limit);
}

export function userTasteProfile(signals: UserSignals, tracks: Track[]): VibeProfile | null {
  const engaged = tracks.filter(
    (t) => signals.liked.has(t.id) || signals.saved.has(t.id) || signals.playlistIds.has(t.id)
  );
  if (!engaged.length) return null;
  const palette = engaged.slice(0, 3).flatMap((t) => t.artworkPalette).slice(0, 5);
  const moods = engaged.flatMap((t) => t.mood);
  const moodCounts = new Map<string, number>();
  for (const m of moods) moodCounts.set(m, (moodCounts.get(m) ?? 0) + 1);
  const topMood = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "balanced";
  const [h, s, l] = rgbToHsl(hexToRgb(engaged[0].dominantArtworkColor));
  return {
    primaryColor: engaged[0].dominantArtworkColor,
    secondaryColors: engaged[0].artworkPalette.slice(1, 3),
    palette,
    brightness: l < 0.3 ? "dark" : l < 0.55 ? "medium" : "light",
    saturation: s < 0.2 ? "muted" : s < 0.5 ? "medium" : "vivid",
    contrast: "medium",
    temperature: h >= 70 && h <= 250 ? "cool" : h < 70 ? "warm" : "warm",
    visualMood: topMood,
    vibeName: topMood,
    confidence: 0.7
  };
}

export function colorOfTheDay(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const hue = (day * 137.508) % 360;
  return rgbToHex(hslToRgb(hue, 0.6, 0.45));
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
