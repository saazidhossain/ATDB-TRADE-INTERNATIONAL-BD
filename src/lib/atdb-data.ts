// ATDB Trade International — canonical company + fleet data.
// Synced 1:1 with the Product Inventory Master List (Apr 2026).

import craneImg from "@/assets/eq-crane-liebherr.webp";
import rollerImg from "@/assets/eq-roller-sakai.webp";
import excavatorImg from "@/assets/eq-excavator-cat.webp";
import supportImg from "@/assets/eq-support.webp";

// Per-equipment, brand-accurate imagery
import imgLiebherr1120 from "@/assets/fleet/liebherr-ltm-1120.webp";
import imgLiebherr1070 from "@/assets/fleet/liebherr-ltm-1070.webp";
import imgKato50 from "@/assets/fleet/kato-kr50h.webp";
import imgKato25 from "@/assets/fleet/kato-kr25.webp";
import imgKato150 from "@/assets/fleet/kato-kr150.webp";
import imgSakai900 from "@/assets/fleet/sakai-sv900.webp";
import imgSakaiMini from "@/assets/fleet/sakai-mini.webp";
import imgDynapac from "@/assets/fleet/dynapac-cc20.webp";
import imgBomag from "@/assets/fleet/bomag-bw.webp";
import imgHawa from "@/assets/fleet/hawa-tandem.webp";
import imgAdvance from "@/assets/fleet/advance-3wheel.webp";
import imgCat320 from "@/assets/fleet/cat-320.webp";
import imgCatCs54 from "@/assets/fleet/cat-cs54.webp";
import imgKomatsu from "@/assets/fleet/komatsu-pc40.webp";
import imgCase from "@/assets/fleet/case-770ex.webp";
import imgJcb from "@/assets/fleet/jcb-backhoe.webp";
import imgXcmg from "@/assets/fleet/xcmg-loader.webp";
import imgSupport from "@/assets/fleet/support-tools.webp";
import imgTata from "@/assets/fleet/tata-truck.webp";

// Per-category cinematic gallery shots (action / detail / site/cabin)
import gCraneAction from "@/assets/fleet/gallery/crane-action.webp";
import gCraneCabin from "@/assets/fleet/gallery/crane-cabin.webp";
import gCraneDetail from "@/assets/fleet/gallery/crane-detail.webp";
import gRollerAction from "@/assets/fleet/gallery/roller-action.webp";
import gRollerDetail from "@/assets/fleet/gallery/roller-detail.webp";
import gRollerSite from "@/assets/fleet/gallery/roller-site.webp";
import gExcAction from "@/assets/fleet/gallery/excavator-action.webp";
import gExcDetail from "@/assets/fleet/gallery/excavator-detail.webp";
import gExcSite from "@/assets/fleet/gallery/excavator-site.webp";
import gLoaderAction from "@/assets/fleet/gallery/loader-action.webp";
import gLoaderDetail from "@/assets/fleet/gallery/loader-detail.webp";
import gLoaderSite from "@/assets/fleet/gallery/loader-site.webp";
import gSupportAction from "@/assets/fleet/gallery/support-action.webp";
import gSupportDetail from "@/assets/fleet/gallery/support-detail.webp";
import gSupportSite from "@/assets/fleet/gallery/support-site.webp";

// Per-category gallery sets — appended after the equipment's own hero image.
const GALLERY_CRANE = [gCraneAction, gCraneDetail, gCraneCabin];
const GALLERY_ROLLER = [gRollerAction, gRollerDetail, gRollerSite];
const GALLERY_EXC = [gExcAction, gExcDetail, gExcSite];
const GALLERY_LOADER = [gLoaderAction, gLoaderDetail, gLoaderSite];
const GALLERY_SUPPORT = [gSupportAction, gSupportDetail, gSupportSite];

