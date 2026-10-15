"use client";

import { useState } from "react";

export default function FooterSignup() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setState("sending");
    setError("");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    }).catch(() => null);
    if (res?.ok) return setState("done");
    const body = await res?.json().catch(() => null);
    setError(body?.error ?? "Something went wrong. Please try again.");
    setState("idle");
  }

  if (state === "done") return <p className="text-sm uppercase tracking-[0.2em]" role="status">You&apos;re in. Check your email.</p>;

  return (
    <form onSubmit={submit} className="w-full max-w-md" noValidate>
      <div className="flex gap-2">
        <input type="email" name="email" placeholder="Email address" aria-label="Email address" autoComplete="email" className="flex-1 rounded-full bg-white/60 px-5 py-3 text-sm outline-none" />
        <button disabled={state === "sending"} className="rounded-full bg-[#a3d9a5] px-5 text-lg disabled:opacity-50" aria-label="Sign up">
          →
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-700" role="alert">{error}</p>}
    </form>
  );
}
