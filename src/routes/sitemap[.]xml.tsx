import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, FLEET } from "@/lib/atdb-data";

function getOrigin(request: Request): string {
  const envOrigin = (typeof process !== "undefined" && process.env?.SITE_URL) || "";
  if (envOrigin) return envOrigin.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const origin = getOrigin(request);
        const today = new Date().toISOString().slice(0, 10);

        const staticUrls = [
          { loc: "/", priority: "1.0", changefreq: "weekly" },
          { loc: "/equipment", priority: "0.9", changefreq: "weekly" },
          { loc: "/projects", priority: "0.7", changefreq: "monthly" },
          { loc: "/about", priority: "0.6", changefreq: "monthly" },
          { loc: "/contact", priority: "0.7", changefreq: "monthly" },
        ];

        const categoryUrls = Object.values(CATEGORIES).map((c) => ({
          loc: `/equipment/${c.slug}`,
          priority: "0.8",
          changefreq: "weekly",
        }));

        const fleetUrls = FLEET.map((eq) => ({
          loc: `/equipment/${eq.category}/${eq.id}`,
          priority: "0.8",
          changefreq: "monthly",
        }));

        const all = [...staticUrls, ...categoryUrls, ...fleetUrls];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) => `  <url>
    <loc>${origin}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
