// Renders the specifications table — a refined two-column layout with a
// section heading, accent rule, zebra striping, and a thin column divider.
// Returns the Y cursor at the bottom of the table.

import type { jsPDF } from "jspdf";
import { CATEGORIES, type Equipment } from "@/lib/atdb-data";
import { ascii, BORDER, BORDER_SOFT, IRON, MARGIN, MUTED, SAFETY, ZEBRA } from "./tokens";
import type { Strings } from "./strings";

export function renderSpecsTable(doc: jsPDF, eq: Equipment, S: Strings, startY: number): number {
  const pageW = doc.internal.pageSize.getWidth();

  // Section heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...IRON);
  doc.text(ascii(S.specsHeading), MARGIN, startY);

  // Accent underline
  doc.setFillColor(...SAFETY);
  doc.rect(MARGIN, startY + 4, 22, 2, "F");

  // Top border of table
  const tableTop = startY + 14;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, tableTop, pageW - MARGIN, tableTop);

  const rows: [string, string][] = [
    [S.assetId, eq.id],
    [S.category, CATEGORIES[eq.category].label],
    [S.brand, eq.brand],
    [S.model, eq.model],
    [S.capacity, eq.capacity],
    [S.origin, eq.origin],
    ...((eq.year ? [[S.year, String(eq.year)]] : []) as [string, string][]),
    ...((eq.fuel ? [[S.fuel, eq.fuel]] : []) as [string, string][]),
    ...((eq.quantity
      ? [[S.fleet, `${String(eq.quantity).padStart(2, "0")} ${S.unitSuffix}`]]
      : []) as [string, string][]),
    [S.operator, S.operatorVal],
    [S.inspection, S.inspectionVal],
  ];

  const rowH = 17;
  const tableW = pageW - MARGIN * 2;
  const labelX = MARGIN + 14;
  const valueX = MARGIN + tableW * 0.42;
  const dividerX = MARGIN + tableW * 0.42 - 14;

  rows.forEach((r, i) => {
    const y = tableTop + i * rowH;
    if (i % 2 === 0) {
      doc.setFillColor(...ZEBRA);
      doc.rect(MARGIN, y, tableW, rowH, "F");
    }
    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(ascii(r[0].toUpperCase()), labelX, y + rowH / 2 + 2.5);

    // Value
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...IRON);
    doc.text(ascii(r[1]), valueX, y + rowH / 2 + 2.5);
  });

  // Vertical divider
  const tableBottom = tableTop + rows.length * rowH;
  doc.setDrawColor(...BORDER_SOFT);
  doc.setLineWidth(0.4);
  doc.line(dividerX, tableTop, dividerX, tableBottom);

  // Bottom border
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, tableBottom, pageW - MARGIN, tableBottom);

  return tableBottom + 18;
}
