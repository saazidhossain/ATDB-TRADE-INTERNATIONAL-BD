# Real / Current-Condition Photos

Drop a photo in this folder named exactly after the equipment ID
(case-insensitive) and it will appear automatically:

- Right after the **Hero shot** in the equipment gallery (caption: "Real photo")
- Inside the downloadable **PDF spec sheet** as a second hero image

## Naming

`<EQUIPMENT_ID>.<ext>` — e.g. `ATDB-CR-001.jpg`, `atdb-rr-004.webp`

Supported extensions: `.webp`, `.jpg`, `.jpeg`, `.png`

You can also drop multiple photos for the same unit:
`ATDB-CR-001-1.jpg`, `ATDB-CR-001-2.jpg` — they appear in alphabetical order.

No code change required. Vite picks them up at build time via `import.meta.glob`.
