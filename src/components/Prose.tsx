export default function Prose({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <section className="px-6 pb-20 pt-28 md:px-16">
      <h1 className="mb-2 font-heading text-3xl font-black uppercase tracking-wide md:text-5xl">{title}</h1>
      <p className="mb-10 text-[10px] uppercase tracking-[0.25em] opacity-50">Last updated {updated}</p>
      <div className="max-w-2xl space-y-4 text-sm leading-relaxed opacity-85 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_a]:underline">
        {children}
      </div>
    </section>
  );
}
