/**
 * EmberParticles — animated safety-orange ember dots that drift upward.
 * Used on dark hero sections throughout the site. Respects prefers-reduced-motion
 * via CSS (the animation is killed globally in @media (prefers-reduced-motion)).
 */

interface EmberConfig {
  /** left position (CSS value, e.g. "12%") */
  left: string;
  /** animation-delay (CSS value, e.g. "2s") */
  delay: string;
  /** animation-duration in seconds */
  duration: number;
  /** initial opacity */
  opacity: number;
  /** dot size in px (width & height) — defaults to 3 */
  size?: number;
}

const DEFAULT_EMBERS: EmberConfig[] = [
  { left: "7%", delay: "0s", duration: 24, opacity: 0.32 },
  { left: "16%", delay: "4.5s", duration: 30, opacity: 0.24 },
  { left: "28%", delay: "2.0s", duration: 20, opacity: 0.4 },
  { left: "40%", delay: "7.0s", duration: 28, opacity: 0.22 },
  { left: "53%", delay: "1.2s", duration: 22, opacity: 0.36 },
  { left: "65%", delay: "9.0s", duration: 34, opacity: 0.2 },
  { left: "74%", delay: "3.5s", duration: 26, opacity: 0.3 },
  { left: "84%", delay: "6.0s", duration: 20, opacity: 0.38 },
  { left: "93%", delay: "5.3s", duration: 32, opacity: 0.24 },
];

interface Props {
  /** Override the default particle config */
  particles?: EmberConfig[];
  /** Additional wrapper className */
  className?: string;
}

export function EmberParticles({ particles = DEFAULT_EMBERS, className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-10%] block rounded-full bg-safety blur-[1px] animate-[emberDrift_var(--dur)_linear_infinite]"
          style={{
            left: p.left,
            width: p.size ?? 3,
            height: p.size ?? 3,
            opacity: p.opacity,
            animationDelay: p.delay,
            ["--dur" as string]: `${p.duration}s`,
            boxShadow: "0 0 6px oklch(0.78 0.13 65 / 0.5), 0 0 14px oklch(0.7 0.19 45 / 0.28)",
          }}
        />
      ))}
    </div>
  );
}
