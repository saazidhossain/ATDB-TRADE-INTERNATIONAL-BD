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
    <footer className="relative bg-gradient-iron pb-24 text-white/85 md:pb-8">
      {/* Decorative top gradient line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze-glow/40 to-transparent" />
      
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo} alt="ATDB Trade International" width={220} height={64} className="h-14 w-auto object-contain" />
          <p className={`mt-5 max-w-xs text-sm leading-relaxed text-white/65 ${fontClass}`}>
            {t("footer.tagline")}
          </p>
        </div>

        <div>
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

        <div>
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

        <div>
          <h4 className="eyebrow !text-bronze-glow">{t("footer.contact")}</h4>
          <ul className={`mt-4 space-y-2.5 text-sm text-white/75 ${fontClass}`}>
            <li>
              <a href={`tel:${COMPANY.phones[0].number}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-safety">
                <Phone className="h-3.5 w-3.5 text-bronze-glow" strokeWidth={2} />
                <span>{COMPANY.phones[0].number}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-safety">
                <Mail className="h-3.5 w-3.5 text-bronze-glow" strokeWidth={2} />
                <span>{COMPANY.email}</span>
              </a>
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-1">
            <a
              href={buildWhatsappGenericLink(undefined, lang)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-sm text-white/65 transition-colors hover:bg-white/5 hover:text-safety"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={COMPANY.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit ATDB on Facebook"
              className="grid h-9 w-9 place-items-center rounded-sm text-white/65 transition-colors hover:bg-white/5 hover:text-safety"
            >
              <Facebook className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>

      {/* Premium Designer Credit Section */}
      <div className="border-t border-white/5">
        <div className="container-page flex flex-col items-center justify-between gap-6 py-8 md:flex-row md:items-center">
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
