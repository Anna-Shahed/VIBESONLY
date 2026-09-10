"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { SCENE_PRESETS } from "@/lib/vibes/presets";
import { DEMO_TRACKS } from "@/lib/music/data";

export default function Hero() {
  const reduced = useReducedMotion();
  const preset = SCENE_PRESETS[4]; // sunset
  const [phase, setPhase] = useState(0);
  const matched = [DEMO_TRACKS[12], DEMO_TRACKS[8], DEMO_TRACKS[7]];

  useEffect(() => {
    if (reduced) { setPhase(4); return; }
    const timers = [
      setTimeout(() => setPhase(1), 900),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3400)
    ];
    const loop = setInterval(() => {
      setPhase(0);
      setTimeout(() => setPhase(1), 900);
      setTimeout(() => setPhase(2), 1800);
      setTimeout(() => setPhase(3), 2600);
      setTimeout(() => setPhase(4), 3400);
    }, 7200);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, [reduced]);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center py-16 sm:py-24">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-vibe-accent mb-5">a visual way to find music</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            YOUR SPACE HAS A<br />
            <em className="text-vibe-accent not-italic font-bold">SOUNDTRACK.</em>
          </h1>
          <p className="mt-6 text-vibe-muted text-lg max-w-md">
            Scan the vibe around you. Find the music that belongs in it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/scan" className="vo-btn-primary !px-8 !py-4">SCAN YOUR VIBE</Link>
            <Link href="/app/discover" className="vo-btn-ghost !px-8 !py-4">EXPLORE MUSIC</Link>
          </div>
        </div>

        {/* visual: camera frame → palette → album → count */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-vibe-line shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preset.scene} alt="A warm sunset room — a sample vibe" className="h-full w-full object-cover" />
            {phase >= 1 && !reduced && <div className="scanline" />}
            <div className="absolute inset-x-6 top-6 bottom-6 border border-white/20 rounded-lg pointer-events-none" />

            {phase >= 2 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 left-6 bg-black/60 backdrop-blur rounded-lg p-3">
                <div className="flex gap-1.5">
                  {preset.palette.map((c, i) => (
                    <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }} className="h-6 w-6 rounded-full border border-white/20" style={{ background: c }} />
                  ))}
                </div>
              </motion.div>
            )}

            {phase >= 3 && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="absolute top-6 right-6 flex -space-x-3">
                {matched.slice(0, 2).map((t, i) => (
                  <img key={t.id} src={t.artwork} alt="" className="h-16 w-16 rounded-md border-2 border-black/60 object-cover" style={{ zIndex: 2 - i }} />
                ))}
              </motion.div>
            )}

            {phase >= 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-6 right-6 bg-black/70 backdrop-blur rounded-lg px-3 py-2 text-xs uppercase tracking-[0.2em] text-vibe-accent">
                {matched.length} tracks found for this vibe
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
