"use client";

import { useEffect, useState } from "react";
import { OPEN_WAITLIST_EVENT } from "@/lib/config";

const KEY = "kw2d_popup_seen";

export default function WaitlistPopup({ delayMs = 3000 }: { delayMs?: number }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_WAITLIST_EVENT, show);
    return () => window.removeEventListener(OPEN_WAITLIST_EVENT, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        first_name: fd.get("first_name") || undefined,
        source: "waitlist-popup",
      }),
    }).catch(() => null);
    setLoading(false);
    if (res?.ok) return setDone(true);
    const body = await res?.json().catch(() => null);
    setError(body?.error ?? "Something went wrong. Please try again.");
  }

  const field =
    "w-full border border-white/15 bg-white/5 px-4 py-3.5 text-[11px] uppercase tracking-[0.12em] text-white outline-none placeholder:text-white/30 focus:border-white/45";

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Get 10% off: join the waitlist"
          className="fixed right-0 top-1/2 z-[9998] -translate-y-1/2 rotate-180 border border-r-0 border-line bg-ink px-2.5 py-4 text-[9px] font-bold uppercase tracking-[0.25em] text-paper transition-[padding] [writing-mode:vertical-rl] hover:pl-3.5"
        >
          10% off
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-heading"
          onClick={(e) => e.target === e.currentTarget && close()}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-[420px] border border-white/10 bg-[#0a0a0a] px-8 pb-8 pt-11 text-white">
            <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-white/40 hover:text-white/85">
              ✕
            </button>
            {done ? (
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-black uppercase tracking-wider">You&apos;re In!</h2>
                <p className="text-[10px] uppercase tracking-[0.3em]">
                  Your discount code is on its way. Check your email. Stay ready.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-[9px] uppercase tracking-[0.35em] text-white/40">Waitlist</p>
                <h2 id="waitlist-heading" className="mb-2 font-heading text-2xl font-black uppercase leading-tight tracking-wider">
                  Join the Early Access Waitlist &amp; Get 10% Off
                </h2>
                <p className="mb-7 text-[10px] uppercase tracking-[0.3em]">
                  Sign up and we&apos;ll send your discount code directly to you.
                </p>
                <form onSubmit={submit} className="flex flex-col gap-2" noValidate>
                  <input name="first_name" placeholder="First name" autoComplete="given-name" className={field} />
                  <input name="email" type="email" placeholder="Email address" autoComplete="email" className={field} />
                  {error && <p className="text-[10px] uppercase tracking-[0.15em] text-red-400">{error}</p>}
                  <button
                    disabled={loading}
                    className="mt-2 bg-white py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-black hover:bg-white/85 disabled:opacity-60"
                  >
                    {loading ? "Joining…" : "Join the Waitlist"}
                  </button>
                </form>
                <p className="mt-5 text-center text-[9px] uppercase tracking-[0.15em] text-white/20">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
