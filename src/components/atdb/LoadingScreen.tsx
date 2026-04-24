import { useEffect, useRef } from "react";
import logo from "@/assets/brand/atdb-logo-light.webp";

interface LoadingScreenProps {
  /** Called once the exit animation ends and the screen is removed */
  onDone: () => void;
}

/**
 * Full-viewport branded splash screen shown while the app bootstraps.
 * Fades out after a short settle delay to mask the initial bundle parse.
 */
export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Give fonts + first paint a moment, then begin fade-out
    const settle = setTimeout(() => {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }, 900);

    const onEnd = () => onDone();
    overlay.addEventListener("transitionend", onEnd, { once: true });

    return () => {
      clearTimeout(settle);
      overlay.removeEventListener("transitionend", onEnd);
    };
  }, [onDone]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        background: "linear-gradient(135deg, oklch(0.22 0.018 240) 0%, oklch(0.18 0.02 240) 100%)",
        opacity: 1,
        transition: "opacity 550ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="ATDB Trade International"
        width={220}
        height={60}
        style={{
          width: "clamp(160px, 30vw, 220px)",
          height: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
          animation: "atdb-loader-pop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      />

      {/* Tagline */}
      <p
        style={{
          fontFamily: "'Montserrat', system-ui, sans-serif",
          fontSize: "clamp(0.65rem, 1.5vw, 0.8rem)",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "oklch(1 0 0 / 45%)",
          animation: "atdb-loader-fade 0.7s 0.2s ease both",
        }}
      >
        Heavy Equipment Rental
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: "clamp(120px, 20vw, 180px)",
          height: "2px",
          borderRadius: "2px",
          background: "oklch(1 0 0 / 10%)",
          overflow: "hidden",
          animation: "atdb-loader-fade 0.7s 0.15s ease both",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "2px",
            background: "linear-gradient(90deg, oklch(0.70 0.19 45), oklch(0.62 0.10 55))",
            animation: "atdb-loader-bar 1.1s 0.1s cubic-bezier(0.4, 0, 0.2, 1) both",
          }}
        />
      </div>

      <style>{`
        @keyframes atdb-loader-pop {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes atdb-loader-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes atdb-loader-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
