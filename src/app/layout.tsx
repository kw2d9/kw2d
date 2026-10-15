import type { Metadata } from "next";
import { Barlow, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import WaitlistPopup from "@/components/WaitlistPopup";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "KW2D",
  description: "Built for people who execute. Know What 2 Do, Vancouver.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WaitlistPopup />
        </CartProvider>
      </body>
    </html>
  );
}
