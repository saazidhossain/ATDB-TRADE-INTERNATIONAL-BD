import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, Images, Loader2, Radio, RefreshCw } from "lucide-react";
import { CATEGORIES, type EquipmentCategory } from "@/lib/atdb-data";
import { useHostedRealPhotoFeed, type HostedRealPhoto } from "@/lib/real-photos";
import { useFontClass, useI18n } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS: Array<EquipmentCategory | "all"> = ["all", "rollers", "cranes", "excavators", "loaders", "support"];

function categoryLabel(category: EquipmentCategory | "all") {
  return category === "all" ? "All" : CATEGORIES[category].label;
}

function LivePhotoSkeleton() {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
      <div className="rounded-md border border-white/12 bg-white/[0.04] p-2 backdrop-blur-md">
        <Skeleton className="aspect-[16/10] w-full rounded-sm bg-white/10" />
      </div>
      <div className="rounded-md border border-white/12 bg-white/[0.04] p-3 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-5 w-32 bg-white/10" />
          <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-sm bg-white/10" />
          ))}
        </div>
        <Skeleton className="mt-4 h-10 w-full bg-white/10" />
      </div>
    </div>
  );
}

export function LivePhotoViewer() {
  const fontClass = useFontClass();
  const { t } = useI18n();
  // Poll every 10 seconds for a more "live" feel as requested
  const { photos, loading, refreshing, error, lastUpdated, refresh } = useHostedRealPhotoFeed(10000);
  const [filter, setFilter] = useState<EquipmentCategory | "all">("all");
  
  const filtered = useMemo(
    () => (filter === "all" ? photos : photos.filter((photo) => photo.category === filter)),
    [filter, photos],
  );
  
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const active = filtered.find((photo) => photo.url === activeUrl) ?? filtered[0];

  // Auto-select first photo when filter changes or photos update
  useEffect(() => {
    if (!filtered.length) {
      setActiveUrl(null);
      return;
    }
    if (!activeUrl || !filtered.some((photo) => photo.url === activeUrl)) {
      setActiveUrl(filtered[0].url);
    }
  }, [activeUrl, filtered]);

  return (
    <section className="relative isolate overflow-hidden bg-iron-deep py-20 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_50%_at_78%_20%,oklch(0.78_0.13_65/0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_28%,transparent_78%)]" />

      <div className="container-page">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className={`eyebrow !text-bronze-glow ${fontClass}`}>Live fleet photos</p>
            <h2 className={`mt-2 text-3xl font-bold text-white md:text-4xl ${fontClass}`}>Current-condition photo stream</h2>
            <p className={`mt-3 text-sm leading-relaxed text-white/72 md:text-base ${fontClass}`}>
              Hosted equipment photos appear here automatically with balanced cropping, clean spacing, and responsive viewing.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              type="button" 
              onClick={refresh} 
              disabled={refreshing}
              className={`inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md transition-all hover:border-safety/60 hover:text-white disabled:opacity-50 ${fontClass}`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-safety opacity-70 ${refreshing ? "animate-ping" : ""}`} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-safety" />
              </span>
              {refreshing ? "Updating" : lastUpdated ? "Live refresh" : "Auto refresh"}
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            {lastUpdated && (
              <p className="text-[10px] uppercase tracking-widest text-white/40">
                Last sync: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 flex items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-white backdrop-blur-sm ${fontClass}`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="font-bold uppercase tracking-wider">Hosting Discovery Failed</p>
                <p className="mt-0.5 text-white/70">The live photo feed is temporarily unavailable. Please check your connection or try again.</p>
              </div>
            </div>
            <button 
              onClick={refresh}
              className="rounded-sm bg-destructive/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-destructive/40"
            >
              Retry
            </button>
          </motion.div>
        )}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                filter === item
                  ? "border-safety bg-safety text-white shadow-[0_0_15px_rgba(var(--safety-rgb),0.4)]"
                  : "border-white/15 bg-white/5 text-white/72 hover:border-bronze-glow/60 hover:text-white"
              } ${fontClass}`}
            >
              {categoryLabel(item)}
            </button>
          ))}
        </div>

        {loading && !active ? (
          <LivePhotoSkeleton />
        ) : active ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
            <div className="relative overflow-hidden rounded-md border border-white/12 bg-white/[0.04] p-2 shadow-[0_24px_70px_-32px_oklch(0_0_0/0.8)] backdrop-blur-md">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-iron/20">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active.url}
                    src={active.url}
                    alt={`${active.equipmentName} real current condition`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="h-full w-full object-contain p-4 sm:p-8"
                  />
                </AnimatePresence>
                
                {/* Responsive Padding Overlay */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-iron-deep/90 via-iron-deep/40 to-transparent p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-safety animate-pulse" />
                    <p className={`text-xs font-semibold uppercase tracking-[0.2em] text-bronze-glow ${fontClass}`}>{active.equipmentId}</p>
                  </div>
                  <h3 className={`mt-2 text-xl font-bold text-white sm:text-3xl ${fontClass}`}>{active.equipmentName}</h3>
                </div>
              </div>
            </div>

            <aside className="flex flex-col rounded-md border border-white/12 bg-white/[0.04] p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div className="flex items-center gap-2 text-white">
                  <Images className="h-4 w-4 text-safety" />
                  <span className={`text-xs font-bold uppercase tracking-[0.16em] ${fontClass}`}>{filtered.length} photos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live</span>
                  <Radio className="h-3.5 w-3.5 text-safety animate-pulse" />
                </div>
              </div>
              
              <div className="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent] sm:grid-cols-3 lg:grid-cols-2">
                {filtered.map((photo) => (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => setActiveUrl(photo.url)}
                    className={`group relative aspect-[4/3] overflow-hidden rounded-sm border-2 bg-iron/30 transition-all duration-300 ${
                      active.url === photo.url 
                        ? "border-safety shadow-[0_0_10px_rgba(var(--safety-rgb),0.3)]" 
                        : "border-transparent hover:border-white/30"
                    }`}
                  >
                    <img 
                      src={photo.url} 
                      alt="" 
                      loading="lazy" 
                      className={`h-full w-full object-cover transition-transform duration-700 ${active.url === photo.url ? "scale-110" : "group-hover:scale-110"}`} 
                    />
                    <div className={`absolute inset-0 bg-safety/10 transition-opacity duration-300 ${active.url === photo.url ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                    <span className={`absolute bottom-1.5 left-1.5 rounded-sm bg-iron-deep/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md border border-white/10 ${fontClass}`}>
                      {photo.equipmentId}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-auto pt-6">
                <Link
                  to="/equipment/$category/$id"
                  params={{ category: active.category, id: active.equipmentId }}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-sm border border-safety bg-safety/10 px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-safety transition-all hover:bg-safety hover:text-white hover:shadow-[0_0_20px_rgba(var(--safety-rgb),0.4)] ${fontClass}`}
                >
                  View equipment <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-md border border-dashed border-white/20 bg-white/[0.04] p-16 text-center backdrop-blur-md"
          >
            <div className="relative mx-auto h-16 w-16">
              <Images className="h-full w-full text-white/10" />
              <Loader2 className="absolute inset-0 h-full w-full text-bronze-glow/40 animate-spin-slow" />
            </div>
            <p className={`mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/80 ${fontClass}`}>Waiting for hosted photos</p>
            <p className={`mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50 ${fontClass}`}>
              Upload images into the equipment real-photo hosting folders and they will appear here automatically in real-time.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
