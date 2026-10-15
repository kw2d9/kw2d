"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    }).catch(() => null);
    if (res?.ok) return setStatus("done");
    const body = await res?.json().catch(() => null);
    setError(body?.error ?? "Something went wrong. Please try again.");
    setStatus("idle");
  }

  if (status === "done") {
    return <p className="text-sm uppercase tracking-[0.2em]">Message sent. We&apos;ll be in touch.</p>;
  }

  const field = "w-full border border-ink/30 bg-white/60 px-4 py-3.5 text-sm outline-none focus:border-ink";
  return (
    <form onSubmit={submit} className="flex w-full max-w-lg flex-col gap-3" noValidate>
      <input name="name" placeholder="Name" autoComplete="name" className={field} />
      <input name="email" type="email" placeholder="Email" autoComplete="email" className={field} />
      <textarea name="message" placeholder="Message" rows={6} className={field} />
      {error && <p className="text-xs text-red-700">{error}</p>}
      <button disabled={status === "sending"} className="self-start bg-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white disabled:opacity-50">
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
