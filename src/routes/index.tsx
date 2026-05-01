import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Zap, Wrench, BadgeCheck, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layout } from "@/components/atdb/Layout";
import { EquipmentCard } from "@/components/atdb/EquipmentCard";
import { WhatsappButton } from "@/components/atdb/WhatsappButton";
import { LivePhotoViewer } from "@/components/atdb/LivePhotoViewer";
import {
  CATEGORIES,
  COMPANY,
  FEATURED,
  buildWhatsappGenericLink,
  type EquipmentCategory,
} from "@/lib/atdb-data";
import { PROJECTS as ALL_PROJECTS, type ProjectCategoryKey } from "@/lib/projects-data";
import { useI18n, useFontClass } from "@/lib/i18n";
import heroImg from "@/assets/brand/atdb-hero-monument.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATDB Trade International — Heavy Equipment Rental in Bangladesh" },
      { name: "description", content: "Bangladesh's premier heavy equipment rental partner since 2000. Cranes, road rollers, excavators, and support equipment. Instant WhatsApp quotation." },
      { property: "og:title", content: "ATDB Trade International — Heavy Equipment Rental" },
      { property: "og:description", content: "26 years of certified fleet operations across Bangladesh. Liebherr, Kato, Sakai, CAT, Komatsu, JCB, CASE." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
    links: [
      { rel: "canonical", href: "https://www.atdbtrade.com/" },
    ],
  }),
  component: Index,
});

