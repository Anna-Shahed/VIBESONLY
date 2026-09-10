"use client";

import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { EmptyState, PaletteDots } from "@/components/ui/primitives";
import { describeVibe } from "@/lib/vibes/classifier";

export default function VibesPage() {
  const { scans, restoreScan } = useApp();

  if (!scans.length) {
    return (
      <EmptyState
        title="Nothing scanned yet"
        body="Point VIBESONLY at your room, your outfit, a sunset — anything with a feeling. Each scan becomes a vibe you can revisit."
        action={<Link href="/scan" className="vo-btn-primary">SCAN YOUR VIBE</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Your vibes</h1>
      <p className="text-sm text-vibe-muted -mt-3">Every scan is saved as a palette, a mood and a soundtrack. Tap one to relive it.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scans.map((s) => (
          <Link
            key={s.id}
            href={`/scan?vibe=${s.id}`}
            onClick={() => restoreScan(s)}
            className="vo-card rounded-xl p-5 hover:border-vibe-accent transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-vibe-muted">
                {new Date(s.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-vibe-accent">{s.source}</span>
            </div>
            <h2 className="font-display text-2xl mt-3 group-hover:text-vibe-accent transition-colors">{s.vibeName}</h2>
            <p className="text-xs text-vibe-muted mt-1">{describeVibe({ primaryColor: s.primaryColor, secondaryColors: s.palette.slice(1, 3), palette: s.palette, brightness: s.brightness, saturation: s.saturation, contrast: s.contrast, temperature: s.temperature, visualMood: s.mood, vibeName: s.vibeName, confidence: s.confidence })}</p>
            <div className="mt-4 flex items-center justify-between">
              <PaletteDots colors={s.palette} size={18} />
              <span className="text-xs text-vibe-muted">{s.recommendationIds.length} tracks</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
