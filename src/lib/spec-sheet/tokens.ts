// Shared brand tokens + helpers used across all spec-sheet renderers.
// Pure data + pure functions only — no jsPDF imports here.

export const SAFETY: [number, number, number] = [255, 153, 0];
export const SAFETY_DEEP: [number, number, number] = [217, 119, 6];
export const IRON: [number, number, number] = [24, 28, 36];
export const IRON_SOFT: [number, number, number] = [54, 60, 72];
export const MUTED: [number, number, number] = [120, 124, 132];
export const MUTED_SOFT: [number, number, number] = [168, 172, 180];
export const BORDER: [number, number, number] = [222, 224, 230];
export const BORDER_SOFT: [number, number, number] = [238, 240, 244];
export const ZEBRA: [number, number, number] = [248, 249, 251];
export const SURFACE: [number, number, number] = [253, 253, 254];
export const INK: [number, number, number] = [255, 255, 255];

export const MARGIN = 40;

// Sanitise punctuation that Helvetica's WinAnsi encoding doesn't ship.
export function ascii(s: string): string {
  return s
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00B7/g, "·") // keep middle dot — it's WinAnsi 0xB7
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u00FF]/g, "");
}

export async function loadImageAsDataUrl(
  src: string,
): Promise<{ data: string; w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve({
          data: canvas.toDataURL("image/jpeg", 0.88),
          w: img.naturalWidth,
          h: img.naturalHeight,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
