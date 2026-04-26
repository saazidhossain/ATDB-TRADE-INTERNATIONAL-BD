import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, ArrowRight, Images, Loader2, Radio, RefreshCw, Maximize2, Info } from "lucide-react";
import { CATEGORIES, type EquipmentCategory } from "@/lib/atdb-data";
import { useHostedRealPhotoFeed, type HostedRealPhoto } from "@/lib/real-photos";
import { useFontClass, useI18n } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoLightbox } from "./PhotoLightbox";
import { cn } from "@/lib/utils";
import {
  imageTransitions,
  filterTransitions,
  textTransitions,
  layoutTransitions,
  loadingTransitions,
  buttonTransitions,
  staggerSequences,
  easingFunctions,
  springPhysics,
} from "@/lib/cinematic-transitions";

const FILTERS: Array<EquipmentCategory | "all"> = ["all", "rollers", "cranes", "excavators", "loaders", "support"];

function categoryLabel(category: EquipmentCategory | "all") {
  return category === "all" ? "All" : CATEGORIES[category].label;
}

function LivePhotoSkeleton() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-2xl"
      >
        <Skeleton className="aspect-[16/10] w-full rounded-lg bg-white/5" />
        <div className="absolute bottom-8 left-8 space-y-3">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-8 w-64 bg-white/10" />
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 bg-white/5" />
          <Skeleton className="h-5 w-12 bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Skeleton className="aspect-[4/3] rounded-lg bg-white/5" />
            </motion.div>
          ))}
        </div>
        <Skeleton className="mt-auto h-12 w-full rounded-lg bg-white/5" />
      </motion.div>
    </div>
  );
}

