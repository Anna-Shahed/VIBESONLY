"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useApp } from "@/lib/store/AppContext";

export function PlaylistModalHost() {
  const { playlistModalTrackIds, closePlaylistModal, playlists, createPlaylist, addToPlaylist, removeFromPlaylist } = useApp();
  const [name, setName] = useState("");

if (!playlistModalTrackIds) return null;
  const ids = playlistModalTrackIds;

  const create = () => {
    if (!name.trim()) return;
    createPlaylist(name.trim(), ids);
    setName("");
    closePlaylistModal();
  };

return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={closePlaylistModal}
      >
<motion.div
          initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
          className="w-full max-w-md bg-vibe-surface border border-vibe-line rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
          role="dialog" aria-modal="true" aria-label="Add to playlist"
        >
          <h3 className="font-display text-xl text-vibe-text mb-1">Add to playlist</h3>
          <p className="text-xs text-vibe-muted mb-5">{ids.length} track{ids.length > 1 ? "s" : ""} selected</p>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {playlists.map((p) => {
              const has = ids.every((id) => p.trackIds.includes(id));
              return (
                <button
                  key={p.id}
