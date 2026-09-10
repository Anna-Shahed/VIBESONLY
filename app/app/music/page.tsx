"use client";

import { useCallback, useRef, useState } from "react";
import { useApp } from "@/lib/store/AppContext";
import { TrackCard } from "@/features/music/TrackCard";
import { EmptyState, SectionHeading } from "@/components/ui/primitives";
import { parsePlaylistFile } from "@/lib/music/provider";

const GENRES = ["All", "ambient", "electronic", "dream pop", "synthwave", "indie folk", "neo-soul", "jazz", "lo-fi", "r&b", "classical", "techno", "soul", "funk", "downtempo", "shoegaze", "indie"];

export default function MusicPage() {
  const { tracks, importTracks, playlists } = useApp();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = tracks.filter((t) => {
    const q = query.toLowerCase();
    const matchesQ = !q || [t.title, t.artist, t.album].some((f) => f.toLowerCase().includes(q));
    const matchesG = genre === "All" || t.genre === genre;
    return matchesQ && matchesG;
  });

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        const metas = await parsePlaylistFile(file);
        if (metas.length) importTracks(metas);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Couldn't parse that file");
    }
  }, [importTracks]);

  return (
    <div className="space-y-10">
      <SectionHeading kicker="library" title="My Music" />

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums…"
          aria-label="Search library"
          className="flex-1 bg-vibe-surface border border-vibe-line rounded-lg px-4 py-3 text-sm placeholder:text-vibe-muted focus:outline-none focus:border-vibe-accent"
        />
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a playlist file (json or csv)"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); void handleFiles(e.dataTransfer.files); }}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-dashed text-xs uppercase tracking-widest transition-colors cursor-pointer ${dragOver ? "border-vibe-accent text-vibe-accent" : "border-vibe-line text-vibe-muted hover:border-vibe-accent"}`}
        >
          ⬆ Upload playlist (.json / .csv)
          <input ref={fileRef} type="file" accept=".json,.csv" multiple className="hidden" onChange={(e) => { void handleFiles(e.target.files); e.target.value = ""; }} />
        </div>
      </div>
      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {GENRES.map((g) => (
          <button key={g} onClick={() => setGenre(g)} className={`vo-chip whitespace-nowrap ${genre === g ? "!text-vibe-accent !border-vibe-accent" : ""}`}>
            {g}
          </button>
        ))}
      </div>

      {playlists.length > 0 && (
        <section>
          <h3 className="font-display text-xl mb-3">Playlists</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {playlists.map((p) => (
              <div key={p.id} className="vo-card rounded-lg p-4">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs text-vibe-muted mt-1">{p.trackIds.length} tracks</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {filtered.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map((t) => <TrackCard key={t.id} track={t} className="w-full" />)}
        </div>
      ) : (
        <EmptyState
          title="Your music is waiting"
          body="Add some songs to start building your soundtrack. Upload a playlist file, or browse Discover."
          action={<button className="vo-btn-primary" onClick={() => fileRef.current?.click()}>Upload a playlist</button>}
        />
      )}
    </div>
  );
}
