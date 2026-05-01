// In-gallery preview/verify panel: lists every mapped real photo for an
// equipment as thumbnails with filename + source badge so an operator can
// quickly confirm the mapping is correct, and click any thumb to open the
// full-size lightbox.

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ImageOff, Maximize2, RefreshCw, Loader2 } from "lucide-react";
import { PhotoLightbox, type LightboxPhoto } from "./PhotoLightbox";
import type { PhotoLoadState } from "@/lib/real-photos";

type Props = {
  equipmentId: string;
  state: PhotoLoadState<string>;
};

function fileNameFromUrl(url: string): string {
  try {
    const clean = url.split("?")[0];
    const tail = clean.split("/").pop() ?? url;
    return decodeURIComponent(tail);
  } catch {
    return url;
  }
}

function sourceLabel(url: string): "Bundled" | "Cloud" {
  // Bundled assets are emitted by Vite to /assets/... or similar relative paths.
  // Cloud/storage URLs are absolute http(s) URLs to the Supabase bucket.
  if (/^https?:\/\//i.test(url) && !url.includes(window.location.host)) return "Cloud";
  return "Bundled";
}

export function RealPhotoVerifyPanel({ equipmentId, state }: Props) {
  const { photos, loading, refreshing, error, refresh } = state;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const lightboxPhotos = useMemo<LightboxPhoto[]>(
    () =>
      photos.map((url, i) => ({
        url,
        caption: `${equipmentId} — ${fileNameFromUrl(url)}`,
        subCaption: sourceLabel(url),
      })),
    [photos, equipmentId],
  );

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <section
      aria-label="Verify real photos"
      className="mt-4 rounded-md border border-border bg-muted/20 p-4"
    >
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-iron">
            Verify real photos
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            <span className="font-mono text-iron">{equipmentId}</span> ·{" "}
            {loading ? "Loading…" : `${photos.length} mapped`}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing || loading}
          aria-label="Refresh real photos"
          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-iron transition hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {error && (
        <p className="mb-2 rounded-sm border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-[11px] text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Discovering photos…
        </div>
      ) : photos.length === 0 ? (
        <div className="flex items-center gap-2 rounded-sm border border-dashed border-border bg-background px-3 py-4 text-xs text-muted-foreground">
          <ImageOff className="h-4 w-4" />
          No real photos mapped for <span className="font-mono">{equipmentId}</span>.
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {photos.map((url, i) => {
            const name = fileNameFromUrl(url);
            const src = sourceLabel(url);
            return (
              <li key={url + i}>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openAt(i)}
                  className="group relative block w-full overflow-hidden rounded-sm border border-border bg-background text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-safety"
                  aria-label={`Open ${name} full size`}
                >
                  <div className="relative aspect-[4/3] w-full bg-muted">
                    <img
                      src={url}
                      alt={name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded-sm bg-success/85 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {src}
                    </span>
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-iron-deep/45 opacity-0 transition-opacity group-hover:opacity-100">
                      <Maximize2 className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <p
                    className="truncate px-1.5 py-1 font-mono text-[9px] leading-tight text-muted-foreground"
                    title={name}
                  >
                    {i + 1}. {name}
                  </p>
                </motion.button>
              </li>
            );
          })}
        </ul>
      )}

      <PhotoLightbox
        photos={lightboxPhotos}
        index={index}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
