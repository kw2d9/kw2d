import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { imageSrc } from "@/lib/images";
import { adminDb } from "@/lib/admin";
import DeleteButton from "./DeleteButton";

type Row = {
  id: string;
  handle: string;
  title: string;
  price_cents: number;
  currency: string;
  images: string[];
  active: boolean;
  preorder: boolean;
  variants: { size: string; inventory: number | null }[];
};

export default async function ProductsPage() {
  const db = await adminDb();
  const { data, error } = await db
    .from("products")
    .select("id, handle, title, price_cents, currency, images, active, preorder, variants:product_variants(size, inventory)")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) return <p className="text-sm text-red-700">Could not load products: {error.message}</p>;
  const products = (data ?? []) as unknown as Row[];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
          New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">No products yet.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="relative size-16 shrink-0 bg-neutral-100">
                {p.images[0] && <Image src={imageSrc(p.images[0])} alt="" fill sizes="64px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="text-xs text-neutral-500">
                  {formatPrice(p.price_cents, p.currency)} · {p.variants.length} sizes · /{p.handle}
                </p>
              </div>
              <div className="flex gap-2 text-[11px] font-semibold uppercase tracking-wider">
                <span className={`px-2 py-1 ${p.active ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-600"}`}>
                  {p.active ? "Live" : "Hidden"}
                </span>
                {p.preorder && <span className="bg-amber-100 px-2 py-1 text-amber-800">Pre-order</span>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/admin/products/${p.id}`} className="underline">Edit</Link>
                <DeleteButton id={p.id} title={p.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
