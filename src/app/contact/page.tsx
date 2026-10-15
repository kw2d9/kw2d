import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact | KW2D" };

export default function ContactPage() {
  return (
    <section className="px-6 pb-16 pt-28 md:px-16">
      <h1 className="mb-10 font-heading text-3xl font-black uppercase tracking-wide md:text-5xl">Contact</h1>
      <ContactForm />
    </section>
  );
}
