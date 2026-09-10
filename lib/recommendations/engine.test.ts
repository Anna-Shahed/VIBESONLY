import { describe, expect, it } from "vitest";
import { DEMO_TRACKS } from "@/lib/music/data";
import { rankTracks, userTasteProfile, colorOfTheDay, type UserSignals } from "./engine";
import { colorSimilarity, paletteSimilarity, moodSimilarity } from "./similarity";
import { hexToRgb } from "@/lib/color/utils";
import type { VibeProfile } from "@/types";

const emptySignals: UserSignals = { liked: new Set(), saved: new Set(), played: new Set(), playlistIds: new Set() };

const vibe = (palette: string[], mood: string): VibeProfile => ({
  primaryColor: palette[0], secondaryColors: palette.slice(1, 3), palette,
  brightness: "dark", saturation: "medium", contrast: "high",
  temperature: "warm", visualMood: mood, vibeName: mood, confidence: 0.8
});

describe("recommendation engine", () => {
  it("ranks deterministically", () => {
    const profile = vibe(["#8E3B46", "#D28B6A", "#231C1A", "#4A1E26", "#E5C3A0"], "cinematic");
    const a = rankTracks(profile, DEMO_TRACKS, emptySignals);
    const b = rankTracks(profile, DEMO_TRACKS, emptySignals);
    expect(a.map((r) => r.track.id)).toEqual(b.map((r) => r.track.id));
    expect(a.length).toBeGreaterThan(0);
    expect(a.length).toBeLessThanOrEqual(24);
  });

  it("scores a palette-matched track above a mismatched one", () => {
    const redVibe = vibe(["#8E3B46", "#D28B6A", "#231C1A", "#4A1E26", "#E5C3A0"], "cinematic");
    const burgundy = DEMO_TRACKS.find((t) => t.id === "t3")!;
    const ocean = DEMO_TRACKS.find((t) => t.id === "t4")!;
    const recs = rankTracks(redVibe, [burgundy, ocean], emptySignals);
    expect(recs[0].track.id).toBe("t3");
    expect(recs[0].score).toBeGreaterThan(recs[1].score);
  });

  it("palette similarity is symmetric-ish and bounded 0..1", () => {
    const a = ["#8E3B46", "#D28B6A", "#231C1A", "#4A1E26", "#E5C3A0"].map(hexToRgb);
    expect(paletteSimilarity(a, a)).toBeCloseTo(1, 1);
    expect(paletteSimilarity(a, a.map(() => [0, 0, 0] as [number, number, number]))).toBeLessThan(0.5);
    expect(colorSimilarity([255, 0, 0], [255, 0, 0])).toBe(1);
    expect(colorSimilarity([255, 255, 255], [0, 0, 0])).toBe(0);
  });

  it("mood similarity handles empty sets", () => {
    expect(moodSimilarity([], [])).toBe(0.5);
    expect(moodSimilarity(["cinematic"], ["cinematic", "midnight"])).toBeCloseTo(0.5);
  });

  it("returns reasons for strong matches", () => {
    const profile = vibe(["#8E3B46", "#D28B6A", "#231C1A", "#4A1E26", "#E5C3A0"], "cinematic");
    const recs = rankTracks(profile, DEMO_TRACKS, emptySignals, 1);
    expect(recs[0].reasons.length).toBeGreaterThan(0);
  });

  it("empty input returns empty output", () => {
    expect(rankTracks(vibe(["#fff"], "fresh"), [], emptySignals)).toEqual([]);
  });

  it("user affinity boosts a previously saved track", () => {
    const profile = vibe(["#8E3B46", "#D28B6A", "#231C1A", "#4A1E26", "#E5C3A0"], "cinematic");
    const signals: UserSignals = { liked: new Set(), saved: new Set(["t4"]), played: new Set(), playlistIds: new Set() };
    const saved = rankTracks(profile, DEMO_TRACKS, signals, 5).map((r) => r.track.id);
    expect(saved).toContain("t4");
  });

  it("user taste profile is null with no engagement", () => {
    expect(userTasteProfile(emptySignals, DEMO_TRACKS)).toBeNull();
  });

  it("colour of the day returns a valid hex", () => {
    expect(colorOfTheDay(new Date("2024-06-15"))).toMatch(/^#[0-9a-f]{6}$/);
  });
});
