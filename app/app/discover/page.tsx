"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp, DEFAULT_PROFILE } from "@/lib/store/AppContext";
import { Shelf, SectionHeading, PaletteDots } from "@/components/ui/primitives";
import { TrackCard } from "@/features/music/TrackCard";
import { rankTracks, userTasteProfile, colorOfTheDay } from "@/lib/recommendations/engine";
import { describeVibe } from "@/lib/vibes/classifier";
import { hexToRgb, rgbToHsl } from "@/lib/color/utils";

export default function DiscoverPage() {
  const { tracks, activeVibe, signals, likedIds, savedIds } = useApp();

  const vibe = activeVibe?.profile ?? DEFAULT_PROFILE;
  const vibeRecs = activeVibe?.recommendations ?? rankTracks(DEFAULT_PROFILE, tracks, signals, 24);

  const tasteProfile = useMemo(() => userTasteProfile(signals, tracks), [signals, tracks]);
  const forYou = useMemo(
    () => rankTracks(tasteProfile ?? DEFAULT_PROFILE, tracks, signals, 16),
    [tasteProfile, tracks, signals]
  );

  const anchors = useMemo(() => {
    const engaged = tracks.filter((t) => likedIds.includes(t.id) || savedIds.includes(t.id));
    return engaged.slice(0, 2).length ? engaged.slice(0, 2) : tracks.slice(0, 1);
  }, [tracks, likedIds, savedIds]);

  const dayColor = colorOfTheDay();
  const dayHue = rgbToHsl(hexToRgb(dayColor))[0];
  const colourOfDay = useMemo(
    () => tracks.filter((t) => {
      const h = rgbToHsl(hexToRgb(t.dominantArtworkColor))[0];
      const d = Math.min(Math.abs(h - dayHue), 360 - Math.abs(h - dayHue));
      return d < 35;
    }).slice(0, 12),
    [tracks, dayHue]
  );

  return (
    <div className="space-y-16">
      {/* CURRENT VIBE */}
      <section>
        <SectionHeading
          kicker={activeVibe ? "your current vibe" : "tonight's vibe"}
          title={activeVibe ? activeVibe.profile.vibeName : "DEEP RED HOUR"}
          action={
            <Link href="/scan" className="vo-btn-primary !py-2 !px-4">Scan</Link>
          }
        />
        <p className="text-sm text-vibe-muted mb-5 -mt-2">{describeVibe(vibe)}</p>
        <div className="flex items-center gap-3 mb-6">
          <PaletteDots colors={vibe.palette} />
          <span className="text-xs text-vibe-muted">theme applied across the app</span>
        </div>
        <Shelf>
          {vibeRecs.map((r) => <TrackCard key={r.track.id} track={r.track} match={r.score} reason={r.reasons[0]} />)}
        </Shelf>
      </section>

      {/* FOR YOU */}
      <section>
        <SectionHeading kicker="personal" title="For you" />
        <Shelf>
          {forYou.map((r) => <TrackCard key={r.track.id} track={r.track} match={r.score} />)}
        </Shelf>
      </section>

      {/* BECAUSE YOU LIKE */}
      {anchors.map((anchor) => {
        const similar = rankTracks({ ...userTasteProfile(signals, [anchor]) ?? anchorProfile(anchor), primaryColor: anchor.dominantArtworkColor, secondaryColors: anchor.artworkPalette.slice(1, 3), palette: anchor.artworkPalette, visualMood: anchor.mood[0] ?? "balanced" }, tracks.filter((t) => t.id !== anchor.id), signals, 12);
        return (
          <section key={anchor.id}>
            <SectionHeading kicker="because you like" title={anchor.title} />
            <Shelf>
              {similar.map((r) => <TrackCard key={r.track.id} track={r.track} match={r.score} />)}
            </Shelf>
          </section>
        );
      })}

      {}
      <section>
        <SectionHeading kicker="colour of the day" title="Today feels blue… or not" />
        <div className="flex items-center gap-3 mb-5">
          <span className="h-8 w-8 rounded-full border border-white/20" style={{ background: dayColor }} />
          <span className="text-xs uppercase tracking-widest text-vibe-muted">#{dayColor.replace("#", "")}</span>
        </div>
        <Shelf>
          {colourOfDay.map((t) => <TrackCard key={t.id} track={t} />)}
        </Shelf>
      </section>
    </div>
  );
}

function anchorProfile(anchor: import("@/types").Track): import("@/types").VibeProfile {
  return {
    primaryColor: anchor.dominantArtworkColor,
    secondaryColors: anchor.artworkPalette.slice(1, 3),
    palette: anchor.artworkPalette,
    brightness: "medium", saturation: "medium", contrast: "medium", temperature: "neutral",
    visualMood: anchor.mood[0] ?? "balanced", vibeName: anchor.mood[0] ?? "Clear Day", confidence: 0.6
  };
}
