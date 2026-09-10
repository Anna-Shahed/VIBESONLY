"use client";

import { usePlayer } from "@/lib/player/PlayerContext";
import { useApp } from "@/lib/store/AppContext";
import { usePathname } from "next/navigation";

export function PlayerSlot() {
  const pathname = usePathname();
  const { current, playing, toggle, next, prev, progress, duration, seekTo } = usePlayer();
  const { toggleSave, isSaved, openSong } = useApp();
  if (!current || pathname === "/") return null;

  const saved = isSaved(current.id);
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pb-safe">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 pb-3">
        <div className="bg-vibe-surface2/95 backdrop-blur border border-vibe-line rounded-xl shadow-2xl overflow-hidden">
          <button
            aria-label={`Seek in ${current.title}`}
            className="block w-full h-1.5 bg-vibe-surface cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seekTo(((e.clientX - rect.left) / rect.width) * duration);
            }}
          >
            <span className="block h-full bg-vibe-accent" style={{ width: `${pct}%` }} />
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
            {}
            <img
              src={current.artwork} alt=""
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-md object-cover cursor-pointer border border-vibe-line"
              onClick={() => openSong(current)}
            />
            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openSong(current)}>
              <p className="truncate text-sm font-semibold text-vibe-text">{current.title}</p>
              <p className="truncate text-xs text-vibe-muted">{current.artist} · preview</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-vibe-muted">
              <span>{fmt(progress)}</span><span>/{fmt(duration)}</span>
            </div>
            <button aria-label="Previous" onClick={prev} className="text-vibe-text hover:text-vibe-accent px-2">⏮</button>
            <button
              aria-label={playing ? "Pause" : "Play"}
              onClick={toggle}
              className="grid h-10 w-10 place-items-center rounded-full bg-vibe-accent text-black font-bold"
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <button aria-label="Next" onClick={next} className="text-vibe-text hover:text-vibe-accent px-2">⏭</button>
            <button
              aria-label={saved ? "Remove from saved" : "Save"}
              onClick={() => toggleSave(current.id)}
              className={`px-2 text-lg ${saved ? "text-vibe-accent" : "text-vibe-muted hover:text-vibe-text"}`}
            >
              {saved ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
