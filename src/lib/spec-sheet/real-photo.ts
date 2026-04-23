// Renders an "Actual Photograph" block with the on-hand condition photo(s).
// Auto-paginates: starts a new page if there isn't enough vertical space left.

import type { jsPDF } from "jspdf";
import {
  ascii,
  BORDER,
  BORDER_SOFT,
  IRON,
  MARGIN,
  MUTED,
  SAFETY,
  SURFACE,
  loadImageAsDataUrl,
} from "./tokens";
import type { Strings } from "./strings";

export async function renderRealPhotos(
  doc: jsPDF,
  S: Strings,
  photos: string[],
  startY: number,
): Promise<number> {
  if (photos.length === 0) return startY;

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const headingH = 22;
  const photoH = 200;
  const captionH = 14;
  const blockH = headingH + photoH + captionH + 18;

  // Paginate if not enough room before the footer area (~ contact card sits ~250pt tall).
  let cursorY = startY;
  if (cursorY + blockH > pageH - MARGIN - 260) {
    doc.addPage();
    cursorY = MARGIN;
  }

  // Section heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...IRON);
  doc.text(ascii(S.realPhoto), MARGIN, cursorY);
  doc.setFillColor(...SAFETY);
  doc.rect(MARGIN, cursorY + 4, 22, 2, "F");
  cursorY += headingH;

  // Frame
  const frameW = pageW - MARGIN * 2;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(MARGIN, cursorY, frameW, photoH, 6, 6, "FD");

  // Lay out photos side-by-side (max 2 per row for readability).
  const cols = Math.min(2, photos.length);
  const gap = 8;
  const cellW = (frameW - 16 - gap * (cols - 1)) / cols;
  const cellH = photoH - 16;

  for (let i = 0; i < cols; i++) {
    const img = await loadImageAsDataUrl(photos[i]);
    if (!img) continue;
    const ratio = img.w / img.h;
    let drawW = cellW;
    let drawH = drawW / ratio;
    if (drawH > cellH) {
      drawH = cellH;
      drawW = drawH * ratio;
    }
    const cellX = MARGIN + 8 + i * (cellW + gap);
    const dx = cellX + (cellW - drawW) / 2;
    const dy = cursorY + 8 + (cellH - drawH) / 2;
    doc.addImage(img.data, "JPEG", dx, dy, drawW, drawH);
  }

  // Subtle inner border
  doc.setDrawColor(...BORDER_SOFT);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN + 4, cursorY + 4, frameW - 8, photoH - 8, 5, 5, "S");
  doc.setLineWidth(0.2);

  cursorY += photoH + 6;

  // Caption
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(ascii(S.realPhotoCaption), MARGIN, cursorY + 6);
  cursorY += captionH + 8;

  return cursorY;
}