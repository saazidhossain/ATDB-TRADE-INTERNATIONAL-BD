// Equipment detail gallery: animated main image + thumbnails with captions,
// plus a fullscreen lightbox with keyboard nav (←/→/Esc) and pinch/double-tap zoom.

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Maximize2, X, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

export type GallerySlot = {
  src: string;
  captionKey:
    | "gallery.cap.hero"
    | "gallery.cap.action"
    | "gallery.cap.detail"
    | "gallery.cap.site"
    | "gallery.cap.cabin"
    | "gallery.cap.real";
};

interface Props {
  slots: GallerySlot[];
  alt: string;
  certifiedLabel: string;
  loading?: boolean;
}

export function EquipmentGallery({ slots, alt, certifiedLabel, loading }: Props) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const next = useCallback(() => {
    setImageLoaded(false);
    setActive((i) => (i + 1) % slots.length);
  }, [slots.length]);

  const prev = useCallback(() => {
    setImageLoaded(false);
    setActive((i) => (i - 1 + slots.length) % slots.length);
  }, [slots.length]);

  useEffect(() => {
    setImageLoaded(false);
  }, [active]);

  if (loading || !slots.length) {
    return (
      <div className="space-y-3">
        <Skeleton className="aspect-[4/3] w-full rounded-md" />
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main image — click to open lightbox */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={t("gallery.lightbox.open")}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-muted shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-safety"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slots[active].src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-muted/50 p-4 sm:p-8"
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-safety/20" />
              </div>
            )}
            <motion.img
              src={slots[active].src}
              alt={alt}
              onLoad={() => setImageLoaded(true)}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full w-full object-contain will-change-transform"
            />
          </motion.div>
        </AnimatePresence>

        {/* Certified badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
          className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.3)]"
        >
          <BadgeCheck className="h-3.5 w-3.5 text-white" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            {certifiedLabel}
          </span>
        </motion.div>

        {/* Open hint — top right */}
        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/25 bg-iron-deep/40 px-2.5 py-1.5 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.16em]">
            {t("gallery.lightbox.open")}
          </span>
        </div>

        {/* Bottom sheen */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-iron-deep/60 via-iron-deep/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
          className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3"
        >
          <span className="rounded-sm border border-white/20 bg-white/10 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {t(slots[active].captionKey)}
          </span>
          <span className="rounded-sm border border-white/20 bg-white/10 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {active + 1} / {slots.length}
          </span>
        </motion.div>
      </button>

      {/* Thumbnails with captions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
        }}
        className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5"
      >
        {slots.map((slot, i) => (
          <motion.div
            key={slot.src + i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
          >
            <motion.button
              type="button"
              onClick={() => setActive(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative block aspect-[4/3] w-full overflow-hidden rounded-sm border-2 transition-all duration-300 ${
                active === i
                  ? "border-safety shadow-[0_0_10px_rgba(var(--safety-rgb),0.3)]"
                  : "border-transparent hover:border-iron/30"
              }`}
              aria-label={`${t("detail.viewImage")}: ${t(slot.captionKey)}`}
              aria-current={active === i}
            >
              <img src={slot.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              {active === i && <div className="absolute inset-0 bg-safety/10" />}
            </motion.button>
            <p
              className={`mt-1.5 truncate text-center text-[10px] font-bold uppercase tracking-[0.12em] ${
                active === i ? "text-safety" : "text-muted-foreground"
              }`}
            >
              {t(slot.captionKey)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            slots={slots}
            startIndex={active}
            alt={alt}
            onClose={(finalIndex) => {
              setActive(finalIndex);
              setLightboxOpen(false);
            }}
            onNext={next}
            onPrev={prev}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Fullscreen lightbox
// ──────────────────────────────────────────────────────────────────
function Lightbox({
  slots,
  startIndex,
  alt,
  onClose,
}: {
  slots: GallerySlot[];
  startIndex: number;
  alt: string;
  onClose: (finalIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { t } = useI18n();
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Pinch state
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);
  // Double-tap state
  const lastTapRef = useRef<number>(0);

  const next = useCallback(() => {
    setImageLoaded(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIndex((i) => (i + 1) % slots.length);
  }, [slots.length]);

  const prev = useCallback(() => {
    setImageLoaded(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIndex((i) => (i - 1 + slots.length) % slots.length);
  }, [slots.length]);

  // Keyboard nav + scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(index);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, next, prev, onClose]);

  // Pinch + double-tap
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchRef.current = { startDist: dist, startZoom: zoom };
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // double-tap toggle zoom
        setZoom((z) => (z > 1 ? 1 : 2.2));
        setPan({ x: 0, y: 0 });
      }
      lastTapRef.current = now;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const nextZoom = Math.min(
        4,
        Math.max(1, pinchRef.current.startZoom * (dist / pinchRef.current.startDist)),
      );
      setZoom(nextZoom);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchRef.current = null;
  };

  // Swipe (when not zoomed)
  const swipeStart = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom === 1) swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) next();
      else prev();
    }
    swipeStart.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col bg-iron-deep/98 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={(e) => {
        // click on backdrop closes
        if (e.target === e.currentTarget) onClose(index);
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 text-white">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold uppercase tracking-widest">{alt}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">
            {t(slots[index].captionKey)} · {index + 1} / {slots.length}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onClose(index)}
          aria-label={t("gallery.lightbox.close")}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:bg-white/15 hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image stage */}
      <div
        className="relative flex-1 select-none overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={() => {
          setZoom((z) => (z > 1 ? 1 : 2.2));
          setPan({ x: 0, y: 0 });
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slots[index].src}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-12"
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-safety/30" />
              </div>
            )}
            <motion.img
              src={slots[index].src}
              alt={alt}
              onLoad={() => setImageLoaded(true)}
              style={{
                scale: zoom,
                x: pan.x,
                y: pan.y,
              }}
              className="max-h-full max-w-full object-contain shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={prev}
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-black/40 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-black/40 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Bottom bar / Thumbnails */}
      <div className="border-t border-white/10 bg-black/20 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl justify-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slots.map((slot, i) => (
            <button
              key={slot.src + i}
              onClick={() => {
                setImageLoaded(false);
                setIndex(i);
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
                index === i
                  ? "border-safety scale-110 shadow-lg"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img src={slot.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
