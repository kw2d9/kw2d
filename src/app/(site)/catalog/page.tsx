import { Suspense } from "react";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import Reveal from "@/components/Reveal";

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
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

export default function CatalogPage() {
  return (
    <section className="px-6 pb-16 pt-28 md:px-16">
      <h1 className="mb-10 font-heading text-3xl font-black uppercase tracking-wide md:text-5xl"><Reveal>Catalog</Reveal></h1>
      <Suspense fallback={<div className="h-96 animate-pulse bg-field" />}>
        <Grid />
      </Suspense>
    </section>
  );
}
