"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const state = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const suppress = (e: Event) => {
      if (state.current.moved) { e.preventDefault(); e.stopPropagation(); state.current.moved = false; }
    };
    el.addEventListener("click", suppress, true);
    return () => el.removeEventListener("click", suppress, true);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<T>) => {
    state.current.down = true; state.current.moved = false;
    state.current.startX = e.clientX; state.current.startScroll = e.currentTarget.scrollLeft;
  };
  const onPointerMove = (e: ReactPointerEvent<T>) => {
    if (!state.current.down) return;
    const dx = e.clientX - state.current.startX;
    if (Math.abs(dx) > 6) state.current.moved = true;
    e.currentTarget.scrollLeft = state.current.startScroll - dx;
  };
  const end = () => { state.current.down = false; };

  return { ref, handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerLeave: end } };
}

export function Shelf({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, handlers } = useDragScroll<HTMLDivElement>();
  return (
    <div ref={ref} {...handlers} className={`shelf cursor-grab active:cursor-grabbing ${className}`}>
      {children}
    </div>
  );
}

export function PaletteDots({ colors, size = 22 }: { colors: string[]; size?: number }) {
  return (
    <div className="flex items-center" role="img" aria-label={`Palette: ${colors.join(", ")}`}>
      {colors.map((c, i) => (
        <span key={i} className="rounded-full border border-white/15 -ml-1.5 first:ml-0" style={{ width: size, height: size, background: c, zIndex: colors.length - i }} />
      ))}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center px-6">
      <h3 className="font-display text-2xl text-vibe-text">{title}</h3>
      <p className="text-sm text-vibe-muted max-w-sm">{body}</p>
      {action}
    </div>
  );
}

export function VibeChips({ profile }: { profile: { brightness: string; saturation: string; contrast: string; temperature: string } }) {
  const chips = [profile.temperature, profile.brightness, profile.saturation, profile.contrast];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => <span key={c} className="vo-chip vo-chip-accent">{c}</span>)}
    </div>
  );
}

export function SectionHeading({ kicker, title, action }: { kicker?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        {kicker && <p className="text-[11px] uppercase tracking-[0.25em] text-vibe-accent mb-1">{kicker}</p>}
        <h2 className="font-display text-2xl sm:text-3xl text-vibe-text">{title}</h2>
      </div>
      {action}
    </div>
  );
}
