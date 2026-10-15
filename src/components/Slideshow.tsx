"use client";

import { useEffect, useState } from "react";

type Slide = string[]; // one image = full bleed, three = triptych

const desktop: Slide[] = [
  ["CatalogIMG4a.jpg", "CatalogIMG4b.jpg", "CatalogIMG4c.jpg"],
  ["CatalogIMG3a.jpg", "CatalogIMG3b.jpg", "CatalogIMG3c.jpg"],
  ["CatalogIMG5.jpg"],
  ["CatalogIMG1.jpg"],
];
const mobile: Slide[] = [
  ["CatalogIMG4c.jpg"],
  ["CatalogIMG4b.jpg"],
  ["CatalogIMG4a.jpg"],
  ["CatalogIMG3a.jpg"],
];

function Show({ slides, speed, className }: { slides: Slide[]; speed: number; className: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), speed);
    return () => clearTimeout(t);
  }, [i, slides.length, speed]);
  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <section className={`relative h-svh w-full overflow-hidden bg-ink ${className}`} aria-label="Collection slideshow">
      {slides.map((cols, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 flex transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          {cols.map((src) => (
            <div
              key={src}
              className="flex-1 bg-cover bg-center"
              style={{ backgroundImage: `url(/images/${src})` }}
            />
          ))}
        </div>
      ))}
      <button onClick={() => go(i - 1)} aria-label="Previous slide" className="absolute left-4 top-1/2 z-10 -translate-y-1/2 px-3 text-5xl text-white/70 hover:text-white">‹</button>
      <button onClick={() => go(i + 1)} aria-label="Next slide" className="absolute right-4 top-1/2 z-10 -translate-y-1/2 px-3 text-5xl text-white/70 hover:text-white">›</button>
      <nav className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2" aria-label="Slideshow navigation">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => go(idx)}
            aria-label={`Slide ${idx + 1}`}
            aria-current={idx === i}
            className={`size-1.5 rounded-full transition ${idx === i ? "scale-125 bg-white" : "bg-white/35"}`}
          />
        ))}
      </nav>
    </section>
  );
}

export default function Slideshow({ speed = 6000 }: { speed?: number }) {
  return (
    <>
      <Show slides={desktop} speed={speed} className="hidden md:block" />
      <Show slides={mobile} speed={speed} className="md:hidden" />
    </>
  );
}
