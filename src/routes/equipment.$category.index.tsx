import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/atdb/Layout";
import { EquipmentCard, equipmentGridVariants } from "@/components/atdb/EquipmentCard";
import {
  CATEGORIES,
  getCategoryFleet,
  getCategoryLabel,
  type EquipmentCategory,
} from "@/lib/atdb-data";
import { useI18n, useFontClass } from "@/lib/i18n";

const validCategories = Object.keys(CATEGORIES) as EquipmentCategory[];

const CAT_TAGLINE_KEY: Record<EquipmentCategory, string> = {
  cranes: "cat.cranes.tagline",
  rollers: "cat.rollers.tagline",
  excavators: "cat.excavators.tagline",
  loaders: "cat.loaders.tagline",
  support: "cat.support.tagline",
};

export const Route = createFileRoute("/equipment/$category/")({
  beforeLoad: ({ params }) => {
    if (!validCategories.includes(params.category as EquipmentCategory)) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const cat = CATEGORIES[params.category as EquipmentCategory];
    if (!cat) return { meta: [{ title: "Equipment — ATDB" }] };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.atdbtrade.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Equipment",
          item: "https://www.atdbtrade.com/equipment",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: cat.label,
          item: `https://www.atdbtrade.com/equipment/${params.category}`,
        },
      ],
    };
    return {
      meta: [
        { title: `${cat.label} — ATDB Trade International` },
        {
          name: "description",
          content: `${cat.label} for rent in Bangladesh. ${cat.tagline}. Inspection-certified, instant WhatsApp quotation.`,
        },
        { property: "og:title", content: `${cat.label} — ATDB Trade International` },
        { property: "og:description", content: `${cat.tagline}. Get a WhatsApp quote in minutes.` },
        { property: "og:image", content: cat.image },
        { name: "twitter:image", content: cat.image },
      ],
      links: [{ rel: "canonical", href: `https://www.atdbtrade.com/equipment/${params.category}` }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd) }],
    };
  },
  notFoundComponent: () => <CategoryNotFound />,
  component: CategoryPage,
});

function CategoryNotFound() {
  const { t } = useI18n();
  return (
    <Layout>
      <div className="container-page py-32 text-center">
        <h1 className="font-display text-3xl font-bold text-iron">{t("eq.cat.notFound")}</h1>
        <Link to="/equipment" className="mt-4 inline-block text-safety hover:underline">
          {t("eq.cat.back")}
        </Link>
      </div>
    </Layout>
  );
}

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = CATEGORIES[category as EquipmentCategory];
  const items = getCategoryFleet(category as EquipmentCategory);
  const { t, lang } = useI18n();
  const fontClass = useFontClass();

  const taglineKey = CAT_TAGLINE_KEY[category as EquipmentCategory];
  const localizedLabel = getCategoryLabel(category as EquipmentCategory, lang);

  return (
    <Layout>
      <section className="relative isolate overflow-hidden bg-iron-deep py-20 text-white md:py-24">
        <img
          src={cat.image}
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-iron-deep/70 to-iron-deep" />
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-white/65">
            <Link to="/" className={`hover:text-safety ${fontClass}`}>
              {t("eq.bc.home")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/equipment" className={`hover:text-safety ${fontClass}`}>
              {t("eq.bc.equipment")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className={`text-white ${fontClass}`}>{localizedLabel}</span>
          </nav>
          {lang === "en" && (
            <p className="eyebrow mt-4 !text-bronze-glow font-bn">{cat.label_bn}</p>
          )}
          <h1 className={`mt-2 text-4xl font-bold text-white md:text-5xl ${fontClass}`}>
            {localizedLabel}
          </h1>
          <p className={`mt-3 max-w-2xl text-white/75 ${fontClass}`}>
            {items.length} {t("common.unitsAvailable")} · {t(taglineKey)}
          </p>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={equipmentGridVariants}
          className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((eq) => (
            <EquipmentCard key={eq.id} eq={eq} />
          ))}
        </motion.div>
      </section>
    </Layout>
  );
}
