# ATDB Trade International — Codebase Guide

## Overview
Heavy equipment rental website for ATDB Trade International (www.atdbtrade.com). Built with Vite + React 19 + TypeScript + TailwindCSS v4 + TanStack Router + Supabase + Framer Motion.

## Architecture
- **Routing**: TanStack Router (file-based, `src/routes/`). Route tree auto-generated in `routeTree.gen.ts` — never edit.
- **Styling**: TailwindCSS v4 via `@tailwindcss/vite` plugin. Custom design tokens in `src/styles.css` (oklch color space). No `tailwind.config.ts`.
- **Database**: Supabase (3 tables: `contact_leads`, `real_photos`, `quote_requests`). Types in `src/integrations/supabase/types.ts`.
- **State**: React Context for cart (`src/lib/cart.tsx`) and i18n (`src/lib/i18n.tsx`). No external state library.
- **Animations**: Framer Motion with shared presets in `src/lib/cinematic-transitions.ts`.
- **Deployment**: Cloudflare Pages/Workers via Wrangler. SSR with `@tanstack/react-start/server-entry`.

## Key Paths
- `src/routes/` — Page routes (TanStack file-based routing)
- `src/components/atdb/` — Custom business components
- `src/components/ui/` — shadcn/ui primitives (Radix + Tailwind)
- `src/lib/atdb-data.ts` — Fleet data, company info, WhatsApp link builders
- `src/lib/real-photos.ts` — Build-time + runtime photo discovery (Supabase Storage)
- `src/lib/spec-sheet/` — PDF spec sheet generation (jsPDF, lazy-loaded)
- `src/integrations/supabase/` — Client/server Supabase setup + generated types

## Design System
- **Colors**: Iron (neutral), Bronze (accent), Safety Orange (CTA), WhatsApp Green
- **Fonts**: Montserrat (display), Inter (body), Hind Siliguri (Bengali)
- **Glass surfaces**: `.glass-industrial`, `.card-glass`, `.header-surface` (CSS var-driven)
- **8px spacing grid**, oklch color space throughout

## Database Schema
- `contact_leads` — Public contact form submissions (RLS: public INSERT only)
- `real_photos` — Equipment photo registry with metadata (RLS: public SELECT/INSERT)
- `quote_requests` — Cart quote submissions with auto-generated reference (RLS: public INSERT only)

## Build & Deploy
- `npm run build` — Production build to `dist/`
- `npm run dev` — Vite dev server
- Manual chunks: vendor-react, vendor-motion, vendor-ui, vendor-supabase, vendor-pdf (lazy)
- Spec sheet (jsPDF + html2canvas) is dynamically imported on user action

## Environment Variables
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Server-side (Cloudflare secrets)

## i18n
Bilingual English/Bengali via `I18nProvider`. Toggle in header. Translation keys in `src/lib/i18n.tsx`.
