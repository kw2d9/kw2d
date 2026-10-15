import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { siteUrl, stripe } from "@/lib/stripe";
import { shipping, site } from "@/lib/config";

const body = z.object({
  items: z
    .array(z.object({ variantId: z.string().uuid(), qty: z.number().int().min(1).max(10) }))
    .min(1)
    .max(20),
});

type VariantRow = {
  id: string;
  size: string;
  inventory: number | null;
  product: { handle: string; title: string; price_cents: number; currency: string; images: string[]; preorder: boolean; active: boolean };
};

export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart." }, { status: 400 });

  // Qty per variant (merge duplicates). Prices always come from the database, never the client.
  const qtyById = new Map<string, number>();
  for (const { variantId, qty } of parsed.data.items) qtyById.set(variantId, (qtyById.get(variantId) ?? 0) + qty);

  const { data, error } = await supabaseAdmin()
    .from("product_variants")
    .select("id, size, inventory, product:products(handle, title, price_cents, currency, images, preorder, active)")
    .in("id", [...qtyById.keys()]);
  if (error) {
    console.error("checkout variant lookup failed", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as VariantRow[];
  if (rows.length !== qtyById.size || rows.some((r) => !r.product?.active)) {
    return NextResponse.json({ error: "An item in your cart is no longer available." }, { status: 409 });
  }
  const currencies = new Set(rows.map((r) => r.product.currency));
  if (currencies.size > 1) return NextResponse.json({ error: "Mixed currencies are not supported." }, { status: 400 });

  for (const r of rows) {
    const qty = qtyById.get(r.id)!;
    if (r.inventory !== null && r.inventory < qty) {
      return NextResponse.json({ error: `${r.product.title} (${r.size}) is sold out or low on stock.` }, { status: 409 });
    }
  }

  const base = siteUrl(req);
  const currency = rows[0].product.currency.toLowerCase();
  const subtotal = rows.reduce((n, r) => n + r.product.price_cents * qtyById.get(r.id)!, 0);
  const shippingCents = subtotal >= shipping.freeOverCents ? 0 : shipping.flatCents;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: rows.map((r) => ({
        quantity: qtyById.get(r.id)!,
        price_data: {
          currency: r.product.currency.toLowerCase(),
          unit_amount: r.product.price_cents,
          product_data: {
            name: `${r.product.title} (${r.size})`,
            ...(r.product.images[0] && base.startsWith("https") ? { images: [`${base}/images/${r.product.images[0]}`] } : {}),
            metadata: { variant_id: r.id, title: r.product.title, size: r.size },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: [...site.shipsTo] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shippingCents === 0 ? `${shipping.label} (free)` : shipping.label,
            fixed_amount: { amount: shippingCents, currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: shipping.minDays },
              maximum: { unit: "business_day", value: shipping.maxDays },
            },
          },
        },
      ],
      allow_promotion_codes: true,
      // Enable once Stripe Tax is configured in the dashboard (set STRIPE_AUTOMATIC_TAX=true).
      ...(process.env.STRIPE_AUTOMATIC_TAX === "true" ? { automatic_tax: { enabled: true } } : {}),
      invoice_creation: { enabled: true },
      phone_number_collection: { enabled: false },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/catalog`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("stripe session create failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
