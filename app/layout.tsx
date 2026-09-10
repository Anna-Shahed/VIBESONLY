import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store/AppContext";
import { PlayerProvider } from "@/lib/player/PlayerContext";
import { SongDetailHost } from "@/features/music/SongDetail";
import { PlaylistModalHost } from "@/features/playlists/PlaylistModal";
import { PlayerSlot } from "@/features/player/MiniPlayer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "VIBESONLY — Your space has a soundtrack.",
  description: "Scan the vibe around you. Find the music that belongs in it.",
  themeColor: "#050506"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body>
        <div className="ambient" aria-hidden />
        <AppProvider>
          <PlayerProvider>
            {children}
            <SongDetailHost />
            <PlaylistModalHost />
            <PlayerSlot />
          </PlayerProvider>
        </AppProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
