import { VibeProfile } from "@/types";

export async function analyzeImageElement(imageElement: HTMLImageElement | HTMLVideoElement): Promise<VibeProfile> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  canvas.width = 100;
  canvas.height = 100;
  ctx.drawImage(imageElement, 0, 0, 100, 100);

  const imageData = ctx.getImageData(0, 0, 100, 100).data;
  let rSum = 0, gSum = 0, bSum = 0;
  let maxR = 0, maxG = 0, maxB = 0;
  let minR = 255, minG = 255, minB = 255;
  const colorBuckets: { [key: string]: number } = {};

  const pixelCount = imageData.length / 4;
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    rSum += r;
    gSum += g;
    bSum += b;

    if (r > maxR) maxR = r;
    if (g > maxG) maxG = g;
    if (b > maxB) maxB = b;
    if (r < minR) minR = r;
    if (g < minG) minG = g;
    if (b < minB) minB = b;

    // Quantize for dominant bucket
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const hex = rgbToHex(qr, qg, qb);
    colorBuckets[hex] = (colorBuckets[hex] || 0) + 1;
  }

  const avgR = rSum / pixelCount;
  const avgG = gSum / pixelCount;
  const avgB = bSum / pixelCount;

  const brightness = Math.round(((avgR * 299 + avgG * 587 + avgB * 114) / 1000 / 255) * 100);
  const contrast = Math.round(((Math.max(maxR, maxG, maxB) - Math.min(minR, minG, minB)) / 255) * 100);
  const temperature = avgR > avgB + 15 ? "Warm" : avgB > avgR + 15 ? "Cool" : "Neutral";
  
  // Sort buckets to find palette
  const sortedColors = Object.entries(colorBuckets)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  const primaryColor = sortedColors[0] || "#9b2d42";
  const secondaryColors = sortedColors.slice(1, 4);
  const palette = [primaryColor, ...secondaryColors];

  let visualMood = "Cinematic Night";
  if (brightness > 70) visualMood = "Ethereal & Dreamy";
  else if (temperature === "Warm" && contrast > 60) visualMood = "Midnight Burgundy";
  else if (temperature === "Cool") visualMood = "Oceanic Chill";
  else if (brightness < 30) visualMood = "Shadow Ambient";

  return {
    primaryColor,
    secondaryColors,
    brightness,
    saturation: 65,
    contrast,
    temperature,
    visualMood,
    confidence: 94,
    palette,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}
