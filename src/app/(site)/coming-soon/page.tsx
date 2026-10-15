import type { Metadata } from "next";
import Countdown from "@/components/Countdown";
import { site } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "Coming Soon | KW2D", description: "Built for people who execute. Drop coming soon." };

export default function ComingSoon() {
  return (
    <section className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-ink px-6 text-center text-paper">
      <p className="text-[10px] uppercase tracking-[0.4em] opacity-60">New Collection</p>
      <h1 className="font-heading text-6xl font-black uppercase tracking-wide md:text-8xl"><Reveal>{site.name}</Reveal></h1>
      <p className="text-xs uppercase tracking-[0.3em] opacity-60">Built for people who execute.<br />Drop coming soon.</p>
      <Countdown target={site.dropDate} />
      <p className="text-[10px] uppercase tracking-[0.25em] opacity-50">Join the waitlist (bottom left) for 10% off</p>
    </section>
  );
}
