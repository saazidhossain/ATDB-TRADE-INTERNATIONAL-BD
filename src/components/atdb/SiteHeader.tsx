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
  const [progress, setProgress] = useState(0);
  const { lang, setLang, t } = useI18n();
  const fontClass = useFontClass();

  useEffect(() => {
    // Smooth interpolation between 0 (at top) and 1 (fully scrolled)
    // across a 120px range — feeds the CSS --header-progress var.
    const RANGE = 120;
    const onScroll = () => {
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, y / RANGE));
      setProgress(p);
      setScrolled(y > 80);
    };
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
      className="header-surface sticky top-0 z-40 w-full"
      style={{ ["--header-progress" as never]: progress.toFixed(3) }}
      role="banner"
    >
      {/* Skip link — first focusable element for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-safety focus:px-3 focus:py-2 focus:font-display focus:text-xs focus:font-semibold focus:uppercase focus:tracking-wider focus:text-white focus:shadow-cta"
      >
        Skip to content
      </a>
      <div
        className={`container-page flex items-center justify-between gap-2 transition-all duration-300 sm:gap-3 lg:gap-4 ${
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
              className={`group relative text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white lg:text-[15px] ${fontClass}`}
              activeProps={{
                className: "!text-safety font-semibold",
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-safety transition-transform duration-300 ease-out group-hover:scale-x-50 group-data-[status=active]:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2" role="group" aria-label="Site actions">
          <CartButton />
          <LangSwitch lang={lang} onToggle={toggleLang} />
          {/* Unified social/contact channel row — equal alignment */}
          <div className="hidden items-center gap-1.5 sm:flex" role="group" aria-label="Contact channels">
            <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-white/15 lg:mx-1" />
            <FacebookLink variant="header" />
            <ContactChannelButton
              channel="phone"
              href={`tel:${COMPANY.phones[0].number}`}
              ariaLabel={`${t("nav.call")} ${COMPANY.phones[0].number}`}
              variant="header"
            >
              {t("nav.call")}
            </ContactChannelButton>
            <ContactChannelButton
              channel="email"
              href={`mailto:${COMPANY.email}`}
              ariaLabel={`${t("nav.email")} ${COMPANY.email}`}
              variant="header"
            >
              {t("nav.email")}
            </ContactChannelButton>
            <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-white/15 md:inline-block lg:mx-1" />
            <WhatsappButton
              href={buildWhatsappGenericLink(undefined, lang)}
              variant="header"
              ariaLabel={t("nav.getQuote")}
            >
              {t("nav.getQuote")}
            </WhatsappButton>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-colors hover:border-safety/60 hover:bg-white/10 focus-visible:border-safety focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-2" aria-label="Mobile navigation">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`relative border-b border-border/60 py-3.5 pl-3 text-[15px] font-medium text-iron transition-colors hover:text-safety ${fontClass}`}
                activeProps={{
                  className:
                    "!text-safety font-semibold bg-safety/5 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full before:bg-safety",
                }}
                activeOptions={{ exact: n.to === "/" }}
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
  const nextLang = lang === "en" ? "Bengali" : "English";
  return (
    <button
      onClick={onToggle}
      type="button"
      aria-label={`Switch language to ${nextLang}`}
      aria-live="polite"
      title={`Switch to ${nextLang}`}
      className="group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full border border-white/15 bg-white/5 px-3 font-display text-xs font-semibold text-white/90 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:-translate-y-0.5 hover:border-safety/60 hover:bg-white/10 hover:text-safety focus-visible:-translate-y-0.5 focus-visible:border-safety focus-visible:bg-white/10 focus-visible:text-safety focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep"
    >
      <Globe aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180 group-focus-visible:rotate-180" />
      <span aria-current={lang === "en" ? "true" : undefined} className={lang === "en" ? "text-safety" : "text-white/50"}>EN</span>
      <span className="text-white/25">/</span>
      <span aria-current={lang === "bn" ? "true" : undefined} className={`font-bn ${lang === "bn" ? "text-safety" : "text-white/50"}`}>বাং</span>
    </button>
  );
}
