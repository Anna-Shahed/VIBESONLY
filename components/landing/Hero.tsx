"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { SCENE_PRESETS } from "@/lib/vibes/presets";
import { DEMO_TRACKS } from "@/lib/music/data";

export default function Hero() {
  const reduced = useReducedMotion();
  const preset = SCENE_PRESETS[4]; 
  const [phase, setPhase] = useState(0);
  const matched = [DEMO_TRACKS[12], DEMO_TRACKS[8], DEMO_TRACKS[7]];

  useEffect(() => {
    if (reduced) { setPhase(4); return; }
    const cycle = () => {
      setPhase(0);
      [900, 1800, 2600, 3400].forEach((d, i) => setTimeout(() => setPhase(i + 1), d));
    };
    cycle();
    const loop = setInterval(cycle, 7200);
    return () => clearInterval(loop);
  }, [reduced]);

  return (
    <section className="relative min-h-svh flex items-center overflow-hidden">
      {}
      <div className="absolute inset-0 -z-10">
        <video autoPlay muted loop playsInline poster={preset.scene} className="h-full w-full object-cover opacity-45">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/35 to-transparent" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 40%, transparent 55%, #050506 100%)" }} />
        <div className="caustics" aria-hidden>
          <span style={{ width: "45%", height: "45%", top: "8%", left: "-10%" }} />
          <span style={{ width: "35%", height: "35%", bottom: "5%", right: "-8%", animationDelay: "-3s" }} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center py-20 sm:py-28 w-full">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-vibe-accent mb-6">VO-001 · a visual way to find music</p>
          <h1 className="font-display text-[13vw] sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
            YOUR SPACE HAS A <em className="text-vibe-accent">SOUNDTRACK.</em>
          </h1>
          <p className="mt-6 text-vibe-muted text-lg max-w-md">Scan the vibe around you. Find the music that belongs in it.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/scan" className="vo-btn-primary !px-8 !py-4">SCAN YOUR VIBE</Link>
            <Link href="/app/discover" className="vo-btn-ghost !px-8 !py-4">EXPLORE MUSIC</Link>
          </div>
        </div>

        {/* glass scan simulation card */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="glass vo-float">
            {/* macOS traffic lights */}
            <div className="absolute top-3.5 left-4 flex gap-2 z-10" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-inner" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-inner" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-inner" />
            </div>
            <div className="p-5 sm:p-6 pt-12">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                <img src={preset.scene} alt="A warm sunset room — a sample vibe" className="h-full w-full object-cover" />
                {phase >= 1 && <div className="scanline" />}
                <div className="absolute inset-4 border border-white/20 rounded-lg pointer-events-none" />
              </div>

              {phase >= 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-vibe-muted mb-2">extracted palette</p>
                  <div className="flex gap-1.5">
                    {preset.palette.map((c, i) => (
                      <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.07 }} className="h-7 w-7 rounded-full border border-white/20" style={{ background: c }} />
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-4 flex items-center justify-between">
                {phase >= 3 && (
                  <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="flex -space-x-3">
                    {matched.slice(0, 2).map((t, i) => (
                      <img key={t.id} src={t.artwork} alt="" className="h-14 w-14 rounded-lg border-2 border-black/50 object-cover" style={{ zIndex: 2 - i }} />
                    ))}
                  </motion.div>
                )}
                {phase >= 4 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] uppercase tracking-[0.25em] text-vibe-accent ml-auto">
                    {matched.length} tracks found for this vibe
                  </motion.p>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-vibe-muted">live demo · same pipeline as your camera</p>
        </div>
      </div>
    </section>
  );
}
