import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy | KW2D" };

export default function PrivacyPage() {
  return (
    <Prose title="Privacy Policy" updated="October 2026">
      <h2>What we collect</h2>
      <p>
        When you join the waitlist we collect your email and first name. When you contact us we collect your name, email and message. When you
        place an order we collect your name, email and shipping address, and your order details.
      </p>
      <h2>Payments</h2>
      <p>
        Payments are processed by Stripe. Your card details go directly to Stripe and are never stored on our servers.
      </p>
      <h2>How we use it</h2>
      <p>
        To fulfil and ship orders, send order and waitlist emails (including your discount code), and answer your messages. We don&apos;t sell your
        personal information.
      </p>
      <h2>Where it&apos;s stored</h2>
      <p>Your information is stored with our database provider, Supabase, and shared with Stripe and our email provider only as needed to run the store.</p>
      <h2>Your choices</h2>
      <p>
        To see, correct or delete your information, or to leave the waitlist, email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </Prose>
  );
}
