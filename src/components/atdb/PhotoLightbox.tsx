import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type LightboxPhoto = {
  url: string;
  caption?: string;
  subCaption?: string;
};

type Props = {
  photos: LightboxPhoto[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const SWIPE_THRESHOLD = 60;

export function PhotoLightbox({ photos, index, open, onClose, onIndexChange }: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const pinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; pan: { x: number; y: number } } | null>(null);

  const photo = photos[index];

  const reset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const goPrev = useCallback(() => {
    if (!photos.length) return;
    onIndexChange((index - 1 + photos.length) % photos.length);
    reset();
  }, [index, photos.length, onIndexChange, reset]);

  const goNext = useCallback(() => {
    if (!photos.length) return;
    onIndexChange((index + 1) % photos.length);
    reset();
  }, [index, photos.length, onIndexChange, reset]);

  // Reset zoom when index/open changes
  useEffect(() => {
    if (open) reset();
  }, [open, index, reset]);

  // Lock body scroll & keyboard nav
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(MAX_ZOOM, z + 0.5));
      else if (e.key === "-") setZoom((z) => Math.max(MIN_ZOOM, z - 0.5));
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext, reset]);

  // Touch handlers: pinch to zoom, drag to pan when zoomed, swipe to navigate when not zoomed
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchStartRef.current = { dist, zoom };
    } else if (e.touches.length === 1) {
      panStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, pan };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartRef.current) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const ratio = dist / pinchStartRef.current.dist;
      setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchStartRef.current.zoom * ratio)));
    } else if (e.touches.length === 1 && panStartRef.current && zoom > 1) {
      const dx = e.touches[0].clientX - panStartRef.current.x;
      const dy = e.touches[0].clientY - panStartRef.current.y;
      setPan({ x: panStartRef.current.pan.x + dx, y: panStartRef.current.pan.y + dy });
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    // Swipe navigation only when not zoomed and single-touch swipe
    if (zoom === 1 && panStartRef.current && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - panStartRef.current.x;
      const dy = e.changedTouches[0].clientY - panStartRef.current.y;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) goPrev();
        else goNext();
      }
    }
    pinchStartRef.current = null;
    panStartRef.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z - e.deltaY * 0.005)));
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Top toolbar */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-4">
            <div className="min-w-0 flex-1 text-white">
              {photo.caption && (
                <p className="truncate text-sm font-semibold">{photo.caption}</p>
              )}
              {photo.subCaption && (
                <p className="truncate text-[11px] uppercase tracking-widest text-white/60">
                  {photo.subCaption} · {index + 1} / {photos.length}
                </p>
              )}
              {!photo.subCaption && (
                <p className="text-[11px] uppercase tracking-widest text-white/60">
                  {index + 1} / {photos.length}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ToolbarBtn onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))} aria-label="Zoom out" disabled={zoom <= MIN_ZOOM}>
                <ZoomOut className="h-4 w-4" />
              </ToolbarBtn>
              <span className="hidden min-w-[44px] text-center text-xs font-semibold tabular-nums text-white/80 sm:inline">
                {Math.round(zoom * 100)}%
              </span>
              <ToolbarBtn onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))} aria-label="Zoom in" disabled={zoom >= MAX_ZOOM}>
                <ZoomIn className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={reset} aria-label="Reset zoom" disabled={zoom === 1 && pan.x === 0 && pan.y === 0}>
                <RotateCcw className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={onClose} aria-label="Close">
                <X className="h-5 w-5" />
              </ToolbarBtn>
            </div>
          </div>

          {/* Prev / Next buttons */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image stage */}
          <div
            ref={containerRef}
            className="relative h-full w-full touch-none select-none overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
            onDoubleClick={() => (zoom === 1 ? setZoom(2) : reset())}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.url}
                src={photo.url}
                alt={photo.caption ?? "Photo"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                draggable={false}
                style={{
                  transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                  transformOrigin: "center center",
                  cursor: zoom > 1 ? "grab" : "zoom-in",
                  transition: pinchStartRef.current || panStartRef.current ? "none" : "transform 0.18s ease-out",
                }}
                className={cn(
                  "absolute left-1/2 top-1/2 max-h-[88vh] max-w-[92vw] object-contain",
                )}
              />
            </AnimatePresence>
          </div>

          {/* Bottom hint */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-[10px] uppercase tracking-widest text-white/50">
              Pinch · double-tap · swipe · arrows · esc
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToolbarBtn({
  children,
  onClick,
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
      {...rest}
    >
      {children}
    </button>
  );
}
