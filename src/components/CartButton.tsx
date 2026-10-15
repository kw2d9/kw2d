"use client";

import { useCart } from "./CartProvider";

export default function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`} className="flex items-center gap-1.5 text-xs hover:opacity-70">
      <span>CAD</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 016 0v2" strokeLinejoin="round" />
      </svg>
      {count > 0 && <span className="rounded-full bg-ink px-1.5 text-[10px] text-white">{count}</span>}
    </button>
  );
}
