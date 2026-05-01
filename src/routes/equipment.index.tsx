import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/atdb/Layout";
import { CATEGORIES, FLEET } from "@/lib/atdb-data";
import { useI18n, useFontClass } from "@/lib/i18n";
import equipmentOg from "@/assets/eq-crane-liebherr.webp";

const categoryGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const categoryCardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export const Route = createFileRoute("/equipment/")({
  head: () => ({
    meta: [
      { title: "Equipment Fleet — ATDB Trade International" },
      {
        name: "description",
        content:
          "Browse ATDB's complete heavy equipment fleet: 7 mobile cranes, 9 road rollers, 6 excavators, plus support equipment. Liebherr, Kato, Sakai, CAT, Komatsu, JCB, CASE.",
      },
      { property: "og:title", content: "Equipment Fleet — ATDB Trade International" },
      {
        property: "og:description",
        content:
          "30+ certified heavy machines across cranes, rollers, excavators and support equipment.",
      },
      { property: "og:image", content: equipmentOg },
      { name: "twitter:image", content: equipmentOg },
    ],
    links: [{ rel: "canonical", href: "https://www.atdbtrade.com/equipment" }],
  }),
  component: EquipmentIndex,
});

function EquipmentIndex() {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();
  const fontClassEyebrow = useFontClass({ eyebrow: true });
  return (
    <Layout>
      <section className="bg-iron-deep py-20 text-white">
        <div className="container-page">
          <p className={`eyebrow !text-bronze-glow ${fontClassEyebrow}`}>{t("eq.eyebrow")}</p>
          <h1 className={`mt-2 max-w-3xl text-4xl font-bold text-white md:text-5xl ${fontClass}`}>
            {t("eq.title")}
          </h1>
          <p className={`mt-4 max-w-2xl text-white/80 ${fontClass}`}>{t("eq.sub")}</p>
        </div>
      </section>

      <section className="bg-background py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={categoryGridVariants}
          className="container-page grid gap-8 md:grid-cols-2"
        >
          {Object.values(CATEGORIES).map((c) => {
            const count = FLEET.filter((f) => f.category === c.slug).length;
            const tx = t as unknown as (k: string) => string;
            const labelKey = `cat.${c.slug}.label`;
            const taglineKey = `cat.${c.slug}.tagline`;
            return (
              <motion.div
                key={c.slug}
                variants={categoryCardVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <Link
                  to="/equipment/$category"
                  params={{ category: c.slug }}
                  className="group relative isolate flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-md border border-border glass-card border-safety-top shadow-card hover:shadow-card-hover"
                >
                  <img
                    src={c.image}
                    alt={tx(labelKey)}
                    loading="lazy"
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-iron-deep/90 via-iron-deep/60 to-transparent" />
                  <div className="p-6 text-white md:p-8">
                    <p className="font-bn text-sm text-bronze-glow">{c.label_bn}</p>
                    <h2 className={`mt-1 text-2xl font-bold text-white md:text-3xl ${fontClass}`}>
                      {tx(labelKey)}
                    </h2>
                    <p className={`mt-1 text-sm text-white/80 ${fontClass}`}>
                      {count} {t("common.units")} · {tx(taglineKey)}
                    </p>
                    <span
                      className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-safety ${fontClass}`}
                    >
                      {t("common.exploreCategory")}{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </Layout>
  );
}
