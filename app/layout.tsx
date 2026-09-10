import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store/AppContext";
import { PlayerProvider } from "@/lib/player/PlayerContext";
import { SongDetailHost } from "@/features/music/SongDetail";
import { PlaylistModalHost } from "@/features/playlists/PlaylistModal";
import { PlayerSlot } from "@/features/player/MiniPlayer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "VIBESONLY — Your space has a soundtrack.",
  description: "Scan the vibe around you. Find the music that belongs in it."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${space.variable}`}>
      <body>
        <AppProvider>
          <PlayerProvider>
            {children}
            <SongDetailHost />
            <PlaylistModalHost />
            <PlayerSlot />
          </PlayerProvider>
        </AppProvider>
      </body>
    </html>
  );
}

