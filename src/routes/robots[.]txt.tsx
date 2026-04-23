import { createFileRoute } from "@tanstack/react-router";

function getOrigin(request: Request): string {
  const envOrigin = (typeof process !== "undefined" && process.env?.SITE_URL) || "";
  if (envOrigin) return envOrigin.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const origin = getOrigin(request);
        const body = `# ATDB Trade International — robots.txt
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
