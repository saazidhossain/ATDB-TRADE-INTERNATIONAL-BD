import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ruler, Gauge, Fuel, ShieldCheck } from "lucide-react";
import { useI18n, useFontClass } from "@/lib/i18n";
import type { Equipment } from "@/lib/atdb-data";

type Row = { label: string; value: string };
type Group = { key: string; title: string; icon: typeof Ruler; rows: Row[] };

export function buildSpecGroups(eq: Equipment, t: (k: string) => string): Group[] {
  const isCrane = eq.category === "cranes";
  const isRoller = eq.category === "rollers";

  return [
    {
      key: "dimensions",
      title: t("specs.dimensions"),
      icon: Ruler,
      rows: [
        { label: t("spec.row.capacity"), value: eq.capacity },
        {
          label: t("spec.row.config"),
          value: eq.notes ?? (isCrane ? t("spec.val.telescopic") : t("spec.val.standard")),
        },
        { label: t("spec.row.origin"), value: eq.origin },
        { label: t("spec.row.year"), value: eq.year ? String(eq.year) : t("spec.val.dash") },
      ],
    },
    {
      key: "performance",
      title: t("specs.performance"),
      icon: Gauge,
      rows: [
        { label: t("spec.row.rated"), value: eq.capacity },
        { label: t("spec.row.operator"), value: t("spec.val.operatorIncl") },
        { label: t("spec.row.mobilisation"), value: t("spec.val.onRequest") },
        {
          label: t("spec.row.workMode"),
          value: isRoller
            ? t("spec.val.vibratory")
            : isCrane
              ? t("spec.val.lift")
              : t("spec.val.cyclic"),
        },
      ],
    },
    {
      key: "engine",
      title: t("specs.engine"),
      icon: Fuel,
      rows: [
        { label: t("spec.row.fuel"), value: eq.fuel ?? t("spec.val.diesel") },
        { label: t("spec.row.brand"), value: eq.brand },
        { label: t("spec.row.model"), value: eq.model },
        {
          label: t("spec.row.drive"),
          value: isCrane ? t("spec.val.allTerrain") : t("spec.val.oem"),
        },
      ],
    },
    {
      key: "safety",
      title: t("specs.safety"),
      icon: ShieldCheck,
      rows: [
        { label: t("spec.row.inspection"), value: t("spec.val.cis") },
        { label: t("spec.row.class"), value: t("spec.val.firstClass") },
        { label: t("spec.row.ppe"), value: t("spec.val.ppeProvided") },
        { label: t("spec.row.insurance"), value: t("spec.val.insOnReq") },
      ],
    },
  ];
}

export function SpecGroupsAccordion({ eq }: { eq: Equipment }) {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();
  const groups = buildSpecGroups(eq, t);
  const [open, setOpen] = useState<Record<string, boolean>>({
    dimensions: true,
    performance: true,
    engine: false,
    safety: false,
  });

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      className="mt-8 space-y-3"
    >
      {groups.map((g) => {
        const isOpen = !!open[g.key];
        const Icon = g.icon;
        return (
          <motion.div
            key={g.key}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="overflow-hidden rounded-md border border-border bg-card shadow-card"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen((s) => ({ ...s, [g.key]: !isOpen }))}
              className="flex w-full items-center justify-between gap-4 bg-muted/40 px-5 py-3.5 text-left transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-sm bg-gradient-iron text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.18em] text-safety ${fontClass}`}
                >
                  {g.title}
                </span>
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="inline-flex"
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <motion.dl
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                    }}
                    className="grid gap-px bg-border sm:grid-cols-2"
                  >
                    {g.rows.map((r) => (
                      <motion.div
                        key={r.label}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.3, ease: "easeOut" },
                          },
                        }}
                        className="flex items-start justify-between gap-6 bg-card px-5 py-3"
                      >
                        <dt
                          className={`text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground ${fontClass}`}
                        >
                          {r.label}
                        </dt>
                        <dd className={`text-right text-sm font-semibold text-iron ${fontClass}`}>
                          {r.value}
                        </dd>
                      </motion.div>
                    ))}
                  </motion.dl>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
