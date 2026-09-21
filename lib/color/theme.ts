export function applyVibeTheme(palette: string[]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const primary = palette[0] || "#9b2d42";
  const secondary = palette[1] || "#d48364";

  root.style.setProperty("--accent-primary", primary);
  root.style.setProperty("--accent-secondary", secondary);
  root.style.setProperty("--border-color", `${primary}40`);
}
