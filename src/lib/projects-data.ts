// ATDB Trade International — executed projects portfolio.
// 14 projects across 4 categories. Sourced from official company portfolio.

import brt from "@/assets/projects/brt-airport-gazipur.jpg";
import jamuna from "@/assets/projects/jamuna-bridge.jpg";
import rtip2 from "@/assets/projects/rtip2-ghatail.jpg";
import centeon from "@/assets/projects/centeon-pharma.jpg";
import pharmacil from "@/assets/projects/pharmacil-tongi.jpg";
import pharmaAshiaSite from "@/assets/projects/pharma-ashia-site.jpg";
import pharmaAshiaRoad from "@/assets/projects/pharma-ashia-road.jpg";
import centeonRccRoad from "@/assets/projects/centeon-rcc-road.jpg";
import amcKnitRoad from "@/assets/projects/amc-knit-road.jpg";
import smcReservoir from "@/assets/projects/smc-reservoir.jpg";
import smcDrainage from "@/assets/projects/smc-drainage-pipes.jpg";
import nassaDrainage from "@/assets/projects/nassa-drainage.jpg";
import centeonEtp from "@/assets/projects/centeon-etp.jpg";
import amcWall from "@/assets/projects/amc-retaining-wall.jpg";

export type ProjectCategoryKey = "infra" | "industrial" | "roads" | "civil";

export interface ProjectEntry {
  id: string;
  category: ProjectCategoryKey;
  image: string;
  // i18n keys — text comes from src/lib/i18n.tsx
  titleKey: string;
  locationKey: string;
  scopeKey: string;
}

export const PROJECT_CATEGORIES: {
  key: ProjectCategoryKey;
  titleKey: string;
  subtitleKey: string;
}[] = [
  { key: "infra", titleKey: "pcat.infra.t", subtitleKey: "pcat.infra.s" },
  { key: "industrial", titleKey: "pcat.industrial.t", subtitleKey: "pcat.industrial.s" },
  { key: "roads", titleKey: "pcat.roads.t", subtitleKey: "pcat.roads.s" },
  { key: "civil", titleKey: "pcat.civil.t", subtitleKey: "pcat.civil.s" },
];

export const PROJECTS: ProjectEntry[] = [
  // 1. Mega Infrastructure & Highway
  {
    id: "brt",
    category: "infra",
    image: brt,
    titleKey: "pj.brt.t",
    locationKey: "pj.brt.l",
    scopeKey: "pj.brt.s",
  },
  {
    id: "jamuna",
    category: "infra",
    image: jamuna,
    titleKey: "pj.jamuna.t",
    locationKey: "pj.jamuna.l",
    scopeKey: "pj.jamuna.s",
  },
  {
    id: "rtip2",
    category: "infra",
    image: rtip2,
    titleKey: "pj.rtip2.t",
    locationKey: "pj.rtip2.l",
    scopeKey: "pj.rtip2.s",
  },

  // 2. Industrial & Factory Building Construction
  {
    id: "centeon",
    category: "industrial",
    image: centeon,
    titleKey: "pj.centeon.t",
    locationKey: "pj.centeon.l",
    scopeKey: "pj.centeon.s",
  },
  {
    id: "pharmacil",
    category: "industrial",
    image: pharmacil,
    titleKey: "pj.pharmacil.t",
    locationKey: "pj.pharmacil.l",
    scopeKey: "pj.pharmacil.s",
  },
  {
    id: "pharma-ashia-site",
    category: "industrial",
    image: pharmaAshiaSite,
    titleKey: "pj.pasite.t",
    locationKey: "pj.pasite.l",
    scopeKey: "pj.pasite.s",
  },

  // 3. Roadways & Pavement
  {
    id: "pharma-ashia-road",
    category: "roads",
    image: pharmaAshiaRoad,
    titleKey: "pj.paroad.t",
    locationKey: "pj.paroad.l",
    scopeKey: "pj.paroad.s",
  },
  {
    id: "centeon-rcc-road",
    category: "roads",
    image: centeonRccRoad,
    titleKey: "pj.crccroad.t",
    locationKey: "pj.crccroad.l",
    scopeKey: "pj.crccroad.s",
  },
  {
    id: "amc-knit-road",
    category: "roads",
    image: amcKnitRoad,
    titleKey: "pj.amcroad.t",
    locationKey: "pj.amcroad.l",
    scopeKey: "pj.amcroad.s",
  },

  // 4. Water Treatment, Drainage & Specialised Civil
  {
    id: "smc-reservoir",
    category: "civil",
    image: smcReservoir,
    titleKey: "pj.smcres.t",
    locationKey: "pj.smcres.l",
    scopeKey: "pj.smcres.s",
  },
  {
    id: "smc-drainage",
    category: "civil",
    image: smcDrainage,
    titleKey: "pj.smcdr.t",
    locationKey: "pj.smcdr.l",
    scopeKey: "pj.smcdr.s",
  },
  {
    id: "nassa-drainage",
    category: "civil",
    image: nassaDrainage,
    titleKey: "pj.nassa.t",
    locationKey: "pj.nassa.l",
    scopeKey: "pj.nassa.s",
  },
  {
    id: "centeon-etp",
    category: "civil",
    image: centeonEtp,
    titleKey: "pj.cetp.t",
    locationKey: "pj.cetp.l",
    scopeKey: "pj.cetp.s",
  },
  {
    id: "amc-retaining",
    category: "civil",
    image: amcWall,
    titleKey: "pj.amcwall.t",
    locationKey: "pj.amcwall.l",
    scopeKey: "pj.amcwall.s",
  },
];

export const HERO_PROJECT_IMAGE = jamuna;