export const COMPANY = {
  name: "M/S ATDB Trade International",
  short: "ATDB",
  tagline: "Your Project, Our Power.",
  tagline_bn: "আপনার প্রজেক্ট, আমাদের শক্তি।",
  founded: 2000,
  // Static value to keep SSR + client output identical (avoids hydration mismatch).
  // Bump manually each year.
  yearsOperating: 26,
  proprietor: "Md. Saiful Alam (Milon)",
  ceo: "Md. Rezaur Rahman Khan (Baboo)",
  staff: 25,
  phones: [
    { label: "Proprietor", number: "+8801712106242", whatsapp: "8801712106242" },
    { label: "CEO", number: "+8801816666067", whatsapp: "8801816666067" },
  ],
  email: "saifulaapi@gmail.com",
  // bank intentionally removed from public-facing surfaces
  facebook: "https://www.facebook.com/atdbtrade",
  offices: [
    {
      city: "Dhaka",
      label: "Corporate Office",
      address: "House #319 (8F), Lane #8, East Kazi Para, Kafrul, Dhaka-1216",
    },
    {
      city: "Tangail",
      label: "Branch Office",
      address: "House #311 (2F), Boro Kalibari Road, Tangail-1900",
    },
  ],
} as const;

export const PRIMARY_WHATSAPP = COMPANY.phones[0].whatsapp;

export type EquipmentCategory = "cranes" | "rollers" | "excavators" | "loaders" | "support";

export interface Equipment {
  id: string;
  category: EquipmentCategory;
  name: string;
  brand: string;
  model: string;
  capacity: string;
  origin: string;
  year?: number;
  fuel?: string;
  /** Quantity available in fleet (e.g., "01", "05"). */
  quantity?: string;
  notes?: string;
  /** Primary hero image. */
  image: string;
  /**
   * Optional gallery of additional cinematic, ATDB-watermarked photos.
   * Order: action shot → close-up detail → operator cabin → site context.
   * The hero image is automatically prepended in the UI.
   */
  gallery?: string[];
  /** i18n key for the bilingual "Best For" use-case copy. */
  bestForKey?: string;
  /** i18n key for the long-form bilingual product description. */
  descriptionKey?: string;
  featured?: boolean;
}

export const CATEGORIES: Record<
  EquipmentCategory,
  { slug: EquipmentCategory; label: string; label_bn: string; tagline: string; image: string }
> = {
  rollers: {
    slug: "rollers",
    label: "Road Rollers",
    label_bn: "রোড রোলার",
    tagline: "9 units · 1T to 12T · Sakai, Dynapac, Bomag",
    image: imgSakai900,
  },
  cranes: {
    slug: "cranes",
    label: "Mobile Cranes",
    label_bn: "ক্রেন বহর",
    tagline: "7 units · 10T to 120T · Liebherr & Kato",
    image: imgLiebherr1120,
  },
  excavators: {
    slug: "excavators",
    label: "Excavators & Compactors",
    label_bn: "এক্সক্যাভেটর",
    tagline: "3 units · CAT, Komatsu",
    image: imgCat320,
  },
  loaders: {
    slug: "loaders",
    label: "Loaders & Backhoes",
    label_bn: "লোডার ও ব্যাকহো",
    tagline: "3 units · CASE, XCMG, JCB",
    image: imgCase,
  },
  support: {
    slug: "support",
    label: "Support Equipment",
    label_bn: "সাপোর্ট ইকুইপমেন্ট",
    tagline: "Generators, compactors, cutters & TATA trucks",
    image: imgSupport,
  },
};

/** Locale-aware category label. Returns Bengali for `bn`, English otherwise. */
export function getCategoryLabel(cat: EquipmentCategory, lang: "en" | "bn" = "en"): string {
  const c = CATEGORIES[cat];
  return lang === "bn" ? c.label_bn : c.label;
}

