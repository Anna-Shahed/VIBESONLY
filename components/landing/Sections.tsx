"use client";

import Link from "next/link";
import { DEMO_TRACKS } from "@/lib/music/data";
import { SCENE_PRESETS } from "@/lib/vibes/presets";

export function HowItWorks() {
  const steps = [
    { n: "01", t: "LOOK", d: "Point your camera at your room, your outfit, a sunset — anywhere with a feeling." },
    { n: "02", t: "FEEL", d: "We turn its colours into a vibe: palette, temperature, brightness, mood." },
    { n: "03", t: "LISTEN", d: "Get the soundtrack that belongs there, matched to your own taste." }
  ];
  return (
    <section id="how" className="border-t border-vibe-line py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-vibe-accent mb-3">How it works</p>
        <h2 className="font-display text-3xl sm:text-5xl mb-12">Three movements.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="vo-card rounded-xl p-8">
              <span className="font-display text-5xl text-vibe-accent/60">{s.n}</span>
              <h3 className="font-display text-2xl mt-4 mb-2">{s.t}</h3>
              <p className="text-vibe-muted text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MusicWall() {
  const row1 = DEMO_TRACKS.slice(0, 20);
  const row2 = DEMO_TRACKS.slice(20);
  const Row = ({ tracks, reverse = false }: { tracks: typeof DEMO_TRACKS; reverse?: boolean }) => (
    <div className="overflow-hidden py-2">
      <div className="marquee" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-4 pr-4">
            {tracks.map((t) => (
              <img key={`${dup}-${t.id}`} src={t.artwork} alt="" loading="lazy" className="h-28 w-28 sm:h-36 sm:w-36 rounded-lg object-cover border border-vibe-line" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <section id="listen" className="border-t border-vibe-line py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-10">
        <p className="text-[11px] uppercase tracking-[0.35em] text-vibe-accent mb-3">The library</p>
        <h2 className="font-display text-3xl sm:text-5xl">Forty worlds, waiting.</h2>
        <p className="text-vibe-muted mt-3 max-w-lg text-sm">Every cover is generated from its own palette — that's how matching works.</p>
      </div>
      <Row tracks={row1} />
      <Row tracks={row2} reverse />
    </section>
  );
}

export function Transform() {
  const preset = SCENE_PRESETS[0]; // midnight room
  return (
    <section className="border-t border-vibe-line py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-vibe-accent mb-3">Your vibe → your soundtrack</p>
        <h2 className="font-display text-3xl sm:text-5xl mb-10">From image to playlist.</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {[
            { label: "Image", node: <img src={preset.scene} alt="Midnight room scene" className="aspect-square w-full object-cover rounded-xl border border-vibe-line" /> },
            { label: "Palette", node: <div className="grid grid-cols-5 gap-1"><div className="flex flex-col gap-1">{preset.palette.map((c, i) => <div key={i} className="flex-1 rounded-sm border border-white/10" style={{ background: c }} />)}</div></div> },
            { label: "Vibe", node: <div className="vo-card rounded-xl p-6 text-center"><p className="text-xs uppercase tracking-[0.3em] text-vibe-accent">mood</p><p className="font-display text-2xl mt-2">Midnight Cinema</p><p className="text-xs text-vibe-muted mt-1">deep red · warm · cinematic</p></div> },
            { label: "Songs", node: <div className="flex -space-x-6">{DEMO_TRACKS.slice(0, 3).map((t) => <img key={t.id} src={t.artwork} alt="" className="h-24 w-24 rounded-lg object-cover border-2 border-vibe-bg" />)}</div> }
          ].map((step) => (
            <div key={step.label} className="relative">
              <p className="text-[10px] uppercase tracking-[0.3em] text-vibe-muted mb-2">{step.label}</p>
              {step.node}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="border-t border-vibe-line py-28 text-center px-4">
      <h2 className="font-display text-4xl sm:text-6xl max-w-2xl mx-auto leading-tight">WHAT DOES YOUR ROOM SOUND LIKE?</h2>
      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        <Link href="/scan" className="vo-btn-primary !px-10 !py-4">SCAN YOUR VIBE</Link>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-vibe-line py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-lg font-bold">VIBESONLY<span className="text-vibe-accent">.</span></p>
        <p className="text-xs text-vibe-muted">Images are processed locally. Nothing leaves your device.</p>
      </div>
    </footer>
  );
}
