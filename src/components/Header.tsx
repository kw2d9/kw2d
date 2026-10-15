import Link from "next/link";
import CartButton from "./CartButton";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import { site } from "@/lib/config";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 text-sm text-white mix-blend-difference">
      <Link href="/" className="font-heading text-lg font-black tracking-tight transition-opacity hover:opacity-70">
        KW2D
      </Link>
      <NavLinks />
      <div className="flex items-center gap-4">
        {site.themeToggle && <ThemeToggle />}
        <CartButton />
      </div>
    </header>
  );
}
