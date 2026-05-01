import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartButton({ className = "" }: { className?: string }) {
  const { open, count } = useCart();
  return (
    <button
      onClick={open}
      type="button"
      aria-label={`Open quotation cart${count ? ` (${count})` : ""}`}
      aria-haspopup="dialog"
      className={`group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-white/90 backdrop-blur-md backdrop-saturate-150 transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-out hover:-translate-y-0.5 hover:border-safety/60 hover:bg-white/10 hover:text-safety focus-visible:-translate-y-0.5 focus-visible:border-safety focus-visible:bg-white/10 focus-visible:text-safety focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-iron-deep ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 blur-[6px] transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(245,124,0,0.55), rgba(212,162,77,0.35), rgba(245,124,0,0.55))",
        }}
      />
      <ShoppingCart aria-hidden="true" className="relative h-4 w-4" strokeWidth={2.2} />
      {count > 0 && <span className="sr-only">{count} item{count === 1 ? "" : "s"} in cart</span>}
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-safety px-1 font-display text-[10px] font-bold leading-none text-white shadow-[0_2px_6px_rgba(245,124,0,0.6)] ring-2 ring-iron-deep/80"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
