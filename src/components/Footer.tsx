import Link from "next/link";
import FooterSignup from "./FooterSignup";

const links = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="px-6 pb-6 pt-24">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <h3 className="font-heading text-2xl">Join the Movement</h3>
        <FooterSignup />
      </div>
      <div className="flex flex-col gap-3 border-t border-[#eaba95] pt-5 text-xs md:flex-row md:justify-between">
        <span>© 2026 KW2D</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Policies">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-60">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