// 6 featured projects — at least one from each of the 4 categories.
const FEATURED_PROJECT_IDS = ["jamuna", "rtip2", "centeon", "pharmacil", "smc-reservoir", "centeon-etp"] as const;
const HOME_PROJECTS = FEATURED_PROJECT_IDS
  .map((id) => ALL_PROJECTS.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const CAT_BADGE: Record<ProjectCategoryKey, string> = {
  infra: "pcat.infra.badge",
  industrial: "pcat.industrial.badge",
  roads: "pcat.roads.badge",
  civil: "pcat.civil.badge",
};

const BRANDS = ["Liebherr", "Kato", "Sakai", "CAT", "Komatsu", "JCB", "Dynapac", "Bomag", "CASE", "XCMG"];
const CAT_KEYS: Record<EquipmentCategory, { label: string; tagline: string }> = {
  cranes: { label: "cat.cranes.label", tagline: "cat.cranes.tagline" },
  rollers: { label: "cat.rollers.label", tagline: "cat.rollers.tagline" },
  excavators: { label: "cat.excavators.label", tagline: "cat.excavators.tagline" },
  loaders: { label: "cat.loaders.label", tagline: "cat.loaders.tagline" },
  support: { label: "cat.support.label", tagline: "cat.support.tagline" },
};

function Index() {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();
  const fontClassEyebrow = useFontClass({ eyebrow: true });
  const tx = t as unknown as (k: string) => string;

  // Subtle scroll parallax on hero monument
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 160]);
  const heroScale = useTransform(scrollY, [0, 800], [1.05, 1.18]);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const fn = () => setReduce(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);

  const PILLARS = [
    { icon: ShieldCheck, title: t("pillar.fleet.t"), desc: t("pillar.fleet.d") },
    { icon: BadgeCheck, title: t("pillar.safety.t"), desc: t("pillar.safety.d") },
    { icon: Zap, title: t("pillar.whatsapp.t"), desc: t("pillar.whatsapp.d") },
    { icon: Wrench, title: t("pillar.pricing.t"), desc: t("pillar.pricing.d") },
  ];

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-iron-deep text-white">
        <motion.img
          src={heroImg}
          alt="ATDB Trade International — monumental industrial gateway with cranes, road roller and Dhaka skyline at sunset"
          width={1920}
          height={1080}
          fetchPriority="high"
          style={reduce ? undefined : { y: heroY, scale: heroScale }}
          className="absolute inset-0 -z-10 h-[115%] w-full object-cover opacity-80 will-change-transform"
        />
        {/* Tonal scrim — deepens the lower half so headline pops */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.18_0.018_240/0.35)_0%,oklch(0.18_0.018_240/0.78)_55%,oklch(0.16_0.018_240/0.95)_100%)]" />
        {/* Bronze radial glow — warms the focal point behind the wordmark */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_28%_62%,oklch(0.78_0.13_65/0.22),transparent_70%)] mix-blend-screen" />
        {/* Engineering grid — subtle blueprint cross-hatch with vignette mask */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        {/* Bronze film grain — fine noise via layered radial dots */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay [background-image:radial-gradient(oklch(0.78_0.13_65/0.55)_0.5px,transparent_0.5px),radial-gradient(oklch(0.62_0.10_55/0.4)_0.5px,transparent_0.5px)] [background-size:3px_3px,5px_5px] [background-position:0_0,1px_2px]" />
        {/* Safety-orange ember particles — drifting upward */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {[
            { l: "12%", d: "0s",   s: 22, o: 0.38 },
            { l: "22%", d: "5.0s", s: 32, o: 0.28 },
            { l: "34%", d: "2.2s", s: 18, o: 0.45 },
            { l: "46%", d: "7.5s", s: 28, o: 0.24 },
            { l: "58%", d: "4.0s", s: 20, o: 0.38 },
            { l: "67%", d: "9.4s", s: 36, o: 0.21 },
            { l: "78%", d: "1.4s", s: 22, o: 0.35 },
            { l: "88%", d: "6.2s", s: 18, o: 0.42 },
            { l: "94%", d: "3.1s", s: 24, o: 0.28 },
          ].map((p, i) => (
            <span
              key={i}
              className="absolute bottom-[-10%] block rounded-full bg-safety blur-[1px] animate-[emberDrift_var(--dur)_linear_infinite]"
              style={{
                left: p.l,
                width: 3,
                height: 3,
                opacity: p.o,
                animationDelay: p.d,
                ["--dur" as string]: `${p.s}s`,
                boxShadow: "0 0 6px oklch(0.78 0.13 65 / 0.5), 0 0 14px oklch(0.7 0.19 45 / 0.28)",
              }}
            />
          ))}
        </div>
        {/* Bottom edge fade — anchors content to next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-iron-deep" />

        <div className="container-page flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:min-h-[92vh] md:pb-24 md:pt-32">
          <p className={`eyebrow !text-bronze-glow animate-in fade-in slide-in-from-bottom-3 duration-700 ${fontClassEyebrow}`}>
            {t("home.eyebrow")}
          </p>
          <h1 className={`mt-4 max-w-4xl text-4xl font-bold leading-[1.05] text-balance text-white animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:120ms] [animation-fill-mode:both] sm:text-5xl md:text-6xl lg:text-7xl ${fontClass}`}>
            {t("home.hero.title.a")} <span className="bg-gradient-to-r from-safety to-bronze-glow bg-clip-text text-transparent">{t("home.hero.title.b")}</span> {t("home.hero.title.c")}
          </h1>
          <p className={`mt-5 max-w-xl text-base leading-relaxed text-white/85 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:240ms] [animation-fill-mode:both] md:text-lg ${fontClass}`}>
            {t("home.hero.sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:360ms] [animation-fill-mode:both]">
            <Link to="/equipment" className={`group inline-flex items-center gap-2 rounded-full bg-gradient-safety px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-cta transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_oklch(0.7_0.19_45/0.5)] sm:px-7 sm:py-4 ${fontClass}`}>
              {t("home.hero.cta.browse")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <WhatsappButton
              href={buildWhatsappGenericLink(undefined, lang)}
              variant="cta"
              className="!px-6 !py-3.5 sm:!px-7 sm:!py-4 glass border-white/20 hover:bg-white/20 rounded-full"
            >
              {t("home.hero.cta.whatsapp")}
            </WhatsappButton>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-iron text-white">
        <div className="container-page grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
          {[
            { n: `${COMPANY.yearsOperating}+`, l: t("stats.years") },
            { n: "30+", l: t("stats.equipment") },
            { n: `${COMPANY.staff}`, l: t("stats.staff") },
            { n: "2", l: t("stats.offices") },
          ].map((s) => (
            <div key={s.l} className="border-l-2 border-bronze pl-5">
              <p className="font-display text-4xl font-bold text-white md:text-5xl">{s.n}</p>
              <p className={`mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70 ${fontClass}`}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section className="overflow-hidden border-y border-border bg-card py-6">
        <p className={`container-page text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground ${fontClass}`}>
          {t("home.brands.eyebrow")}
        </p>
        <div className="relative mt-4 flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="flex shrink-0 animate-[brandMarquee_28s_linear_infinite] gap-12 pr-12">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={`${b}-${i}`} className="font-display text-2xl font-bold tracking-[0.06em] text-iron/55 transition-colors hover:text-safety md:text-3xl">
                <span className="text-bronze-glow">●</span> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-page">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className={`eyebrow ${fontClassEyebrow}`}>{t("home.cat.eyebrow")}</p>
              <h2 className={`mt-2 text-3xl font-bold text-iron md:text-4xl ${fontClass}`}>{t("home.cat.title")}</h2>
            </div>
            <Link to="/equipment" className={`hidden items-center gap-1 text-sm font-semibold text-safety hover:text-safety-deep md:inline-flex ${fontClass}`}>
              {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.values(CATEGORIES).map((c) => {
              const keys = CAT_KEYS[c.slug];
              return (
                <Link key={c.slug} to="/equipment/$category" params={{ category: c.slug }}
                  className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-md border-safety-top shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                  <img src={c.image} alt={tx(keys.label)} loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-iron-deep via-iron-deep/70 to-transparent" />
                  <div className="p-6 text-white">
                    <p className="font-bn text-sm text-bronze-glow">{c.label_bn}</p>
                    <h3 className={`mt-1 text-xl font-bold text-white ${fontClass}`}>{tx(keys.label)}</h3>
                    <p className={`mt-1 text-xs text-white/75 ${fontClass}`}>{tx(keys.tagline)}</p>
                    <span className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-safety transition-transform group-hover:translate-x-1 ${fontClass}`}>
                      {t("common.explore")} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-muted/40 py-20 md:py-28">
        <div className="container-page">
          <p className={`eyebrow ${fontClassEyebrow}`}>{t("home.featured.eyebrow")}</p>
          <h2 className={`mt-2 max-w-2xl text-3xl font-bold text-iron md:text-4xl ${fontClass}`}>{t("home.featured.title")}</h2>
          <motion.div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}>
            {FEATURED.map((eq) => <EquipmentCard key={eq.id} eq={eq} />)}
          </motion.div>
        </div>
      </section>

      <LivePhotoViewer />

      {/* WHY ATDB */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className={`eyebrow ${fontClassEyebrow}`}>{t("home.why.eyebrow")}</p>
              <h2 className={`mt-2 text-3xl font-bold text-iron md:text-4xl ${fontClass}`}>{t("home.why.title")}</h2>
              <p className={`mt-4 text-base text-muted-foreground ${fontClass}`}>{t("home.why.body")}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="group card-glass rounded-md p-6"
                >
                  <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-sm border border-iron/15 bg-white/40 backdrop-blur-md backdrop-saturate-150 transition-colors group-hover:border-safety/50">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_45)] to-[oklch(0.60_0.20_40)] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_2px_8px_rgba(245,124,0,0.45)] ring-1 ring-white/30 transition-transform duration-300 group-hover:rotate-[10deg]">
                      <p.icon className="h-4 w-4 text-white" strokeWidth={2.2} />
                    </span>
                  </div>
                  <h3 className={`mt-4 text-lg font-semibold text-iron transition-colors group-hover:text-safety ${fontClass}`}>{p.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${fontClass}`}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS STRIP */}
      <section className="relative isolate overflow-hidden bg-iron-deep py-20 text-white md:py-28">
        {/* Bronze radial glow — warms the upper-left of the strip */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_55%_at_18%_30%,oklch(0.78_0.13_65/0.16),transparent_70%)] mix-blend-screen" />
        {/* Engineering grid — subtle blueprint cross-hatch with vignette mask */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
        {/* Bronze film grain — layered radial dots */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay [background-image:radial-gradient(oklch(0.78_0.13_65/0.5)_0.5px,transparent_0.5px),radial-gradient(oklch(0.62_0.10_55/0.35)_0.5px,transparent_0.5px)] [background-size:3px_3px,5px_5px] [background-position:0_0,1px_2px]" />
        {/* Safety-orange ember particles — scaled-down ambient drift */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {[
            { l: "8%",  d: "1.5s", s: 28, o: 0.28 },
            { l: "21%", d: "6.0s", s: 36, o: 0.22 },
            { l: "39%", d: "3.4s", s: 24, o: 0.32 },
            { l: "55%", d: "8.2s", s: 30, o: 0.2  },
            { l: "72%", d: "2.0s", s: 26, o: 0.3  },
            { l: "86%", d: "5.0s", s: 32, o: 0.24 },
          ].map((p, i) => (
            <span
              key={i}
              className="absolute bottom-[-10%] block rounded-full bg-safety blur-[1px] animate-[emberDrift_var(--dur)_linear_infinite]"
              style={{
                left: p.l,
                width: 2,
                height: 2,
                opacity: p.o,
                animationDelay: p.d,
                ["--dur" as string]: `${p.s}s`,
                boxShadow: "0 0 5px oklch(0.78 0.13 65 / 0.45), 0 0 12px oklch(0.7 0.19 45 / 0.22)",
              }}
            />
          ))}
        </div>
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className={`eyebrow !text-bronze-glow ${fontClassEyebrow}`}>{t("home.projects.eyebrow")}</p>
              <h2 className={`mt-2 text-3xl font-bold text-white md:text-4xl ${fontClass}`}>{t("home.projects.title")}</h2>
              <p className={`mt-3 text-sm text-white/70 md:text-base ${fontClass}`}>{t("home.projects.sub")}</p>
            </div>
            <Link to="/projects" className={`inline-flex items-center gap-1 text-sm font-semibold text-safety hover:text-bronze-glow ${fontClass}`}>
              {t("home.projects.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}>
            {HOME_PROJECTS.map((p) => (
              <motion.article key={p.id}
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 320, damping: 22 } }}
                className="group relative aspect-[4/5] overflow-hidden rounded-md shadow-card hover:shadow-card-hover">
                <img src={p.image} alt={tx(p.titleKey)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-iron-deep/95 via-iron-deep/40 to-transparent" />
                <span className={`absolute left-4 top-4 rounded-full border border-white/25 bg-iron-deep/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bronze-glow backdrop-blur-md ${fontClass}`}>
                  {tx(CAT_BADGE[p.category])}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-safety ${fontClass}`}>
                    <MapPin className="h-3 w-3" />
                    {tx(p.locationKey)}
                  </p>
                  <h3 className={`mt-1.5 text-base font-bold leading-tight text-white md:text-lg ${fontClass}`}>
                    {tx(p.titleKey)}
                  </h3>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-safety py-16 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className={`text-3xl font-bold text-white md:text-4xl ${fontClass}`}>{t("home.cta.title")}</h2>
            <p className={`mt-2 max-w-xl text-white/90 ${fontClass}`}>{t("home.cta.body")}</p>
          </div>
          <WhatsappButton
            href={buildWhatsappGenericLink(undefined, lang)}
            variant="ctaDark"
          >
            {t("home.cta.button")}
          </WhatsappButton>
        </div>
      </section>
    </Layout>
  );
}
