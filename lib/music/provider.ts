import type { MusicProvider, Track } from "@/types";
import { DEMO_TRACKS } from "./data";
import { artworkFor, seedFromId } from "./artwork";

/** Local demo provider. External streaming providers can implement the same interface later. */
export class DemoProvider implements MusicProvider {
  id = "demo";
  name = "VIBESONLY Library";
  private tracks: Track[] = DEMO_TRACKS;

  async getTracks(): Promise<Track[]> { return this.tracks; }
  async searchTracks(query: string): Promise<Track[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.tracks;
    return this.tracks.filter((t) =>
      [t.title, t.artist, t.album, t.genre].some((f) => f.toLowerCase().includes(q))
    );
  }
  async getArtwork(trackId: string): Promise<string | null> {
    const t = this.tracks.find((x) => x.id === trackId);
    return t?.artwork ?? null;
  }
  async createPlaylist(name: string) {
    return { id: `provider-pl-${Date.now()}`, name };
  }
  async addTracksToPlaylist(_playlistId: string, _trackIds: string[]): Promise<void> { /* local */ }
}

/** Parse an uploaded playlist file (.json or .csv) into partial track metadata. */
export async function parsePlaylistFile(file: File): Promise<Array<{ title: string; artist?: string; album?: string; genre?: string }>> {
  const text = await file.text();
  const name = file.name.toLowerCase();
  if (name.endsWith(".json")) {
    const data = JSON.parse(text);
    const arr = Array.isArray(data) ? data : data.tracks ?? data.playlists?.[0]?.tracks;
    if (!Array.isArray(arr)) throw new Error("Unrecognised playlist JSON shape");
    return arr.map((raw: any) => ({
      title: String(raw.title ?? raw.name ?? "").trim(),
      artist: raw.artist ? String(raw.artist) : undefined,
      album: raw.album ? String(raw.album) : undefined,
      genre: raw.genre ? String(raw.genre) : undefined
    })).filter((t) => t.title);
  }
  if (name.endsWith(".csv")) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const idx = { title: headers.indexOf("title"), artist: headers.indexOf("artist"), album: headers.indexOf("album"), genre: headers.indexOf("genre") };
    if (idx.title < 0) throw new Error("CSV needs a title column");
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      return {
        title: cols[idx.title] ?? "",
        artist: idx.artist >= 0 ? cols[idx.artist] : undefined,
        album: idx.album >= 0 ? cols[idx.album] : undefined,
        genre: idx.genre >= 0 ? cols[idx.genre] : undefined
      };
    }).filter((t) => t.title);
  }
  throw new Error("Only .json or .csv playlists are supported");
}

/** Convert uploaded metadata into a Track with a deterministic generated artwork. */
export function trackFromUpload(meta: { title: string; artist?: string; album?: string; genre?: string }, index: number): Track {
  const id = `up-${Date.now()}-${index}`;
  const hue = seedFromId(meta.title.toLowerCase()) % 360;
  const palette = [
    `hsl(${hue} 62% 38%)`, `hsl(${(hue + 40) % 360} 55% 55%)`, `hsl(${hue} 30% 16%)`,
    `hsl(${(hue + 160) % 360} 40% 70%)`, `hsl(${hue} 45% 12%)`
  ].map((hsl) => hslToHex(hsl));
  return {
    id,
    title: meta.title,
    artist: meta.artist ?? "Unknown Artist",
    album: meta.album ?? "Imported",
    genre: meta.genre ?? "unknown",
    artwork: artworkFor(id, palette),
    dominantArtworkColor: palette[0],
    artworkPalette: palette,
    mood: ["balanced"],
    energy: 0.5,
    popularity: 0.4,
    duration: 200,
    uploaded: true
  };
}

function hslToHex(hsl: string): string {
  const m = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!m) return "#333333";
  const h = +m[1], s = +m[2] / 100, l = +m[3] / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m2 = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return "#" + [r, g, b].map((v) => Math.round((v + m2) * 255).toString(16).padStart(2, "0")).join("");
}
