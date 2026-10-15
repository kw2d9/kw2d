import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { shipping, site } from "@/lib/config";

export const metadata: Metadata = { title: "Shipping | KW2D" };

export default function ShippingPage() {
  return (
    <Prose title="Shipping" updated="October 2026">
      <h2>Where we ship</h2>
      <p>We currently ship to Canada and the United States.</p>
      <h2>Rates</h2>
      <p>
        {shipping.label} is ${(shipping.flatCents / 100).toFixed(2)} {site.currency}. Orders of $
        {(shipping.freeOverCents / 100).toFixed(0)} {site.currency} or more ship free. The exact amount is shown at checkout before you pay.
      </p>
      <h2>Delivery times</h2>
      <p>
        In-stock orders arrive in about {shipping.minDays}–{shipping.maxDays} business days after they ship. Pre-order items ship in the window
        shown on the product page (for the Meisai Collection Hoodie, 4–6 weeks), and we email you when your order is on its way.
      </p>
      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> or use the <a href="/contact">contact page</a>.
      </p>
    </Prose>
  );
}
