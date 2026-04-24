import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ATDB Trade International | Premier Heavy Equipment Rental in Bangladesh" },
      { name: "description", content: "Bangladesh's trusted heavy equipment rental partner since 2000. Mobile cranes, excavators, road rollers, and support equipment for mega-infrastructure projects." },
      { name: "author", content: "ATDB Trade International" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { name: "theme-color", content: "#1a1a1a" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ATDB Trade International" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "bn_BD" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "ATDB Trade International | Premier Heavy Equipment Rental in Bangladesh" },
      { name: "twitter:title", content: "ATDB Trade International | Premier Heavy Equipment Rental in Bangladesh" },
      { property: "og:description", content: "Bangladesh's trusted heavy equipment rental partner since 2000. Mobile cranes, excavators, road rollers, and support equipment for mega-infrastructure projects." },
      { name: "twitter:description", content: "Bangladesh's trusted heavy equipment rental partner since 2000. Mobile cranes, excavators, road rollers, and support equipment for mega-infrastructure projects." },
      { property: "og:url", content: "https://www.atdbtrade.com" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e50bbcf7-c7b8-45e1-a9bf-c1598573f482" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e50bbcf7-c7b8-45e1-a9bf-c1598573f482" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://www.atdbtrade.com" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://www.atdbtrade.com/#organization",
              name: "ATDB Trade International",
              url: "https://www.atdbtrade.com",
              description: "Premier Heavy Equipment Rental in Bangladesh.",
              foundingDate: "2000",
              location: {
                "@type": "Place",
                name: "Dhaka & Tangail, Bangladesh",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://www.atdbtrade.com/#website",
              url: "https://www.atdbtrade.com",
              name: "ATDB Trade International",
              publisher: { "@id": "https://www.atdbtrade.com/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <I18nProvider>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </I18nProvider>
  );
}
