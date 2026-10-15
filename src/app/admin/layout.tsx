import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | KW2D",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-50 text-neutral-900">{children}</div>;
}
