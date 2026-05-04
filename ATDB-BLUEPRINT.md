# ATDB Trade International — Complete Technical Blueprint
**Version 1.0 | Generated May 2026**  
**Domain:** https://www.atdbtrade.com  
**Host:** IntelWebHost (cPanel, Apache static hosting)

---

## 1. BUSINESS OVERVIEW

| Field | Value |
|-------|-------|
| **Full Name** | M/S ATDB Trade International |
| **Short Name** | ATDB |
| **Tagline (EN)** | Your Project, Our Power. |
| **Tagline (BN)** | আপনার প্রজেক্ট, আমাদের শক্তি। |
| **Founded** | 2000 |
| **Years Operating** | 26 |
| **Proprietor** | Md. Saiful Alam (Milon) |
| **CEO** | Md. Rezaur Rahman Khan (Baboo) |
| **Staff** | 25 |
| **Primary Phone** | +8801712106242 (WhatsApp) |
| **Secondary Phone** | +8801816666067 (CEO) |
| **Email** | saifulaapi@gmail.com |
| **Facebook** | https://www.facebook.com/atdbtrade |
| **Business Type** | 1st Class Government-Approved Contractor & Heavy Equipment Rental |

### Offices
| Office | Address |
|--------|---------|
| Corporate (Dhaka) | House #319 (8F), Lane #8, East Kazi Para, Kafrul, Dhaka-1216 |
| Branch (Tangail) | House #311 (2F), Boro Kalibari Road, Tangail-1900 |

---

## 2. TECHNOLOGY STACK

### Frontend
| Layer | Technology | Version |
|-------|-----------|---------|
| UI Library | React | 19.2.0 |
| Language | TypeScript | 5.8.3 |
| Build Tool | Vite | 7.3.x |
| Routing | TanStack Router (file-based) | 1.168.x |
| Styling | Tailwind CSS | v4.2.x |
| Animation | Framer Motion | 12.x |
| Icons | Lucide React | 0.575.x |
| UI Primitives | Radix UI (full suite) | Latest |
| Component Library | shadcn/ui (configured via components.json) | — |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| State | React Context (i18n, cart) | — |
| Data Fetching | TanStack Query | 5.83.x |
| PDF Export | jsPDF | 4.x |
| Charts | Recharts | 2.x |

### Backend / Infrastructure
| Layer | Technology |
|-------|-----------|
| Database / Auth | Supabase (PostgreSQL) |
| Supabase URL | https://wqczymiycmtnrwlsmxvq.supabase.co |
| Hosting | IntelWebHost — cPanel static (Apache) |
| Deployment | Upload `dist/` contents to `public_html/` |
| CDN / Edge | None (direct hosting) |
| Domain | https://www.atdbtrade.com |

---

## 3. PROJECT STRUCTURE

