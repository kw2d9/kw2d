import { notFound } from "next/navigation";
import { adminDb } from "@/lib/admin";
import ProductForm, { type InitialProduct } from "../ProductForm";

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const db = await adminDb();
  const { data } = await db
    .from("products")
    .select("*, variants:product_variants(id, size, inventory, sort_order)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const initial: InitialProduct = {
    id: data.id,
    handle: data.handle,
    title: data.title,
    collection: data.collection ?? "",
    subtitle: data.subtitle ?? "",
    description: data.description ?? "",
    price: data.price_cents / 100,
    images: data.images ?? [],
    size_chart_image: data.size_chart_image ?? null,
    preorder: data.preorder,
    ships_note: data.ships_note ?? "",
    fit_note: data.fit_note ?? "",
    active: data.active,
    sort_order: data.sort_order,
    variants: [...data.variants]
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((v: { id: string; size: string; inventory: number | null }) => ({ id: v.id, size: v.size, inventory: v.inventory })),
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Edit product</h1>
      <ProductForm initial={initial} />
    </>
  );
}
