import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { formatPrice, getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Catalog | KW2D" };

async function Grid() {
  const products = await getProducts();
  if (!products.length) {
    return <p className="text-sm opacity-60">Nothing here yet. Drop coming soon.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <Link href={`/products/${p.handle}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-white">
              <Image
                src={`/images/${p.images[0]}`}
                alt={p.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              {p.preorder && (
                <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[8px] font-bold uppercase tracking-[0.25em] text-white">
                  Pre-Order
                </span>
              )}
            </div>
            <h2 className="mt-3 font-heading text-sm font-bold uppercase tracking-wide">{p.title}</h2>
            <p className="text-xs opacity-60">{formatPrice(p.price_cents, p.currency)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function CatalogPage() {
  return (
    <section className="px-6 pb-16 pt-28 md:px-16">
      <h1 className="mb-10 font-heading text-3xl font-black uppercase tracking-wide md:text-5xl">Catalog</h1>
      <Suspense fallback={<div className="h-96 animate-pulse bg-white/40" />}>
        <Grid />
      </Suspense>
    </section>
  );
}
