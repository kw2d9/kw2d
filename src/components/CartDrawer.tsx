"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { imageSrc } from "@/lib/images";
import { checkoutEnabled, OPEN_WAITLIST_EVENT } from "@/lib/config";

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, subtotalCents } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })) }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (res?.ok && data?.url) {
      window.location.href = data.url;
      return;
    }
    setError(data?.error ?? "Could not start checkout. Please try again.");
    setBusy(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-[9999] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[#eaba95] px-6 py-5">
          <h2 className="font-heading text-lg font-black uppercase tracking-wide">Cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="text-lg opacity-60 hover:opacity-100">✕</button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm opacity-60">Your cart is empty.</p>
            <Link href="/catalog" onClick={() => setOpen(false)} className="bg-ink px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white">
              Shop the Catalog
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[#eaba95] overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.variantId} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 bg-white">
                    <Image src={imageSrc(l.image)} alt={l.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link href={`/products/${l.handle}`} onClick={() => setOpen(false)} className="font-heading text-sm font-bold uppercase tracking-wide hover:opacity-70">
                      {l.title}
                    </Link>
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Size {l.size}</p>
                    <p className="text-sm">{formatPrice(l.priceCents, l.currency)}</p>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center border border-ink/30">
                        <button onClick={() => setQty(l.variantId, l.qty - 1)} aria-label="Decrease quantity" className="px-3 py-1">−</button>
                        <span className="min-w-6 text-center text-xs" aria-live="polite">{l.qty}</span>
                        <button onClick={() => setQty(l.variantId, l.qty + 1)} aria-label="Increase quantity" className="px-3 py-1">+</button>
                      </div>
                      <button onClick={() => setQty(l.variantId, 0)} className="text-[10px] uppercase tracking-[0.2em] underline opacity-60 hover:opacity-100">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#eaba95] px-6 py-5">
              <div className="mb-4 flex justify-between text-sm font-bold">
                <span className="uppercase tracking-wider">Subtotal</span>
                <span>{formatPrice(subtotalCents, lines[0].currency)}</span>
              </div>
              <p className="mb-4 text-[9px] uppercase tracking-[0.18em] opacity-50">Shipping and taxes calculated at checkout.</p>
              {checkoutEnabled ? (
                <>
                  {error && <p className="mb-3 text-xs text-red-700" role="alert">{error}</p>}
                  <button
                    onClick={checkout}
                    disabled={busy}
                    className="w-full bg-ink py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition hover:opacity-80 disabled:opacity-50"
                  >
                    {busy ? "Redirecting…" : "Checkout"}
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-3 text-xs leading-relaxed">Pre-orders aren&apos;t open yet. Join the waitlist and we&apos;ll email you the moment they are, with 10% off.</p>
                  <button
                    onClick={() => {
                      setOpen(false);
                      window.dispatchEvent(new Event(OPEN_WAITLIST_EVENT));
                    }}
                    className="w-full bg-ink py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition hover:opacity-80"
                  >
                    Join the Waitlist
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
