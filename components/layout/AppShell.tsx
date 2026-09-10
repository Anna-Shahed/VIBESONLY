"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/app/discover", label: "Discover" },
  { href: "/app/music", label: "My Music" },
  { href: "/app/vibes", label: "Vibes" },
  { href: "/app/saved", label: "Saved" }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen text-vibe-text relative z-10">
      <header className="sticky top-0 z-30 bg-[#0a0a0c]/55 backdrop-blur-2xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-6">
          <Link href="/app/discover" className="font-display text-xl font-bold tracking-tight whitespace-nowrap">
            VIBESONLY<span className="text-vibe-accent">.</span>
          </Link>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 ml-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-[11px] uppercase tracking-[0.18em] rounded-full transition-colors ${
                  pathname === l.href ? "text-vibe-accent bg-white/5" : "text-vibe-muted hover:text-vibe-text"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <Link href="/scan" className="vo-btn-primary !py-2.5">SCAN</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-32 md:pb-24 pt-8">{children}</main>

      <nav aria-label="Mobile" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0c0c0e]/65 backdrop-blur-2xl border-t border-white/10 pb-safe">
        <div className="grid grid-cols-4 h-16">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-col items-center justify-center gap-1 text-[9px] uppercase tracking-[0.18em] ${
                pathname === l.href ? "text-vibe-accent" : "text-vibe-muted"
              }`}
            >
              <span className="text-base leading-none">{icon(l.href)}</span>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function icon(href: string) {
  switch (href) {
    case "/app/discover": return "◈";
    case "/app/music": return "♪";
    case "/app/vibes": return "✧";
    case "/app/saved": return "♥";
    default: return "•";
  }
}