export const FLEET: Equipment[] = [
  // ── Cranes ──────────────────────────────────────────────────────────
  {
    id: "ATDB-CR-001",
    category: "cranes",
    name: "Liebherr LTM 1120-5.1",
    brand: "Liebherr",
    model: "LTM 1120-5.1",
    capacity: "120 Tons",
    origin: "Germany",
    year: 2005,
    fuel: "Diesel",
    quantity: "01",
    image: imgLiebherr1120,
    gallery: GALLERY_CRANE,
    featured: true,
    bestForKey: "eq.bestfor.liebherr1120",
    descriptionKey: "eq.desc.liebherr1120",
  },
  {
    id: "ATDB-CR-002",
    category: "cranes",
    name: "Liebherr LTM 1070-4.1",
    brand: "Liebherr",
    model: "LTM 1070-4.1",
    capacity: "70 Tons",
    origin: "Germany",
    year: 2005,
    fuel: "Diesel",
    quantity: "01",
    image: imgLiebherr1070,
    gallery: GALLERY_CRANE,
    featured: true,
    bestForKey: "eq.bestfor.liebherr1070",
    descriptionKey: "eq.desc.liebherr1070",
  },
  {
    id: "ATDB-CR-003",
    category: "cranes",
    name: "Kato KR-50H-V",
    brand: "Kato",
    model: "KR-50H-V (SS-500SP-V)",
    capacity: "50 Tons",
    origin: "Japan",
    year: 2003,
    fuel: "Diesel",
    quantity: "01",
    image: imgKato50,
    gallery: GALLERY_CRANE,
    featured: true,
    bestForKey: "eq.bestfor.kato",
    descriptionKey: "eq.desc.kato",
  },
  {
    id: "ATDB-CR-004",
    category: "cranes",
    name: "Kato KR-35H-III",
    brand: "Kato",
    model: "KR-35H-III",
    capacity: "35 Tons",
    origin: "Japan",
    year: 2012,
    fuel: "Diesel",
    quantity: "01",
    image: imgKato50,
    gallery: GALLERY_CRANE,
    bestForKey: "eq.bestfor.kato",
    descriptionKey: "eq.desc.kato",
  },
  {
    id: "ATDB-CR-005",
    category: "cranes",
    name: "Kato KR-25H-V7",
    brand: "Kato",
    model: "KR-25H-V7",
    capacity: "25 Tons",
    origin: "Japan",
    year: 2017,
    fuel: "Diesel",
    quantity: "01",
    image: imgKato25,
    gallery: GALLERY_CRANE,
    bestForKey: "eq.bestfor.kato",
    descriptionKey: "eq.desc.kato",
  },
  {
    id: "ATDB-CR-006",
    category: "cranes",
    name: "Kato KR-150",
    brand: "Kato",
    model: "KR-150",
    capacity: "15 Tons",
    origin: "Japan",
    fuel: "Diesel",
    quantity: "01",
    image: imgKato150,
    gallery: GALLERY_CRANE,
    bestForKey: "eq.bestfor.kato",
    descriptionKey: "eq.desc.kato",
  },
  {
    id: "ATDB-CR-007",
    category: "cranes",
    name: "Kato KR-10H",
    brand: "Kato",
    model: "KR-10H",
    capacity: "10 Tons",
    origin: "Japan",
    year: 2002,
    fuel: "Diesel",
    quantity: "01",
    image: imgKato25,
    gallery: GALLERY_CRANE,
    bestForKey: "eq.bestfor.kato",
    descriptionKey: "eq.desc.kato",
  },

  // ── Road Rollers ───────────────────────────────────────────────────
  {
    id: "ATDB-RR-001",
    category: "rollers",
    name: "Sakai SV902 3-Wheel Steel",
    brand: "Sakai",
    model: "SV902",
    capacity: "10 Ton",
    origin: "Japan",
    year: 2014,
    fuel: "Diesel",
    quantity: "01",
    notes: "3 Wheel Steel",
    image: imgSakai900,
    gallery: GALLERY_ROLLER,
    featured: true,
    bestForKey: "eq.bestfor.heavyroller",
    descriptionKey: "eq.desc.heavyroller",
  },
  {
    id: "ATDB-RR-002",
    category: "rollers",
    name: "Sakai RS902 3-Wheel Steel",
    brand: "Sakai",
    model: "RS902335",
    capacity: "10 Ton",
    origin: "Japan",
    year: 2014,
    fuel: "Diesel",
    quantity: "01",
    notes: "3 Wheel Steel",
    image: imgSakai900,
    gallery: GALLERY_ROLLER,
    bestForKey: "eq.bestfor.heavyroller",
    descriptionKey: "eq.desc.heavyroller",
  },
  {
    id: "ATDB-RR-003",
    category: "rollers",
    name: "Dynapac HP890 1-Drum & 2-Tire",
    brand: "Dynapac",
    model: "HP89042ST",
    capacity: "10 Ton",
    origin: "Sweden",
    year: 2013,
    fuel: "Diesel",
    quantity: "01",
    notes: "1 Drum & 2 Tier Wheel",
    image: imgDynapac,
    gallery: GALLERY_ROLLER,
    bestForKey: "eq.bestfor.heavyroller",
    descriptionKey: "eq.desc.heavyroller",
  },
  {
    id: "ATDB-RR-004",
    category: "rollers",
    name: "Dynapac CC20 Double Drum",
    brand: "Dynapac",
    model: "CC20",
    capacity: "12 Ton",
    origin: "Italy",
    year: 2012,
    fuel: "Diesel",
    quantity: "01",
    notes: "Double Drum (SI 489759)",
    image: imgDynapac,
    gallery: GALLERY_ROLLER,
    featured: true,
    bestForKey: "eq.bestfor.heavyroller",
    descriptionKey: "eq.desc.heavyroller",
  },
  {
    id: "ATDB-RR-005",
    category: "rollers",
    name: "Bomag BW Tandem Vibratory",
    brand: "Bomag",
    model: "BW121.A.C",
    capacity: "4/6 Ton",
    origin: "Germany",
    year: 2015,
    fuel: "Diesel",
    quantity: "01",
    notes: "Vibration (SI 212818)",
    image: imgBomag,
    gallery: GALLERY_ROLLER,
    bestForKey: "eq.bestfor.vibroller",
    descriptionKey: "eq.desc.vibroller",
  },
  {
    id: "ATDB-RR-006",
    category: "rollers",
    name: "Hawa JV-40 Tandem",
    brand: "Hawa",
    model: "JV-40-CW1",
    capacity: "4/6 Ton",
    origin: "Japan",
    year: 2013,
    fuel: "Diesel",
    quantity: "01",
    notes: "Vibration",
    image: imgHawa,
    gallery: GALLERY_ROLLER,
    bestForKey: "eq.bestfor.vibroller",
    descriptionKey: "eq.desc.vibroller",
  },
  {
    id: "ATDB-RR-007",
    category: "rollers",
    name: "Advance 3-Wheel Steel",
    brand: "Advance",
    model: "—",
    capacity: "8.5 Ton",
    origin: "—",
    year: 2015,
    fuel: "Diesel",
    quantity: "01",
    notes: "3 Wheel Steel",
    image: imgAdvance,
    gallery: GALLERY_ROLLER,
    bestForKey: "eq.bestfor.vibroller",
    descriptionKey: "eq.desc.vibroller",
  },
  {
    id: "ATDB-RR-008",
    category: "rollers",
    name: "Sakai HV60 Mini Tandem",
    brand: "Sakai",
    model: "HV 60ST",
    capacity: "1/2 Ton",
    origin: "Japan",
    year: 2015,
    fuel: "Diesel",
    quantity: "01",
    notes: "2 Drum Steel, Vibration (SI-VHV12-42135)",
    image: imgSakaiMini,
    gallery: GALLERY_ROLLER,
    bestForKey: "eq.bestfor.vibroller",
    descriptionKey: "eq.desc.vibroller",
  },
  {
    id: "ATDB-RR-009",
    category: "rollers",
    name: "Sakai 920 Tandem Vibratory",
    brand: "Sakai",
    model: "920",
    capacity: "3.5/5 Ton",
    origin: "Japan",
    year: 2014,
    fuel: "Diesel",
    quantity: "01",
    notes: "Drum Steel, Vibration",
    image: imgSakaiMini,
    gallery: GALLERY_ROLLER,
    bestForKey: "eq.bestfor.vibroller",
    descriptionKey: "eq.desc.vibroller",
  },

  // ── Excavators & Heavy ─────────────────────────────────────────────
  {
    id: "ATDB-EX-001",
    category: "excavators",
    name: "CAT CS54 Soil Compactor",
    brand: "Caterpillar",
    model: "CAT11020",
    capacity: "12/18 Ton",
    origin: "USA",
    year: 2014,
    fuel: "Diesel",
    quantity: "01",
    notes: "Vibration",
    image: imgCatCs54,
    gallery: GALLERY_EXC,
    bestForKey: "eq.bestfor.catcs54",
    descriptionKey: "eq.desc.catcs54",
  },
  {
    id: "ATDB-EX-002",
    category: "excavators",
    name: "CAT 320BU Excavator",
    brand: "Caterpillar",
    model: "320BU",
    capacity: "20 Ton",
    origin: "Japan",
    year: 2015,
    fuel: "Diesel",
    quantity: "01",
    notes: "Chain wheel (Engine No 1910599)",
    image: imgCat320,
    gallery: GALLERY_EXC,
    featured: true,
    bestForKey: "eq.bestfor.cat320",
    descriptionKey: "eq.desc.cat320",
  },
  {
    id: "ATDB-EX-003",
    category: "excavators",
    name: "Komatsu PC40 Mini Excavator",
    brand: "Komatsu",
    model: "PC40",
    capacity: "4 Ton",
    origin: "Japan",
    year: 2017,
    fuel: "Diesel",
    quantity: "01",
    notes: "Chain wheel",
    image: imgKomatsu,
    gallery: GALLERY_EXC,
    bestForKey: "eq.bestfor.komatsu",
    descriptionKey: "eq.desc.komatsu",
  },

  // ── Loaders ────────────────────────────────────────────────────────
  {
    id: "ATDB-LD-001",
    category: "loaders",
    name: "CASE 770EX Magnum Backhoe",
    brand: "CASE",
    model: "770EX Magnum",
    capacity: "Backhoe Loader",
    origin: "India",
    year: 2018,
    fuel: "Diesel",
    quantity: "01",
    image: imgCase,
    gallery: GALLERY_LOADER,
    featured: true,
    bestForKey: "eq.bestfor.backhoe",
    descriptionKey: "eq.desc.backhoe",
  },
  {
    id: "ATDB-LD-002",
    category: "loaders",
    name: "XCMG KMC 950 Pay Loader",
    brand: "XCMG",
    model: "KMC 950 (TNV-Series)",
    capacity: "5 Ton Bucket",
    origin: "China",
    year: 2017,
    fuel: "Diesel",
    quantity: "01",
    image: imgXcmg,
    gallery: GALLERY_LOADER,
    bestForKey: "eq.bestfor.xcmg",
    descriptionKey: "eq.desc.xcmg",
  },
  {
    id: "ATDB-LD-003",
    category: "loaders",
    name: "JCB JC 0.6 Backhoe Loader",
    brand: "JCB",
    model: "JC 0.6",
    capacity: "Backhoe Loader",
    origin: "India",
    year: 2014,
    fuel: "Diesel",
    quantity: "01",
    image: imgJcb,
    gallery: GALLERY_LOADER,
    bestForKey: "eq.bestfor.backhoe",
    descriptionKey: "eq.desc.backhoe",
  },

  // ── Support ────────────────────────────────────────────────────────
  {
    id: "ATDB-SP-001",
    category: "support",
    name: "Honda GQR 350 Cutting Machine",
    brand: "Honda",
    model: "GQR 350",
    capacity: '7" depth',
    origin: "Japan",
    year: 2021,
    fuel: "Octane",
    quantity: "02",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.cutter",
    descriptionKey: "eq.desc.cutter",
  },
  {
    id: "ATDB-SP-002",
    category: "support",
    name: "Honda HSP500C Cutting Machine",
    brand: "Honda",
    model: "HSP500C",
    capacity: '7" depth',
    origin: "Japan",
    year: 2020,
    fuel: "Octane",
    quantity: "02",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.cutter",
    descriptionKey: "eq.desc.cutter",
  },
  {
    id: "ATDB-SP-003",
    category: "support",
    name: "Honda HZR-90 Plate Compactor",
    brand: "Honda",
    model: "HZR-90",
    capacity: "Plate Compactor",
    origin: "Japan",
    year: 2019,
    fuel: "Octane",
    quantity: "02",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.surfacecomp",
    descriptionKey: "eq.desc.surfacecomp",
  },
  {
    id: "ATDB-SP-004",
    category: "support",
    name: "Honda 80k-100 Sand Compactor",
    brand: "Honda",
    model: "80k-100",
    capacity: "Sand Rammer",
    origin: "Japan",
    year: 2020,
    fuel: "Octane",
    quantity: "02",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.surfacecomp",
    descriptionKey: "eq.desc.surfacecomp",
  },
  {
    id: "ATDB-SP-005",
    category: "support",
    name: "Honda ER2500CX Generator",
    brand: "Honda",
    model: "ER2500CX",
    capacity: "2.5 kVA",
    origin: "Japan",
    year: 2022,
    fuel: "Octane",
    quantity: "03",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.generator",
    descriptionKey: "eq.desc.generator",
  },
  {
    id: "ATDB-SP-006",
    category: "support",
    name: "Zhejiang BS8000WT Generator",
    brand: "Zhejiang",
    model: "BS8000WT",
    capacity: "8 kVA",
    origin: "China",
    year: 2019,
    fuel: "Octane",
    quantity: "01",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.generator",
    descriptionKey: "eq.desc.generator",
  },
  {
    id: "ATDB-SP-007",
    category: "support",
    name: "Honda HZRH50 Power Trowel",
    brand: "Honda",
    model: "HZRH50",
    capacity: "Power Trowel",
    origin: "Japan",
    year: 2017,
    fuel: "Octane",
    quantity: "02",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.trowel",
    descriptionKey: "eq.desc.trowel",
  },
  {
    id: "ATDB-SP-008",
    category: "support",
    name: "Honda GXCR200ST Drill Hammer",
    brand: "Honda",
    model: "GXCR200ST",
    capacity: "Demolition Hammer",
    origin: "Japan",
    year: 2022,
    fuel: "Octane",
    quantity: "05",
    image: imgSupport,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.drillhammer",
    descriptionKey: "eq.desc.drillhammer",
  },
  {
    id: "ATDB-SP-009",
    category: "support",
    name: "TATA T7 Ultra Drum Truck",
    brand: "TATA",
    model: "T7 Ultra 3900/HSD",
    capacity: "Drum Truck",
    origin: "India",
    year: 2017,
    fuel: "Diesel",
    quantity: "02",
    image: imgTata,
    gallery: GALLERY_SUPPORT,
    bestForKey: "eq.bestfor.tata",
    descriptionKey: "eq.desc.tata",
  },
];

