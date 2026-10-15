import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Returns | KW2D" };

export default function ReturnsPage() {
  return (
    <Prose title="Returns" updated="October 2026">
      <h2>Need to return something?</h2>
      <p>
        If something isn&apos;t right with your order, contact us at <a href={`mailto:${site.email}`}>{site.email}</a> or through the{" "}
        <a href="/contact">contact page</a> with your order details and we&apos;ll make it right.
      </p>
      <h2>Pre-orders</h2>
      <p>Pre-order items are made after you order, so please check the size chart carefully before you buy.</p>
      {/* TODO(owner): add the exact return window and conditions once decided. */}
    </Prose>
  );
}
