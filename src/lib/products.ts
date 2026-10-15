import { cacheLife, cacheTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

export type Variant = { id: string; size: string; inventory: number | null };
export type Product = {
  id: string;
  handle: string;
  title: string;
  collection: string | null;
  subtitle: string | null;
  description: string | null;
  price_cents: number;
  currency: string;
  images: string[];
  size_chart_image: string | null;
  preorder: boolean;
  ships_note: string | null;
  fit_note: string | null;
  variants: Variant[];
};

const SELECT =
  "id, handle, title, collection, subtitle, description, price_cents, currency, images, size_chart_image, preorder, ships_note, fit_note, variants:product_variants(id, size, inventory, sort_order)";

type Row = Omit<Product, "variants"> & { variants: (Variant & { sort_order: number })[] };

function normalize(row: Row): Product {
  return {
    ...row,
    variants: [...row.variants]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ id, size, inventory }) => ({ id, size, inventory })),
  };
}

export function formatPrice(cents: number, currency = "CAD") {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)} ${currency}`;
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`getProducts: ${error.message}`);
  return (data as unknown as Row[]).map(normalize);
}

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products", `product:${handle}`);
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select(SELECT)
    .eq("handle", handle)
    .eq("active", true)
    .maybeSingle();
  if (error) throw new Error(`getProduct: ${error.message}`);
  return data ? normalize(data as unknown as Row) : null;
}
