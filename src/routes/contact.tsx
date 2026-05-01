import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Layout } from "@/components/atdb/Layout";
import { FacebookFeed } from "@/components/atdb/FacebookFeed";
import { WhatsappButton } from "@/components/atdb/WhatsappButton";
import { ContactChannelButton } from "@/components/atdb/ContactChannelButton";
import { COMPANY, buildWhatsappGenericLink, FLEET } from "@/lib/atdb-data";
import { useI18n, useFontClass } from "@/lib/i18n";
import contactOg from "@/assets/brand/atdb-hero-monument.webp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ATDB Trade International — WhatsApp, Phone & Quote Form" },
      {
        name: "description",
        content:
          "Reach ATDB Trade International for heavy equipment rental quotations. WhatsApp +8801712106242. Offices in Dhaka and Tangail.",
      },
      { property: "og:title", content: "Contact ATDB Trade International" },
      {
        property: "og:description",
        content:
          "WhatsApp, phone, email or quote form — get a heavy-equipment rental quotation in minutes.",
      },
      { property: "og:image", content: contactOg },
      { name: "twitter:image", content: contactOg },
    ],
    links: [{ rel: "canonical", href: "https://www.atdbtrade.com/contact" }],
  }),
  component: ContactPage,
});

type Status = "idle" | "submitting" | "success" | "error" | "rate_limited";

