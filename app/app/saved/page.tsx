"use client";

import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { TrackCard } from "@/features/music/TrackCard";
import { EmptyState } from "@/components/ui/primitives";

export default function SavedPage() {
  const { tracks, savedIds } = useApp();
  const saved = tracks.filter((t) => savedIds.includes(t.id));

  if (!saved.length) {
    return (
      <EmptyState
        title="Nothing saved yet"
        body="Find something that feels right. Tap the ♡ on any track and it will wait for you here."
        action={<Link href="/app/discover" className="vo-btn-primary">Explore music</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Saved</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {saved.map((t) => <TrackCard key={t.id} track={t} className="w-full" />)}
      </div>
    </div>
  );
}
