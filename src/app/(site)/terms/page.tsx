import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service | KW2D" };

export default function TermsPage() {
  return (
    <Prose title="Terms of Service" updated="October 2026">
      <h2>Using this site</h2>
      <p>By using {site.name}&apos;s website and placing an order you agree to these terms.</p>
      <h2>Orders and pricing</h2>
      <p>
        Prices are in {site.currency}. We may cancel and refund an order if an item is unavailable or a pricing error occurs. Taxes and shipping are
        shown at checkout where applicable.
      </p>
      <h2>Pre-orders</h2>
      <p>Pre-order items are charged at purchase and ship in the estimated window shown on the product page. Estimates aren&apos;t guarantees.</p>
      <h2>Shipping and returns</h2>
      <p>
        See our <a href="/shipping">shipping</a> and <a href="/returns">returns</a> pages.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </Prose>
  );
}
