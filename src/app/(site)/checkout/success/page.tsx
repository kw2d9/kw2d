import Link from "next/link";
import type { Metadata } from "next";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export const metadata: Metadata = { title: "Order confirmed | KW2D", robots: { index: false } };

export default function SuccessPage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <ClearCartOnMount />
      <p className="text-[9px] uppercase tracking-[0.35em] opacity-50">Order confirmed</p>
      <h1 className="font-heading text-4xl font-black uppercase tracking-wide">You&apos;re locked in</h1>
      <p className="max-w-md text-sm opacity-70">
        Thanks for your order. A receipt is on its way to your email. Pre-orders ship in 4–6 weeks.
      </p>
      <Link href="/catalog" className="bg-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white hover:opacity-80">
        Keep Shopping
      </Link>
    </section>
  );
}
