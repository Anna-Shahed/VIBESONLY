"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useApp } from "@/lib/store/AppContext";

export function PlaylistModalHost() {
  const { playlistModalTrackIds, closePlaylistModal, playlists, createPlaylist, addToPlaylist, removeFromPlaylist } = useApp();
  const [name, setName] = useState("");