export function LivePhotoViewer() {
  const fontClass = useFontClass();
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const { photos, loading, refreshing, error, lastUpdated, refresh } = useHostedRealPhotoFeed(10000);
  const [filter, setFilter] = useState<EquipmentCategory | "all">("all");
  const [prevFilter, setPrevFilter] = useState<EquipmentCategory | "all">("all");
  
  const filtered = useMemo(
    () => (filter === "all" ? photos : photos.filter((photo) => photo.category === filter)),
    [filter, photos],
  );
  
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const active = filtered.find((photo) => photo.url === activeUrl) ?? filtered[0];
  const activeIndex = active ? filtered.findIndex((p) => p.url === active.url) : -1;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!filtered.length) {
      setActiveUrl(null);
      return;
    }
    if (!activeUrl || !filtered.some((photo) => photo.url === activeUrl)) {
      setActiveUrl(filtered[0].url);
    }
  }, [activeUrl, filtered]);

  const handleFilterChange = (newFilter: EquipmentCategory | "all") => {
    setPrevFilter(filter);
    setFilter(newFilter);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-iron-deep py-24 text-white md:py-32"
    >
      {/* Parallax Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,134,11,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </motion.div>

      <div className="container-page relative">
        {/* Header Section with Staggered Animation */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easingFunctions.smoothOut }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "auto" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-bronze-glow/60" />
              <p className={cn("text-[11px] font-bold uppercase tracking-[0.3em] text-bronze-glow", fontClass)}>
                Live fleet photos
              </p>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: easingFunctions.smoothOut }}
              className={cn("mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl", fontClass)}
            >
              Current-condition <span className="text-white/40">photo stream</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: easingFunctions.smoothOut }}
              className={cn("mt-6 text-base leading-relaxed text-white/60 md:text-lg", fontClass)}
            >
              Hosted equipment photos appear here automatically with balanced cropping, clean spacing, and responsive viewing.
            </motion.p>
          </motion.div>

          {/* Refresh Button with Detailed Hover */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-end gap-3"
          >
            <motion.button 
              type="button" 
              onClick={refresh} 
              disabled={refreshing}
              whileHover={!refreshing ? buttonTransitions.primaryButtonHover : {}}
              whileTap={!refreshing ? buttonTransitions.primaryButtonTap : {}}
              className={cn(
                "group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md transition-all hover:border-safety/60 hover:text-white disabled:opacity-50",
                fontClass
              )}
            >
              <motion.div 
                className="relative flex h-2.5 w-2.5"
                animate={refreshing ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className={cn(
                  "absolute inline-flex h-full w-full rounded-full bg-safety opacity-70",
                  refreshing ? "animate-ping" : "animate-pulse"
                )} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-safety" />
              </motion.div>
              <span>{refreshing ? "Updating" : lastUpdated ? "Live refresh" : "Auto refresh"}</span>
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </motion.div>
            </motion.button>

            {lastUpdated && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] uppercase tracking-widest text-white/40"
              >
                Last sync: {new Date(lastUpdated).toLocaleTimeString()}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Error State with Bounce Animation */}
        <AnimatePresence>
          {error && (
            <motion.div 
              {...layoutTransitions.errorMessageEnter}
              className="mt-8"
            >
              <div className={cn("flex items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-white backdrop-blur-sm", fontClass)}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-bold uppercase tracking-wider">Hosting Discovery Failed</p>
                    <p className="mt-0.5 text-white/70">The live photo feed is temporarily unavailable. Please check your connection or try again.</p>
                  </div>
                </div>
                <motion.button 
                  onClick={refresh}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-sm bg-destructive/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-destructive/40"
                >
                  Retry
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Navigation with Layout Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((item, idx) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              onClick={() => handleFilterChange(item)}
              whileHover={filterTransitions.filterButtonHover}
              whileTap={filterTransitions.filterButtonTap}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                filter === item
                  ? "border-safety bg-safety text-white shadow-[0_0_15px_rgba(var(--safety-rgb),0.4)]"
                  : "border-white/15 bg-white/5 text-white/72 hover:border-bronze-glow/60 hover:text-white",
                fontClass
              )}
            >
              {categoryLabel(item)}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Viewer Content */}
        {loading && !active ? (
          <LivePhotoSkeleton />
        ) : active ? (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]"
          >
            {/* Primary Display with Cinematic Transitions */}
            <motion.div 
              layout
              className="relative overflow-hidden rounded-md border border-white/12 bg-white/[0.04] p-2 shadow-[0_24px_70px_-32px_oklch(0_0_0/0.8)] backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open photo viewer"
                className="group/img relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-iron/20"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active.url}
                    src={active.url}
                    alt={`${active.equipmentName} real current condition`}
                    {...imageTransitions.mainImageEnter}
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover/img:scale-[1.02] sm:p-8"
                  />
                </AnimatePresence>
                <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-iron-deep/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/img:opacity-100">
                  <Maximize2 className="h-3 w-3" /> View
                </span>
                
                {/* Responsive Padding Overlay */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                
                {/* Gradient Overlay */}
                <motion.div 
                  {...textTransitions.overlayFadeIn}
                  className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-iron-deep/90 via-iron-deep/40 to-transparent p-6 sm:p-8"
                />

                {/* Equipment Info with Staggered Animation */}
                <motion.div 
                  className="absolute inset-x-0 bottom-0 p-6 sm:p-8"
                  initial="hidden"
                  animate="visible"
                  variants={staggerSequences.staggerContainer}
                >
                  <motion.div 
                    className="flex items-center gap-2"
                    variants={textTransitions.equipmentIdEnter}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-safety animate-pulse" />
                    <p className={`text-xs font-semibold uppercase tracking-[0.2em] text-bronze-glow ${fontClass}`}>
                      {active.equipmentId}
                    </p>
                  </motion.div>
                  <motion.h3 
                    className={`mt-2 text-xl font-bold text-white sm:text-3xl ${fontClass}`}
                    variants={textTransitions.equipmentNameEnter}
                  >
                    {active.equipmentName}
                  </motion.h3>
                </motion.div>
              </div>
            </motion.div>

            {/* Sidebar Gallery with Staggered Thumbnails */}
            <aside className="flex flex-col rounded-md border border-white/12 bg-white/[0.04] p-4 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between gap-3 pb-4"
              >
                <div className="flex items-center gap-2 text-white">
                  <Images className="h-4 w-4 text-safety" />
                  <span className={`text-xs font-bold uppercase tracking-[0.16em] ${fontClass}`}>{filtered.length} photos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live</span>
                  <motion.div
                    animate={buttonTransitions.liveIndicatorPulse.animate}
                    transition={buttonTransitions.liveIndicatorPulse.transition}
                  >
                    <Radio className="h-3.5 w-3.5 text-safety" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent] sm:grid-cols-3 lg:grid-cols-2"
                initial="hidden"
                animate="visible"
                variants={layoutTransitions.thumbnailGrid}
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((photo, idx) => (
                    <motion.button
                      key={photo.url}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ delay: idx * 0.03, duration: 0.4 }}
                      onClick={() => setActiveUrl(photo.url)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative aspect-[4/3] overflow-hidden rounded-sm border-2 bg-iron/30 transition-all duration-300 ${
                        active.url === photo.url 
                          ? "border-safety shadow-[0_0_10px_rgba(var(--safety-rgb),0.3)]" 
                          : "border-transparent hover:border-white/30"
                      }`}
                    >
                      <motion.img 
                        src={photo.url} 
                        alt="" 
                        loading="lazy" 
                        className={`h-full w-full object-cover transition-transform duration-700 ${active.url === photo.url ? "scale-110" : "group-hover:scale-110"}`}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div 
                        className={`absolute inset-0 bg-safety/10 transition-opacity duration-300 ${active.url === photo.url ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: active.url === photo.url ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.span 
                        className={`absolute bottom-1.5 left-1.5 rounded-sm bg-iron-deep/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md border border-white/10 ${fontClass}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 + 0.2, duration: 0.3 }}
                      >
                        {photo.equipmentId}
                      </motion.span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-auto pt-6"
              >
                <Link
                  to="/equipment/$category/$id"
                  params={{ category: active.category, id: active.equipmentId }}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-sm border border-safety bg-safety/10 px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-safety transition-all hover:bg-safety hover:text-white hover:shadow-[0_0_20px_rgba(var(--safety-rgb),0.4)] ${fontClass}`}
                >
                  View equipment <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </aside>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-md border border-dashed border-white/20 bg-white/[0.04] p-16 text-center backdrop-blur-md"
          >
            <motion.div 
              className="relative mx-auto h-16 w-16"
              animate={loadingTransitions.loadingSpinner.animate}
              transition={loadingTransitions.loadingSpinner.transition}
            >
              <Images className="h-full w-full text-white/10" />
              <Loader2 className="absolute inset-0 h-full w-full text-bronze-glow/40" />
            </motion.div>
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
