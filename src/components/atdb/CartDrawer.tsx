import { useEffect } from "react";
import { X, Trash2, MapPin, Calendar, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useI18n, useFontClass } from "@/lib/i18n";
import { WhatsappButton } from "./WhatsappButton";

export function CartDrawer() {
  const { isOpen, close, items, project, setProject, setQty, remove, clear, whatsappUrl, count } =
    useCart();
  const { t, lang } = useI18n();
  const fontClass = useFontClass();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label={t("cart.title")}
    >
      <button
        className="absolute inset-0 bg-iron-deep/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={close}
        aria-label={t("cart.close")}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-border bg-iron-deep px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5 text-bronze-glow" />
            <div>
              <p className={`text-base font-bold ${fontClass}`}>{t("cart.title")}</p>
              <p className={`text-[11px] uppercase tracking-[0.18em] text-white/55 ${fontClass}`}>
                {count} {t("common.units")}
              </p>
            </div>
          </div>
          <button
            onClick={close}
            aria-label={t("cart.close")}
            className="grid h-9 w-9 place-items-center rounded-sm border border-white/15 text-white/80 hover:border-white hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
                <ShoppingCart className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className={`mt-5 text-base font-semibold text-iron ${fontClass}`}>
                {t("cart.empty.t")}
              </p>
              <p className={`mt-1 max-w-xs text-sm text-muted-foreground ${fontClass}`}>
                {t("cart.empty.d")}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="rounded-md border border-border bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-[0.18em] text-safety ${fontClass}`}
                      >
                        {it.id}
                      </p>
                      <p className={`mt-1 truncate text-sm font-semibold text-iron ${fontClass}`}>
                        {it.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{it.capacity}</p>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      aria-label={t("cart.remove")}
                      className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 inline-flex items-center rounded-sm border border-border">
                    <button
                      onClick={() => setQty(it.id, it.qty - 1)}
                      aria-label={t("cart.decrease")}
                      disabled={it.qty <= 1}
                      className="grid h-8 w-8 place-items-center text-iron hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center font-display text-sm font-semibold text-iron">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => setQty(it.id, it.qty + 1)}
                      aria-label={t("cart.increase")}
                      disabled={it.qty >= 99}
                      className="grid h-8 w-8 place-items-center text-iron hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}

              <li className="mt-2 rounded-md border-safety-top border border-border bg-card p-4 shadow-card">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.16em] text-safety ${fontClass}`}
                >
                  {t("cart.project")}
                </p>
                <div className="mt-3 space-y-3">
                  <Field
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    label={t("cart.location")}
                    value={project.location ?? ""}
                    onChange={(v) => setProject({ location: v })}
                    placeholder={t("cart.location.ph")}
                    fontClass={fontClass}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      icon={<Calendar className="h-3.5 w-3.5" />}
                      label={t("cart.start")}
                      type="date"
                      value={project.startDate ?? ""}
                      onChange={(v) => setProject({ startDate: v })}
                      fontClass={fontClass}
                    />
                    <Field
                      icon={<Calendar className="h-3.5 w-3.5" />}
                      label={t("cart.end")}
                      type="date"
                      value={project.endDate ?? ""}
                      onChange={(v) => setProject({ endDate: v })}
                      fontClass={fontClass}
                    />
                  </div>
                  <div>
                    <label
                      className={`mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground ${fontClass}`}
                    >
                      {t("cart.notes")}
                    </label>
                    <textarea
                      value={project.notes ?? ""}
                      onChange={(e) => setProject({ notes: e.target.value.slice(0, 500) })}
                      maxLength={500}
                      rows={2}
                      placeholder={t("cart.notes.ph")}
                      className={`w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-iron focus:border-safety focus:outline-none ${fontClass}`}
                    />
                  </div>
                </div>
              </li>
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-card px-5 py-4">
            {whatsappUrl ? (
              <WhatsappButton href={whatsappUrl} variant="drawer" fullWidth>
                {t("cart.send")} ({count})
              </WhatsappButton>
            ) : (
              <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-xs text-destructive">
                {t("cart.error.noLink") ?? "Unable to generate WhatsApp link"}
              </div>
            )}
            <button
              onClick={clear}
              className={`mt-2 w-full text-center text-xs font-medium text-muted-foreground hover:text-destructive ${fontClass}`}
            >
              {t("cart.clear")}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  fontClass,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  fontClass?: string;
}) {
  return (
    <div>
      <label
        className={`mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground ${fontClass ?? ""}`}
      >
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 200))}
        placeholder={placeholder}
        className={`w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-iron focus:border-safety focus:outline-none ${fontClass ?? ""}`}
      />
    </div>
  );
}
