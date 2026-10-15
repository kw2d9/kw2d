import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { orderEmail, sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.payment_status === "paid") {
      const db = supabaseAdmin();
      const { data: order, error } = await db
        .from("orders")
        .upsert(
          {
            stripe_session_id: s.id,
            stripe_payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id,
            email: s.customer_details?.email,
            name: s.customer_details?.name,
            amount_total: s.amount_total ?? 0,
            currency: s.currency ?? "cad",
            shipping: s.collected_information?.shipping_details ?? null,
          },
          { onConflict: "stripe_session_id" },
        )
        .select("id")
        .single();
      if (error || !order) {
        console.error("order upsert failed", error?.message);
        return NextResponse.json({ error: "db" }, { status: 500 }); // Stripe will retry
      }

      const items = await stripe().checkout.sessions.listLineItems(s.id, { limit: 100, expand: ["data.price.product"] });
      await db.from("order_items").delete().eq("order_id", order.id); // idempotent on retries
      const { error: itemsError } = await db.from("order_items").insert(
        items.data.map((li) => {
          const product = li.price?.product as Stripe.Product | undefined;
          return {
            order_id: order.id,
            variant_id: product?.metadata?.variant_id ?? null,
            title: product?.metadata?.title ?? li.description ?? "Item",
            size: product?.metadata?.size ?? null,
            qty: li.quantity ?? 1,
            unit_amount: li.price?.unit_amount ?? 0,
          };
        }),
      );
      if (itemsError) {
        console.error("order items insert failed", itemsError.message);
        return NextResponse.json({ error: "db" }, { status: 500 });
      }

      // Confirmation email, once per order (retries and resends skip it).
      const { data: claimed } = await db
        .from("orders")
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq("id", order.id)
        .is("confirmation_sent_at", null)
        .select("id");
      if (claimed?.length && s.customer_details?.email) {
        const ok = await sendEmail({
          to: s.customer_details.email,
          ...orderEmail({
            name: s.customer_details.name,
            items: items.data.map((li) => {
              const p = li.price?.product as Stripe.Product | undefined;
              return { title: p?.metadata?.title ?? li.description ?? "Item", size: p?.metadata?.size, qty: li.quantity ?? 1 };
            }),
            totalCents: s.amount_total ?? 0,
            currency: s.currency ?? "cad",
          }),
        });
        if (!ok) await db.from("orders").update({ confirmation_sent_at: null }).eq("id", order.id);
      }
    }
  }
  return NextResponse.json({ received: true });
}