```
ATDB-TRADE-INTERNATIONAL-BD/
├── src/
│   ├── main.tsx                    # React app entry point
│   ├── App.tsx                     # Root component (if present)
│   ├── router.tsx                  # TanStack Router config
│   ├── routeTree.gen.ts            # Auto-generated route tree
│   ├── styles.css                  # Global CSS + Tailwind + Google Fonts
│   ├── env.d.ts                    # Type declarations for env vars
│   │
│   ├── routes/                     # File-based routes (TanStack Router)
│   │   ├── __root.tsx              # Root layout: SEO head, shell, providers
│   │   ├── index.tsx               # Home page (/)
│   │   ├── about.tsx               # About page (/about)
│   │   ├── contact.tsx             # Contact page (/contact)
│   │   ├── projects.tsx            # Projects portfolio (/projects)
│   │   ├── equipment.index.tsx     # Equipment category listing (/equipment)
│   │   ├── equipment.$category.index.tsx  # Category detail (/equipment/:category)
│   │   ├── equipment.$category.$id.tsx    # Equipment detail (/equipment/:category/:id)
│   │   ├── api.contact.ts          # Contact form API handler
│   │   ├── api.photos.ts           # Photos API handler
│   │   ├── api.quotes.ts           # Quotes API handler
│   │   ├── robots[.]txt.tsx        # /robots.txt route
│   │   └── sitemap[.]xml.tsx       # /sitemap.xml route
│   │
│   ├── components/
│   │   ├── atdb/                   # App-specific components
│   │   │   ├── Layout.tsx          # Page wrapper (Header + Footer + FAB)
│   │   │   ├── SiteHeader.tsx      # Sticky nav, lang switch, WhatsApp CTA
│   │   │   ├── SiteFooter.tsx      # Footer with links, contacts, offices
│   │   │   ├── EquipmentCard.tsx   # Equipment listing card
│   │   │   ├── EquipmentGallery.tsx # Cinematic photo gallery
│   │   │   ├── WhatsappButton.tsx  # WhatsApp CTA button (variants)
│   │   │   ├── WhatsappFab.tsx     # Fixed WhatsApp floating action button
│   │   │   ├── CartButton.tsx      # Cart icon in header
│   │   │   ├── CartDrawer.tsx      # Slide-out quotation cart
│   │   │   ├── ContactChannelButton.tsx # Phone / email buttons
│   │   │   ├── FacebookFeed.tsx    # Facebook post embed
│   │   │   ├── FacebookLink.tsx    # Facebook icon link
│   │   │   ├── LivePhotoViewer.tsx # Live Supabase-fed photo viewer
│   │   │   ├── PhotoLightbox.tsx   # Full-screen image lightbox
│   │   │   ├── LoadingScreen.tsx   # App loading state
│   │   │   ├── EmberParticles.tsx  # Decorative particle animation
│   │   │   ├── Reviews.tsx         # Customer reviews section
│   │   │   ├── SpecGroups.tsx      # Equipment spec table groups
│   │   │   ├── AssetManager.tsx    # Admin: asset management panel
│   │   │   ├── RealPhotoUpload.tsx # Admin: photo uploader
│   │   │   └── RealPhotoVerifyPanel.tsx # Admin: photo verification
│   │   └── ui/                     # shadcn/ui primitives (accordion, dialog, etc.)
│   │
│   ├── lib/
│   │   ├── atdb-data.ts            # COMPANY info, FLEET data (30+ units), CATEGORIES
│   │   ├── projects-data.ts        # 14 executed projects, 4 categories
│   │   ├── i18n.tsx                # Bilingual (EN/BN) translation system
│   │   ├── cart.tsx                # Cart context & reducer
│   │   ├── spec-sheet.ts           # PDF spec sheet generator
│   │   ├── spec-sheet/             # Spec sheet templates
│   │   ├── real-photos.ts          # Supabase photo fetching logic
│   │   ├── utils.ts                # Utility functions (cn, etc.)
│   │   ├── animation-performance.ts # Reduced-motion helpers
│   │   └── cinematic-transitions.ts # Framer Motion variants
│   │
│   └── assets/
│       ├── brand/                  # Logos (light, dark, hero monument)
│       ├── fleet/                  # Per-unit equipment photos (webp)
│       │   └── gallery/            # Category cinematic gallery shots
│       ├── projects/               # 14 project photos (jpg)
│       ├── eq-*.webp               # Category hero images
│       ├── hero-crane.webp         # Additional hero image
│       ├── project-*.webp          # Generic project images
│       └── trust-badges.png        # Trust/certification badge
│
├── public/
│   └── favicon.ico                 # Site favicon
│
├── dist/                           # ← BUILT OUTPUT (deploy this to public_html)
│   ├── index.html                  # SPA entry
│   ├── favicon.ico                 # Favicon
│   ├── .htaccess                   # Apache SPA routing + security + cache
│   ├── 404.html                    # Custom 404 fallback
│   └── assets/                     # Hashed CSS, JS, all images
│
├── supabase/                       # Supabase config & migrations
├── index.html                      # Dev HTML entry
├── vite.config.ts                  # Vite build config
├── tsconfig.json                   # TypeScript config
├── components.json                 # shadcn/ui config
├── eslint.config.js                # ESLint config
├── .prettierrc                     # Prettier config
└── package.json                    # NPM dependencies & scripts
```

