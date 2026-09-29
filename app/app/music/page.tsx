"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

export default function MusicStationPage() {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    { id: "1", title: "Digital Sunrise Preview", artist: "Ethereal Sound Lab", url: "https://p.scdn.co/mp3-preview/7d7a8286faee718d7f76326b4847e70e9b46e3ea?cid=96550734a96b42b2b16ea9825b1b4d08" },
    { id: "2", title: "Midnight Terminal Session", artist: "Cyber Café", url: "https://p.scdn.co/mp3-preview/3d837648348268482648364826482?cid=96550734a96b42b2b16ea9825b1b4d08" }
  ];

  const handlePlayTrack = (trackId: string, url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playingTrack === trackId) {
      setPlayingTrack(null);
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().then(() => {
      setPlayingTrack(trackId);
    }).catch(e => console.error("Playback error:", e));

    audio.onended = () => setPlayingTrack(null);
  };

  return (
    <main className="min-h-screen p-6 flex flex-col gap-6 select-none">
      <header className="flex justify-between items-center glass-window px-6 py-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/app" className="font-black text-sm tracking-widest uppercase hover:opacity-75">&larr; Dashboard</Link>
          <span className="text-gray-300">/</span>
          <h1 className="font-extrabold text-lg text-gray-800">Soundscape Station</h1>
        </div>
      </header>

      <div className="glass-window p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
        <h2 className="text-2xl font-black text-gray-900">30-Second Preview Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <div key={track.id} className="p-5 rounded-2xl bg-white/60 border border-white shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{track.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{track.artist}</p>
              </div>
              <button
                onClick={() => handlePlayTrack(track.id, track.url)}
                className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform shadow-lg"
              >
                {playingTrack === track.id ? "❚❚" : "▶"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
