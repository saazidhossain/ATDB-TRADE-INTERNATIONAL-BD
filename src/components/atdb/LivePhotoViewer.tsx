import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, ArrowRight, Images, Loader2, Radio, RefreshCw, Maximize2, Info } from "lucide-react";
import { CATEGORIES, type EquipmentCategory } from "@/lib/atdb-data";
import { useHostedRealPhotoFeed, type HostedRealPhoto } from "@/lib/real-photos";
import { useFontClass, useI18n } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const FILTERS: Array<EquipmentCategory | "all"> = ["all", "rollers", "cranes", "excavators", "loaders", "support"];

function categoryLabel(category: EquipmentCategory | "all") {
  return category === "all" ? "All" : CATEGORIES[category].label;
}

function LivePhotoSkeleton() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-2xl">
        <Skeleton className="aspect-[16/10] w-full rounded-lg bg-white/5" />
        <div className="absolute bottom-8 left-8 space-y-3">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-8 w-64 bg-white/10" />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 bg-white/5" />
          <Skeleton className="h-5 w-12 bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg bg-white/5" />
          ))}
        </div>
        <Skeleton className="mt-auto h-12 w-full rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

export function LivePhotoViewer() {
  const fontClass = useFontClass();
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Advanced scroll parallax for background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const { photos, loading, refreshing, error, lastUpdated, refresh } = useHostedRealPhotoFeed(10000);
  const [filter, setFilter] = useState<EquipmentCategory | "all">("all");
  
  const filtered = useMemo(
    () => (filter === "all" ? photos : photos.filter((photo) => photo.category === filter)),
    [filter, photos],
  );
  
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const active = filtered.find((photo) => photo.url === activeUrl) ?? filtered[0];

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
    <section 
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#0a0a0a] py-24 text-white md:py-32"
    >
      {/* Top 1% Background Setup */}
      <motion.div 
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,134,11,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </motion.div>

      <div className="container-page relative">
        {/* Header Section */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-bronze-glow/60" />
              <p className={cn("text-[11px] font-bold uppercase tracking-[0.3em] text-bronze-glow", fontClass)}>
                Real-Time Fleet Intelligence
              </p>
            </div>
            <h2 className={cn("mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl", fontClass)}>
              Live Condition <span className="text-white/40">Stream</span>
            </h2>
            <p className={cn("mt-6 text-base leading-relaxed text-white/50 md:text-lg", fontClass)}>
              Experience our fleet through a high-fidelity live feed. Every photo is captured on-site, providing 100% transparency into the current operational state of our machinery.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-end gap-3"
          >
            <button 
              type="button" 
              onClick={refresh} 
              disabled={refreshing}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-xl transition-all hover:border-safety/50 hover:bg-white/10 disabled:opacity-50",
                fontClass
              )}
            >
              <div className="relative flex h-2 w-2">
                <span className={cn("absolute inline-flex h-full w-full rounded-full bg-safety opacity-75", refreshing ? "animate-ping" : "animate-pulse")} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-safety" />
              </div>
              <span className="relative z-10">{refreshing ? "Syncing Fleet..." : "Live Feed Active"}</span>
              <RefreshCw className={cn("h-3.5 w-3.5 transition-transform duration-500", refreshing ? "animate-spin" : "group-hover:rotate-180")} />
              
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
            {lastUpdated && (
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
                <span className="h-1 w-1 rounded-full bg-white/20" />
                Last Sync: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8"
            >
              <div className={cn("flex items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 backdrop-blur-md", fontClass)}>
                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/20">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-white">Connection Interrupted</p>
                    <p className="text-xs text-white/60">Unable to reach the live hosting server. Retrying in background...</p>
                  </div>
                </div>
                <button 
                  onClick={refresh}
                  className="rounded-lg bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/20"
                >
                  Force Reconnect
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Navigation */}
        <div className="mt-12 flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((item, idx) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setFilter(item)}
              className={cn(
                "relative shrink-0 rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                filter === item
                  ? "bg-safety text-white shadow-[0_0_25px_rgba(var(--safety-rgb),0.4)]"
                  : "border border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white",
                fontClass
              )}
            >
              {categoryLabel(item)}
              {filter === item && (
                <motion.div 
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-full bg-safety -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Viewer Content */}
        {loading && !active ? (
          <LivePhotoSkeleton />
        ) : active ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Primary Display */}
            <motion.div 
              layout
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-3 shadow-2xl backdrop-blur-3xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#111]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.url}
                    initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full"
                  >
                    <img
                      src={active.url}
                      alt={active.equipmentName}
                      className="h-full w-full object-contain p-6 md:p-12"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Overlay UI */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`info-${active.url}`}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-safety/20 px-3 py-1 backdrop-blur-md border border-safety/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-safety animate-pulse" />
                        <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] text-safety", fontClass)}>
                          {active.equipmentId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 backdrop-blur-md border border-white/10">
                        <Info className="h-3 w-3 text-white/40" />
                        <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] text-white/60", fontClass)}>
                          Verified Condition
                        </span>
                      </div>
                    </div>
                    <h3 className={cn("text-3xl font-bold text-white md:text-5xl", fontClass)}>
                      {active.equipmentName}
                    </h3>
                  </motion.div>
                </div>

                {/* Interactive Controls */}
                <div className="absolute right-6 top-6 flex flex-col gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-xl border border-white/10 transition-all hover:bg-safety hover:border-safety">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Gallery */}
            <aside className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-safety/10">
                    <Images className="h-4 w-4 text-safety" />
                  </div>
                  <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em] text-white/80", fontClass)}>
                    {filtered.length} Available
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 border border-white/10">
                  <Radio className="h-3 w-3 text-safety animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent] lg:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filtered.map((photo, idx) => (
                    <motion.button
                      key={photo.url}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setActiveUrl(photo.url)}
                      className={cn(
                        "group relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all duration-500",
                        active.url === photo.url 
                          ? "border-safety shadow-[0_0_20px_rgba(var(--safety-rgb),0.3)]" 
                          : "border-transparent bg-white/5 hover:border-white/20"
                      )}
                    >
                      <img 
                        src={photo.url} 
                        alt="" 
                        loading="lazy" 
                        className={cn(
                          "h-full w-full object-cover transition-transform duration-1000",
                          active.url === photo.url ? "scale-110" : "group-hover:scale-110"
                        )} 
                      />
                      <div className={cn(
                        "absolute inset-0 bg-safety/20 transition-opacity duration-500",
                        active.url === photo.url ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} />
                      
                      {/* Thumbnail ID Badge */}
                      <div className="absolute bottom-2 left-2">
                        <span className={cn(
                          "rounded-md bg-black/60 px-2 py-1 text-[8px] font-bold text-white backdrop-blur-md border border-white/10 transition-transform duration-500",
                          active.url === photo.url ? "scale-110" : "group-hover:scale-110",
                          fontClass
                        )}>
                          {photo.equipmentId}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-auto pt-4">
                <Link
                  to="/equipment/$category/$id"
                  params={{ category: active.category, id: active.equipmentId }}
                  className={cn(
                    "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-safety py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:shadow-[0_0_30px_rgba(var(--safety-rgb),0.5)] active:scale-[0.98]",
                    fontClass
                  )}
                >
                  <span className="relative z-10">Explore Equipment</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-24 text-center backdrop-blur-3xl"
          >
            <div className="relative mx-auto h-20 w-20">
              <Images className="h-full w-full text-white/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-safety animate-spin" />
              </div>
            </div>
            <h4 className={cn("mt-8 text-xl font-bold uppercase tracking-[0.3em] text-white/80", fontClass)}>
              Initializing Stream
            </h4>
            <p className={cn("mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/40", fontClass)}>
              Connecting to the secure fleet hosting server. Real-time condition photos will appear here momentarily.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
