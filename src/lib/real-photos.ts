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

// Photo-type priority: lower number = earlier in gallery / PDF.
// Order is intentionally chosen to match how operators typically inspect a unit:
//   1. exterior / hero-style "main" shot     (no suffix, or `-main`, `-1`)
//   2. side / angle context shots            (`-side`, `-angle`, `-2`..`-4`)
//   3. cabin / operator station              (`-cabin`, `-cab`, `-interior`)
//   4. engine / mechanical                    (`-engine`, `-mech`)
//   5. attachment / working end               (`-attach`, `-bucket`, `-drum`)
//   6. detail / close-up / wear items         (`-detail`, `-closeup`, `-wear`)
//   7. anything else                          (fallback)
const TYPE_ORDER: Array<[RegExp, number]> = [
  [/(^|-)(main|hero)$/i, 1],
  [/(^|-)(side|angle|front|rear|back|left|right)$/i, 2],
  [/(^|-)(cab|cabin|interior|operator)$/i, 3],
  [/(^|-)(engine|mech|mechanical)$/i, 4],
  [/(^|-)(attach|attachment|bucket|drum|blade|boom|arm)$/i, 5],
  [/(^|-)(detail|closeup|close-up|wear|tyre|tire|track)$/i, 6],
];

function classify(base: string): { type: number; index: number } {
  // Strip the equipment ID prefix so we only inspect the descriptor tail.
  const tail = base.replace(/^[A-Za-z]+-[A-Za-z]+-\d+/i, "");
  for (const [re, weight] of TYPE_ORDER) {
    if (re.test(tail)) {
      const m = tail.match(/-(\d+)$/);
      return { type: weight, index: m ? parseInt(m[1], 10) : 0 };
    }
  }
  // Numeric-only suffix like `-2` => treat as additional "main" shot, ordered by N.
  const num = tail.match(/^-(\d+)$/);
  if (num) return { type: 1, index: parseInt(num[1], 10) };
  // No suffix at all => primary hero (index 0 inside type 1).
  if (tail === "") return { type: 1, index: 0 };
  return { type: 99, index: 0 };
}

// Build an ID -> [url, url, ...] map with deterministic ordering:
// (1) equipment ID (asc) — groups stay together
// (2) photo type weight (asc) — main → side → cabin → engine → attach → detail
// (3) numeric suffix (asc) — `-1` before `-2` before `-10`
// (4) full filename (asc) — final tiebreaker so order never shifts
const REAL_PHOTOS: Record<string, string[]> = (() => {
  type Entry = { id: string; file: string; base: string; url: string; type: number; index: number };
  const entries: Entry[] = Object.entries(modules).map(([path, url]) => {
    const file = path.split("/").pop() ?? "";
    const base = file.replace(/\.[^.]+$/, "");
    const id = base.replace(/-(\d+|[a-z]+)$/i, "").toUpperCase();
    const { type, index } = classify(base);
    return { id, file, base, url, type, index };
  });

  entries.sort((a, b) => {
    if (a.id !== b.id) return a.id.localeCompare(b.id);
    if (a.type !== b.type) return a.type - b.type;
    if (a.index !== b.index) return a.index - b.index;
    return a.file.localeCompare(b.file);
  });

  const out: Record<string, string[]> = {};
  for (const e of entries) {
    if (!out[e.id]) out[e.id] = [];
    out[e.id].push(e.url);
  }
  return out;
})();

export function getRealPhotos(equipmentId: string): string[] {
  return REAL_PHOTOS[equipmentId.toUpperCase()] ?? [];
}

export function hasRealPhoto(equipmentId: string): boolean {
  return getRealPhotos(equipmentId).length > 0;
}

// ── Runtime (Cloud-uploaded) photos ────────────────────────────────────────
// Build-time photos (above) + Cloud-uploaded photos (below) are merged in
// `useAllRealPhotos` so the gallery and PDF stay in sync without duplicate code.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RuntimePhoto = { url: string; sort: number; createdAt: string };

export async function fetchRuntimePhotos(equipmentId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("real_photos")
    .select("public_url, sort_index, created_at")
    .eq("equipment_id", equipmentId.toUpperCase())
    .order("sort_index", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((r) => r.public_url);
}

/**
 * React hook: returns the merged list of build-time + Cloud-uploaded photos
 * for an equipment ID. Re-fetches when `bumpKey` changes (use after upload).
 */
export function useAllRealPhotos(equipmentId: string, bumpKey: number = 0): string[] {
  const buildTime = getRealPhotos(equipmentId);
  const [runtime, setRuntime] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    fetchRuntimePhotos(equipmentId).then((urls) => {
      if (alive) setRuntime(urls);
    });
    return () => {
      alive = false;
    };
  }, [equipmentId, bumpKey]);
  // De-duplicate by URL while preserving order (build-time first, then uploads).
  const seen = new Set<string>();
  return [...buildTime, ...runtime].filter((u) => (seen.has(u) ? false : (seen.add(u), true)));
}