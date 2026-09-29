import type { VibeProfile } from "@/types";

export function buildTheme(profile: VibeProfile) {
  return {
    background: profile.primaryColor,
    text: profile.brightness === "dark" ? "#ffffff" : "#000000",
    accent: profile.secondaryColors?.[0] ?? "#ff007f"
  };
}
