import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Layout } from "@/components/atdb/Layout";
import { WhatsappButton } from "@/components/atdb/WhatsappButton";
import { useI18n, TRANSLATIONS, useFontClass } from "@/lib/i18n";
import { buildWhatsappGenericLink } from "@/lib/atdb-data";
import { PROJECT_CATEGORIES, PROJECTS, HERO_PROJECT_IMAGE } from "@/lib/projects-data";

const SITE_URL = "https://www.atdbtrade.com";
const en = (key: string): string => TRANSLATIONS[key]?.en ?? key;

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "ATDB Trade International — Executed Projects Portfolio",
  description:
    "14 executed heavy-engineering, civil construction and infrastructural projects across Bangladesh by M/S ATDB Trade International.",
  numberOfItems: PROJECTS.length,
  itemListElement: PROJECTS.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "CreativeWork",
      name: en(p.titleKey),
      description: en(p.scopeKey),
      image: `${SITE_URL}${p.image}`,
      locationCreated: {
        "@type": "Place",
        name: en(p.locationKey),
        address: {
          "@type": "PostalAddress",
          addressLocality: en(p.locationKey),
          addressCountry: "BD",
        },
      },
      creator: { "@type": "Organization", name: "M/S ATDB Trade International" },
    },
  })),
};

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Executed Projects — ATDB Trade International" },
      { name: "description", content: "ATDB's portfolio: BRT Airport-Gazipur, Jamuna Bridge Contract 1, RTIP-2 Ghatail, Centeon Pharma, Pharmacil, Pharma Ashia, AMC Knit Composite, SMC ORS, Nassa Super Garments — 14 executed heavy-engineering & civil projects across Bangladesh." },
      { property: "og:title", content: "ATDB Trade International — Executed Projects Portfolio" },
      { property: "og:description", content: "14 executed projects across mega-infrastructure, industrial, roadways and specialised civil works." },
      { property: "og:image", content: HERO_PROJECT_IMAGE },
      { name: "twitter:image", content: HERO_PROJECT_IMAGE },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(projectsJsonLd),
      },
    ],
  }),
  component: ProjectsPage,
});

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

function ProjectsPage() {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();
  const fontClassEyebrow = useFontClass({ eyebrow: true });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-iron-deep py-24 text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${HERO_PROJECT_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-iron-deep via-iron-deep/85 to-iron-deep/40" aria-hidden="true" />
        <div className="container-page relative">
          <p className={`eyebrow !text-bronze-glow ${fontClassEyebrow}`}>{t("projects.eyebrow")}</p>
          <h1 className={`mt-2 max-w-3xl text-4xl font-bold text-white md:text-5xl ${fontClass}`}>
            {t("projects.title")}
          </h1>
          <p className={`mt-4 max-w-3xl text-white/80 md:text-lg ${fontClass}`}>
            {t("projects.lede")}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((c, idx) => (
              <a
                key={c.key}
                href={`#cat-${c.key}`}
                className={`rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors hover:border-bronze-glow hover:text-bronze-glow ${fontClass}`}
              >
                {idx + 1}. {t(c.titleKey as Parameters<typeof t>[0])}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories + project grids */}
      {PROJECT_CATEGORIES.map((cat, idx) => {
        const items = PROJECTS.filter((p) => p.category === cat.key);
        return (
          <section
            key={cat.key}
            id={`cat-${cat.key}`}
            className={`scroll-mt-24 py-16 md:py-20 ${idx % 2 === 0 ? "bg-background" : "bg-muted/40"}`}
          >
            <div className="container-page">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-[0.2em] text-safety ${fontClass}`}>
                    {String(idx + 1).padStart(2, "0")} · {items.length} {items.length === 1 ? "project" : "projects"}
                  </p>
                  <h2 className={`mt-2 max-w-2xl text-2xl font-bold text-iron md:text-3xl ${fontClass}`}>
                    {t(cat.titleKey as Parameters<typeof t>[0])}
                  </h2>
                  <p className={`mt-1.5 max-w-xl text-sm text-muted-foreground ${fontClass}`}>
                    {t(cat.subtitleKey as Parameters<typeof t>[0])}
                  </p>
                </div>
              </div>

              <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((p) => (
                  <motion.article
                    key={p.id}
                    variants={cardVariants}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className="group flex flex-col overflow-hidden rounded-md border border-border glass-card shadow-card hover:shadow-card-hover"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={p.image}
                        alt={t(p.titleKey as Parameters<typeof t>[0])}
                        loading="lazy"
                        width={1024}
                        height={768}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-iron-deep/40 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-safety ${fontClass}`}>
                        <MapPin className="h-3 w-3" />
                        {t(p.locationKey as Parameters<typeof t>[0])}
                      </p>
                      <h3 className={`mt-1.5 text-lg font-bold leading-tight text-iron ${fontClass}`}>
                        {t(p.titleKey as Parameters<typeof t>[0])}
                      </h3>
                      <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${fontClass}`}>
                        {t(p.scopeKey as Parameters<typeof t>[0])}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="bg-gradient-safety py-14 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className={`text-2xl font-bold text-white md:text-3xl ${fontClass}`}>{t("projects.cta.title")}</h2>
            <p className={`mt-1 max-w-xl text-sm text-white/90 ${fontClass}`}>{t("projects.cta.body")}</p>
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
