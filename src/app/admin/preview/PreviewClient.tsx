"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/product-types";
import CartProvider from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import ProductPurchase from "@/components/ProductPurchase";

export type PreviewView = "product" | "catalog";
export type PreviewMessage = { type: "kw2d-preview"; product: Product; view: PreviewView; sortOrder: number };
export const PREVIEW_READY = "kw2d-preview-ready";

/** Where the product would sit in the catalog: replaces its live copy, or slots in by sort order. */
function placeInCatalog(live: Product[], product: Product, sortOrder: number) {
  const others = live.filter((p) => p.id !== product.id && p.handle !== product.handle);
  const at = others.findIndex((p) => (p.sort_order ?? 0) > sortOrder);
  const list = [...others];
  list.splice(at === -1 ? list.length : at, 0, product);
  return list;
}

export default function PreviewClient({ live }: { live: Product[] }) {
  const [msg, setMsg] = useState<PreviewMessage | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "kw2d-preview") return;
      setMsg(e.data as PreviewMessage);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!msg) return <div className="min-h-screen bg-background" />;
  const { product, view, sortOrder } = msg;

  return (
    // Links inside the preview would leave it, so they are disabled; buttons still work.
    <div
      className="flex min-h-screen flex-col bg-background text-foreground"
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest("a")) e.preventDefault();
      }}
    >
      <CartProvider persist={false}>
        <Header />
        <main className="flex-1">
          {view === "product" ? (
            <section className="px-6 pb-16 pt-24 md:px-16">
              <ProductDetail product={product} purchase={<ProductPurchase product={product} />} />
            </section>
          ) : (
            <section className="px-6 pb-16 pt-28 md:px-16">
              <h1 className="mb-10 font-heading text-3xl font-black uppercase tracking-wide md:text-5xl">Catalog</h1>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
                {placeInCatalog(live, product, sortOrder).map((p) => (
                  <li key={p.id} className={p === product ? "outline-2 outline-offset-8 outline-dashed outline-ink/40" : undefined}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </div>
  );
}