---

## 4. ROUTES & PAGES

| Route | File | Description |
|-------|------|-------------|
| `/` | `routes/index.tsx` | Home — hero, brand strip, categories, featured equipment, projects teaser, why-us, reviews, live photos, CTA |
| `/equipment` | `routes/equipment.index.tsx` | Equipment category grid (5 categories with images) |
| `/equipment/:category` | `routes/equipment.$category.index.tsx` | Category fleet listing (e.g. /equipment/cranes) |
| `/equipment/:category/:id` | `routes/equipment.$category.$id.tsx` | Individual equipment detail — specs, gallery, WhatsApp CTA |
| `/projects` | `routes/projects.tsx` | Portfolio of 14 executed projects in 4 categories |
| `/about` | `routes/about.tsx` | Company history, leadership, values, credentials, associates |
| `/contact` | `routes/contact.tsx` | Contact form, WhatsApp, phone, email, Facebook, offices |
| `/robots.txt` | `routes/robots[.]txt.tsx` | SEO robots file |
| `/sitemap.xml` | `routes/sitemap[.]xml.tsx` | XML sitemap |
| `*` | `__root.tsx` | 404 NotFoundComponent (React in-app) |

### Equipment Categories & Slugs
| Slug | Label | Units |
|------|-------|-------|
| `cranes` | Mobile Cranes | 7 (Liebherr LTM-1120, LTM-1070, Kato KR-150, KR-50H, KR-25, etc.) |
| `rollers` | Road Rollers | 9 (Sakai SV900, Mini, Dynapac CC20, Bomag BW, Hawa Tandem, Advance 3-Wheel, etc.) |
| `excavators` | Excavators & Compactors | 3 (CAT 320, CAT CS54, Komatsu PC40) |
| `loaders` | Loaders & Backhoes | 3 (CASE 770EX, JCB Backhoe, XCMG Loader) |
| `support` | Support Equipment | Variable (generators, trucks, compactors — TATA trucks, tools) |

---

## 5. DESIGN SYSTEM

### Color Palette
| Token | Hex / Usage |
|-------|-------------|
| `--safety` | #F57C00 (orange — primary CTA, accents) |
| `--bronze-glow` | ~#D4A24D (golden — eyebrow text, dividers) |
| `--iron-deep` | ~#1A1A1A (near-black backgrounds) |
| `--iron` | ~#37474F (dark slate — body text) |
| Background | White / light gray (`bg-background`, `bg-muted/40`) |
| Dark sections | `bg-iron-deep` (hero, footer, dark CTAs) |

### Typography
| Role | Font | Weights |
|------|------|---------|
| Display / Headings | Montserrat | 400–800 |
| Body | Inter | 300–600 |
| Bengali text | Hind Siliguri | 400–700 |
| Eyebrows | Montserrat (uppercase, tracked) | 700 |

**Google Fonts URL:**
```
https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Hind+Siliguri:wght@400;500;600;700&display=swap
```

### CSS Utility Classes (custom, defined in styles.css)
- `.container-page` — max-width centered container
- `.eyebrow` — small uppercase tracked label style
- `.glass-card` / `.card-glass` / `.card-glass-dark` — glassmorphism cards
- `.border-safety-top` — orange top border accent
- `.shadow-card` / `.shadow-card-hover` / `.shadow-cta` — custom shadows
- `.header-surface` — sticky header with scroll-driven opacity
- `.bg-iron-deep` / `.bg-gradient-iron` / `.bg-gradient-safety` — background utilities
- `.font-bn` — Bengali font class

