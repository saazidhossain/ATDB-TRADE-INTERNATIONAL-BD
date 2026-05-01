// Quote cart — visitors stack equipment, set project context, send one
// consolidated WhatsApp quotation. Persisted to localStorage.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Equipment } from "./atdb-data";
import { buildWhatsappCartLink, type CartItem, type CartProject } from "./atdb-data";
import { useI18n } from "./i18n";

const STORAGE_KEY = "atdb_quote_cart_v1";

interface PersistedCart {
  items: CartItem[];
  project: CartProject;
}

interface CartCtx {
  items: CartItem[];
  project: CartProject;
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (eq: Equipment, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setProject: (p: Partial<CartProject>) => void;
  whatsappUrl: string;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { lang } = useI18n();
  const [items, setItems] = useState<CartItem[]>([]);
  const [project, setProjectState] = useState<CartProject>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedCart;
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.project) setProjectState(parsed.project);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, project }));
    } catch {
      /* ignore */
    }
  }, [items, project]);

  const add = (eq: Equipment, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === eq.id);
      if (existing) {
        return prev.map((i) =>
          i.id === eq.id ? { ...i, qty: Math.min(99, i.qty + qty) } : i
        );
      }
      return [...prev, { id: eq.id, name: eq.name, capacity: eq.capacity, qty }];
    });
    setIsOpen(true);
  };

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) {
      remove(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i)));
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => {
    setItems([]);
    setProjectState({});
  };

  const setProject = (p: Partial<CartProject>) => setProjectState((prev) => ({ ...prev, ...p }));

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const whatsappUrl = useMemo(() => buildWhatsappCartLink(items, project, lang), [items, project, lang]);

  const value: CartCtx = {
    items,
    project,
    count,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add,
    setQty,
    remove,
    clear,
    setProject,
    whatsappUrl,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside <CartProvider>");
  return v;
}
