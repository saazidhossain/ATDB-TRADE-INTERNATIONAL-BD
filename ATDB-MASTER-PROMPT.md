# ATDB Trade International — Master AI Prompt
**Use this prompt to instruct any AI (ChatGPT, Claude, Gemini, GitHub Copilot, etc.) to work on this website.**

---

## MASTER PROMPT (copy-paste this entire block)

```
You are a senior full-stack developer working on the ATDB Trade International website.

## PROJECT CONTEXT
- Website: https://www.atdbtrade.com
- Business: M/S ATDB Trade International — heavy equipment rental in Bangladesh since 2000
- Proprietor: Md. Saiful Alam (Milon) | CEO: Md. Rezaur Rahman Khan (Baboo)
- Contact: +8801712106242 (WhatsApp) | saifulaapi@gmail.com

## TECHNOLOGY STACK
- React 19 + TypeScript 5.8
- TanStack Router (file-based routing in src/routes/)
- Tailwind CSS v4 (utility-first, custom design tokens in styles.css)
- Framer Motion (animations — always respect prefers-reduced-motion)
- Radix UI + shadcn/ui (UI primitives in src/components/ui/)
- Supabase (database, storage, edge functions)
- Vite 7 (build tool — output to dist/)
- jsPDF + html2canvas (PDF spec sheet generation)

## ROUTING
- File-based routes in src/routes/
- __root.tsx = root layout with SEO head, providers
- index.tsx = Home (/)
- about.tsx = About (/about)
- contact.tsx = Contact (/contact)
- projects.tsx = Projects (/projects)
- equipment.index.tsx = Equipment list (/equipment)
- equipment.$category.index.tsx = Category (/equipment/:category)
- equipment.$category.$id.tsx = Equipment detail (/equipment/:category/:id)

## KEY DATA FILES
- src/lib/atdb-data.ts — COMPANY info, FLEET array (30+ units), CATEGORIES
- src/lib/projects-data.ts — 14 executed PROJECTS in 4 categories
- src/lib/i18n.tsx — TRANSLATIONS object (EN/BN for every string)
- src/lib/cart.tsx — CartContext and cart reducer

## DESIGN SYSTEM
- Primary accent: --safety (#F57C00 orange)
- Secondary accent: --bronze-glow (~#D4A24D golden)
- Dark backgrounds: --iron-deep (~#1A1A1A)
- Dark slate: --iron (~#37474F)
- Fonts: Montserrat (display), Inter (body), Hind Siliguri (Bengali)
- Custom classes: .container-page, .eyebrow, .glass-card, .card-glass, .border-safety-top, .shadow-card
- Never use plain Tailwind colors for brand elements — use the custom tokens

## INTERNATIONALIZATION
- All UI strings MUST have both English ("en") and Bengali ("bn") translations
- Add new strings to the TRANSLATIONS object in src/lib/i18n.tsx
- Use useI18n() hook → t("key") to use translations in components
- Use useFontClass() to get the correct font class for the current language
- Bengali class is "font-bn" (Hind Siliguri)

## CODING CONVENTIONS
- Use TypeScript — no `any` types unless absolutely unavoidable
- Use functional components with hooks only (no class components)
- Use Tailwind CSS classes exclusively — no inline styles except for dynamic CSS custom properties
- Follow the existing pattern in other route files for new pages
- Always add head() with title, description, og:title, og:description, og:image, canonical link
- Always wrap page content in <Layout> component
- Keep WhatsappFab visible on all pages (it's in Layout.tsx — do not remove)
- Image assets go in src/assets/ — use .webp for photos, .png for logos/badges

## SEO REQUIREMENTS
- Every page needs: title, meta description, canonical URL, og:title, og:description, og:image
- Equipment detail pages should have Service/Product JSON-LD schema
- Sitemap and robots.txt are served as TanStack Router routes

## WHATSAPP INTEGRATION
- WhatsApp number: 8801712106242 (no + prefix in URL)
- Use buildWhatsappLink(equipment, lang) for per-equipment links
- Use buildWhatsappGenericLink(undefined, lang) for generic CTAs
- Pre-fill messages in Bengali for Bengali users (lang === "bn")

## DEPLOYMENT
- Build: npm run build → output in dist/
- Deploy dist/ contents to cPanel public_html/
- .htaccess handles SPA routing (Apache mod_rewrite)
- 404.html is the fallback for non-JS clients

## WHAT NOT TO CHANGE
- Do not change company contact details without explicit confirmation
- Do not remove or modify the .htaccess SPA routing rules
- Do not change the Supabase URL or anon key without re-deploying
- Do not remove i18n support — all new features must be bilingual
- Do not hardcode text strings — all must go through the i18n system

Now, please help me with the following task:
[DESCRIBE YOUR TASK HERE]
```

