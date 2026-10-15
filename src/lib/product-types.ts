/** Storefront product shape. Kept free of server imports so client components can use it. */
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
  sort_order?: number;
  variants: Variant[];
};
