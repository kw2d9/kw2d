"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  variantId: string;
  handle: string;
  title: string;
  size: string;
  image: string;
  priceCents: number;
  currency: string;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (line: Omit<CartLine, "qty">) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "kw2d_cart_v1";
const MAX_QTY = 10;

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

/** `persist={false}` keeps the cart in memory only (used by the admin preview). */
export default function CartProvider({ children, persist = true }: { children: React.ReactNode; persist?: boolean }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Hydrate after mount so server and client markup match on first render.
  useEffect(() => {
    if (!persist) return;
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [persist]);

  useEffect(() => {
    if (!ready || !persist) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready, persist]);

  const add = useCallback((line: Omit<CartLine, "qty">) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.variantId === line.variantId);
      if (hit) return prev.map((l) => (l === hit ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l));
      return [...prev, { ...line, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) =>
      prev.flatMap((l) => (l.variantId !== variantId ? [l] : qty <= 0 ? [] : [{ ...l, qty: Math.min(qty, MAX_QTY) }])),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotalCents: lines.reduce((n, l) => n + l.qty * l.priceCents, 0),
      open,
      setOpen,
      add,
      setQty,
      clear,
    }),
    [lines, open, add, setQty, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
