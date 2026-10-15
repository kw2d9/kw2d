import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { imageSrc } from "@/lib/images";
import ProductPurchase from "@/components/ProductPurchase";
import { formatPrice, getProduct, getProducts } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  return p ? { title: `${p.title} | KW2D`, description: p.description ?? undefined } : {};
}

const eyebrow = "text-[9px] uppercase tracking-[0.35em] opacity-50";

async function Product({ params }: { params: PageProps<"/products/[handle]">["params"] }) {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) notFound();

  return (
    <div className="grid gap-10 md:grid-cols-[60fr_40fr] md:gap-16">
      <div className="grid grid-cols-2 gap-3">
        {p.images.map((src, i) => (
          <div key={src} className={`relative bg-white ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-[4/5]"}`}>
            <Image src={imageSrc(src)} alt={`${p.title} ${i + 1}`} fill priority={i === 0} sizes="(min-width: 768px) 36vw, 100vw" className="object-cover" />
          </div>
        ))}
        {p.size_chart_image && (
          <div className="relative col-span-2 aspect-[4/3] bg-white">
            <Image src={imageSrc(p.size_chart_image)} alt={`${p.title} size chart`} fill sizes="(min-width: 768px) 36vw, 100vw" className="object-contain" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-5 md:sticky md:top-24 md:self-start">
        {p.collection && <p className={eyebrow}>{p.collection}</p>}
        <h1 className="font-heading text-3xl font-black uppercase leading-none tracking-wide md:text-5xl">{p.title}</h1>
        {p.subtitle && <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">{p.subtitle}</p>}
        <p className="text-xl font-bold tracking-wider">{formatPrice(p.price_cents, p.currency)}</p>
        {p.preorder && (
          <div className="flex items-center gap-3">
            <span className="border border-current/40 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.25em] opacity-70">Pre-Order</span>
            {p.ships_note && <span className="text-[9px] uppercase tracking-[0.2em] opacity-50">{p.ships_note}</span>}
          </div>
        )}
        {p.description && <p className="max-w-md text-sm leading-relaxed opacity-80">{p.description}</p>}
        <ProductPurchase product={p} />
        {p.fit_note && <p className="text-[9px] uppercase tracking-[0.18em] opacity-40">{p.fit_note}</p>}
      </div>
    </div>
  );
}

export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <section className="px-6 pb-16 pt-24 md:px-16">
      <Suspense fallback={<div className="h-[70vh] animate-pulse bg-white/40" />}>
        <Product params={params} />
      </Suspense>
    </section>
  );
}
