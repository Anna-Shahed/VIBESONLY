"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/store/AppContext";
import { describeVibe } from "@/lib/vibes/classifier";
import { PaletteDots, Shelf, SectionHeading, VibeChips } from "@/components/ui/primitives";
import { TrackCard } from "@/features/music/TrackCard";

export function ScanResult({ onRescan, onBack }: { onRescan(): void; onBack(): void }) {
  const { activeVibe } = useApp();
  if (!activeVibe) return null;
  const { profile, recommendations } = activeVibe;

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="text-center py-8 sm:py-12">
        <p className="text-[11px] uppercase tracking-[0.35em] text-vibe-accent mb-4">Your vibe</p>
        <h1 className="font-display text-5xl sm:text-7xl text-vibe-text leading-none">“{profile.vibeName.toUpperCase()}”</h1>
        <p className="mt-4 text-vibe-muted text-sm sm:text-base">{describeVibe(profile)} · {Math.round(profile.confidence * 100)}% confidence</p>
        <div className="mt-5 flex items-center justify-center gap-4 flex-wrap">
          <PaletteDots colors={profile.palette} size={26} />
          <VibeChips profile={profile} />
        </div>
      </div>

      <div className="border-t border-vibe-line pt-8">
        <SectionHeading kicker="matching your vibe" title="We found your soundtrack" />
        <Shelf className="!-mx-4 sm:!-mx-6 px-4 sm:px-6">
          {recommendations.map((r, i) => (
            <motion.div key={r.track.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <TrackCard track={r.track} match={r.score} reason={r.reasons[0]} />
            </motion.div>
          ))}
        </Shelf>
        {recommendations.length === 0 && (
          <p className="text-center text-vibe-muted py-16">No matches — try scanning something more colourful.</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 py-12">
        <button className="vo-btn-primary" onClick={onRescan}>Scan again</button>
        <button className="vo-btn-ghost" onClick={onBack}>Back to discover</button>
      </div>
    </motion.div>
  );
}

