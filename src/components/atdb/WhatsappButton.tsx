import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useI18n, useFontClass } from "@/lib/i18n";

type Variant = "header" | "fab" | "cta" | "ctaDark" | "drawer" | "hero";

interface WhatsappButtonProps {
  href: string;
  children?: ReactNode;
  /** Visual variant — see component header for details. */
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  /** Show the small label text on header variant ≥ sm only (matches old behaviour). */
  fullWidth?: boolean;
}

/** Inline brand WhatsApp glyph */
function WaGlyph({ className = "h-4 w-4 fill-white" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M19.11 17.32c-.27-.13-1.59-.78-1.84-.87-.25-.09-.43-.13-.61.13-.18.27-.7.87-.85 1.05-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.16-1.34-.8-.71-1.34-1.6-1.49-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.46.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.61-1.46-.83-2-.22-.53-.45-.46-.62-.47l-.53-.01a1.02 1.02 0 0 0-.74.34c-.25.27-.96.94-.96 2.29 0 1.35.99 2.66 1.13 2.84.13.18 1.95 2.98 4.72 4.18.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.59-.65 1.81-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31zM16.06 5.33c-5.91 0-10.71 4.8-10.71 10.7 0 1.89.5 3.74 1.45 5.36L5 27l5.78-1.51a10.7 10.7 0 0 0 5.28 1.36h.01c5.9 0 10.7-4.8 10.7-10.71 0-2.86-1.11-5.55-3.13-7.57a10.65 10.65 0 0 0-7.58-3.24z" />
    </svg>
  );
}

/**
 * Glassmorphic, animated WhatsApp button — companion to <FacebookLink>.
 *
 * Variants:
 * - header   : compact glass pill for the desktop site header.
 * - fab      : floating action button (bottom-right, persistent ripple).
 * - cta      : full-width primary CTA (replaces bg-whatsapp blocks on light surfaces).
 * - ctaDark  : same as cta but tuned for dark/iron-deep backgrounds.
 * - drawer   : matches cta but spaced for the cart drawer footer.
 * - hero     : large hero-section CTA for the contact page.
 */
export function WhatsappButton({
  href,
  children,
  variant = "cta",
  className = "",
  ariaLabel,
  fullWidth,
}: WhatsappButtonProps) {
  const { lang } = useI18n();
  const fontClass = useFontClass();

  // Guard: if href is missing or empty, render a disabled placeholder so we
  // never produce a broken <a> link.
  if (!href) {
    return (
      <span
        role="button"
        aria-disabled="true"
        aria-label={ariaLabel ?? "Chat on WhatsApp"}
        className={`inline-flex items-center justify-center gap-2.5 rounded-sm bg-muted px-7 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-not-allowed opacity-60 ${fullWidth ? "w-full" : ""} ${className}`}
      >
        <WaGlyph className="h-4 w-4 fill-muted-foreground" />
        <span>{children}</span>
      </span>
    );
  }

  // ─── HEADER PILL ──────────────────────────────────────────────────
  if (variant === "header") {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ?? "Chat on WhatsApp"}
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className={`group relative hidden h-9 items-center gap-2 overflow-hidden rounded-full border border-whatsapp/40 bg-gradient-to-br from-whatsapp to-[hsl(140,55%,38%)] pl-1.5 pr-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_-6px_rgba(37,211,102,0.6)] backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-whatsapp focus-visible:-translate-y-0.5 focus-visible:border-whatsapp focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep md:inline-flex lg:pr-4 ${fontClass} ${className}`}
      >
        {/* gradient halo */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 blur-[6px] transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90"
          style={{
            background:
              "linear-gradient(120deg, rgba(37,211,102,0.55), rgba(245,124,0,0.4), rgba(37,211,102,0.55))",
          }}
        />
        {/* shimmer sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/20 ring-1 ring-white/40 transition-transform duration-300 group-hover:rotate-[10deg]">
          <WaGlyph className="h-3.5 w-3.5 fill-white" />
        </span>
        <span className="relative z-10">{children}</span>
      </motion.a>
    );
  }

  // ─── FAB (floating, persistent ripple) ────────────────────────────
  if (variant === "fab") {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ?? "Chat on WhatsApp"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -3, scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className={`group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-whatsapp px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-8px_rgba(37,211,102,0.55)] backdrop-blur-md md:bottom-8 md:right-8 ${fontClass} ${className}`}
      >
        {/* persistent breathing halo */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full opacity-60 blur-md"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 50%, rgba(37,211,102,0.55), rgba(245,124,0,0.35), rgba(37,211,102,0.55))",
            animation: "atdb-spin-slow 12s linear infinite",
          }}
        />
        {/* shimmer sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
          <WaGlyph className="h-4 w-4 fill-white" />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full ring-2 ring-white/40"
            style={{ animation: "atdb-ripple 2s ease-out infinite" }}
          />
        </span>
        <span className="relative z-10 hidden sm:inline">{children}</span>
      </motion.a>
    );
  }

  // ─── CTA (light surface) ──────────────────────────────────────────
  if (variant === "cta" || variant === "drawer" || variant === "hero" || variant === "ctaDark") {
    const isDark = variant === "ctaDark";
    const isHero = variant === "hero";
    const sizing = isHero ? "px-7 py-4" : variant === "drawer" ? "px-5 py-3.5" : "px-7 py-4";
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ?? "Chat on WhatsApp"}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`group relative inline-flex ${
          fullWidth ? "w-full" : ""
        } items-center justify-center gap-2.5 overflow-hidden rounded-sm ${
          isDark ? "bg-iron-deep border border-white/10" : "bg-whatsapp"
        } ${sizing} text-sm font-semibold uppercase tracking-wider text-white shadow-cta transition-colors ${fontClass} ${className}`}
      >
        {/* conic halo on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-sm opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 50%, rgba(37,211,102,0.55), rgba(245,124,0,0.4), rgba(37,211,102,0.55))",
          }}
        />
        {/* shimmer sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 transition-transform duration-300 group-hover:rotate-[8deg]">
          <WaGlyph className="h-4 w-4 fill-white" />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full ring-2 ring-white/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ animation: "atdb-ripple 1.6s ease-out infinite" }}
          />
        </span>
        <span className="relative z-10">{children}</span>
      </motion.a>
    );
  }

  return null;
}

export { WaGlyph };
