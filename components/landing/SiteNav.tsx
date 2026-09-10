"use client";

import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 bg-vibe-bg/85 backdrop-blur border-b border-vibe-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          VIBESONLY<span className="text-vibe-accent">.</span>
        </Link>
        <nav aria-label="Landing" className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-vibe-muted">
          <a href="#how" className="hover:text-vibe-text transition-colors">How it works</a>
          <a href="#demo" className="hover:text-vibe-text transition-colors">Demo</a>
          <a href="#listen" className="hover:text-vibe-text transition-colors">Music</a>
        </nav>
        <Link href="/app/discover" className="vo-btn-ghost !px-4 !py-2">Enter the app</Link>
      </div>
    </header>
  );
}
