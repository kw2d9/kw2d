import Header from "./Header";
import Footer from "./Footer";
import CartProvider from "./CartProvider";
import CartDrawer from "./CartDrawer";
import WaitlistPopup from "./WaitlistPopup";

/** Public storefront shell: header, cart, footer, waitlist popup. The admin does not use this. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WaitlistPopup />
    </CartProvider>
  );
}
