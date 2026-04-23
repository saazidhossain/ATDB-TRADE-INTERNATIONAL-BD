// Generates a branded one-page PDF spec sheet for an Equipment item.
// English-only — keeps the renderer lean and the visuals stunning.
// Pure client-side jsPDF — no server roundtrip.

import { jsPDF } from "jspdf";
import { type Equipment } from "@/lib/atdb-data";
import { STRINGS_EN } from "./spec-sheet/strings";
import { renderHeader } from "./spec-sheet/header";
import { renderSpecsTable } from "./spec-sheet/specs-table";
import { renderFooter } from "./spec-sheet/footer";
import { renderRealPhotos } from "./spec-sheet/real-photo";
import { getRealPhotos } from "./real-photos";

export async function generateSpecSheet(eq: Equipment, extraPhotos: string[] = []) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const S = STRINGS_EN;

  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const afterHeader = await renderHeader(doc, eq, S, dateStr);
  const afterTable = renderSpecsTable(doc, eq, S, afterHeader);
  // Merge build-time photos + any caller-supplied (e.g. Cloud-uploaded) photos,
  // de-duplicated while preserving order.
  const seen = new Set<string>();
  const realPhotos = [...getRealPhotos(eq.id), ...extraPhotos].filter((u) =>
    seen.has(u) ? false : (seen.add(u), true),
  );
  const afterReal = await renderRealPhotos(doc, S, realPhotos, afterTable);
  renderFooter(doc, S, dateStr, afterReal);

  doc.save(`ATDB_${eq.id}_${eq.brand.replace(/\s+/g, "")}.pdf`);
}
