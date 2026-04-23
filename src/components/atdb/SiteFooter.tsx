import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Facebook, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/brand/atdb-logo-dark.webp";
import { COMPANY, buildWhatsappGenericLink } from "@/lib/atdb-data";
import { useI18n, useFontClass } from "@/lib/i18n";

export function SiteFooter() {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();

  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const links = [
    { to: "/equipment" as const, l: t("nav.equipment") },
    { to: "/projects" as const, l: t("nav.projects") },
    { to: "/about" as const, l: t("nav.about") },
    { to: "/contact" as const, l: t("nav.contact") },
  ];

  const officeFor = (city: string) => {
    if (city === "Dhaka") return { label: t("office.corporate"), city: t("office.dhaka"), addr: t("office.dhaka.address") };
    return { label: t("office.branch"), city: t("office.tangail"), addr: t("office.tangail.address") };
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-iron pb-28 text-white/85 md:pb-0">
      {/* Decorative top gradient line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze-glow/40 to-transparent" />
      {/* Ambient radial glow — subtle brand atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--safety) 0%, transparent 70%)" }}
      />

      <div className="container-page relative grid gap-10 py-14 sm:grid-cols-2 md:gap-x-10 md:gap-y-12 md:py-16 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <img src={logo} alt="ATDB Trade International" width={220} height={64} className="h-14 w-auto object-contain" />
          <p className={`mt-5 max-w-xs text-sm leading-relaxed text-white/65 ${fontClass}`}>
            {t("footer.tagline")}
          </p>
        </div>

        <div className="lg:col-span-2">
          <h4 className="eyebrow !text-bronze-glow">{t("footer.explore")}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((i) => (
              <li key={i.to}>
                <Link to={i.to} className={`text-white/75 transition-colors hover:text-safety ${fontClass}`}>
                  {i.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow !text-bronze-glow">{t("footer.offices")}</h4>
          <ul className="mt-4 space-y-4 text-sm text-white/75">
            {COMPANY.offices.map((o) => {
              const loc = officeFor(o.city);
              return (
                <li key={o.city} className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-glow" />
                  <div>
                    <p className={`text-sm font-semibold text-white ${fontClass}`}>{loc.label}</p>
                    <p className={`text-xs leading-relaxed ${fontClass}`}>{loc.addr}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <h4 className="eyebrow !text-bronze-glow">{t("footer.contact")}</h4>
          <ul className={`mt-4 space-y-2.5 text-sm text-white/75 ${fontClass}`}>
            <li>
              <a href={`tel:${COMPANY.phones[0].number}`} className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-safety focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep rounded-sm">
                <Phone className="h-3.5 w-3.5 text-bronze-glow" strokeWidth={2} />
                <span>{COMPANY.phones[0].number}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-safety focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep rounded-sm">
                <Mail className="h-3.5 w-3.5 text-bronze-glow" strokeWidth={2} />
                <span>{COMPANY.email}</span>
              </a>
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-2">
            <a
              href={buildWhatsappGenericLink(undefined, lang)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="group/icon grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-safety/40 hover:bg-white/10 hover:text-safety hover:shadow-[0_6px_18px_-4px_color-mix(in_oklab,var(--safety)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={COMPANY.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit ATDB on Facebook"
              className="group/icon grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-safety/40 hover:bg-white/10 hover:text-safety hover:shadow-[0_6px_18px_-4px_color-mix(in_oklab,var(--safety)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep"
            >
              <Facebook className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>

      {/* Premium Designer Credit Section */}
      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col-reverse items-center justify-center gap-5 py-7 text-center md:flex-row md:flex-wrap md:justify-between md:gap-x-6 md:gap-y-4 md:pr-52 md:text-left lg:pr-60">
          {/* Designer Credit — Premium Branding */}
          <motion.div
            className="group relative flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="relative">
              {/* Animated glow backdrop */}
              <div className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-bronze-glow/40 via-safety/20 to-bronze-glow/40 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Glass container with premium styling */}
              <a
                href="https://behance.net/saazidhossain"
                target="_blank"
                rel="noopener noreferrer author"
                className="relative inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/8 px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-bronze-glow/60 hover:bg-white/12 hover:shadow-[0_8px_24px_rgba(212,162,77,0.2)]"
                title="Sazid Hossain — Architect & Designer · Award-Winning Portfolio"
              >
                {/* Shimmer effect */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                
                {/* Sparkle icon */}
                <span className="relative">
                  <Sparkles className="h-3.5 w-3.5 text-bronze-glow transition-transform duration-300 group-hover:rotate-12" />
                </span>
                
                {/* Text content */}
                <span className="relative flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-bronze-glow to-safety" />
                  <span className={`text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-bronze-glow via-safety to-bronze-glow bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 ${fontClass}`}>
                    {t("footer.credit")}
                  </span>
                </span>
              </a>
            </div>
          </motion.div>

          {/* Copyright */}
          <p className={`text-xs text-white/50 transition-colors duration-300 ${fontClass}`}>
            © {year ?? "—"} <span className="font-semibold text-white/70">{COMPANY.name}</span>. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
