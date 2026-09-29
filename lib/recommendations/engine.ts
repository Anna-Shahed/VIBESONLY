import type { Track, VibeProfile } from "@/types";

export function rankTracks(allTracks: Track[], profile: VibeProfile): Track[] {
  // Score every track based on how well its tags match the VibeProfile
  const scoredTracks = allTracks.map((track) => {
    let score = 0;
    const t = track as Track & { moods?: string[] };

    // Match visual mood (e.g., "neon", "midnight", "minimal", "cinematic")
    if (t.moods && t.moods.includes(profile.visualMood)) {
      score += 10;
    }

    // Match temperature alignment (warm vibes get a boost for warm audio tags, etc.)
    if (profile.temperature === "warm" && (track.title.includes("Golden") || track.title.includes("Solar"))) {
      score += 5;
    } else if (profile.temperature === "cool" && (track.title.includes("Midnight") || track.title.includes("Submarine"))) {
      score += 5;
    }

    // Add a slight pseudo-random variance based on track ID so results feel fresh on every scan
    const randomHash = Math.abs(Math.sin(parseInt(track.id) * 999)) * 3;
    score += randomHash;

    return { track, score };
  });

  // Sort descending by highest score
  scoredTracks.sort((a, b) => b.score - a.score);

  // Return just the sorted tracks
  return scoredTracks.map((item) => item.track);
}
