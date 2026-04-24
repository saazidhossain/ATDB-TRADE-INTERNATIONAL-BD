import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Images, Radio } from "lucide-react";
import { CATEGORIES, type EquipmentCategory } from "@/lib/atdb-data";
import { useHostedRealPhotoFeed, type HostedRealPhoto } from "@/lib/real-photos";
import { useFontClass } from "@/lib/i18n";

const FILTERS: Array<EquipmentCategory | "all"> = ["all", "rollers", "cranes", "excavators", "loaders", "support"];

function categoryLabel(category: EquipmentCategory | "all") {
  return category === "all" ? "All" : CATEGORIES[category].label;
}

export function LivePhotoViewer() {
  const fontClass = useFontClass();
  const photos = useHostedRealPhotoFeed(45000);
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
          <div className={`inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md ${fontClass}`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safety opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-safety" />
            </span>
            Auto refresh
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                filter === item
                  ? "border-safety bg-safety text-white"
                  : "border-white/15 bg-white/5 text-white/72 hover:border-bronze-glow/60 hover:text-white"
              } ${fontClass}`}
            >
              {categoryLabel(item)}
            </button>
          ))}
        </div>

        {active ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
            <div className="relative overflow-hidden rounded-md border border-white/12 bg-white/[0.04] p-2 shadow-[0_24px_70px_-32px_oklch(0_0_0/0.8)] backdrop-blur-md">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-iron">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active.url}
                    src={active.url}
                    alt={`${active.equipmentName} real current condition`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="h-full w-full object-contain p-2 sm:p-4"
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-iron-deep/86 to-transparent p-4 sm:p-5">
                  <p className={`text-xs font-semibold uppercase tracking-[0.16em] text-bronze-glow ${fontClass}`}>{active.equipmentId}</p>
                  <h3 className={`mt-1 text-lg font-bold text-white sm:text-2xl ${fontClass}`}>{active.equipmentName}</h3>
                </div>
              </div>
            </div>

            <aside className="rounded-md border border-white/12 bg-white/[0.04] p-3 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 px-1 pb-3">
                <div className="flex items-center gap-2 text-white">
                  <Images className="h-4 w-4 text-safety" />
                  <span className={`text-xs font-bold uppercase tracking-[0.16em] ${fontClass}`}>{filtered.length} photos</span>
                </div>
                <Radio className="h-4 w-4 text-bronze-glow" />
              </div>
              <div className="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2">
                {filtered.map((photo) => (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => setActiveUrl(photo.url)}
                    className={`group relative aspect-[4/3] overflow-hidden rounded-sm border-2 bg-iron transition-colors ${
                      active.url === photo.url ? "border-safety" : "border-transparent hover:border-white/35"
                    }`}
                  >
                    <img src={photo.url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className={`absolute bottom-1 left-1 rounded bg-iron-deep/75 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur ${fontClass}`}>
                      {photo.equipmentId}
                    </span>
                  </button>
                ))}
              </div>
              <Link
                to="/equipment/$category/$id"
                params={{ category: active.category, id: active.equipmentId }}
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-safety bg-safety/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-safety transition-colors hover:bg-safety hover:text-white ${fontClass}`}
              >
                View equipment <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </aside>
          </div>
        ) : (
          <div className="mt-6 rounded-md border border-dashed border-white/20 bg-white/[0.04] p-10 text-center backdrop-blur-md">
            <Images className="mx-auto h-8 w-8 text-bronze-glow" />
            <p className={`mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/80 ${fontClass}`}>Waiting for hosted photos</p>
            <p className={`mx-auto mt-2 max-w-md text-sm text-white/58 ${fontClass}`}>Upload images into the equipment real-photo hosting folders and they will appear here automatically.</p>
          </div>
        )}
      </div>
    </section>
  );
}