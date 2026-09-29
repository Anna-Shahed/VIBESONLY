export function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function artworkFromPalette(palette: string[], seed: number): string {
  if (!palette || palette.length === 0) return "#1db954";
  const index = seed % palette.length;
  return palette[index];
}

export function artworkFor(id: string, palette: string[]): string {
  return artworkFromPalette(palette, seedFromId(id));
}
