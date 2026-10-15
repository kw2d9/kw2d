import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "../actions";

async function Shell({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-bold">KW2D Admin</Link>
          <Link href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900">Products</Link>
          <Link href="/" target="_blank" className="text-sm text-neutral-600 hover:text-neutral-900">View site ↗</Link>
        </div>
        <form action={signOut} className="flex items-center gap-4">
          <span className="hidden text-xs text-neutral-500 sm:inline">{admin.email}</span>
          <button className="text-sm text-neutral-600 hover:text-neutral-900">Sign out</button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-8">{children}</main>
    </>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-neutral-500">Loading…</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