### Animation
- **Framer Motion** for card entrance animations (stagger, fade-up)
- **Scroll parallax** on hero image (`useScroll`, `useTransform`)
- Respects `prefers-reduced-motion`
- Custom cinematic transition variants in `lib/cinematic-transitions.ts`

---

## 6. INTERNATIONALISATION (i18n)

- **Languages:** English (`en`) + Bengali (`bn`)
- **Storage:** `localStorage` key `atdb_lang`
- **Switching:** Globe icon in header, toggles EN ↔ বাং
- **Coverage:** 100% — every UI string has both EN and BN versions
- **Mechanism:** `useI18n()` hook → `t("key")` returns string for current lang
- **Font switching:** `useFontClass()` returns `font-bn` class for Bengali
- **Translation dictionary:** `src/lib/i18n.tsx` — `TRANSLATIONS` object

---

## 7. KEY FEATURES

### 7.1 Equipment Detail Pages
- Full spec sheets (dimensions, capacity, boom length, engine, fuel, etc.)
- Per-unit images (brand-accurate webp photos)
- Category gallery (3 cinematic shots per category)
- WhatsApp CTA pre-filled with equipment name
- PDF spec sheet download (jsPDF)
- Add-to-cart for multi-equipment quotation

### 7.2 WhatsApp Quotation System
- WhatsApp FAB (fixed bottom-right) on all pages
- Header "Get Quote" button
- Per-equipment "Rent Now" → WhatsApp with equipment name pre-filled
- Cart system: add multiple units → generate bundled WhatsApp message
- `buildWhatsappGenericLink()` and `buildWhatsappLink()` utilities in `lib/atdb-data.ts`

### 7.3 Cart / Multi-Equipment Quote
- Context-based cart (`lib/cart.tsx`)
- CartButton in header showing item count badge
- CartDrawer (slide-out panel) listing selected equipment
- Generates WhatsApp message with all selected items

### 7.4 Projects Portfolio
- 14 executed projects in 4 categories:
  1. **Mega Infrastructure & Highway** (3): BRT Airport-Gazipur, Jamuna Bridge Contract 1, RTIP-2 Ghatail
  2. **Industrial & Factory** (3): Centeon Pharma, Pharmacil Tongi, Pharma Ashia Site
  3. **Roadways & Pavement** (3): Pharma Ashia Road, Centeon RCC Road, AMC Knit Road
  4. **Water Treatment & Civil** (5): SMC Reservoir, SMC Drainage, Nassa Drainage, Centeon ETP, AMC Retaining Wall
- Framer Motion stagger animation on scroll
- JSON-LD `ItemList` schema markup for SEO

### 7.5 Live Photo Viewer
- Supabase-fed live photos on home page
- `LivePhotoViewer` component fetches from Supabase storage
- PhotoLightbox for full-screen viewing

### 7.6 Contact Form
- React Hook Form + Zod validation
- Rate-limited (prevents spam)
- Status states: idle / submitting / success / error / rate_limited
- Connects to Supabase via `/api/contact` edge function

### 7.7 SEO
- Per-route `<head>` meta via TanStack Router's `head()` function
- Canonical URLs on all pages
- Open Graph + Twitter Card tags
- JSON-LD structured data (Organization, WebSite, ItemList for projects)
- `robots.txt` and `sitemap.xml` served as routes
- `hreflang` alternate links (en, bn, x-default)

---

## 8. BUILD & DEPLOYMENT

### Build Command
```bash
npm install
npm run build
# Output: dist/
```

### Deploy to cPanel (IntelWebHost)
1. Upload ALL contents of `dist/` to `public_html/`  
   (not the `dist/` folder itself — its *contents*)
2. Ensure `.htaccess` is uploaded (hidden file — tick "show hidden files" in cPanel File Manager)
3. Ensure `404.html` is uploaded

