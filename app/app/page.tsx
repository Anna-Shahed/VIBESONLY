"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [inputText, setInputText] = useState("");
  const [submissions, setSubmissions] = useState<string[]>([
    "Endless scrolling through neon lights",
    "A cozy room filled with ambient music",
    "Digital whispers across the ocean"
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setSubmissions([inputText, ...submissions]);
    setInputText("");
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 select-none">
      {/* Top Header */}
      <header className="flex justify-between items-center glass-panel px-6 py-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-extrabold text-lg tracking-wider hover:opacity-70">&larr; Back</Link>
          <span className="text-gray-400">/</span>
          <h1 className="font-bold text-xl">Vibes Space Explorer</h1>
        </div>
        <div className="text-sm font-semibold bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
          English UI Active
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Left Window: Input transmission */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-xl font-bold mb-2">Send to the Ether</h2>
            <p className="text-sm text-gray-600 mb-4">Type words or phrases about what the internet means to you right now.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. glowing digital memories..."
                className="p-3 rounded-xl bg-white/60 border border-black/10 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <button type="submit" className="bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors">
                Broadcast Vibe
              </button>
            </form>
          </div>
          <div className="mt-6 text-xs text-gray-500 font-mono">
            Status: Connected to live peer stream.
          </div>
        </div>

        {/* Center/Right Window: Live Feed */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-2 flex flex-col shadow-xl">
          <h2 className="text-xl font-bold mb-4">Live Community Stream</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[400px]">
            {submissions.map((sub, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/50 border border-white/80 shadow-sm flex items-center justify-between">
                <span className="font-medium text-gray-800">{sub}</span>
                <span className="text-xs font-mono text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">Node #{idx + 101}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
