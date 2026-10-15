"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - (now ?? 0));
  const parts = now === null
    ? ["--", "--", "--", "--"]
    : [diff / 86400000, (diff % 86400000) / 3600000, (diff % 3600000) / 60000, (diff % 60000) / 1000].map((n) => pad(Math.floor(n)));
  const labels = ["Days", "Hours", "Mins", "Secs"];

  return (
    <div role="timer" aria-label="Time until drop" className="flex items-start gap-3 md:gap-5">
      {parts.map((p, i) => (
        <div key={labels[i]} className="flex items-start gap-3 md:gap-5">
          <div className="flex min-w-14 flex-col items-center">
            <span className="font-heading text-4xl font-black tabular-nums md:text-6xl">{p}</span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.3em] opacity-50">{labels[i]}</span>
          </div>
          {i < 3 && <span className="font-heading text-4xl opacity-30 md:text-6xl" aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  );
}
