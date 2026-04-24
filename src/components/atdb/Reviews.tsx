import { Star } from "lucide-react";
import { useI18n, type Lang, useFontClass } from "@/lib/i18n";

export type Review = {
  id: number;
  author: string;
  company: string;
  rating: number;
  date: string; // ISO yyyy-mm-dd
  content: string;
};

// Source content kept in English for SEO / Schema.org JSON-LD output.
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Engr. Rahim Chowdhury",
    company: "MegaBuilders Corp.",
    rating: 5,
    date: "2024-03-18",
    content:
      "Equipment delivered on time and in pristine condition. The ATDB team supported us through the entire bridge piling phase — operator discipline was outstanding.",
  },
  {
    id: 2,
    author: "Engr. Tariqul Islam",
    company: "National Infrastructure Solutions",
    rating: 5,
    date: "2023-11-05",
    content:
      "Maintenance logs were fully up to date — our compliance audit took minutes, not days. Highest tier supplier in the country.",
  },
  {
    id: 3,
    author: "Sajjad Hossain",
    company: "Pinnacle Developments",
    rating: 4,
    date: "2024-07-22",
    content:
      "Reliable machinery and a WhatsApp response team that handles shift changes within minutes. Will rent from ATDB again.",
  },
];

export const reviewAggregate = {
  rating: 4.8,
  count: SAMPLE_REVIEWS.length,
};

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(value) ? "fill-bronze-glow text-bronze-glow" : "text-iron/20"}`}
        />
      ))}
    </div>
  );
}

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_BN = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"];
const DIGITS_BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBnDigits = (s: string) => s.replace(/\d/g, (d) => DIGITS_BN[Number(d)]);

function formatDate(iso: string, lang: Lang) {
  // Deterministic UTC formatting — identical on server and client to avoid hydration drift.
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = (lang === "bn" ? MONTHS_BN : MONTHS_EN)[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const out = `${day} ${month} ${year}`;
  return lang === "bn" ? toBnDigits(out) : out;
}

export function ReviewsSection() {
  const { t, lang } = useI18n();
  const fontClass = useFontClass();
  const fontClassEyebrow = useFontClass({ eyebrow: true });

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={`eyebrow ${fontClassEyebrow}`}>{t("reviews.eyebrow")}</p>
            <h2 className={`mt-2 text-2xl font-bold text-iron md:text-3xl ${fontClass}`}>{t("reviews.title")}</h2>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2.5 shadow-card">
            <Stars value={reviewAggregate.rating} />
            <p className={`text-sm font-semibold text-iron ${fontClass}`}>
              {reviewAggregate.rating.toFixed(1)}
              <span className={`ml-2 text-xs font-medium text-muted-foreground ${fontClass}`}>
                {t("reviews.based")} {reviewAggregate.count} {t("reviews.count")}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {SAMPLE_REVIEWS.map((r) => {
            const tx = t as unknown as (k: string) => string;
            const author = tx(`review.${r.id}.author`) || r.author;
            const company = tx(`review.${r.id}.company`) || r.company;
            const body = tx(`review.${r.id}.body`) || r.content;
            return (
              <article
                key={r.id}
                className="flex flex-col rounded-md border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5"
              >
                <Stars value={r.rating} />
                <p className={`mt-3 flex-1 text-sm leading-relaxed text-iron/80 ${fontClass}`}>"{body}"</p>
                <div className="mt-4 border-t border-border pt-3">
                  <p className={`text-sm font-semibold text-iron ${fontClass}`}>{author}</p>
                  <p className={`text-xs text-muted-foreground ${fontClass}`}>
                    {company} · {formatDate(r.date, lang)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

