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
