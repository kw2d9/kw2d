"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/contact", label: "Contact" },
];

/** Header links: a bar slides in under the hovered link and stays under the current page. */
export default function NavLinks() {
  const path = usePathname();
  return (
    <nav className="hidden gap-8 md:flex" aria-label="Main">
      {links.map((l) => {
        const current = l.href === "/" ? path === "/" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={current ? "page" : undefined}
            className={`relative py-1 text-[11px] font-bold uppercase tracking-[0.22em] transition-opacity after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-current after:transition-transform after:duration-300 hover:opacity-100 hover:after:scale-x-100 focus-visible:after:scale-x-100 ${
              current ? "opacity-100 after:scale-x-100" : "opacity-70 after:scale-x-0"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
