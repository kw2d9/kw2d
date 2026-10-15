import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import ProductPurchase from "@/components/ProductPurchase";
import { getProduct, getProducts } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  return p ? { title: `${p.title} | KW2D`, description: p.description ?? undefined } : {};
}

async function Product({ params }: { params: PageProps<"/products/[handle]">["params"] }) {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) notFound();
  return <ProductDetail product={p} purchase={<ProductPurchase product={p} />} />;
}

export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <section className="px-6 pb-16 pt-24 md:px-16">
      <Suspense fallback={<div className="h-[70vh] animate-pulse bg-field" />}>
        <Product params={params} />
      </Suspense>
    </section>
  );
}
