"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store/AppContext";
import { SCENE_PRESETS, type ScenePreset } from "@/lib/vibes/presets";
import { PaletteDots } from "@/components/ui/primitives";
import { TrackCard } from "@/features/music/TrackCard";
import { describeVibe } from "@/lib/vibes/classifier";

export default function DemoSection() {
  const { runPreset, activeVibe } = useApp();
  const [selected, setSelected] = useState<ScenePreset | null>(null);
  const [thinking, setThinking] = useState(false);

  const pick = (p: ScenePreset) => {
    setSelected(p);
    setThinking(true);
    setTimeout(() => {
      runPreset(p);
      setThinking(false);
    }, 900);
  };

  const result = selected ? activeVibe : null;

  return (
    <section id="demo" className="border-t border-vibe-line py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-vibe-accent mb-3">Try it now</p>
        <h2 className="font-display text-3xl sm:text-5xl mb-4">No camera? No problem.</h2>
        <p className="text-vibe-muted max-w-lg mb-10">Pick a sample vibe and watch the full pipeline run — palette, mood, and the music that matches.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {SCENE_PRESETS.map((p) => (
            <button key={p.id} onClick={() => pick(p)} className={`text-left vo-card rounded-xl overflow-hidden transition-colors ${selected?.id === p.id ? "border-vibe-accent" : "hover:border-vibe-accent"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.scene} alt={`${p.name} scene`} loading="lazy" className="aspect-square w-full object-cover" />
              <div className="p-2.5">
                <p className="text-xs font-semibold truncate">{p.name}</p>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {thinking && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center">
              <p className="font-display text-3xl tracking-[0.2em] vo-pulse">MATCHING…</p>
            </motion.div>
          )}
          {!thinking && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="vo-card rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-4">
                  <img src={selected!.scene} alt="" className="h-24 w-24 rounded-lg object-cover border border-vibe-line" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-vibe-accent">your vibe</p>
                    <h3 className="font-display text-3xl">{result.profile.vibeName}</h3>
                    <p className="text-xs text-vibe-muted mt-1">{describeVibe(result.profile)}</p>
                  </div>
                </div>
                <div className="sm:ml-auto">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-vibe-muted mb-2">palette</p>
                  <PaletteDots colors={result.profile.palette} size={24} />
                </div>
              </div>
              <div className="mt-6 border-t border-vibe-line pt-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-vibe-accent mb-4">found your soundtrack</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {result.recommendations.slice(0, 6).map((r) => <TrackCard key={r.track.id} track={r.track} match={r.score} className="w-full" />)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