export const FEATURED = FLEET.filter((e) => e.featured);

export function getCategoryFleet(cat: EquipmentCategory) {
  return FLEET.filter((e) => e.category === cat);
}

export function getEquipmentById(id: string) {
  return FLEET.find((e) => e.id.toLowerCase() === id.toLowerCase());
}

// Re-export legacy fallback assets so other files keep working
export { craneImg, rollerImg, excavatorImg, supportImg };

export type WaLang = "en" | "bn";

// ── WhatsApp message templates ────────────────────────────────────────
// Centralised EN/BN copy. Edit here to change wording in either language;
// no other file needs to know the templates exist.
interface WaTemplates {
  rent: (eq: Equipment) => string;
  generic: string;
  cart: {
    greeting: string;
    intro: string;
    item: (i: number, it: CartItem) => string;
    location: (v: string) => string;
    start: (v: string) => string;
    end: (v: string) => string;
    notesLabel: (v: string) => string;
    closing: string;
  };
}

const WA_TEMPLATES: Record<WaLang, WaTemplates> = {
  en: {
    rent: (eq) =>
      `Hello ATDB Trade International,\n\nI'd like to rent the ${eq.name} (${eq.id} · ${eq.capacity}).\nProject location: \nDuration (days): \nPlease share availability and a quotation. — ATDB website`,
    generic: `Hello ATDB Trade International,\n\nI'd like to discuss a heavy-equipment rental for an upcoming project. Please share availability and a quotation.`,
    cart: {
      greeting: "Hello ATDB Trade International,",
      intro: "I'd like a quotation for the following equipment:",
      item: (i, it) => `${i + 1}. ${it.name}  ·  ${it.capacity}  ·  Qty: ${it.qty}  (${it.id})`,
      location: (v) => `📍 Project location: ${v}`,
      start: (v) => `📅 Start date: ${v}`,
      end: (v) => `📅 End date: ${v}`,
      notesLabel: (v) => `Notes: ${v}`,
      closing: "Please share availability and pricing. — ATDB website",
    },
  },
  bn: {
    rent: (eq) =>
      `আসসালামু আলাইকুম, ATDB Trade International।\n\nআমি ${eq.name} (${eq.id} · ${eq.capacity}) ভাড়া নিতে চাই।\nপ্রজেক্ট লোকেশন: \nসময়কাল (দিন): \nঅনুগ্রহ করে অ্যাভেইলেবিলিটি ও কোটেশন পাঠান। — ATDB ওয়েবসাইট`,
    generic: `আসসালামু আলাইকুম, ATDB Trade International।\n\nআমি একটি আসন্ন প্রজেক্টের জন্য হেভি-ইকুইপমেন্ট ভাড়ার ব্যাপারে কথা বলতে চাই। অনুগ্রহ করে অ্যাভেইলেবিলিটি ও কোটেশন পাঠান।`,
    cart: {
      greeting: "আসসালামু আলাইকুম, ATDB Trade International।",
      intro: "নিচের ইকুইপমেন্টগুলোর জন্য কোটেশন প্রয়োজন:",
      item: (i, it) => `${i + 1}. ${it.name}  ·  ${it.capacity}  ·  পরিমাণ: ${it.qty}  (${it.id})`,
      location: (v) => `📍 প্রজেক্ট লোকেশন: ${v}`,
      start: (v) => `📅 শুরু: ${v}`,
      end: (v) => `📅 শেষ: ${v}`,
      notesLabel: (v) => `নোট: ${v}`,
      closing: "অনুগ্রহ করে অ্যাভেইলেবিলিটি ও প্রাইস জানান। — ATDB ওয়েবসাইট",
    },
  },
};

