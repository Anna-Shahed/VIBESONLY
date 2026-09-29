"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const discoveredNodes = [
    { title: "Neon Skyline Echoes", author: "Node #402", category: "Ambient" },
    { title: "Submarine Hypertext Dreams", author: "Node #881", category: "Lo-Fi" },
    { title: "Static on the Radio Dial", author: "Node #120", category: "Noise" },
    { title: "Midnight Code & Coffee", author: "Node #554", category: "Synth" }
  ];

  const filtered = discoveredNodes.filter(node => 
    node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 select-none">
      <header className="flex justify-between items-center glass-window px-6 py-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/app" className="font-black text-sm tracking-widest uppercase hover:opacity-75">&larr; Dashboard</Link>
          <span className="text-gray-300">/</span>
          <h1 className="font-extrabold text-lg text-gray-800">Discover Frequencies</h1>
        </div>
      </header>

      <div className="glass-window p-8 rounded-3xl shadow-2xl flex flex-col gap-6 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-black text-gray-900">Explore Archives</h2>
          <input
            type="text"
            placeholder="Search vibes or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 px-5 rounded-2xl bg-white/70 border border-black/10 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm w-full md:w-80 shadow-inner"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/60 border border-white shadow-sm flex flex-col justify-between gap-3 hover:bg-white/95 transition-all">
              <div>
                <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full uppercase tracking-wider">{item.category}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{item.title}</h3>
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-gray-500 border-t border-black/5 pt-3">
                <span>{item.author}</span>
                <button 
                  onClick={() => alert(`Tuned into: ${item.title}`)} 
                  className="bg-black text-white px-4 py-1.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  Tune In
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
