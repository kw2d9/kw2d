"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Heading text that rises out of a mask the first time it scrolls into view,
 * like the home wordmark. Renders visible until hydrated, so it never hides text without JS.
 */
export default function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="block overflow-hidden pb-[0.06em]">
      <span className="kw-reveal block" data-state={state}>
        {children}
      </span>
    </span>
  );
}
