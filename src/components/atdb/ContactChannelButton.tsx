import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n, useFontClass } from "@/lib/i18n";

export type Channel = "phone" | "email";
export type ChannelVariant = "header" | "footer" | "card" | "cta";

interface ContactChannelButtonProps {
  channel: Channel;
  href: string;
  children?: ReactNode;
  /** Optional secondary line (e.g. role, label). */
  sublabel?: ReactNode;
  variant?: ChannelVariant;
  className?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
}

/**
 * Glassmorphic, animated Phone / Email CTA — companion to <WhatsappButton>
 * and <FacebookLink>. Variants:
 *
 * - header : compact light glass pill (matches FacebookLink header).
 * - footer : dark glass pill on iron/footer surfaces (matches FacebookLink footer).
 * - card   : large rounded card row for the contact-page sidebar (replaces old
 *            border-card rows so all four channels feel like one system).
 * - cta    : full-width pill for equipment-detail / sticky-mobile CTA blocks.
 */
export function ContactChannelButton({
  channel,
  href,
  children,
  sublabel,
  variant = "card",
  className = "",
  ariaLabel,
  fullWidth,
}: ContactChannelButtonProps) {
  const { lang } = useI18n();
  const fontClass = useFontClass();
  const Icon = channel === "phone" ? Phone : Mail;

  // Per-channel brand accents (kept in sync with WA green & FB blue).
  // Phone uses ATDB safety-orange (engineering primary), email uses iron-deep + bronze.
  const accent =
    channel === "phone"
      ? {
          orbBg: "bg-gradient-to-br from-[hsl(24,94%,53%)] to-[hsl(20,90%,42%)]",
          orbShadow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_2px_8px_rgba(245,124,0,0.45)]",
          haloFooter:
            "conic-gradient(from 180deg at 50% 50%, rgba(245,124,0,0.55), rgba(212,162,77,0.4), rgba(245,124,0,0.55))",
          haloHeader:
            "linear-gradient(120deg, rgba(245,124,0,0.45), rgba(212,162,77,0.35), rgba(245,124,0,0.45))",
          ringHover: "hover:border-safety/60",
          textHover: "group-hover:text-safety",
          rippleRing: "ring-[hsl(24,94%,53%)]/60",
        }
      : {
          orbBg: "bg-gradient-to-br from-[hsl(28,32%,28%)] to-[hsl(28,40%,18%)]",
          orbShadow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_8px_rgba(58,42,28,0.55)]",
          haloFooter:
            "conic-gradient(from 180deg at 50% 50%, rgba(212,162,77,0.6), rgba(245,124,0,0.4), rgba(212,162,77,0.6))",
          haloHeader:
            "linear-gradient(120deg, rgba(212,162,77,0.5), rgba(245,124,0,0.3), rgba(212,162,77,0.5))",
          ringHover: "hover:border-bronze-glow/60",
          textHover: "group-hover:text-bronze-glow",
          rippleRing: "ring-[hsl(36,55%,57%)]/60",
        };

  // ─── HEADER PILL (light surface, ~h-9) ────────────────────────────
  if (variant === "header") {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel ?? (channel === "phone" ? "Call ATDB" : "Email ATDB")}
        title={typeof children === "string" ? children : ariaLabel}
        whileHover={{ y: -2, scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className={`group relative hidden h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-md backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ease-out ${accent.ringHover} hover:bg-white/10 focus-visible:border-safety focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep sm:grid ${className}`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 blur-[6px] transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90"
          style={{ background: accent.haloHeader }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span
          className={`relative grid h-6 w-6 place-items-center rounded-full ${accent.orbBg} ${accent.orbShadow} ring-1 ring-white/30 transition-transform duration-300 group-hover:rotate-[12deg]`}
        >
          <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />
        </span>
        <span className={`sr-only ${fontClass}`}>{children}</span>
      </motion.a>
    );
  }

  // ─── FOOTER PILL (dark surface, breathing halo) ───────────────────
  if (variant === "footer") {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel ?? (channel === "phone" ? "Call ATDB" : "Email ATDB")}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`group relative inline-flex w-full items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-left text-sm font-semibold text-white backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] transition-colors ${accent.ringHover} hover:bg-white/10 ${className}`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: accent.haloFooter }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span
          className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full ${accent.orbBg} ${accent.orbShadow} ring-1 ring-white/20 transition-transform duration-300 group-hover:rotate-[8deg]`}
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={2.2} />
          <span
            aria-hidden
            className={`absolute inset-0 rounded-full opacity-0 ring-2 ${accent.rippleRing} transition-opacity duration-500 group-hover:opacity-100`}
            style={{ animation: "atdb-ripple 1.6s ease-out infinite" }}
          />
        </span>
        <span className="relative z-10 flex min-w-0 flex-col leading-tight">
          <span className={`truncate tracking-wide ${fontClass}`}>{children}</span>
          {sublabel && (
            <span
              className={`mt-0.5 truncate text-[10px] font-normal uppercase tracking-[0.16em] text-white/55 ${fontClass}`}
            >
              {sublabel}
            </span>
          )}
        </span>
      </motion.a>
    );
  }

  // ─── CARD ROW (light card, contact sidebar) ───────────────────────
  if (variant === "card") {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel ?? (channel === "phone" ? "Call ATDB" : "Email ATDB")}
        whileHover={{ y: -2, scale: 1.005 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`group relative flex items-center gap-3 overflow-hidden rounded-md border border-border bg-card px-4 py-3.5 shadow-card transition-colors ${accent.ringHover} ${className}`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-md opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: accent.haloFooter }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span
          className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-sm ${accent.orbBg} ${accent.orbShadow} ring-1 ring-white/20 transition-transform duration-300 group-hover:rotate-[8deg]`}
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={2.2} />
          <span
            aria-hidden
            className={`absolute inset-0 rounded-sm opacity-0 ring-2 ${accent.rippleRing} transition-opacity duration-500 group-hover:opacity-100`}
            style={{ animation: "atdb-ripple 1.8s ease-out infinite" }}
          />
        </span>
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <span
            className={`truncate font-display text-sm font-semibold text-iron ${accent.textHover} transition-colors`}
          >
            {children}
          </span>
          {sublabel && (
            <span className={`mt-0.5 truncate text-xs text-muted-foreground ${fontClass}`}>
              {sublabel}
            </span>
          )}
        </div>
      </motion.a>
    );
  }

  // ─── CTA (full-width pill, equipment detail / sticky CTA) ─────────
  return (
    <motion.a
      href={href}
      aria-label={ariaLabel ?? (channel === "phone" ? "Call ATDB" : "Email ATDB")}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`group relative inline-flex ${
        fullWidth ? "w-full" : ""
      } items-center justify-center gap-2.5 overflow-hidden rounded-sm border border-iron/15 bg-iron px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-cta transition-colors hover:border-iron ${fontClass} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-sm opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: accent.haloFooter }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span
        className={`relative grid h-7 w-7 place-items-center rounded-full ${accent.orbBg} ${accent.orbShadow} ring-1 ring-white/25 transition-transform duration-300 group-hover:rotate-[8deg]`}
      >
        <Icon className="h-4 w-4 text-white" strokeWidth={2.2} />
      </span>
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
