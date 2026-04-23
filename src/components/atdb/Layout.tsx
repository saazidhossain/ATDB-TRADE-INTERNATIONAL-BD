import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsappFab } from "./WhatsappFab";
import { CartDrawer } from "./CartDrawer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
      <SiteFooter />
      <WhatsappFab />
      <CartDrawer />
    </div>
  );
}