### File Structure in public_html after deploy
```
public_html/
├── .htaccess          ← SPA routing + security + cache headers
├── 404.html           ← Custom 404 fallback
├── index.html         ← React SPA entry
├── favicon.ico        ← Site favicon
└── assets/
    ├── index-[hash].js       ← Main JS bundle (~1.37 MB, gzip ~415 KB)
    ├── styles-[hash].css     ← All CSS (~150 KB, gzip ~23 KB)
    ├── html2canvas.esm-*.js  ← PDF generation (~201 KB)
    ├── index.es-*.js         ← Supabase (~159 KB)
    ├── purify.es-*.js        ← DOMPurify (~24 KB)
    └── [images]              ← 60+ webp/jpg images (content-hashed)
```

### Supabase Environment (already baked into build)
- The Supabase anon key and URL are embedded in the compiled JS bundle
- No `.env` file needed on the server (static hosting)

---

## 9. SEO AUDIT FINDINGS

### ✅ Implemented Well
- Meta title, description on every page (unique per route)
- Canonical URLs
- Open Graph + Twitter cards
- JSON-LD Organization + WebSite schema on root
- JSON-LD ItemList for projects page
- hreflang for EN/BN bilingual
- robots.txt and sitemap.xml as routes
- `alt` attributes on all images
- Semantic HTML (header, main, nav, footer, article, section)
- Skip-to-content link for accessibility

### ⚠️ Issues & Gaps
1. **SPA — no pre-rendering**: Search engines see blank HTML until JS loads. Google generally indexes SPAs but Bing/others may not. Consider adding pre-rendering via Vite SSG or a prerender service.
2. **sitemap.xml**: Auto-generated from routes — verify it includes all equipment detail pages (dynamic routes may be missing).
3. **OG Image**: Currently pointing to external Google storage URL — should be a local self-hosted image at `/og-image.jpg`.
4. **Missing apple-touch-icon.png**: Referenced in `index.html` but not in `public/`.
5. **Missing structured data**: Equipment pages lack `Product` or `Service` JSON-LD schema.
6. **CSS `@import` order warning**: Google Fonts `@import` comes after other rules in CSS — minor but should be fixed.

---

## 10. PERFORMANCE AUDIT

### Build Output Size
| File | Raw | Gzipped |
|------|-----|---------|
| index-[hash].js (main bundle) | 1,376 KB | 415 KB |
| styles-[hash].css | 150 KB | 23 KB |
| html2canvas (PDF) | 201 KB | 47 KB |
| index.es (Supabase) | 159 KB | 53 KB |
| purify.es (DOMPurify) | 24 KB | 9 KB |
| **Total JS (gzipped)** | — | **~527 KB** |

### ⚠️ Performance Issues
1. **Main bundle too large (1.37 MB unminified)**: Vite warns chunks > 500 KB. Should be code-split using dynamic `import()`.
2. **Hero image** (`atdb-hero-monument.webp`): 1.64 MB — should be compressed further (target < 300 KB).
3. **No lazy loading on heavy components**: PDF generator (html2canvas, jsPDF) loads eagerly.
4. **No preload hints** for critical fonts in HTML `<head>`.
5. **Google Fonts loaded synchronously** — should use `font-display: swap` (already in URL params with `display=swap`).
6. **No service worker / PWA**: Offline support and caching could improve repeat-visit performance.

### ✅ Performance Positives
- All images are `.webp` format (except project photos which are `.jpg`)
- Images use `loading="lazy"` where appropriate
- Hero image uses `fetchPriority="high"`
- Vite automatically content-hashes all assets (ideal for long-term caching)
- Gzip compression configured via `.htaccess`
- 1-year cache on all hashed assets

---

## 11. ACCESSIBILITY AUDIT

