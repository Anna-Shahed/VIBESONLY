import { Track, VibeProfile, RecommendationResult } from "@/types";

export function calculateMatchScore(track: Track, vibe: VibeProfile): RecommendationResult {

  let score = 75;
  if (vibe.temperature === "Warm" && track.mood.includes("Warm")) score += 15;
  if (vibe.visualMood.toLowerCase().includes("cinematic") && track.genre.includes("Cinematic")) score += 10;
  score = Math.min(98, Math.max(62, score + Math.floor(Math.random() * 8)));

  return {
    track,
    matchScore: score,
    explanation: `Shares the ${vibe.temperature.toLowerCase()} tone and ${vibe.visualMood.toLowerCase()} resonance of your captured environment.`
  };
}

export function getRecommendations(tracks: Track[], vibe: VibeProfile): RecommendationResult[] {
  return tracks
    .map(track => calculateMatchScore(track, vibe))
    .sort((a, b) => b.matchScore - a.matchScore);
}
