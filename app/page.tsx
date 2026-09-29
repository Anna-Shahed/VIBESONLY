"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const floatingWords = [
  "Connection", "The extension of myself", "Ocean", "Waste of my life",
  "Love", "404", "Interact", "Cyworld", "Social media", "Vibes Only",
  "Digital soul", "Stuff", "Memories", "Static", "Frequency"
];

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 30-second preview track (reliable sample URL)
  const sampleTrackUrl = "https://p.scdn.co/mp3-preview/7d7a8286faee718d7f76326b4847e70e9b46e3ea?cid=96550734a96b42b2b16ea9825b1b4d08";

  useEffect(() => {
    audioRef.current = new Audio(sampleTrackUrl);
    audioRef.current.volume = 0.5;

    const updateProgress = () => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime;
        setProgress((current / 30) * 100);
        if (current >= 30) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
          setProgress(0);
        }
      }
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.error("Playback blocked:", e));
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center z-20">
        <div className="glass-panel px-4 py-2 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          VIBES ONLY // INTERACTIVE ESPACE
        </div>
        <div className="flex gap-3">
          <Link href="/app" className="glass-panel px-5 py-2 rounded-full text-sm font-bold hover:bg-white transition-all shadow-md">
            Enter App &rarr;
          </Link>
        </div>
      </header>

      {/* Floating Hypertext Cloud (Reference Style) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div className="relative w-full h-full max-w-5xl max-h-[600px]">
          {floatingWords.map((word, index) => {
            // Pseudo-random deterministic placement
            const randomX = (index * 23) % 85 + 5;
            const randomY = (index * 37) % 75 + 15;
            const randomSize = index % 3 === 0 ? "text-2xl md:text-4xl font-light" : index % 2 === 0 ? "text-sm md:text-lg font-mono" : "text-base md:text-xl font-bold";
            
            return (
              <div
                key={index}
                style={{ top: `${randomY}%`, left: `${randomX}%` }}
                className={`absolute pointer-events-auto cursor-pointer transition-transform hover:scale-125 hover:text-pink-600 drop-shadow-sm ${randomSize}`}
                onClick={() => alert(`You touched node: "${word}". The internet feels alive.`)}
              >
                {word}
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Interactive Hero Banner */}
      <div className="my-auto z-20 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md mb-4">
          What does the internet feel like to you?
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl font-medium drop-shadow">
          Type your thoughts into the ether, play 30 seconds of immersive soundscapes, and drift through hyperspace.
        </p>
      </div>

      {/* Bottom Interactive Floating Music Player Dock */}
      <div className="z-20 w-full flex justify-center pb-4">
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-6 w-full max-w-xl shadow-2xl">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-xs font-bold uppercase tracking-wider">
              <span>Ambient Soundscape — 30s Preview</span>
              <span>{isPlaying ? "Playing..." : "Paused"}</span>
            </div>
            <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-pink-600 h-full transition-all duration-200" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
