import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 text-sm text-black">
      <Link href="/" className="font-semibold tracking-tight">
        KW2D
      </Link>
      <nav className="hidden gap-6 md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:opacity-70">
            {l.label}
          </Link>
        ))}
      </nav>
      <span className="text-xs">CAD</span>
    </header>
  );
}