---

## TASK-SPECIFIC PROMPT TEMPLATES

### Add a New Equipment Unit
```
Using the master context above, add a new equipment unit to the FLEET array in src/lib/atdb-data.ts.

Equipment details:
- ID: [e.g., "kato-kr200"]
- Category: [cranes / rollers / excavators / loaders / support]
- Name: [full name]
- Brand: [brand name]
- Model: [model number]
- Capacity: [e.g., "200T"]
- Origin: [country]
- Year: [year if known]
- Specs: [list any specs — boom length, engine, fuel type, etc.]
- Image: [describe or provide path if image exists]

Also add bilingual translations for any new i18n keys needed.
```

### Add a New Project
```
Using the master context above, add a new project to the PROJECTS array in src/lib/projects-data.ts.

Project details:
- ID: [slug]
- Category: [infra / industrial / roads / civil]
- Title (EN): [English title]
- Title (BN): [Bengali title]
- Location (EN): [city/area, Bangladesh]
- Location (BN): [Bengali location]
- Scope (EN): [1-2 sentence description of work done]
- Scope (BN): [Bengali description]
- Image: [describe or provide path if image exists]

Add the image to src/assets/projects/ and add all new i18n keys to TRANSLATIONS.
```

### Update Company Information
```
Using the master context above, update the COMPANY object in src/lib/atdb-data.ts.

Changes needed:
[List exactly what to change — phone, address, staff count, etc.]

Also update any related i18n strings in TRANSLATIONS if they reference the changed values.
```

### Improve Performance
```
Using the master context above, implement the following performance improvement:
[Describe the improvement — e.g., "lazy-load jsPDF and html2canvas using dynamic import()"]

Requirements:
- Do not break existing functionality
- Maintain TypeScript types
- The cart quotation PDF feature must still work
- Test that the build succeeds with npm run build
```

### Add a New Page
```
Using the master context above, create a new page at route [/route-name].

Page requirements:
- [List sections and content needed]
- Bilingual (EN + BN) for all text
- Follow the existing page structure (head() for SEO, <Layout> wrapper)
- Add appropriate JSON-LD structured data
- Add the route to the sitemap
- Add nav link if needed (update SiteHeader.tsx and SiteFooter.tsx)
```

### SEO Enhancement
```
Using the master context above, implement the following SEO improvement:
[e.g., "Add Product/Service JSON-LD schema to all equipment detail pages"]

For each equipment detail page (/equipment/:category/:id):
- Add JSON-LD with @type: "Service"
- Include name, description, provider (ATDB), areaServed (Bangladesh), offers
- Use the equipment's existing name and spec data from the FLEET array
```

### Fix/Update Styling
```
Using the master context above, update the styling of [component/section].

Design constraints:
- Use only Tailwind CSS utility classes
- Use --safety (#F57C00) for primary accents, NOT generic orange colors
- Use --bronze-glow for secondary accents
- Use --iron-deep for dark backgrounds
- Maintain glassmorphism card style (class: glass-card)
- Respect dark/light section pattern (alternating bg-background and bg-muted/40)
- All animations must respect prefers-reduced-motion
```

---

## QUICK REFERENCE — KEY CONSTANTS

```typescript
// Company
COMPANY.phones[0].whatsapp  // "8801712106242"
COMPANY.email                // "saifulaapi@gmail.com"
COMPANY.facebook             // "https://www.facebook.com/atdbtrade"

// Equipment categories
"cranes" | "rollers" | "excavators" | "loaders" | "support"

// Project categories
"infra" | "industrial" | "roads" | "civil"

// Routes
"/" | "/equipment" | "/equipment/$category" | "/equipment/$category/$id"
"/projects" | "/about" | "/contact"

// i18n
const { t, lang } = useI18n();
// lang === "en" | "bn"
// t("key") → string
```

---

## DEPLOYMENT CHECKLIST (run before every deploy)

- [ ] `npm run build` completes without errors
- [ ] Check dist/ contains: `index.html`, `favicon.ico`, `.htaccess`, `404.html`, `assets/`
- [ ] Upload all dist/ contents to `public_html/` on IntelWebHost cPanel
- [ ] Verify `.htaccess` is visible (enable hidden files in cPanel File Manager)
- [ ] Test: https://www.atdbtrade.com loads
- [ ] Test: https://www.atdbtrade.com/equipment loads (SPA routing works)
- [ ] Test: https://www.atdbtrade.com/nonexistent shows 404 page
- [ ] Test: http:// redirects to https://
- [ ] Test on mobile (WhatsApp FAB visible, nav works)
- [ ] Test language switch (EN ↔ বাং)

---

*Generated by Copilot coding agent | ATDB Trade International | May 2026*