export function buildWhatsappRentLink(eq: Equipment, lang: WaLang = "en") {
  return `https://wa.me/${PRIMARY_WHATSAPP}?text=${encodeURIComponent(WA_TEMPLATES[lang].rent(eq))}`;
}

export function buildWhatsappGenericLink(text?: string, lang: WaLang = "en") {
  const msg = text ?? WA_TEMPLATES[lang].generic;
  return `https://wa.me/${PRIMARY_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

// ── Cart → consolidated WhatsApp quotation ────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  capacity: string;
  qty: number;
}

export interface CartProject {
  location?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export function buildWhatsappCartLink(
  items: CartItem[],
  project: CartProject,
  lang: WaLang = "en",
) {
  const t = WA_TEMPLATES[lang].cart;
  const lines: string[] = [t.greeting, "", t.intro, ""];
  items.forEach((it, i) => lines.push(t.item(i, it)));
  lines.push("");
  if (project.location) lines.push(t.location(project.location));
  if (project.startDate) lines.push(t.start(project.startDate));
  if (project.endDate) lines.push(t.end(project.endDate));
  if (project.notes) {
    lines.push("");
    lines.push(t.notesLabel(project.notes));
  }
  lines.push("");
  lines.push(t.closing);
  return `https://wa.me/${PRIMARY_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}
