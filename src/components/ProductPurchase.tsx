"use client";

import { useState } from "react";
import type { Variant } from "@/lib/products";

export default function ProductPurchase({ variants, preorder }: { variants: Variant[]; preorder: boolean }) {
  const [size, setSize] = useState<string | null>(null);
  const soldOut = (v: Variant) => v.inventory !== null && v.inventory <= 0;

  return (
    <div className="flex w-full flex-col gap-5">
      <fieldset>
        <legend className="mb-3 text-[10px] uppercase tracking-[0.25em] opacity-60">Size</legend>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={soldOut(v)}
              aria-pressed={size === v.size}
              onClick={() => setSize(v.size)}
              className={`min-w-14 border px-4 py-3 text-xs font-semibold uppercase tracking-wider transition disabled:line-through disabled:opacity-30 ${
                size === v.size ? "border-ink bg-ink text-white" : "border-ink/30 hover:border-ink"
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>
      </fieldset>
      {/* Cart + Stripe checkout come in the next slice. */}
      <button
        type="button"
        disabled
        className="bg-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white disabled:opacity-50"
      >
        {preorder ? "Pre-Order" : "Add to Cart"} · Coming Soon
      </button>
      {!size && <p className="text-[9px] uppercase tracking-[0.18em] opacity-40">Select a size</p>}
    </div>
  );
}
