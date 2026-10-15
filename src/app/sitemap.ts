import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await getProducts();
  const pages = ["", "/catalog", "/contact", "/shipping", "/returns", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...products.map((p) => ({ url: `${base}/products/${p.handle}` })),
  ];
}
