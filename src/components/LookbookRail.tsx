"use client";

import Image from "next/image";
import { useRef } from "react";

export type LookbookImage = { src: string; alt: string; w: number; h: number };

const arrow =
  "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-white md:size-14";

/** Sideways-scrolling photo strip. Both arrows always show (for symmetry); at either end a click just does nothing. */
export default function LookbookRail({ images }: { images: LookbookImage[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: -1 | 1) => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={rail}
        className="flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:scroll-px-6 md:gap-4 md:px-6"
        tabIndex={0}
        aria-label="Lookbook photos, scroll sideways"
      >
        {images.map((img) => (
          <li key={img.src} className="relative h-[56svh] max-h-[620px] shrink-0 snap-start bg-foreground/5" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
            <Image src={`/images/${img.src}`} alt={img.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 90vw" />
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => scroll(-1)} aria-label="Previous photos" className={`${arrow} left-12 md:left-16`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" onClick={() => scroll(1)} aria-label="Next photos" className={`${arrow} right-12 md:right-16`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
