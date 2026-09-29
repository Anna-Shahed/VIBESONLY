import type { Track } from "@/types";

// Base categories of preview URLs from reliable public preview endpoints
const PREVIEW_URLS = [
  "https://p.scdn.co/mp3-preview/7d7a8286faee718d7f76326b4847e70e9b46e3ea?cid=96550734a96b42b2b16ea9825b1b4d08",
  "https://p.scdn.co/mp3-preview/32579b28ab2ea057a62a34494a737d2e0abf97e6?cid=96550734a96b42b2b16ea9825b1b4d08",
  "https://p.scdn.co/mp3-preview/122240974b2f29393e155bc8628373e357608149?cid=96550734a96b42b2b16ea9825b1b4d08",
  "https://p.scdn.co/mp3-preview/612a832e18b87e22008e734bc1a7a08b982bb905?cid=96550734a96b42b2b16ea9825b1b4d08",
  "https://p.scdn.co/mp3-preview/f798a705e49ef2cf111831899140416b170066aa?cid=96550734a96b42b2b16ea9825b1b4d08"
];

const GENRES_AND_MOODS = [
  { genre: "Lo-Fi", moods: ["minimal", "soft", "earthy"] },
  { genre: "Synthwave", moods: ["neon", "midnight", "cinematic"] },
  { genre: "Ambient", moods: ["dreamy", "airy", "balanced"] },
  { genre: "Indie Electronic", moods: ["fresh", "golden", "sunlit"] },
  { genre: "Deep House", moods: ["moody", "neon", "cinematic"] },
  { genre: "Chillhop", moods: ["soft", "minimal", "balanced"] }
];

const ADJECTIVES = ["Digital", "Midnight", "Neon", "Golden", "Submarine", "Velvet", "Astral", "Cyber", "Desert", "Cosmic", "Solar", "Lunar", "Electric", "Silent", "Hidden", "Echoing", "Fading", "Prismatic", "Retro", "Future"];
const NOUNS = ["Sunrise", "Terminal", "Alleyways", "Glow", "Drift", "Night", "Projection", "Rain", "Echoes", "Mirage", "Wave", "Horizon", "Pulse", "Shadow", "Frequency", "Session", "Journey", "Atlas", "Vibe", "Oasis"];
const ARTISTS = ["Ethereal Sound Lab", "Cyber Café", "Synthwave Runner", "Solaris", "Deep Blue Ambient", "Lo-Fi Collective", "Starlight Beats", "Chillhop Session", "Glitch Mob Concept", "Nomad Sounds", "Neon Pulse", "Astral Projection", "Echo Chamber", "Sub-Zero Audio", "Vaporwave State"];

// Dynamically generate 200+ distinct tracks with matching mood tags
export const mockTracks: Track[] = Array.from({ length: 210 }, (_, index) => {
  const id = `${index + 1}`;
  const adj = ADJECTIVES[index % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(index / ADJECTIVES.length) % NOUNS.length];
  const title = `${adj} ${noun} ${index > 20 ? `#${Math.floor(index / 20) + 1}` : ""}`.trim();
  const artist = ARTISTS[index % ARTISTS.length];
  const meta = GENRES_AND_MOODS[index % GENRES_AND_MOODS.length];
  
  return {
    id,
    title,
    artist,
    url: PREVIEW_URLS[index % PREVIEW_URLS.length],
    // Custom internal attributes used by our recommendation engine
    genre: meta.genre,
    moods: meta.moods
  } as Track & { genre: string; moods: string[] };
});

export const DEMO_TRACKS = mockTracks;
export const tracks = mockTracks;
