import Image from "next/image";
import Link from "next/link";

const grid = [
  { src: "Drop1IMG2.jpeg", alt: "Meisai Hoodie, waffle knit sleeve branding" },
  { src: "Drop1IMG3.jpeg", alt: "Meisai Hoodie, hood detail" },
  { src: "Drop1IMG4.jpeg", alt: "Meisai Hoodie, Vancouver lifestyle" },
];

const eyebrow = "text-[9px] uppercase tracking-[0.35em] opacity-50";

export default function DropShowcase() {
  const url = "/products/kw2d-meisai-collection-hoodie";
  return (
    <section className="px-6 py-16 md:px-16 md:py-24">
      <p className={`${eyebrow} mb-12`}>Drop 01</p>
      <div className="mb-6 grid gap-10 md:grid-cols-[55fr_45fr] md:gap-16">
        <div className="relative aspect-[4/3] bg-white md:h-[70vh] md:aspect-auto">
          <Image src="/images/Drop1IMG1.jpeg" alt="KW2D Meisai Collection Hoodie, Snow Camo" fill priority className="object-cover" sizes="(min-width: 768px) 55vw, 100vw" />
        </div>
        <div className="flex flex-col items-start gap-5 pt-4">
          <p className={eyebrow}>Meisai Collection</p>
          <h2 className="font-heading text-3xl font-black uppercase leading-none tracking-wide md:text-5xl">
            <Link href={url} className="hover:opacity-70">Meisai Collection Hoodie</Link>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">Reversible · Snow Camo &amp; Waffle Knit</p>
          <p className="text-xl font-bold tracking-wider">$110 CAD</p>
          <div className="flex items-center gap-3">
            <span className="border border-current/40 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.25em] opacity-70">Pre-Order</span>
            <span className="text-[9px] uppercase tracking-[0.2em] opacity-50">Ships in 4–6 weeks</span>
          </div>
          <Link href={url} className="bg-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white hover:opacity-80">
            Shop Now
          </Link>
          <p className="text-[9px] uppercase tracking-[0.18em] opacity-40">Model is 6&apos;4 wearing size XL</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
        {grid.map((g) => (
          <div key={g.src} className="relative h-[42vw] md:h-[50vh]">
            <Image src={`/images/${g.src}`} alt={g.alt} fill className="object-cover" sizes="(min-width: 768px) 33vw, 50vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
