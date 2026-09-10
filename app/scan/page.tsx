"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store/AppContext";
import { CameraView } from "@/features/camera/CameraView";
import { ScanResult } from "@/features/camera/ScanResult";
import { SCENE_PRESETS, analysisFromPreset } from "@/lib/vibes/presets";

type Stage = "consent" | "camera" | "analyzing" | "result" | "presets";
const STATUS = ["SCANNING", "ANALYZING", "MATCHING"];

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-vibe-muted">Loading…</div>}>
      <ScanInner />
    </Suspense>
  );
}

function ScanInner() {
  const { runAnalysis, runPreset, restoreScan, scans } = useApp();
  const params = useSearchParams();
  const vibeId = params.get("vibe");

  const [stage, setStage] = useState<Stage>("consent");
  const [statusIdx, setStatusIdx] = useState(0);
  const analyzingRef = useRef(false);

  useEffect(() => {
    if (vibeId) {
      const scan = scans.find((s) => s.id === vibeId);
      if (scan) { restoreScan(scan); setStage("result"); }
    }
  }, [vibeId, scans, restoreScan]);

  const handleCaptured = useCallback((canvas: HTMLCanvasElement) => {
    if (analyzingRef.current) return;
    analyzingRef.current = true;
    setStage("analyzing");
    setStatusIdx(0);
    const statusTimer = setInterval(() => setStatusIdx((i) => Math.min(i + 1, STATUS.length - 1)), 650);
    setTimeout(async () => {
      try {
        const { analyzeImage } = await import("@/lib/color/analysis");
        const analysis = await analyzeImage(canvas, 96);
        runAnalysis(analysis, "camera");
        setStage("result");
      } catch {
        setStage("presets");
      } finally {
        clearInterval(statusTimer);
        analyzingRef.current = false;
      }
    }, 1400);
  }, [runAnalysis]);

  const handlePreset = useCallback((id: string) => {
    const preset = SCENE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setStage("analyzing");
    setStatusIdx(0);
    const statusTimer = setInterval(() => setStatusIdx((i) => Math.min(i + 1, STATUS.length - 1)), 500);
    setTimeout(() => {
      runPreset(preset);
      setStage("result");
      clearInterval(statusTimer);
    }, 1300);
  }, [runPreset]);

  const presets = useMemo(() => SCENE_PRESETS, []);

  return (
    <main className="min-h-screen relative z-10">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <Link href="/app/discover" className="font-display text-xl font-bold">VIBESONLY<span className="text-vibe-accent">.</span></Link>
          <Link href="/app/discover" className="text-[11px] uppercase tracking-[0.2em] text-vibe-muted hover:text-vibe-text">Exit</Link>
        </div>

        <AnimatePresence mode="wait">
          {stage === "consent" && (
            <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-16">
              <h1 className="font-display text-4xl sm:text-6xl">SCAN YOUR VIBE</h1>
              <p className="max-w-md text-vibe-muted">
                VIBESONLY needs camera access to read the colours around you. Your image is processed{" "}
                <strong className="text-vibe-text">locally in your browser</strong> — nothing is uploaded or stored.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button className="vo-btn-primary" onClick={() => setStage("camera")}>Enable camera</button>
                <button className="vo-btn-ghost" onClick={() => setStage("presets")}>Try a sample vibe</button>
              </div>
            </motion.div>
          )}

          {stage === "camera" && (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center gap-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-vibe-muted">capture the vibe</p>
              <CameraView
                onCaptured={handleCaptured}
                onCancel={() => setStage("presets")}
                onPermissionError={() => setStage("presets")}
              />
            </motion.div>
          )}

          {stage === "presets" && (
            <motion.div key="presets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 py-10">
              <p className="text-center text-[11px] uppercase tracking-[0.3em] text-vibe-muted mb-2">No camera? No problem.</p>
              <h2 className="text-center font-display text-3xl mb-8">Try a sample vibe</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {presets.map((p) => (
                  <button key={p.id} onClick={() => handlePreset(p.id)} className="group text-left vo-card rounded-xl overflow-hidden hover:!border-vibe-accent">
                    <img src={p.scene} alt={`${p.name} sample scene`} loading="lazy" className="aspect-[4/5] w-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    <div className="p-3">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-[10px] text-vibe-muted uppercase tracking-widest">{p.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {stage === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center gap-6 py-24">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-vibe-accent border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-display text-3xl tracking-[0.2em]">{STATUS[statusIdx]}</p>
                <p className="text-[11px] text-vibe-muted mt-2 uppercase tracking-[0.25em]">reading the colours around you</p>
              </div>
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
              <ScanResult onRescan={() => setStage("camera")} onBack={() => { window.location.href = "/app/discover"; }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
