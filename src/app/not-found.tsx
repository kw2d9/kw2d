import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-[9px] uppercase tracking-[0.35em] opacity-50">404</p>
      <h1 className="font-heading text-4xl font-black uppercase tracking-wide">Page not found</h1>
      <Link href="/catalog" className="bg-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white hover:opacity-80">
        Back to Catalog
      </Link>
    </section>
    </SiteChrome>
  );
}
