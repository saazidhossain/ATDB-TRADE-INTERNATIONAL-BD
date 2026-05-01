import { motion } from "framer-motion";
import { Facebook } from "lucide-react";
import { COMPANY } from "@/lib/atdb-data";

type Variant = "header" | "footer";

interface FacebookLinkProps {
  variant?: Variant;
  label?: string;
  className?: string;
}

/**
 * Glassmorphic, animated Facebook link.
 * - Header: compact pill, subtle backdrop-blur, brand-orange ring on hover.
 * - Footer: dark glass card, animated glow halo + ripple + icon pulse.
 */
export function FacebookLink({ variant = "header", label, className = "" }: FacebookLinkProps) {
  const isFooter = variant === "footer";

  if (isFooter) {
    return (
      <motion.a
        href={COMPANY.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit ATDB on Facebook"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] transition-colors hover:border-[#1877F2]/60 hover:bg-white/10 ${className}`}
      >
        {/* animated bronze-to-facebook glow halo */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(24,119,242,0.55), rgba(245,124,0,0.4), rgba(24,119,242,0.55))",
          }}
        />
        {/* shimmer sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        {/* icon orb */}
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#1877F2] to-[#0c5dc7] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(24,119,242,0.45)] ring-1 ring-white/20 transition-transform duration-300 group-hover:rotate-[8deg]">
          <Facebook className="h-4 w-4 fill-white text-white" strokeWidth={0} />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full opacity-0 ring-2 ring-[#1877F2]/60 transition-all duration-700 group-hover:scale-150 group-hover:opacity-0 group-hover:[transition-duration:1200ms]"
            style={{ animation: "atdb-ripple 1.6s ease-out infinite" }}
          />
        </span>
        <span className="relative z-10 tracking-wide">{label ?? "Follow on Facebook"}</span>
      </motion.a>
    );
  }

  // Header — compact glass icon-only square (matches Phone + Email pills)
  return (
    <motion.a
      href={COMPANY.facebook}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit ATDB on Facebook"
      title="Facebook"
      whileHover={{ y: -2, scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className={`group relative hidden h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-md backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-[#1877F2]/60 hover:bg-white/10 focus-visible:border-[#1877F2] focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep sm:grid ${className}`}
    >
      {/* animated gradient ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 blur-[6px] transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90"
        style={{
          background:
            "linear-gradient(120deg, rgba(24,119,242,0.45), rgba(245,124,0,0.35), rgba(24,119,242,0.45))",
        }}
      />
      {/* shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#1877F2] to-[#0c5dc7] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_8px_rgba(24,119,242,0.45)] ring-1 ring-white/30 transition-transform duration-300 group-hover:rotate-[12deg]">
        <Facebook className="h-3.5 w-3.5 fill-white text-white" strokeWidth={0} />
      </span>
      <span className="sr-only">Facebook</span>
    </motion.a>
  );
}