### ✅ Good Practices
- Skip-to-main-content link (first focusable element)
- `aria-label` on all icon buttons
- `role="banner"`, `role="group"`, `aria-label` on nav elements
- `aria-expanded` / `aria-controls` on mobile hamburger
- `aria-live="polite"` on language switcher
- `aria-current` on active nav language
- `aria-hidden="true"` on decorative elements
- `tabIndex={-1}` on main content for skip-link target

### ⚠️ Accessibility Issues
1. **Color contrast**: Light text on `bg-iron-deep` — verify `text-white/55` and `text-white/65` pass WCAG AA (4.5:1).
2. **Focus management**: Mobile nav close doesn't explicitly return focus.
3. **Cart drawer**: Needs focus trap when open.
4. **Language switch button**: Should announce "Language changed to Bengali" via live region.

---

## 12. SECURITY NOTES

- `.htaccess` blocks access to `.env`, `.git`, `package.json`, etc.
- Supabase anon key in client-side code is acceptable (it's public by design — RLS controls actual data access)
- No secrets are exposed beyond what Supabase intends to be public
- HTTPS redirect enforced via `.htaccess`
- Security headers set: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy

---

## 13. IMPROVEMENT RECOMMENDATIONS

### Priority 1 — Critical (Do First)
1. **Compress hero image**: Reduce `atdb-hero-monument.webp` from 1.64 MB to under 300 KB using Squoosh or `sharp`.
2. **Code-split large dependencies**: Lazy-load jsPDF + html2canvas (only needed on equipment detail pages).
3. **Self-host OG image**: Save a proper `og-image.jpg` (1200×630px) in `public/` and update all OG meta tags.
4. **Add apple-touch-icon.png**: Create 180×180px PNG icon in `public/`.

### Priority 2 — High Value SEO/UX
5. **Add Product schema** to equipment detail pages: `@type: Service` or `@type: Product` JSON-LD.
6. **Pre-render critical pages** using `vite-plugin-prerender` or similar to ship static HTML for /, /equipment, /projects, /about, /contact.
7. **Fix CSS `@import` order**: Move Google Fonts `@import` to very top of `styles.css`.
8. **Sitemap completeness**: Generate sitemap entries for all 30+ equipment detail URLs.

### Priority 3 — Enhancements
9. **Add Google Analytics / Clarity**: Track user behavior and conversion events (WhatsApp clicks).
10. **Add a cookie/consent banner** if tracking is added (GDPR/PDPA consideration).
11. **Add `robots.txt` disallow for `/api/`** routes to prevent crawling of API endpoints.
12. **Implement WebP for project photos** (currently `.jpg`) — convert using `sharp` or Squoosh for ~30% size reduction.
13. **Add loading="eager"** to above-fold equipment category hero images.
14. **Add `width` and `height` attributes** to all `<img>` tags to eliminate layout shift (CLS).

### Priority 4 — Nice to Have
15. **PWA / Service Worker**: Cache assets for offline browsing.
16. **Dark mode toggle** (design system already uses dark backgrounds — could offer full dark mode).
17. **Equipment comparison feature**: Allow users to compare 2–3 units side by side.
18. **WhatsApp analytics**: Track which equipment pages generate the most quote requests.
19. **Review/testimonials CMS**: Pull reviews from Supabase rather than hardcoding.

---

## 14. MASTER PROMPT FOR AI-ASSISTED UPDATES

See `ATDB-MASTER-PROMPT.md` (included in this package).

---

## 15. CONTACTS FOR UPDATES

- **Proprietor:** Md. Saiful Alam (Milon) — +8801712106242
- **CEO:** Md. Rezaur Rahman Khan (Baboo) — +8801816666067
- **Email:** saifulaapi@gmail.com
- **Facebook:** https://www.facebook.com/atdbtrade
- **Supabase Project:** https://wqczymiycmtnrwlsmxvq.supabase.co
- **GitHub Repo:** https://github.com/saazidhossain/ATDB-TRADE-INTERNATIONAL-BD

---

*Blueprint generated by Copilot coding agent based on full codebase + dist analysis.*
