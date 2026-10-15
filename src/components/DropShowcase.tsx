import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { formatPrice, getProduct } from "@/lib/products";
import LookbookRail, { type LookbookImage } from "./LookbookRail";
import Reveal from "./Reveal";

const HANDLE = "kw2d-meisai-collection-hoodie";
const url = `/products/${HANDLE}`;

const lookbook: LookbookImage[] = [
  { src: "CatalogIMG2.jpg", alt: "Two models in the olive and snow camo hoodies", w: 4000, h: 4802 },
  { src: "Drop1IMG3.jpeg", alt: "Snow camo hoodie in front of a Vancouver mural", w: 1200, h: 1600 },
  { src: "CatalogIMG4b.jpg", alt: "Snow camo hoodie, studio", w: 3624, h: 5436 },
  { src: "Drop1IMG4.jpeg", alt: "Snow camo hoodie on a Vancouver sidewalk", w: 1200, h: 1600 },
  { src: "CatalogIMG2.2.jpg", alt: "Hood detail with Meisai print", w: 3714, h: 5291 },
  { src: "CatalogIMG3a.jpg", alt: "Grey hoodie and sweatpants, studio", w: 2215, h: 4742 },
  { src: "CatalogIMG1.jpg", alt: "Two models in snow camo and olive camo", w: 6000, h: 3551 },
];

const small = "text-[10px] uppercase tracking-[0.25em]";

/** Title, price and pre-order state come from the database, so admin edits show here too. */
async function Details() {
  const p = await getProduct(HANDLE).catch(() => null);
  return (
    <>
      <h2 className="font-heading text-5xl font-black uppercase leading-[0.85] tracking-[-0.01em] md:text-7xl">
        <Link href={url} className="hover:opacity-70"><Reveal>{p?.title ?? "Meisai Collection Hoodie"}</Reveal></Link>
      </h2>
      <p className="max-w-sm text-sm leading-relaxed opacity-75">
        {p?.description ?? "A heavyweight zip hoodie that reverses from snow camo to waffle knit, with Meisai printed across the hood."}
      </p>
      <dl className={`grid w-full max-w-sm grid-cols-2 gap-y-3 border-t border-ink/15 pt-5 ${small}`}>
        <dt className="opacity-50">Price</dt>
        <dd className="font-bold">{p ? formatPrice(p.price_cents, p.currency) : "$110 CAD"}</dd>
        {(p?.preorder ?? true) && (
          <>
            <dt className="opacity-50">Pre-order</dt>
            <dd>{p?.ships_note ?? "Ships in 4–6 weeks"}</dd>
          </>
        )}
        <dt className="opacity-50">Sizes</dt>
        <dd>{p?.variants.length ? `${p.variants[0].size}–${p.variants.at(-1)!.size}` : "XS–XXL"}</dd>
      </dl>
    </>
  );
}

export default function DropShowcase() {
  return (
    <>
      {/* The drop */}
      <section className="grid gap-8 px-4 py-14 md:grid-cols-12 md:items-center md:gap-6 md:px-6 md:py-20">
        <div className="relative aspect-square overflow-hidden bg-white md:col-span-6 md:col-start-1">
          <Image src="/images/Drop1IMG1.jpeg" alt="KW2D Meisai Collection Hoodie in snow camo" fill className="scale-[1.08] object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div className="flex flex-col items-start gap-6 md:col-span-5 md:col-start-8">
          <p className={`${small} opacity-50`}>Drop 01</p>
          <Suspense fallback={<div className="h-72 w-full" />}>
            <Details />
          </Suspense>
          <Link href={url} className="bg-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-paper hover:opacity-80">
            Shop now
          </Link>
        </div>
      </section>

      {/* Reversible: one panel per side */}
      <section className="px-4 pb-14 md:px-6 md:pb-20" aria-labelledby="reversible">
        <h2 id="reversible" className="mb-6 font-heading text-4xl font-black uppercase leading-none md:mb-8 md:text-6xl">
          <Reveal>One hoodie, two sides</Reveal>
        </h2>
        <div className="grid grid-cols-2 gap-2 md:gap-6">
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden bg-foreground/5 md:aspect-auto md:h-[75svh]">
              <Image src="/images/CatalogIMG4c.jpg" alt="Snow camo side" fill className="object-cover object-top" sizes="50vw" />
            </div>
            <figcaption className={`mt-3 flex justify-between ${small}`}>
              <span className="font-bold">Snow camo</span>
              <span className="hidden opacity-50 md:inline">Outside</span>
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden bg-foreground/5 md:aspect-auto md:h-[75svh]">
              <Image src="/images/Drop1IMG2.jpeg" alt="Waffle knit side with Meisai hood print" fill className="object-cover" sizes="50vw" />
            </div>
            <figcaption className={`mt-3 flex justify-between ${small}`}>
              <span className="font-bold">Waffle knit</span>
              <span className="hidden opacity-50 md:inline">Inside</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Lookbook rail */}
      <section aria-labelledby="lookbook">
        <div className="mb-6 flex items-end justify-between px-4 md:px-6">
          <h2 id="lookbook" className="font-heading text-4xl font-black uppercase leading-none md:text-6xl"><Reveal>Lookbook</Reveal></h2>
          <p className={`${small} opacity-50`}>Shot in Vancouver</p>
        </div>
        <LookbookRail images={lookbook} />
      </section>
    </>
  );
}