function ContactPage() {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();
  const fontClassEyebrow = useFontClass({ eyebrow: true });

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    project_location: "",
    equipment_interest: "",
    message: "",
    website: "", // honeypot
  });

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_page" }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        if (data?.issues?.fieldErrors) {
          const fe: Record<string, string> = {};
          for (const [k, v] of Object.entries<string[]>(data.issues.fieldErrors)) {
            if (v?.[0]) fe[k] = v[0];
          }
          setErrors(fe);
        }
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        project_location: "",
        equipment_interest: "",
        message: "",
        website: "",
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-iron-deep py-20 text-white md:py-24">
        <div className="container-page">
          <p className="eyebrow !text-bronze-glow">{t("nav.contact")}</p>
          <h1
            className={`mt-2 max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl ${fontClass}`}
          >
            {t("contact.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">{t("contact.sub")}</p>
          <div className="mt-8">
            <WhatsappButton href={buildWhatsappGenericLink(undefined, lang)} variant="hero">
              {t("common.openWhatsapp")}
            </WhatsappButton>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* FORM */}
          <div className="rounded-md border border-border bg-card p-6 shadow-card md:p-8">
            <p className="eyebrow">{t("contact.eyebrow")}</p>
            <h2 className={`mt-2 text-2xl font-bold text-iron md:text-3xl ${fontClass}`}>
              {t("contact.title")}
            </h2>

            {status === "success" ? (
              <div className="mt-8 rounded-md border border-success/30 bg-success/10 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
                  <div>
                    <p className={`text-base font-bold text-success ${fontClass}`}>
                      {t("contact.success.t")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("contact.success.d")}</p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-4 text-sm font-semibold text-safety hover:underline"
                    >
                      ← {t("contact.submit")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update("website")}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  aria-hidden="true"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={t("contact.name")}
                    name="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    error={errors.name}
                    fontClass={fontClass}
                  />
                  <Field
                    label={t("contact.email")}
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    error={errors.email}
                    fontClass={fontClass}
                  />
                  <Field
                    label={t("contact.phone")}
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    error={errors.phone}
                    fontClass={fontClass}
                  />
                  <Field
                    label={t("contact.company")}
                    name="company"
                    value={form.company}
                    onChange={update("company")}
                    error={errors.company}
                    fontClass={fontClass}
                  />
                  <Field
                    label={t("contact.location")}
                    name="project_location"
                    value={form.project_location}
                    onChange={update("project_location")}
                    error={errors.project_location}
                    fontClass={fontClass}
                  />
                  <SelectField
                    label={t("contact.equipment")}
                    name="equipment_interest"
                    value={form.equipment_interest}
                    onChange={update("equipment_interest")}
                    error={errors.equipment_interest}
                    fontClass={fontClass}
                    t={t}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground ${fontClass}`}
                  >
                    {t("contact.message")} <span className="text-safety">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder={t("contact.message.ph")}
                    className={`w-full resize-none rounded-sm border bg-background px-4 py-3 text-sm text-iron transition-colors focus:outline-none ${
                      errors.message
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-safety"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                  )}
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/10 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm text-destructive">{t("contact.error")}</p>
                  </div>
                )}
                {status === "rate_limited" && (
                  <div className="flex items-start gap-2 rounded-sm border border-safety/30 bg-safety/10 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
                    <p className="text-sm text-safety">{t("contact.rate")}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-safety px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-cta transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${fontClass}`}
                >
                  <Send className="h-4 w-4" />
                  {status === "submitting" ? t("contact.submitting") : t("contact.submit")}
                </button>
              </form>
            )}
          </div>

          {/* SIDEBAR — minimal */}
          <div className="space-y-10">
            <div>
              <p className={`eyebrow ${fontClassEyebrow}`}>{t("contact.sidebar.direct")}</p>
              <h2 className={`mt-2 text-xl font-bold text-iron md:text-2xl ${fontClass}`}>
                {t("contact.sidebar.directTitle")}
              </h2>

              {/* Minimal divided list — flat, properly aligned */}
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {COMPANY.phones.map((p) => (
                  <li key={p.number}>
                    <a
                      href={`tel:${p.number}`}
                      className="flex items-center gap-3 py-3 text-sm text-iron transition-colors hover:text-safety"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-bronze-glow" strokeWidth={1.75} />
                      <span className="font-display font-semibold tracking-wide">{p.number}</span>
                      <span
                        className={`ml-auto text-[10px] uppercase tracking-[0.16em] text-muted-foreground ${fontClass}`}
                      >
                        {p.label === "Proprietor" ? t("phone.proprietor") : t("phone.ceo")}
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="flex items-center gap-3 py-3 text-sm text-iron transition-colors hover:text-safety"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-bronze-glow" strokeWidth={1.75} />
                    <span className="truncate font-display font-semibold">{COMPANY.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={buildWhatsappGenericLink(undefined, lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-3 text-sm text-iron transition-colors hover:text-safety"
                  >
                    <MessageCircle
                      className="h-4 w-4 shrink-0 text-bronze-glow"
                      strokeWidth={1.75}
                    />
                    <span className="font-display font-semibold">WhatsApp</span>
                    <span
                      className={`ml-auto text-[10px] uppercase tracking-[0.16em] text-muted-foreground ${fontClass}`}
                    >
                      {COMPANY.phones[0].number}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={COMPANY.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-3 text-sm text-iron transition-colors hover:text-safety"
                  >
                    <Facebook className="h-4 w-4 shrink-0 text-bronze-glow" strokeWidth={1.75} />
                    <span className="font-display font-semibold">Facebook</span>
                    <span
                      className={`ml-auto text-[10px] uppercase tracking-[0.16em] text-muted-foreground ${fontClass}`}
                    >
                      @atdbtrade
                    </span>
                  </a>
                </li>
              </ul>

              {/* Single primary CTA */}
              <div className="mt-5">
                <WhatsappButton
                  href={buildWhatsappGenericLink(undefined, lang)}
                  variant="cta"
                  fullWidth
                  className="!py-3.5"
                >
                  {t("common.openWhatsapp")}
                </WhatsappButton>
              </div>
            </div>

            <div>
              <p className={`eyebrow ${fontClassEyebrow}`}>{t("footer.offices")}</p>
              <h2 className={`mt-2 text-xl font-bold text-iron md:text-2xl ${fontClass}`}>
                {t("contact.sidebar.officesTitle")}
              </h2>
              <ul className="mt-5 space-y-3">
                {COMPANY.offices.map((o) => {
                  const labelTr =
                    o.label === "Corporate Office" ? t("office.corporate") : t("office.branch");
                  const cityTr = o.city === "Dhaka" ? t("office.dhaka") : t("office.tangail");
                  const addrTr =
                    o.city === "Dhaka" ? t("office.dhaka.address") : t("office.tangail.address");
                  return (
                    <li
                      key={o.city}
                      className="flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-shadow duration-250 hover:shadow-card hover:border-safety/40"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-glow" />
                      <div>
                        <p
                          className={`text-[11px] uppercase tracking-[0.16em] text-safety ${fontClass}`}
                        >
                          {labelTr}
                        </p>
                        <p className={`mt-0.5 text-sm font-semibold text-iron ${fontClass}`}>
                          {cityTr}
                        </p>
                        <p
                          className={`mt-1 text-xs leading-relaxed text-muted-foreground ${fontClass}`}
                        >
                          {addrTr}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Maps — Dhaka ↔ Tangail toggle */}
      <OfficeMaps />

      {/* Live Facebook feed */}
      <FacebookFeed />
    </Layout>
  );
}

const MAP_URLS: Record<"dhaka" | "tangail", string> = {
  dhaka:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.6273418576404!2d90.37255151543208!3d23.796245293027963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0cd9dc76d75%3A0x8e1aecdfe7dd29d8!2sEast%20Kazipara%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1684000000000!5m2!1sen!2sbd",
  tangail:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.3879796264906!2d89.91264251544265!3d24.263172074813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdfb5a2bf8fb53%3A0xe5a3c61aa0de4c6f!2sBoro%20Kalibari%20Rd%2C%20Tangail!5e0!3m2!1sen!2sbd!4v1684000000000!5m2!1sen!2sbd",
};

const DIRECTIONS_URLS: Record<"dhaka" | "tangail", string> = {
  dhaka: "https://www.google.com/maps/dir/?api=1&destination=East+Kazipara+Kafrul+Dhaka+1216",
  tangail: "https://www.google.com/maps/dir/?api=1&destination=Boro+Kalibari+Road+Tangail+1900",
};

function OfficeMaps() {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();
  const [active, setActive] = useState<"dhaka" | "tangail">("dhaka");
  const office = COMPANY.offices.find((o) => o.city.toLowerCase() === active) ?? COMPANY.offices[0];

  return (
    <section className="bg-muted/40 py-16 md:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("maps.eyebrow")}</p>
            <h2 className={`mt-2 text-2xl font-bold text-iron md:text-3xl ${fontClass}`}>
              {t("maps.title")}
            </h2>
          </div>
          <div className="inline-flex rounded-md border border-border bg-card p-1 shadow-card">
            {(["dhaka", "tangail"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={active === c}
                className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${fontClass} ${
                  active === c
                    ? "bg-gradient-safety text-white shadow-cta"
                    : "text-iron/70 hover:text-iron"
                }`}
              >
                {c === "dhaka" ? t("maps.dhaka") : t("maps.tangail")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-card">
            <iframe
              key={active}
              title={`ATDB ${office.label} map`}
              src={MAP_URLS[active]}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full animate-fade-in"
            />
          </div>

          <aside className="rounded-md border border-border bg-card p-6 shadow-card border-safety-top">
            <p className="text-[11px] uppercase tracking-[0.18em] text-safety">{office.label}</p>
            <p className={`mt-1 font-display text-xl font-bold text-iron ${fontClass}`}>
              {office.city}
            </p>
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-glow" />
              {office.address}
            </p>
            <a
              href={DIRECTIONS_URLS[active]}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-safety px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-cta transition-transform hover:-translate-y-px ${fontClass}`}
            >
              {t("maps.directions")} <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <ContactChannelButton
              channel="phone"
              href={`tel:${COMPANY.phones[0].number}`}
              variant="cta"
              fullWidth
              className="mt-2"
            >
              {COMPANY.phones[0].number}
            </ContactChannelButton>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  error,
  fontClass,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
  fontClass: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground ${fontClass}`}
      >
        {label} {required && <span className="text-safety">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-sm border bg-background px-4 py-2.5 text-sm text-iron transition-colors focus:outline-none ${
          error
            ? "border-destructive focus:border-destructive"
            : "border-border focus:border-safety"
        }`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  fontClass,
  t,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  fontClass: string;
  t: (key: Parameters<ReturnType<typeof useI18n>["t"]>[0]) => string;
}) {
  // Group brands for quick selection
  const brands = Array.from(new Set(FLEET.map((f) => f.brand))).sort();
  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground ${fontClass}`}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-sm border bg-background px-4 py-2.5 text-sm text-iron transition-colors focus:outline-none ${fontClass} ${
          error
            ? "border-destructive focus:border-destructive"
            : "border-border focus:border-safety"
        }`}
      >
        <option value="">—</option>
        <optgroup label={t("contact.equipment.opt.cat")}>
          <option value="Mobile Cranes">{t("contact.equipment.opt.cranes")}</option>
          <option value="Road Rollers">{t("contact.equipment.opt.rollers")}</option>
          <option value="Excavators">{t("contact.equipment.opt.excavators")}</option>
          <option value="Loaders & Backhoes">{t("contact.equipment.opt.loaders")}</option>
          <option value="Support Equipment">{t("contact.equipment.opt.support")}</option>
        </optgroup>
        <optgroup label={t("contact.equipment.opt.brand")}>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </optgroup>
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
