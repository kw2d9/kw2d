"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = string[]; // one image = full bleed, three = triptych

const desktop: Slide[] = [
  ["CatalogIMG4a.jpg", "CatalogIMG4b.jpg", "CatalogIMG4c.jpg"],
  ["CatalogIMG5.jpg"],
  ["CatalogIMG3a.jpg", "CatalogIMG3b.jpg", "CatalogIMG3c.jpg"],
  ["CatalogIMG1.jpg"],
];
const mobile: Slide[] = [
  ["CatalogIMG4c.jpg"],
  ["CatalogIMG2.1.jpg"],
  ["CatalogIMG4a.jpg"],
  ["CatalogIMG3b.jpg"],
];

function Show({ slides, speed, className }: { slides: Slide[]; speed: number; className: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), speed);
    return () => clearTimeout(t);
  }, [i, slides.length, speed]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {slides.map((cols, idx) => (
        <div
          key={idx}
          aria-hidden={idx !== i}
          className={`absolute inset-0 flex transition-opacity duration-[1400ms] ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          {cols.map((src) => (
            <div key={src} className="relative flex-1">
              <Image src={`/images/${src}`} alt="" fill priority={idx === 0} sizes={`${Math.round(100 / cols.length)}vw`} className="object-cover object-top" />
            </div>
          ))}
        </div>
      ))}
      <nav className="absolute left-6 top-20 z-10 flex w-40 gap-1.5 md:left-auto md:right-6 md:w-56" aria-label="Slideshow">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Show photo ${idx + 1} of ${slides.length}`}
            aria-current={idx === i}
            className="relative h-4 flex-1 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-black/25"
          >
            <span
              key={idx === i ? `on-${i}` : "off"}
              className={`absolute left-0 top-1/2 h-px bg-black ${idx < i ? "w-full" : idx === i ? "kw-progress w-full" : "w-0"}`}
              style={idx === i ? { animationDuration: `${speed}ms` } : undefined}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}

/** Home hero: crossfading lookbook photos under a full-width wordmark. */
export default function Slideshow({ speed = 6000 }: { speed?: number }) {
  return (
    <section className="flex h-svh min-h-[560px] w-full flex-col" aria-label="KW2D Drop 01 lookbook">
      <div className="relative flex-1 overflow-hidden bg-foreground/5">
        <Show slides={desktop} speed={speed} className="hidden md:block" />
        <Show slides={mobile} speed={speed} className="md:hidden" />
      </div>

      {/* The wordmark sits on the page colour, below the photos, so it always reads cleanly. */}
      <div className="px-4 pb-16 pt-4 md:px-6 md:pb-16">
        <div className="mb-3 flex items-end justify-between gap-4">
          <p className="max-w-[16rem] text-[10px] uppercase leading-relaxed tracking-[0.25em]">
            Drop 01, the Meisai collection.
            <br />
            Made in Vancouver.
          </p>
          <Link href="/products/kw2d-meisai-collection-hoodie" className="shrink-0 border-b border-current pb-0.5 text-[10px] font-bold uppercase tracking-[0.25em] hover:opacity-70">
            Shop the drop
          </Link>
        </div>
        <h1 className="overflow-hidden">
          <span className="kw-rise block whitespace-nowrap font-heading text-[16.6vw] font-black uppercase leading-[0.8] tracking-[-0.035em] md:text-[12.8vw]">
            <span className="md:hidden">Know What<br />2 Do</span>
            <span className="hidden md:inline">Know What 2 Do</span>
          </span>
        </h1>
      </div>
    </section>
  );
}
