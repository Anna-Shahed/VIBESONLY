"use client";

import { motion } from "framer-motion";
import type { Track } from "@/types";
import { useApp } from "@/lib/store/AppContext";
import { usePlayer } from "@/lib/player/PlayerContext";

export function TrackCard({ track, match, reason, className = "" }: { track: Track; match?: number; reason?: string; className?: string }) {
  const { toggleSave, isSaved, openSong, openPlaylistModal, signals } = useApp();
  const { playTrack } = usePlayer();
  const saved = isSaved(track.id);
  const liked = signals.liked.has(track.id);

  return (
    <motion.article
      layout
      className={`group w-[160px] sm:w-[190px] shrink-0 snap-start select-none ${className}`}
      onClick={() => openSong(track, match !== undefined ? { match, reasons: reason ? [reason] : undefined } : undefined)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") openSong(track); }}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-vibe-surface2 border border-vibe-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.artwork}
          alt={`${track.album} — ${track.artist}`}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {match !== undefined && (
          <span className="absolute top-2 left-2 vo-chip vo-chip-accent !bg-black/60 backdrop-blur">
            {Math.round(match * 100)}% MATCH
          </span>
        )}
        <button
          aria-label={saved ? "Remove from saved" : "Save track"}
          onClick={(e) => { e.stopPropagation(); toggleSave(track.id); }}
          className={`absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur transition-all ${saved ? "text-vibe-accent opacity-100" : "text-white opacity-0 group-hover:opacity-100 focus:opacity-100"}`}
        >
          {saved ? "♥" : "♡"}
        </button>
        <button
          aria-label={`Play ${track.title}`}
          onClick={(e) => { e.stopPropagation(); playTrack(track); }}
          className="absolute inset-0 m-auto h-12 w-12 scale-75 rounded-full bg-vibe-accent text-black text-sm font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center"
        >
          ▶
        </button>
      </div>
      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-sm font-semibold text-vibe-text">{track.title}</h3>
        <p className="truncate text-xs text-vibe-muted">{track.artist}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-vibe-muted/70">{track.genre}</span>
          <button
            aria-label="Add to playlist"
            onClick={(e) => { e.stopPropagation(); openPlaylistModal([track.id]); }}
            className="ml-auto text-[11px] text-vibe-muted hover:text-vibe-accent"
          >
            + playlist
          </button>
          {liked && <span className="text-[10px] text-vibe-accent" title="Liked">♥</span>}
        </div>
      </div>
    </motion.article>
  );
}
