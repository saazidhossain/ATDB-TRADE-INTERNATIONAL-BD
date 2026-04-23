// Auto-discovers per-equipment "real / current condition" photos.
//
// Drop files in `src/assets/fleet/real/` named `<EQUIPMENT_ID>.<ext>` (or
// `<EQUIPMENT_ID>-<n>.<ext>` for multiple shots) and they appear automatically
// in the gallery (right after the hero) and in the downloadable PDF spec sheet.
//
// No registration / wiring needed — Vite picks them up at build time.

const modules = import.meta.glob("@/assets/fleet/real/*.{webp,jpg,jpeg,png,WEBP,JPG,JPEG,PNG}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// Build an ID -> [url, url, ...] map (sorted, alphabetical) for stable order.
const REAL_PHOTOS: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {};
  const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));
  for (const [path, url] of entries) {
    const file = path.split("/").pop() ?? "";
    const base = file.replace(/\.[^.]+$/, "");
    // Match "ATDB-CR-001" or "ATDB-CR-001-2" (suffix index ignored for grouping)
    const id = base.replace(/-\d+$/, "").toUpperCase();
    if (!out[id]) out[id] = [];
    out[id].push(url);
  }
  return out;
})();

export function getRealPhotos(equipmentId: string): string[] {
  return REAL_PHOTOS[equipmentId.toUpperCase()] ?? [];
}

export function hasRealPhoto(equipmentId: string): boolean {
  return getRealPhotos(equipmentId).length > 0;
}