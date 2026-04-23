import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import logo from "@/assets/brand/atdb-logo-light.webp";
import { COMPANY, buildWhatsappGenericLink } from "@/lib/atdb-data";
import { useI18n, type Lang, useFontClass } from "@/lib/i18n";
import { CartButton } from "./CartButton";
import { FacebookLink } from "./FacebookLink";
import { WhatsappButton } from "./WhatsappButton";
import { ContactChannelButton } from "./ContactChannelButton";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useI18n();
  const fontClass = useFontClass();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV = [
    { to: "/" as const, label: t("nav.home") },
    { to: "/equipment" as const, label: t("nav.equipment") },
    { to: "/projects" as const, label: t("nav.projects") },
    { to: "/about" as const, label: t("nav.about") },
    { to: "/contact" as const, label: t("nav.contact") },
  ];

  const toggleLang = () => setLang(lang === "en" ? "bn" : "en");

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-[background,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "glass-dark shadow-[0_4px_24px_-8px_rgba(0,0,0,0.45)]"
          : "header-veil"
      }`}
    >
      <div
        className={`container-page flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? "h-14 md:h-16 lg:h-16" : "h-16 md:h-20 lg:h-24 lg:py-2"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-opacity duration-300 hover:opacity-80 focus-visible:opacity-80"
          aria-label="ATDB Trade International — home"
        >
          <img
            src={logo}
            alt="ATDB Trade International"
            width={180}
            height={48}
            className={`w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${
              scrolled ? "h-8 md:h-9 lg:h-10" : "h-9 md:h-11 lg:h-14"
            }`}
            fetchPriority="high"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex lg:gap-10" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm font-medium text-white/85 transition-colors duration-200 hover:text-safety lg:text-[15px] ${fontClass}`}
              activeProps={{ className: "text-safety" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton />
          <LangSwitch lang={lang} onToggle={toggleLang} />
          {/* Unified social/contact channel row — equal alignment */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <FacebookLink variant="header" />
            <ContactChannelButton
              channel="phone"
              href={`tel:${COMPANY.phones[0].number}`}
              ariaLabel={`Call ${COMPANY.phones[0].number}`}
              variant="header"
            >
              Call
            </ContactChannelButton>
            <ContactChannelButton
              channel="email"
              href={`mailto:${COMPANY.email}`}
              ariaLabel={`Email ${COMPANY.email}`}
              variant="header"
            >
              Email
            </ContactChannelButton>
            <WhatsappButton
              href={buildWhatsappGenericLink(undefined, lang)}
              variant="header"
              ariaLabel={t("nav.getQuote")}
            >
              {t("nav.getQuote")}
            </WhatsappButton>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-sm border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-2" aria-label="Mobile">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`border-b border-border/60 py-3.5 text-[15px] font-medium text-iron ${fontClass}`}
                activeProps={{ className: "text-safety" }}
              >
                {n.label}
              </Link>
            ))}

            {/* Primary CTA — minimal, single accent */}
            <a
              href={buildWhatsappGenericLink(undefined, lang)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`mt-5 inline-flex h-11 items-center justify-center rounded-sm bg-safety px-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-safety/90 ${fontClass}`}
            >
              {t("nav.whatsappQuote")}
            </a>

            {/* Minimal contact row — flat, equal-height, aligned */}
            <ul className="mt-3 mb-2 divide-y divide-border/60 border-y border-border/60">
              <li>
                <a
                  href={`tel:${COMPANY.phones[0].number}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3 text-sm text-iron"
                >
                  <span className={`text-muted-foreground ${fontClass}`}>
                    {t("nav.call")}
                  </span>
                  <span className="font-display font-semibold tracking-wide text-iron">{COMPANY.phones[0].number}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 py-3 text-sm text-iron"
                >
                  <span className={`text-muted-foreground ${fontClass}`}>
                    {t("nav.email")}
                  </span>
                  <span className="truncate font-display font-semibold text-iron">{COMPANY.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3 text-sm text-iron"
                >
                  <span className={`text-muted-foreground ${fontClass}`}>Facebook</span>
                  <span className="font-display font-semibold text-iron">@atdbtrade</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

function LangSwitch({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch language to ${lang === "en" ? "Bengali" : "English"}`}
      className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-iron/15 px-2.5 font-display text-xs font-semibold text-iron transition-colors hover:border-safety hover:text-safety"
    >
      <Globe className="h-3.5 w-3.5" />
      <span className={lang === "en" ? "text-safety" : "text-iron/40"}>EN</span>
      <span className="text-iron/30">/</span>
      <span className={`font-bn ${lang === "bn" ? "text-safety" : "text-iron/40"}`}>বাং</span>
    </button>
  );
}
